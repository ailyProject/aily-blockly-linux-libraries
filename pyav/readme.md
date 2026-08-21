# PyAV Blockly 库

面向树莓派和 Linux 单板机的 PyAV 常用 API 白名单积木。

- 目标端安装：`sudo apt install python3-av`
- 积木（5 个）：`python_pyav_call`、`python_pyav_do`、`python_pyav_method`、`python_pyav_do_method`、`python_pyav_attribute`
- 可调用入口：`open`、`AudioFrame`、`VideoFrame`、`Packet`
- 对象方法：`demux`、`decode`、`encode`、`mux`、`close`、`add_stream`、`to_ndarray`、`reformat`
- 对象/模块属性：`streams`、`duration`、`format`、`metadata`、`time_base`、`pts`、`width`、`height`
- API 文档：https://pyav.org/docs/stable/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
