# I2C / SMBus

在 Raspberry Pi 5 上通过 `smbus2` 访问 Linux 的 `/dev/i2c-*` 设备，支持 8 位/16 位寄存器、I2C 块数据和带重复起始条件的组合写读事务。

- npm 包：`@aily-project/lib-rpi-i2c`
- Blockly 积木：9 个
- 运行环境：`devmode: "python"`，并加载独立 CPython generator runtime
- Python 依赖：在运行程序的虚拟环境中执行 `python3 -m pip install smbus2`；Raspberry Pi OS Bookworm 及以后版本不要直接修改系统 Python
- 系统要求：先在 Raspberry Pi 系统配置中启用 I2C，并确认存在对应的 `/dev/i2c-*` 设备节点
- 权限要求：为运行用户配置 `/dev/i2c-*` 访问权限（通常加入系统的 `i2c` 用户组后重新登录）
- 电气要求：目标板 GPIO 使用 3.3V 电平；连接 5V I2C 外设时必须使用合适的电平转换

## 积木

- `rpi_i2c_init`
- `rpi_i2c_read_byte_data`
- `rpi_i2c_write_byte_data`
- `rpi_i2c_read_word_data`
- `rpi_i2c_write_word_data`
- `rpi_i2c_read_i2c_block`
- `rpi_i2c_write_i2c_block`
- `rpi_i2c_write_read`
- `rpi_i2c_close`

总线下拉项使用 `${board.i2c}`。生成器可将 `I2C1`、`I2C2` 和 `/dev/i2c-1` 一类值转换为 `SMBus(1)`、`SMBus(2)`。`rpi_i2c_write_read` 使用 `i2c_msg` 与 `i2c_rdwr`，在写和读之间发出 repeated START，不插入 STOP。

`read_word_data` 与 `write_word_data` 遵循 SMBus 的 16 位小端 word 语义；设备若使用不同字节序，调用方需要自行交换字节。`read_i2c_block_data` 与 `write_i2c_block_data` 的 SMBus 块长度通常最多为 32 字节，实际限制还取决于设备和内核适配器。

本库只声明兼容 Raspberry Pi 5。

该库只向 `globalThis.Python.forBlock` 注册生成器；没有 Python runtime 时安全跳过，不会回退到 MPY/MicroPython。

API 依据：[smbus2 官方文档](https://smbus2.readthedocs.io/en/latest/)与 [Raspberry Pi I2C 配置文档](https://www.raspberrypi.com/documentation/computers/configuration.html#i2c)。
