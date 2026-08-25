# NVIDIA VPI Blockly 库

使用 Jetson 的 CPU、CUDA 和 PVA 后端执行硬件加速视觉算法。

- 目标端安装：`sudo apt install python3-vpi3`
- 积木（5 个）：`nvidia_vpi_call`、`nvidia_vpi_do`、`nvidia_vpi_method`、`nvidia_vpi_do_method`、`nvidia_vpi_attribute`
- 可调用入口：`asimage`、`asarray`、`Image`、`Array`、`Pyramid`、`Stream`、`execute`、`mixchannels`
- 对象方法：`convert`、`rescale`、`box_filter`、`gaussian_filter`、`median_filter`、`bilateral_filter`、`erode`、`dilate`、`canny`、`eqhist`、`histogram`、`minmaxloc`、`lock_cpu`、`lock_cuda`、`sync`
- 对象/模块属性：`Backend.CPU`、`Backend.CUDA`、`Backend.PVA`、`Format.RGB8`、`Format.RGBA8`、`Format.BGR8`、`Format.GRAY8`、`Interp.NEAREST`、`Interp.LINEAR`、`Border.CLAMP`、`width`、`height`、`size`、`format`
- API 文档：https://docs.nvidia.com/vpi/python/index.html

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
