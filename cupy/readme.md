# CuPy Blockly 库

在 Jetson CUDA GPU 上使用 NumPy 风格的数组、线性代数和流。

- 目标端安装：`python3 -m pip install cupy-cuda12x`
- 积木（5 个）：`cupy_call`、`cupy_do`、`cupy_method`、`cupy_do_method`、`cupy_attribute`
- 可调用入口：`array`、`asarray`、`asnumpy`、`zeros`、`ones`、`empty`、`arange`、`linspace`、`concatenate`、`stack`、`matmul`、`dot`、`mean`、`sum`、`max`、`min`、`argmax`、`get_array_module`、`cuda.Device`、`cuda.Stream`、`cuda.Event`
- 对象方法：`get`、`set`、`astype`、`reshape`、`transpose`、`copy`、`fill`、`sum`、`mean`
- 对象/模块属性：`ndarray`、`float32`、`float16`、`int8`、`int32`、`int64`、`bool_`
- API 文档：https://docs.cupy.dev/en/stable/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
