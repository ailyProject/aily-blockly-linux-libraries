# libgpiod v2 Blockly 库

面向树莓派和 Linux 单板机的 libgpiod v2 常用 API 白名单积木。

- 目标端安装：`sudo apt install python3-libgpiod`
- 积木（5 个）：`linux_gpiod_call`、`linux_gpiod_do`、`linux_gpiod_method`、`linux_gpiod_do_method`、`linux_gpiod_attribute`
- 可调用入口：`request_lines`、`LineSettings`
- 对象方法：`get_value`、`get_values`、`set_value`、`set_values`、`wait_edge_events`、`read_edge_events`、`reconfigure_lines`、`release`
- 对象/模块属性：`line.Direction.INPUT`、`line.Direction.OUTPUT`、`line.Value.ACTIVE`、`line.Value.INACTIVE`、`line.Edge.RISING`、`line.Edge.FALLING`、`line.Edge.BOTH`
- API 文档：https://libgpiod.readthedocs.io/en/stable/python_api.html

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

兼容性说明：面向 libgpiod v2 的 request_lines API，不使用已淘汰的 v1 Chip.get_line API。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
