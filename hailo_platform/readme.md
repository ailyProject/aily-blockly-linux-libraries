# HailoRT Python Blockly 库

面向树莓派和 Linux 单板机的 HailoRT Python 常用 API 白名单积木。

- 目标端安装：`sudo apt install hailo-all`
- 积木（4 个）：`python_hailo_platform_call`、`python_hailo_platform_do`、`python_hailo_platform_method`、`python_hailo_platform_do_method`
- 可调用入口：`HEF`、`VDevice`、`Device`、`ConfigureParams`、`InferVStreams`、`InputVStreamParams`、`OutputVStreamParams`
- 对象方法：`configure`、`create_infer_model`、`activate`、`wait_for_async_ready`、`run_async`、`infer`、`get_input_vstream_infos`、`get_output_vstream_infos`
- 对象/模块属性：无
- API 文档：https://www.raspberrypi.com/documentation/computers/ai.html

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

兼容性说明：AI HAT+/AI Kit 使用 hailo-all，AI HAT+ 2 使用 hailo-h10-all；两套软件栈不能共存。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
