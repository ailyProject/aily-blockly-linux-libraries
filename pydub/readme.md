# pydub Blockly 库

面向树莓派和 Linux 单板机的 pydub 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install pydub`
- 积木（5 个）：`python_pydub_call`、`python_pydub_do`、`python_pydub_method`、`python_pydub_do_method`、`python_pydub_attribute`
- 可调用入口：`AudioSegment.silent`、`AudioSegment.from_file`、`AudioSegment.from_wav`
- 对象方法：`export`、`overlay`、`append`、`fade_in`、`fade_out`、`set_frame_rate`、`set_channels`
- 对象/模块属性：`duration_seconds`、`frame_rate`、`channels`、`sample_width`、`raw_data`
- API 文档：https://github.com/jiaaro/pydub

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

兼容性说明：多数压缩音频格式还需要 FFmpeg。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
