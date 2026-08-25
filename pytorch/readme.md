# PyTorch Blockly 库

使用 NVIDIA 针对 JetPack 提供的 PyTorch 构建张量和运行 GPU 推理。

- 目标端安装：`python3 -m pip install --no-cache-dir "$TORCH_INSTALL"`
- 积木（5 个）：`pytorch_call`、`pytorch_do`、`pytorch_method`、`pytorch_do_method`、`pytorch_attribute`
- 可调用入口：`tensor`、`as_tensor`、`from_numpy`、`zeros`、`ones`、`empty`、`arange`、`linspace`、`stack`、`cat`、`matmul`、`no_grad`、`inference_mode`、`load`、`save`、`device`、`cuda.is_available`、`cuda.device_count`、`cuda.get_device_name`
- 对象方法：`to`、`cpu`、`cuda`、`numpy`、`detach`、`clone`、`reshape`、`permute`、`unsqueeze`、`squeeze`、`eval`、`train`、`forward`
- 对象/模块属性：`__version__`、`float32`、`float16`、`bfloat16`、`int8`、`int32`、`int64`、`bool`
- API 文档：https://docs.nvidia.com/deeplearning/frameworks/install-pytorch-jetson-platform/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
