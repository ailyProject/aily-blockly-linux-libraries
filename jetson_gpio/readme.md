# Jetson.GPIO Blockly 库

Jetson 40 针扩展接口的数字输入输出、边沿检测和硬件 PWM。

- 目标端安装：`python3 -m pip install Jetson.GPIO`
- 积木（5 个）：`jetson_gpio_call`、`jetson_gpio_do`、`jetson_gpio_method`、`jetson_gpio_do_method`、`jetson_gpio_attribute`
- 可调用入口：`setwarnings`、`setmode`、`getmode`、`setup`、`input`、`output`、`cleanup`、`gpio_function`、`add_event_detect`、`remove_event_detect`、`event_detected`、`add_event_callback`、`wait_for_edge`、`PWM`
- 对象方法：`start`、`stop`、`ChangeDutyCycle`、`ChangeFrequency`
- 对象/模块属性：`BOARD`、`BCM`、`CVM`、`TEGRA_SOC`、`IN`、`OUT`、`HIGH`、`LOW`、`RISING`、`FALLING`、`BOTH`、`PUD_UP`、`PUD_DOWN`、`JETSON_INFO`、`VERSION`
- API 文档：https://github.com/NVIDIA/jetson-gpio

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
