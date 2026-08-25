# NVIDIA TensorRT Blockly 库

在 Jetson 上构建、加载并执行 TensorRT 推理引擎。

- 目标端安装：`install the TensorRT Python bindings supplied with NVIDIA JetPack`
- 积木（5 个）：`nvidia_tensorrt_call`、`nvidia_tensorrt_do`、`nvidia_tensorrt_method`、`nvidia_tensorrt_do_method`、`nvidia_tensorrt_attribute`
- 可调用入口：`Logger`、`Runtime`、`Builder`、`OnnxParser`、`Refitter`、`volume`、`nptype`、`init_libnvinfer_plugins`、`get_plugin_registry`
- 对象方法：`deserialize_cuda_engine`、`create_execution_context`、`create_network`、`create_builder_config`、`build_serialized_network`、`parse`、`parse_from_file`、`set_input_shape`、`set_tensor_address`、`execute_async_v3`、`get_tensor_shape`、`get_tensor_name`、`get_tensor_mode`
- 对象/模块属性：`__version__`、`Logger.WARNING`、`Logger.ERROR`、`Logger.INFO`、`NetworkDefinitionCreationFlag.EXPLICIT_BATCH`、`TensorIOMode.INPUT`、`TensorIOMode.OUTPUT`、`float32`、`float16`、`int8`、`int32`、`bool`、`bfloat16`
- API 文档：https://docs.nvidia.com/deeplearning/tensorrt/latest/api/python-api.html

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
