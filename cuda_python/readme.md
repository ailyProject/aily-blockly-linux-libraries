# NVIDIA CUDA Python Blockly 库

CUDA Runtime 的官方低层 Python 绑定，覆盖设备、内存、流和同步。

- 目标端安装：`python3 -m pip install cuda-python`
- 积木（3 个）：`cuda_python_call`、`cuda_python_do`、`cuda_python_attribute`
- 可调用入口：`cudaGetDeviceCount`、`cudaGetDevice`、`cudaSetDevice`、`cudaGetDeviceProperties`、`cudaDeviceGetAttribute`、`cudaMalloc`、`cudaFree`、`cudaMemcpy`、`cudaMemcpyAsync`、`cudaMemset`、`cudaStreamCreate`、`cudaStreamDestroy`、`cudaStreamSynchronize`、`cudaDeviceSynchronize`、`cudaGetErrorName`、`cudaGetErrorString`
- 对象方法：无
- 对象/模块属性：`cudaError_t.cudaSuccess`、`cudaMemcpyKind.cudaMemcpyHostToDevice`、`cudaMemcpyKind.cudaMemcpyDeviceToHost`、`cudaMemcpyKind.cudaMemcpyDeviceToDevice`
- API 文档：https://nvidia.github.io/cuda-python/cuda-bindings/latest/index.html

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
