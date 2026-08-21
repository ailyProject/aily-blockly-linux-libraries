# SPI

通过 `py-spidev` 使用 Linux 的 `/dev/spidev*` 设备进行 SPI 通信。

- npm 包：`@aily-project/lib-rpi-spi`
- Blockly 积木：5 个
- 运行环境：`devmode: "python"`，并加载独立 CPython generator runtime
- 兼容平台：Raspberry Pi 5

## 积木

- `rpi_spi_init`：打开总线/设备并设置模式、最大时钟频率和每字位数
- `rpi_spi_transfer`：使用 `xfer2` 全双工收发字节列表
- `rpi_spi_read`：使用 `readbytes` 读取字节列表
- `rpi_spi_write`：使用 `writebytes2` 写入列表或缓冲区
- `rpi_spi_close`：关闭设备

## 目标机准备

1. 安装 Python 运行时依赖 `spidev`（发行版包名可能是 `python3-spidev`）。
2. 在系统配置中启用 SPI，并确认相应的 `/dev/spidev*` 设备存在。
3. 确保运行用户拥有该设备的读写权限。

npm 安装本 Blockly 包不会安装 Python 包、修改系统 SPI 配置、执行 `sudo` 或调整设备权限。总线下拉值如 `SPI0` 会转换为 `spidev.SpiDev.open(0, device)` 的总线编号。电气连接必须使用目标板支持的 3.3 V 电平，并按外设要求设置模式与时钟频率。

`mode`、`bits_per_word` 与速度最终由内核控制器驱动决定；硬件不支持某项设置时 py-spidev 会抛出系统错误，不能仅靠积木强制启用。

本库只向 `globalThis.Python.forBlock` 注册生成器；没有 Python runtime 时安全跳过，不会回退到 MPY/MicroPython。

API 依据：[Raspberry Pi SPI 文档](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#spi)与 [py-spidev 官方仓库](https://github.com/doceme/py-spidev)。
