# python-socketio Blockly 库

面向树莓派和 Linux 单板机的 python-socketio 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install python-socketio`
- 积木（5 个）：`python_python_socketio_call`、`python_python_socketio_do`、`python_python_socketio_method`、`python_python_socketio_do_method`、`python_python_socketio_attribute`
- 可调用入口：`Client`、`AsyncClient`、`Server`、`AsyncServer`、`WSGIApp`、`ASGIApp`
- 对象方法：`connect`、`disconnect`、`emit`、`send`、`call`、`on`、`event`、`start_background_task`、`sleep`、`transport`
- 对象/模块属性：`connected`、`sid`、`namespaces`
- API 文档：https://python-socketio.readthedocs.io/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

异步入口复用仓库级持久 asyncio 事件循环，并同步等待结果；客户端和会话仍需显式关闭。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
