# Sense HAT Blockly 库

面向树莓派和 Linux 单板机的 Sense HAT 常用 API 白名单积木。

- 目标端安装：`sudo apt install sense-hat`
- 积木（5 个）：`rpi_sense_hat_call`、`rpi_sense_hat_do`、`rpi_sense_hat_method`、`rpi_sense_hat_do_method`、`rpi_sense_hat_attribute`
- 可调用入口：`SenseHat`
- 对象方法：`show_message`、`show_letter`、`clear`、`set_pixel`、`get_pixel`、`set_pixels`、`get_pixels`、`get_temperature`、`get_humidity`、`get_pressure`、`get_orientation`、`get_accelerometer_raw`、`get_gyroscope_raw`
- 对象/模块属性：`low_light`、`rotation`、`gamma`、`stick`
- API 文档：https://www.raspberrypi.com/documentation/accessories/sense-hat.html

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
