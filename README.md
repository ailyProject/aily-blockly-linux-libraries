# aily-blockly-linux-libraries

Python 积木库，给 CyberCAM、树莓派和独立核桃派使用。这不是 Arduino 库仓库。

| 目录 | npm 包 | 用途 |
| --- | --- | --- |
| `cybercam` | `@aily-project/lib-cybercam` | CyberCAM K230 专用 CanMV/`walnutpi`/`kpu` 积木，并自包含可移植积木 |
| `python-core` | `@aily-project/lib-python-core` | 可移植 CPython：语言、OpenCV、码识别、网络、文件 |
| `linux-python` | `@aily-project/lib-linux-python` | gpiozero / pyserial / `cv2.VideoCapture` / ALSA |

不要把 `lib-cybercam` 装到树莓派或独立核桃派项目上。那些板使用 `lib-python-core` + `lib-linux-python`。  
CyberCAM 项目继续只依赖 `lib-cybercam`，保持自包含。

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
