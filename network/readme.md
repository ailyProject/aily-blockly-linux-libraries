# Network

面向 CyberCAM Linux、Raspberry Pi 5 和 WalnutPi 的通用 CPython 网络积木库。全部功能基于 Python 标准库，覆盖 IPv4/IPv6、TCP 客户端/服务端、UDP 数据报、超时与非阻塞轮询，以及当前目录的 HTTP 文件服务。

- npm 包：`@aily-project/lib-network`
- Blockly 积木：23 个，其中 Socket 22 个、标准库 HTTP 文件服务器 1 个
- 运行环境：项目使用 `devmode: "python"`，并加载独立 CPython generator runtime
- 标准库依赖：`socket`、`select`、`http.server`

原有 `python_http_request` 与 `python_http_response` 客户端积木已迁移到独立包 `@aily-project/lib-requests`，本包不再注册这两个类型，以避免同时加载时产生重复定义。`python_http_server` 仍保留在本包，使用标准库 `http.server` 提供当前目录。

## Socket 能力

| 分组 | 积木 | 生成的核心接口 |
| --- | --- | --- |
| 创建与地址 | `python_socket_init`、`python_socket_address`、`python_socket_address_part` | `socket()`、`getaddrinfo()` |
| TCP 客户端 | `python_socket_connect`、`python_socket_send`、`python_socket_receive` | `connect()`、`sendall()`、`recv()` |
| TCP 服务端 | `python_socket_bind`、`python_socket_listen`、`python_socket_accept_into` | `bind()`、`listen()`、`accept()` |
| UDP | `python_socket_send_to`、`python_socket_receive_from_into` | `sendto()`、`recvfrom()` |
| 模式与状态 | `python_socket_set_timeout`、`python_socket_set_blocking`、`python_socket_ready`、`python_socket_endpoint` | `settimeout()`、`setblocking()`、`select()`、地址查询 |
| 配置与生命周期 | `python_socket_set_option`、`python_socket_shutdown`、`python_socket_close` | 常用 `setsockopt()`、`shutdown()`、`close()` |
| 数据转换 | `python_socket_encode`、`python_socket_decode` | `encode()`、`decode()` |

旧聚合库使用的 9 个 `python_socket_*` 类型全部保留。原 CyberCAM 聚合库中的 `cybercam_socket_*` 不在本包重复注册，旧 CyberCAM 工作区需要迁移为对应的 `python_socket_*` 类型，且不要同时加载新旧聚合库。原“发送”积木现在生成 `sendall()`，避免 `send()` 只发送部分数据；输入为文本时自动按 UTF-8 编码，输入为 `bytes`、`bytearray` 或 `memoryview` 时保持原二进制内容。

## 推荐流程

TCP 客户端：

1. 创建 IPv4/IPv6 TCP Socket。
2. 在连接前设置超时。
3. 用与 Socket 相同地址族、类型的“解析地址”积木连接服务器。
4. 可靠发送数据，接收返回的 bytes；需要文本时连接“解码 bytes”积木。
5. 关闭 Socket。

TCP 服务端：

1. 创建 TCP Socket，在 `bind()` 前启用“重用地址”。
2. 绑定 `0.0.0.0`（IPv4）或 `::`（IPv6）以及服务端端口，再开始监听。
3. 用“接受连接并保存”积木取得客户端 Socket 与地址。
4. 必须通过客户端 Socket 收发；监听 Socket 只负责继续接受连接。
5. 每轮处理完成后显式关闭客户端 Socket，服务结束时再关闭监听 Socket。自动 cleanup 只是退出时的最后保护，只能清理变量中最后保存的连接。

UDP：

1. 创建 UDP Socket；接收端先绑定本地地址。
2. 用 `sendto()` 积木发送一个数据报。
3. 用赋值式 `recvfrom()` 积木分别保存数据和发送端地址。

## 通信语义与安全

- TCP 是可靠、有序的字节流，但不保留消息边界。一次发送不保证对应一次接收；应用协议应使用固定长度、分隔符或长度前缀。
- TCP 的 `recv()` 返回 `b''` 表示对端已关闭连接。UDP 的零长度数据报则是合法数据，不能用同一规则判断断线。
- UDP 可能丢失、重复或乱序；接收缓冲区小于数据报时，超出部分会被截断。
- 超时操作会抛出 `socket.timeout`，非阻塞操作在暂时无法完成时会抛出 `BlockingIOError`。可以先使用“Socket 可读/可写”积木轮询。
- “可读”也可能表示 TCP 已到 EOF 或发生错误；“可写”不能单独证明非阻塞连接成功，严谨程序还应检查 `SO_ERROR`。
- “接受连接并保存”和“接收 UDP 并保存”的各个目标变量必须互不相同，也不能与源 Socket 同名；生成器会拒绝有歧义的名称。
- `0.0.0.0` 和 `::` 只用于服务端监听所有网卡，不能作为客户端目标地址。它们会扩大服务暴露范围，应配合可信网络和最小化的防火墙端口规则。
- 原始 Socket 不提供加密或身份认证；跨不可信网络时应使用 TLS 或安全的上层协议。

## 参考资料

- [01Studio CyberCAM Socket 通讯](https://wiki.01studio.cc/docs/cybercam/network/socket)
- [Python socket 标准库](https://docs.python.org/3/library/socket.html)
- [Python Socket Programming HOWTO](https://docs.python.org/3/howto/sockets.html)
- [Raspberry Pi OS 中使用 Python](https://www.raspberrypi.com/documentation/computers/os.html#use-python-on-a-raspberry-pi)
- [Raspberry Pi Picamera2 手册中的 TCP Socket 流式传输示例](https://datasheets.raspberrypi.com/camera/picamera2-manual.pdf)

本库只向 `globalThis.Python.forBlock` 注册生成器；没有 Python runtime 时安全跳过，不会回退到 MPY/MicroPython 生成器。
