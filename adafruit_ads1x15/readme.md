# CircuitPython ADS1x15 Blockly 库

面向树莓派和 Linux 单板机的 CircuitPython ADS1x15 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install adafruit-circuitpython-ads1x15`
- 积木（5 个）：`python_adafruit_ads1x15_call`、`python_adafruit_ads1x15_do`、`python_adafruit_ads1x15_method`、`python_adafruit_ads1x15_do_method`、`python_adafruit_ads1x15_attribute`
- 可调用入口：`ADS1115`、`AnalogIn`
- 对象方法：`read`
- 对象/模块属性：`gain`、`mode`、`data_rate`、`comparator_queue_length`、`comparator_latch`、`comparator_polarity`、`value`、`voltage`、`Pin.A0`、`Pin.A1`、`Pin.A2`、`Pin.A3`
- API 文档：https://docs.circuitpython.org/projects/ads1x15/en/latest/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。

## Raspberry Pi 5B 的 CPython 运行层

尽管 PyPI 包名包含 `circuitpython`，这里运行的是标准 Raspberry Pi OS/Linux CPython，通过 Blinka 访问硬件；它不是 MicroPython，也不需要 CircuitPython 固件。

生成器分别从 `adafruit_ads1x15.ads1115` 与 `adafruit_ads1x15.analog_in` 导入两个构造器，并从 `adafruit_ads1x15.ads1x15` 读取 `Pin.A0` 至 `Pin.A3`。`value`、`voltage` 等通道属性读取属性积木连接的对象。

推荐以标准 64 位 Raspberry Pi OS 为首要路径，并在 Bookworm/Trixie 中使用虚拟环境：

```sh
sudo apt install python3-venv python3-libgpiod python3-lgpio i2c-tools
python3 -m venv .venv --system-site-packages
. .venv/bin/activate
python3 -m pip install --upgrade Adafruit-Blinka adafruit-circuitpython-ads1x15
```

根据硬件启用 I2C/SPI，并确认运行用户可访问对应的 `/dev/i2c-*`、`/dev/spidev*`、GPIO 或 PIO 设备。不要使用 `--break-system-packages`；本库也不会自动修改 `/boot/firmware/config.txt`、udev 或用户组。
