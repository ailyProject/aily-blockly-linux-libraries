# pymavlink Blockly 库

面向树莓派和 Linux 单板机的 pymavlink 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install pymavlink`
- 积木（5 个）：`python_pymavlink_call`、`python_pymavlink_do`、`python_pymavlink_method`、`python_pymavlink_do_method`、`python_pymavlink_attribute`
- 可调用入口：`mavlink_connection`、`mode_string_v10`、`all_printable`、`periodic_event`
- 对象方法：`wait_heartbeat`、`recv_match`、`mode_mapping`、`set_mode`、`close`、`write`、`param_fetch_all`
- 对象/模块属性：`target_system`、`target_component`、`mav`、`flightmode`、`messages`
- API 文档：https://mavlink.io/en/mavgen_python/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
