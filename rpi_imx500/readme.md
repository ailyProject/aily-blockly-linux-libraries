# Raspberry Pi IMX500 Blockly 库

面向 Raspberry Pi AI Camera 的 IMX500 模型加载、推理输出、ROI 与网络元数据 API。

- 目标端安装：`sudo apt install imx500-all python3-picamera2`
- 积木（5 个）：`rpi_imx500_call`、`rpi_imx500_do`、`rpi_imx500_method`、`rpi_imx500_do_method`、`rpi_imx500_attribute`
- 可调用入口：`IMX500`、`NetworkIntrinsics`、`postprocess_nanodet_detection`、`softmax`
- 对象方法：`get_outputs`、`get_output_shapes`、`get_input_size`、`convert_inference_coords`、`set_inference_roi_abs`、`set_inference_aspect_ratio`、`set_auto_aspect_ratio`、`show_network_fw_progress_bar`、`get_kpi_info`、`update_with_defaults`
- 对象/模块属性：`camera_num`、`config`、`network_intrinsics`、`task`、`inference_rate`、`labels`、`bbox_normalization`、`bbox_order`、`preserve_aspect_ratio`、`postprocess`、`softmax`
- API 文档：https://www.raspberrypi.com/documentation/accessories/ai-camera.html

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
