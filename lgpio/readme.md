# lgpio Blockly 库

面向树莓派和 Linux 单板机的 lgpio 常用 API 白名单积木。

- 目标端安装：`sudo apt install python3-lgpio`
- 积木（5 个）：`linux_lgpio_call`、`linux_lgpio_do`、`linux_lgpio_method`、`linux_lgpio_do_method`、`linux_lgpio_attribute`
- 可调用入口：`gpiochip_open`、`gpiochip_close`、`gpio_claim_input`、`gpio_claim_output`、`gpio_read`、`gpio_write`、`tx_pwm`、`callback`
- 对象方法：`cancel`
- 对象/模块属性：`RISING_EDGE`、`FALLING_EDGE`、`BOTH_EDGES`、`SET_PULL_UP`、`SET_PULL_DOWN`、`SET_PULL_NONE`
- API 文档：https://github.com/joan2937/lg

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
