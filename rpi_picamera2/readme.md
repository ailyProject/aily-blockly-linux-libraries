# Picamera2

通过 Raspberry Pi 官方 Picamera2 API 使用 Raspberry Pi 5 的 CSI 相机。

- npm 包：`@aily-project/lib-rpi-picamera2`
- Blockly 积木：7 个
- 兼容平台：仅 Raspberry Pi 5（`broadcom:bcm2712:raspberrypi_5`）
- 运行环境：项目使用 `devmode: "python"`，并加载独立 CPython generator runtime
- Python API：Picamera2/libcamera；不使用旧版 `picamera` 库

## Raspberry Pi OS 安装

Picamera2 应由 Raspberry Pi OS 的 APT 软件源安装：

```bash
sudo apt update
sudo apt install python3-picamera2
```

如果项目使用 Python 虚拟环境，创建环境时必须允许访问系统安装的软件包：

```bash
python3 -m venv --system-site-packages .venv
```

npm 安装本 Blockly 库不会安装 `python3-picamera2`、libcamera 或任何相机驱动。运行前还必须正确连接并启用相机，且当前用户应具有访问相机设备所需的权限。可先运行 `rpicam-hello --list-cameras` 检查相机。

## 积木

- `rpi_picamera2_init`：选择相机编号，创建预览配置并配置主图像流
- `rpi_picamera2_start`：启动相机
- `rpi_picamera2_capture_array`：将主图像流采集为 NumPy 数组
- `rpi_picamera2_capture_file`：将图像保存到文件
- `rpi_picamera2_set_control`：设置 `FrameRate`、`ExposureTime`、`AnalogueGain` 或 `AwbEnable`
- `rpi_picamera2_stop`：停止采集但保持相机打开
- `rpi_picamera2_close`：安全停止并关闭相机

`FrameRate`、`ExposureTime`、`AnalogueGain` 和 `AwbEnable` 的值会分别转换为 `float`、`int`、`float` 和 `bool`。`ExposureTime` 的单位是微秒；`AwbEnable` 应连接布尔值。下拉项 `XRGB888` 会生成 Picamera2 官方格式名 `XRGB8888`。

初始化积木会注册清理代码。程序结束时只会停止已启动的相机，并只会关闭仍处于打开状态的相机，因此显式使用停止或关闭积木后不会因重复清理而报错。

本库只向 `globalThis.Python.forBlock` 注册生成器；没有 Python runtime 时安全跳过，不会回退到 MPY/MicroPython。

API 与安装依据：[Raspberry Pi Picamera2 官方手册](https://datasheets.raspberrypi.com/camera/picamera2-manual.pdf)。
