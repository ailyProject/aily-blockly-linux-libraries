# Camera

通过 OpenCV 的 `cv2.VideoCapture` 使用普通 Linux V4L2 相机。

- npm 包：`@aily-project/lib-camera`
- Blockly 积木：4 个
- 运行环境：`devmode: "python"`，并加载独立 CPython generator runtime
- 目标端依赖：`cv2`、V4L2 相机设备及相应访问权限
- 兼容平台：Raspberry Pi 和 WalnutPi Python

## 积木

- `linux_camera_init`
- `linux_camera_opened`
- `linux_camera_read`
- `linux_camera_release`

该库面向 `/dev/video*` V4L2 设备。CyberCAM 板载 CSI 相机应使用 `@aily-project/lib-cybercam-cv` 的 `cybercam_camera_*`，因此本库不声明 CyberCAM 兼容。

该库只向 `globalThis.Python.forBlock` 注册生成器；没有 Python runtime 时安全跳过，不会回退到 MPY/MicroPython。
