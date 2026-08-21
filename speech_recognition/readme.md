# SpeechRecognition Blockly 库

面向树莓派和 Linux 单板机的 SpeechRecognition 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install SpeechRecognition`
- 积木（5 个）：`python_speech_recognition_call`、`python_speech_recognition_do`、`python_speech_recognition_method`、`python_speech_recognition_do_method`、`python_speech_recognition_attribute`
- 可调用入口：`Recognizer`、`Microphone`、`AudioFile`
- 对象方法：`listen`、`record`、`adjust_for_ambient_noise`、`recognize_google`、`recognize_sphinx`、`recognize_vosk`、`recognize_whisper`
- 对象/模块属性：`energy_threshold`、`dynamic_energy_threshold`、`pause_threshold`、`phrase_threshold`、`non_speaking_duration`
- API 文档：https://github.com/Uberi/speech_recognition

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
