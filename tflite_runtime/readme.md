# LiteRT / TFLite Runtime Blockly 库

面向树莓派和 Linux 单板机的 LiteRT / TFLite Runtime 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install tflite-runtime`
- 积木（4 个）：`python_tflite_runtime_call`、`python_tflite_runtime_do`、`python_tflite_runtime_method`、`python_tflite_runtime_do_method`
- 可调用入口：`Interpreter`、`load_delegate`
- 对象方法：`allocate_tensors`、`get_input_details`、`get_output_details`、`set_tensor`、`get_tensor`、`invoke`、`resize_tensor_input`、`get_signature_runner`
- 对象/模块属性：无
- API 文档：https://ai.google.dev/edge/litert

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

兼容性说明：应在虚拟环境安装当前 wheel；旧的 Debian python3-tflite-runtime 包已不是推荐路径。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
