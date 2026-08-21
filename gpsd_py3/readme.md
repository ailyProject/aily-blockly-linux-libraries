# gpsd-py3 Blockly 库

面向树莓派和 Linux 单板机的 gpsd-py3 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install gpsd-py3`
- 积木（5 个）：`linux_gpsd_call`、`linux_gpsd_do`、`linux_gpsd_method`、`linux_gpsd_do_method`、`linux_gpsd_attribute`
- 可调用入口：`connect`、`get_current`、`get_packets`
- 对象方法：`position`、`altitude`、`movement`、`speed`、`climb`
- 对象/模块属性：`mode`、`sats`、`lat`、`lon`、`hspeed`、`track`、`time`
- API 文档：https://pypi.org/project/gpsd-py3/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
