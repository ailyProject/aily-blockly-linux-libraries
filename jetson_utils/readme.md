# jetson-utils Blockly 库

Jetson 的摄像头/视频流、CUDA 图像缓冲区、图像转换和显示工具。

- 目标端安装：`python3 -m pip install git+https://github.com/dusty-nv/jetson-utils`
- 积木（5 个）：`jetson_utils_call`、`jetson_utils_do`、`jetson_utils_method`、`jetson_utils_do_method`、`jetson_utils_attribute`
- 可调用入口：`videoSource`、`videoOutput`、`cudaAllocMapped`、`cudaFromNumpy`、`cudaToNumpy`、`cudaConvertColor`、`cudaResize`、`cudaCrop`、`cudaOverlay`、`loadImage`、`saveImage`
- 对象方法：`Capture`、`Render`、`IsStreaming`、`Close`、`SetStatus`、`GetWidth`、`GetHeight`、`GetFrameRate`、`GetFrameCount`、`GetLastTimestamp`
- 对象/模块属性：`width`、`height`、`channels`、`format`、`mapped`、`ptr`、`shape`
- API 文档：https://github.com/dusty-nv/jetson-utils

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
