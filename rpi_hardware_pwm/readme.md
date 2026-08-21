# Raspberry Pi Hardware PWM Blockly 库

面向树莓派和 Linux 单板机的 Raspberry Pi Hardware PWM 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install rpi-hardware-pwm`
- 积木（5 个）：`rpi_hardware_pwm_call`、`rpi_hardware_pwm_do`、`rpi_hardware_pwm_method`、`rpi_hardware_pwm_do_method`、`rpi_hardware_pwm_attribute`
- 可调用入口：`HardwarePWM`
- 对象方法：`start`、`stop`、`change_duty_cycle`、`change_frequency`
- 对象/模块属性：`duty_cycle`、`frequency_hz`、`pwm_channel`、`chip`
- API 文档：https://github.com/Pioreactor/rpi_hardware_pwm

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
