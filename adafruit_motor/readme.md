# CircuitPython Motor Blockly 库

面向树莓派和 Linux 单板机的 CircuitPython Motor 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install adafruit-circuitpython-motor`
- 积木（3 个）：`python_adafruit_motor_call`、`python_adafruit_motor_do`、`python_adafruit_motor_attribute`
- 可调用入口：`DCMotor`
- 对象方法：无
- 对象/模块属性：`throttle`、`decay_mode`、`SLOW_DECAY`、`FAST_DECAY`
- API 文档：https://docs.circuitpython.org/projects/motor/en/latest/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。

## Raspberry Pi 5B 的 CPython 运行层

尽管 PyPI 包名包含 `circuitpython`，这里运行的是标准 Raspberry Pi OS/Linux CPython，通过 Blinka 访问硬件；它不是 MicroPython，也不需要 CircuitPython 固件。

推荐以标准 64 位 Raspberry Pi OS 为首要路径，并在 Bookworm/Trixie 中使用虚拟环境：

```sh
sudo apt install python3-venv python3-libgpiod python3-lgpio i2c-tools
python3 -m venv .venv --system-site-packages
. .venv/bin/activate
python3 -m pip install --upgrade Adafruit-Blinka adafruit-circuitpython-motor
```

根据硬件启用 I2C/SPI，并确认运行用户可访问对应的 `/dev/i2c-*`、`/dev/spidev*`、GPIO 或 PIO 设备。不要使用 `--break-system-packages`；本库也不会自动修改 `/boot/firmware/config.txt`、udev 或用户组。
