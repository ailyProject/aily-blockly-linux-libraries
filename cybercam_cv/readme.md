# 相机与 AI

`@aily-project/lib-cybercam-cv` 提供 01Studio CyberCAM K230 独有的相机、显示和 KPU 机器视觉能力。本包共 24 个积木：从 `@aily-project/lib-cybercam` 拆出的 23 个既有 type 保持不变，另新增 `cybercam_camera_read_raw` 以返回完整的相机读取结果。

官方教程入口：[CyberCAM 机器视觉](https://wiki.01studio.cc/docs/category/%E6%9C%BA%E5%99%A8%E8%A7%86%E8%A7%89-2/)。逐分类映射和证据链接见 [API-COVERAGE.md](./API-COVERAGE.md)。

## 积木范围

### 相机与显示（12）

`cybercam_camera_init`、`cybercam_camera_opened`、`cybercam_camera_read`、`cybercam_camera_read_raw`、`cybercam_camera_hmirror`、`cybercam_camera_vflip`、`cybercam_camera_release`、`cybercam_display_init`、`cybercam_display_rotation`、`cybercam_display_show`、`cybercam_ide_show`、`cybercam_lcd_direction`。

这些积木生成 `walnutpi.Sensor`、`Display`、`IDE` 和 `direction` API。相机下拉选项明确区分板载 CSI2（`id=2`）和扩展 CSI0（`id=0`）；显示旋转开放 0°、90°、180°、270° 四个官方方向值。`cybercam_camera_read` 便捷返回图像，新增的 `cybercam_camera_read_raw` 则保留官方 `read()` 的完整 `(ret, img)` 结果，便于先判断采集是否成功。板载或扩展 CSI 摄像头不能用面向普通 V4L2 设备的 `linux_camera_*` 积木替代。

### KPU 推理与结果（12）

`cybercam_ai_init_simple`、`cybercam_ai_init_face`、`cybercam_ai_init_mask`、`cybercam_ai_init_hand_keypoint`、`cybercam_ai_init_ocr`、`cybercam_ai_init_licence`、`cybercam_ai_run`、`cybercam_ai_run_confidence`、`cybercam_ai_run_thresholds`、`cybercam_result_length`、`cybercam_result_item`、`cybercam_result_property`。

已核对的 `walnutpi.kpu` 类包括 `FACE_DETECT`、`FACE_MASK`、`FALL_DETECT`、`HAND_DETECT`、`HAND_KEYPOINT`、`HAND_KEYPOINT_CLS`、`LICENCE_DETECT`、`OCR`、`PERSON_DETECT`、`PERSON_KEYPOINT`、`SMOKE_DETECT`、`TRAFFIC_LIGHT_DETECT`、`YOLO11_CLS` 和 `YOLO11_DET`。模型、锚点、字典和标签文件不随积木库分发，必须部署到 CyberCAM 并把实际路径传给初始化积木。

结果属性包含各模型已验证的通用框、标签、文字、关键点和人脸特征字段，并补充 `mask`（口罩结果）与 `top5`（YOLO11 分类前五项）。不同模型的结果结构不同，选择不适用于当前模型的属性会在运行时失败。

## 不重复的功能边界

官方机器视觉教程也使用 OpenCV、绘图、颜色/形状检测以及 QR、条码和 AprilTag。这些是可移植能力，继续由 CyberCAM 兼容的 `@aily-project/lib-vision` 提供 32 个 `python_*` 积木，本包不复制它们。该通用库已经补齐教程使用的 Canny、霍夫圆、形态学、轮廓分析、连通域字段、折线/FreeType 文字以及码识别结果字段。

在线模型训练、数据集标注、应用打包、扫码部署和系统配置属于外部工作流，不是运行时 Python API，因此不生成积木。

## 组合使用

- 程序结构、变量和基础值：`@aily-project/lib-core`
- CyberCAM 相机、显示和 KPU：本包
- OpenCV、绘图和码识别：`@aily-project/lib-vision`
- GPIO、板载 LED/按键和 PWM：`@aily-project/lib-cybercam-gpio`（12 个迁移 type）
- UART：`@aily-project/lib-serial`（共 12 个 definition、工具箱可见 6 个 `linux_uart_*`；CyberCAM 的 `DEVICE` 必须为 `/dev/ttyS2`，6 个 `cybercam_uart_*` 仅隐藏兼容旧工程）
- ADC、音频、IMU 和芯片 ID：`@aily-project/lib-cybercam`（10 个积木）

典型视觉项目使用 `python_start`/`python_forever` 组织程序，在开始阶段初始化显示、相机和模型，在循环中采集图像、执行推理并显示结果。

## 运行前提

项目级 `package.json` 必须设置 `"devmode": "python"`，编辑器构建也必须包含 aily CPython generator runtime。目标系统镜像还必须提供相匹配的 `walnutpi` 模块、KPU 运行时和模型格式；不同镜像或 nncase 版本生成的模型不保证互换。

## 从 CyberCAM 主库迁移

迁移的 23 个机器视觉积木只改变所属包，不改变 type。使用这些积木的旧项目应安装 `@aily-project/lib-cybercam-cv`；`cybercam_camera_read_raw` 是新增 type，不影响旧工作区。GPIO、板载 LED/按键和 PWM 的 12 个既有 type 现由 `@aily-project/lib-cybercam-gpio` 所有；6 个既有 `cybercam_uart_*` type 已移入 `@aily-project/lib-serial` 并隐藏注册以兼容旧工作区，新工程应改用工具箱可见的 `linux_uart_*` 并将 CyberCAM `DEVICE` 固定为 `/dev/ttyS2`；基础 `@aily-project/lib-cybercam` 现只保留 10 个 ADC、音频、IMU 和芯片 ID 积木。不要将本包与仍内含原 23 个机器视觉定义的旧聚合版 `lib-cybercam` 同时加载，不要将新 GPIO 包与仍注册其 12 个迁移 type 的旧版基础包同时加载，也不要将更新后的 `serial` 与仍注册旧 UART type 的旧版基础包同时加载，否则会重复注册 Blockly block 和 Python generator handler。

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-cybercam-cv` |
| Version | 0.0.1 |
| Blocks | 24（23 migrated + 1 new） |
| Board | 01Studio CyberCAM K230 (Python mode) |
| Block type migration | unchanged (`cybercam_*`) |
| Author | ailyProject; hardware APIs by 01Studio |
| License | MIT |
