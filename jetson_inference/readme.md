# jetson-inference Blockly 库

Jetson 上的图像分类、目标检测、分割、姿态和动作识别推理。

- 目标端安装：`build and install https://github.com/dusty-nv/jetson-inference`
- 积木（5 个）：`jetson_inference_call`、`jetson_inference_do`、`jetson_inference_method`、`jetson_inference_do_method`、`jetson_inference_attribute`
- 可调用入口：`detectNet`、`imageNet`、`segNet`、`poseNet`、`actionNet`、`backgroundNet`
- 对象方法：`Detect`、`Classify`、`Segment`、`Process`、`GetNetworkFPS`、`PrintProfilerTimes`、`GetClassDesc`、`GetClassLabel`、`GetNumClasses`
- 对象/模块属性：`ClassID`、`Confidence`、`Left`、`Top`、`Right`、`Bottom`、`Width`、`Height`、`Center`、`Area`
- API 文档：https://github.com/dusty-nv/jetson-inference

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
