# @aily-project/lib-speech-recognition

Curated SpeechRecognition integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import speech_recognition as _python_lib_speech_recognition`
- Install on target: `python3 -m pip install SpeechRecognition`
- Blocks (5): `python_speech_recognition_call`, `python_speech_recognition_do`, `python_speech_recognition_method`, `python_speech_recognition_do_method`, `python_speech_recognition_attribute`
- Allowlisted callables: `Recognizer`, `Microphone`, `AudioFile`
- Allowlisted methods: `listen`, `record`, `adjust_for_ambient_noise`, `recognize_google`, `recognize_sphinx`, `recognize_vosk`, `recognize_whisper`
- Allowlisted attributes: `energy_threshold`, `dynamic_energy_threshold`, `pause_threshold`, `phrase_threshold`, `non_speaking_duration`
- API source: https://github.com/Uberi/speech_recognition

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
