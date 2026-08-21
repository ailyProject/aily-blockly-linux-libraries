# Serial

`@aily-project/lib-serial` 提供 Linux UART/串口初始化、收发、输入缓冲区清理和关闭能力。当前包注册 12 个积木定义：工具箱只展示 6 个通用 `linux_uart_*` 积木；另外 6 个固定 CyberCAM UART2 的 `cybercam_uart_*` 仅用于加载旧工作区，不在工具箱中展示。

- npm 包：`@aily-project/lib-serial`
- 已注册定义：12 个
- 工具箱可见积木：6 个
- 运行环境：`devmode: "python"`，并加载独立 CPython generator runtime
- 目标端依赖：第三方 PySerial 包与串口设备访问权限

## PySerial 依赖

生成代码中的 `import serial` 来自第三方 [PySerial](https://pyserial.readthedocs.io/en/latest/)，不是 Python 标准库。PyPI 分发包名是 `pyserial`，导入名才是 `serial`：

```bash
python -m pip install pyserial
```

部分 Linux 发行版或板卡镜像会预装 PySerial，但这不改变其第三方依赖属性。npm 安装本积木库不会安装 Python 包、授予 `/dev/tty*` 权限或启用板卡 UART。安装依据见 [PySerial Installation](https://pyserial.readthedocs.io/en/latest/pyserial.html#installation) 和 [PyPI: pyserial](https://pypi.org/project/pyserial/)。

## 工具箱公开积木（6）

- `linux_uart_init`
- `linux_uart_available`
- `linux_uart_read`
- `linux_uart_write`
- `linux_uart_flush`
- `linux_uart_close`

`linux_uart_init` 允许填写 Linux 设备节点和波特率，适用于目标系统实际暴露的 `/dev/tty*`。构造器在给出设备节点时会立即打开串口；默认数据格式由 PySerial 决定，为 8 数据位、无校验、1 停止位，默认读取超时为 `None`。

工具箱公开的 `linux_uart_*` 生成器使用 PySerial 3 的现代 API：

| 积木语义 | PySerial API |
|---|---|
| 初始化 | `serial.Serial(device, baudrate)` |
| 查询接收字节数 | `uart.in_waiting` |
| 读取 | `uart.read(size)`，返回 `bytes` |
| 写入 | `uart.write(_serial_payload(data))`；文本按 UTF-8 编码，bytes-like 原样透传 |
| 丢弃输入缓冲区 | `uart.reset_input_buffer()` |
| 关闭 | `uart.close()` |

`inWaiting()` 和 `flushInput()` 是 PySerial 3.0 起弃用的旧名称，本包不为工具箱中的新积木生成它们。隐藏的 `cybercam_uart_*` 兼容 handler 仍保留这两个历史调用形式，仅用于维持旧工作区行为。`flush()` 的含义是等待发送完成，不是丢弃输入缓冲区。公开写入积木接受 `str`、`bytes`、`bytearray` 或 `memoryview`：`str` 自动按 UTF-8 编码，其余 bytes-like 数据不变；其它类型会明确抛出 `TypeError`。完整语义见 [PySerial API](https://pyserial.readthedocs.io/en/latest/pyserial_api.html#serial.Serial)。

初始化积木未设置读取超时，因此 PySerial 默认 `timeout=None`；直接读取固定数量时会等待到收到足够字节。需要非阻塞式循环时，应先用“可读取的字节数”积木取得 `in_waiting`，仅在数量大于 0 时读取该数量。

## CyberCAM 兼容迁移

以下 6 个既有 type 已从 `@aily-project/lib-cybercam` 迁入本包，仅为旧工程保持序列化兼容：

- `cybercam_uart_init`
- `cybercam_uart_available`
- `cybercam_uart_read`
- `cybercam_uart_write`
- `cybercam_uart_flush`
- `cybercam_uart_close`

它们保持原 type 和输入结构，初始化固定使用 CyberCAM UART2 的 `/dev/ttyS2`。这些兼容积木不会出现在工具箱中。不要把拆分后的 `lib-serial` 与仍注册相同 6 个 type 的旧聚合版 `@aily-project/lib-cybercam` 同时加载，否则会重复注册 Blockly 积木定义和 Python generator handler。

新建 CyberCAM 项目不应继续放置隐藏兼容块，而应使用工具箱中的 `linux_uart_init`，把设备字段改为 `/dev/ttyS2`，再组合其余 `linux_uart_*` 积木。

## CyberCAM UART2 启用与接线

[01Studio CyberCAM UART 教程](https://wiki.01studio.cc/docs/cybercam/basic_examples/uart/)确认 UART2 使用 TX2=IO11、RX2=IO12，Linux 设备节点为 `/dev/ttyS2`。先检查 UART2：

```bash
gpio pins
```

若未启用，执行：

```bash
sudo set-device enable uart2
sudo reboot
```

重启后再次运行 `gpio pins` 确认。`set-device` 是 CyberCAM/核桃派镜像的板级工具，不是通用 Linux 命令。

CyberCAM UART 是 3.3V TTL 电平。连接 USB 转 TTL 或其它开发板时必须共地，TX/RX 交叉连接，并将可切换适配器设置为 3.3V。配套 4P 线的红线是 5V，不能接到 3.3V 设备；通常只连接 GND、TX、RX，电源线无需连接。

该库只向 `globalThis.Python.forBlock` 注册生成器：`globalThis.Python` 不存在时安全跳过，不会回退到 MPY/MicroPython；若对象存在但缺少所需的 CPython generator 方法，则抛出明确的兼容性错误。
