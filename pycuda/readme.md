# PyCUDA Blockly 库

使用 Python 管理 CUDA 设备、上下文、显存、流、事件和已编译模块。

- 目标端安装：`sudo apt install python3-pycuda`
- 积木（5 个）：`pycuda_call`、`pycuda_do`、`pycuda_method`、`pycuda_do_method`、`pycuda_attribute`
- 可调用入口：`init`、`Device`、`Device.count`、`mem_alloc`、`memcpy_htod`、`memcpy_dtoh`、`memcpy_dtod`、`Stream`、`Event`、`module_from_file`、`get_version`、`get_driver_version`
- 对象方法：`name`、`compute_capability`、`total_memory`、`make_context`、`pop`、`detach`、`synchronize`、`record`、`time_till`、`time_since`、`free`
- 对象/模块属性：`handle`、`device`、`context`
- API 文档：https://documen.tician.de/pycuda/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
