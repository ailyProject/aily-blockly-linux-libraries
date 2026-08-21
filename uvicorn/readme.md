# Uvicorn Blockly 库

面向树莓派和 Linux 单板机的 Uvicorn 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install uvicorn`
- 积木（5 个）：`python_uvicorn_call`、`python_uvicorn_do`、`python_uvicorn_method`、`python_uvicorn_do_method`、`python_uvicorn_attribute`
- 可调用入口：`run`、`Config`、`Server`
- 对象方法：`run`
- 对象/模块属性：`started`、`should_exit`、`force_exit`、`config`
- API 文档：https://www.uvicorn.org/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

Uvicorn 的 `run` 入口直接在当前线程运行，不使用 asyncio 桥接，以避免服务器内部事件循环嵌套。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
