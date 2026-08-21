# RPLCD Blockly 库

面向树莓派和 Linux 单板机的 RPLCD 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install RPLCD`
- 积木（5 个）：`python_rplcd_call`、`python_rplcd_do`、`python_rplcd_method`、`python_rplcd_do_method`、`python_rplcd_attribute`
- 可调用入口：`CharLCD`
- 对象方法：`write_string`、`clear`、`create_char`、`home`、`close`
- 对象/模块属性：`cursor_pos`、`backlight_enabled`、`cursor_mode`、`display_enabled`
- API 文档：https://rplcd.readthedocs.io/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
