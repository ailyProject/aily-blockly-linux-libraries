# aily-blockly-linux-libraries

Linux Python 积木库，给树莓派和独立核桃派使用。

这不是 Arduino 库仓库，也不包含 CyberCAM CanMV / KPU 积木。

| 目录 | npm 包 | 用途 |
| --- | --- | --- |
| `python-core` | `@aily-project/lib-python-core` | 可移植 CPython：语言、OpenCV、码识别、网络、文件 |
| `linux-python` | `@aily-project/lib-linux-python` | gpiozero / pyserial / `cv2.VideoCapture` / ALSA |

板卡包见 [aily-blockly-linux-boards](https://github.com/ailyProject/aily-blockly-linux-boards)。

## 开发

```text
<repo>/aily-blockly
<repo>/aily-blockly-linux-boards
<repo>/aily-blockly-linux-libraries
```

```powershell
npm test
```
