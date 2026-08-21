# Requests

面向 CyberCAM、Raspberry Pi 5、WalnutPi 与通用 CPython Linux 的 Requests Blockly 库。它提供 22 个工具箱可见积木，覆盖普通请求、Session、请求选项、认证、TLS、上传下载、响应处理与异常处理；另隐藏注册原 `network` 中的 2 个 `python_http_*` 类型，用于兼容旧工作区。

- npm 包：`@aily-project/lib-requests`
- Python 依赖：`requests>=2.32.3,<3`
- Blockly 定义：24 个（工具箱可见 22 个，隐藏兼容 2 个）
- 方法：GET、POST、PUT、PATCH、DELETE、HEAD、OPTIONS
- 默认超时：连接 3.05 秒、相邻响应数据等待 30 秒
- TLS：默认验证证书与主机名

## 安装

CyberCAM 镜像通常已带 Requests，可先检查：

```bash
python3 -c "import requests; print(requests.__version__)"
```

Raspberry Pi OS Bookworm 及以后版本不允许用 `sudo pip3` 修改系统 Python。需要系统包时使用：

```bash
sudo apt update
sudo apt install python3-requests
```

需要 PyPI 版本时使用虚拟环境：

```bash
sudo apt install python3-full
python3 -m venv .venv
source .venv/bin/activate
python -m pip install "requests>=2.32.3,<3"
```

Requests 2.34.2 要求 Python 3.10 或更高版本；目标系统 Python 较旧时，优先使用操作系统提供的受支持软件包。npm 安装本 Blockly 库不会自动安装 Python 依赖。

## 功能

| 分组 | 积木 | 核心语义 |
| --- | --- | --- |
| Session | `python_requests_session_init`、`python_requests_session_defaults`、`python_requests_session_close` | 持久化 Cookie 与默认配置、复用连接池、可靠关闭 |
| 请求 | `python_requests_request`、`python_requests_get`、`python_requests_send_body` | 通用方法、查询参数、JSON/表单/原始体/multipart；默认有限超时 |
| 选项 | `python_requests_content_options`、`python_requests_network_options`、`python_requests_tls_options`、`python_requests_merge_options` | 组合 params、headers、cookies、auth、timeout、proxy、redirect、stream、verify、cert |
| 认证与代理 | `python_requests_auth`、`python_requests_timeout`、`python_requests_proxies` | Basic/Digest、连接/读取超时元组、HTTP(S) 代理映射 |
| 上传下载 | `python_requests_upload_file`、`python_requests_for_chunks`、`python_requests_download` | 二进制文件句柄自动关闭、流式分块与响应关闭、流式写盘 |
| 响应与异常 | `python_requests_response_property`、`python_requests_response_json`、`python_requests_response_lookup`、`python_requests_response_set_encoding`、`python_requests_raise_for_status`、`python_requests_try` | 状态/文本/bytes/headers/cookies、JSON、编码、HTTP 错误与 Requests 异常 |

## 推荐流程

简单 GET：

1. 用“内容选项”创建查询参数和 headers；需要代理、重定向或自定义 timeout 时，再创建“网络选项”。
2. 用“合并选项”组合它们，右侧同名键覆盖左侧。
3. 调用“GET 请求”；未连接客户端输入时使用模块级 Requests。
4. 用 `raise_for_status()` 检查 4xx/5xx，再读取 text、content 或 JSON。

重复访问同一服务：

1. 初始化 Session，并设置默认 headers、查询参数、Cookie、认证、代理与 TLS 配置。
2. 把 Session 变量连接到请求积木的 client 输入。Session 会持久化 Cookie 并复用底层连接。
3. 完成后关闭 Session。生成器也注册退出 cleanup，但显式关闭能更及时释放资源。

上传和下载：

- 上传积木以 `rb` 打开文件，在请求返回前始终关闭文件句柄，并把 Response 保存到指定变量。
- 下载积木强制 `stream=True`，在上下文管理器中分块写入并关闭 Response；发生中途错误时目标文件可能保留部分内容，应用可按需要下载到临时路径后再替换。
- 已自行发起 `stream=True` 请求时，用“遍历响应块”消费数据；该积木在 `finally` 中关闭 Response。

## 重要语义与安全

- Requests 默认没有 timeout，可能无限等待。本库的新请求、上传和下载积木在选项未指定时自动使用 `(3.05, 30)`；其中 30 秒是相邻数据到达之间的读取等待，不是整个下载的墙钟总时限。把选项中的 `timeout` 设为 `None` 才会显式关闭超时保护。
- `json=` 会编码 JSON 并设置内容类型；`data=` 的字典/键值序列是表单，字符串或 bytes 是原始请求体；`files=` 是 multipart。不要同时提供 `json` 与 `data`/`files`，Requests 会忽略前者。
- TLS 系统验证模式是默认值。CA bundle 模式必须提供证书包路径；“不安全/仅测试”会生成 `verify=False`，从而失去证书与主机名校验，可能遭受中间人攻击。
- `.ok` 表示状态码小于 400，因此 3xx 也为真。判断 4xx/5xx 应使用 `raise_for_status()`。
- `.text` 按 Response 编码解码，`.content` 是 bytes。服务端编码声明错误时，应在首次读取 text 前设置 encoding。
- `.json()` 成功只表示正文可解析，不表示 HTTP 请求成功；空正文或非法 JSON 会抛 `JSONDecodeError`。
- `stream=True` 的 Response 必须完整消费或关闭，否则连接无法及时归还 Session 连接池。
- 本库不自动重试请求，尤其不会自动重试 POST 等可能产生副作用的方法。
- Session 的方法级字典选项会与 Session 默认字典合并并覆盖同名键；普通标量参数使用方法级值。

## 兼容迁移

原 `network` 聚合库中的 `python_http_request` 与 `python_http_response` 已保持序列化 schema 和历史生成语义迁入本包，并从新工具箱隐藏。旧工作区无需重命名 type，只需改为加载 `@aily-project/lib-requests`。不要同时加载仍注册这两个类型的旧版 `@aily-project/lib-network` 或 `@aily-project/lib-python-core`。

兼容请求积木会精确保留旧行为：GET 使用 `params`、POST 使用 `json`、PUT 使用 `data`、DELETE 忽略旧 DATA 输入，而且不自动设置 timeout。新工程应使用工具箱可见的 `python_requests_*` 积木。

## 参考资料

- [01Studio CyberCAM HTTP 通信](https://wiki.01studio.cc/docs/cybercam/network/http)
- [Requests 快速上手](https://requests.readthedocs.io/en/stable/user/quickstart/)
- [Requests API](https://requests.readthedocs.io/en/stable/api/)
- [Requests 高级用法](https://requests.readthedocs.io/en/stable/user/advanced/)
- [Requests 身份认证](https://requests.readthedocs.io/en/stable/user/authentication/)
- [Raspberry Pi OS 中使用 Python](https://www.raspberrypi.com/documentation/computers/os.html#use-python-on-a-raspberry-pi)

本库只向 `globalThis.Python.forBlock` 注册生成器；没有 CPython generator runtime 时安全跳过，不会回退到 MPY/MicroPython 生成器。
