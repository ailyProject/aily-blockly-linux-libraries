# TorchVision Blockly 库

PyTorch 的常用视觉模型、预处理变换、图像 I/O 和检测算子。

- 目标端安装：`python3 -m pip install torchvision`
- 积木（5 个）：`torchvision_call`、`torchvision_do`、`torchvision_method`、`torchvision_do_method`、`torchvision_attribute`
- 可调用入口：`models.resnet18`、`models.resnet50`、`models.mobilenet_v3_small`、`models.mobilenet_v3_large`、`models.detection.fasterrcnn_resnet50_fpn`、`transforms.Compose`、`transforms.Resize`、`transforms.CenterCrop`、`transforms.ToTensor`、`transforms.Normalize`、`io.read_image`、`io.write_jpeg`、`ops.nms`、`ops.box_iou`
- 对象方法：`to`、`cpu`、`cuda`、`eval`、`train`、`forward`
- 对象/模块属性：`__version__`
- API 文档：https://pytorch.org/vision/stable/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
