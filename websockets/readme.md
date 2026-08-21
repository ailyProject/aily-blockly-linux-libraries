# websockets Blockly 库

面向树莓派和 Linux 单板机的 websockets 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install websockets`
- 积木（5 个）：`python_websockets_call`、`python_websockets_do`、`python_websockets_method`、`python_websockets_do_method`、`python_websockets_attribute`
- 可调用入口：`connect`、`serve`、`broadcast`
- 对象方法：`send`、`recv`、`close`、`ping`、`pong`、`wait_closed`
- 对象/模块属性：`remote_address`、`local_address`、`state`、`close_code`、`close_reason`、`subprotocol`、`latency`、`request`、`response`
- API 版本说明：面向 websockets 17 顶层 asyncio `connect` 返回的新 `Connection`；该对象使用 `state`，不提供 legacy `closed` 属性。
- API 文档：https://websockets.readthedocs.io/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

异步入口复用仓库级持久 asyncio 事件循环，并同步等待结果；客户端和会话仍需显式关闭。

兼容性说明：该包大版本 API 差异明显，请针对实际安装版本测试。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
