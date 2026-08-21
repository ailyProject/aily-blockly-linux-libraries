# Build HAT Blockly 库

面向树莓派和 Linux 单板机的 Build HAT 常用 API 白名单积木。

- 目标端安装：`sudo apt install python3-build-hat`
- 积木（5 个）：`rpi_buildhat_call`、`rpi_buildhat_do`、`rpi_buildhat_method`、`rpi_buildhat_do_method`、`rpi_buildhat_attribute`
- 可调用入口：`Motor`、`MotorPair`、`ColorSensor`、`DistanceSensor`、`ForceSensor`、`Matrix`、`Light`
- 对象方法：`run_for_seconds`、`run_for_degrees`、`start`、`stop`、`get_aposition`、`get_color`、`get_distance`、`get_force`、`on`、`off`
- 对象/模块属性：`position`、`when_pressed`、`when_released`
- API 文档：https://www.raspberrypi.com/documentation/accessories/build-hat.html

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

兼容性说明：树莓派官方当前明确 Build HAT 不支持 Raspberry Pi OS Trixie，请使用 Bookworm。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
