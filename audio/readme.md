# Audio

通过 ALSA 播放和录制 WAV 音频。

- npm 包：`@aily-project/lib-audio`
- Blockly 积木：2 个（工具箱可见 2 个）
- 运行环境：`devmode: "python"`，并加载独立 CPython generator runtime
- 目标端依赖：系统命令 aplay、arecord

## 积木

- `linux_audio_play`
- `linux_audio_record`

该库只向 `globalThis.Python.forBlock` 注册生成器；没有 Python runtime 时安全跳过，不会回退到 MPY/MicroPython。
