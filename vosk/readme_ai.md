# @aily-project/lib-vosk

Curated Vosk integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import vosk as _python_lib_vosk`
- Install on target: `python3 -m pip install vosk`
- Blocks (4): `python_vosk_call`, `python_vosk_do`, `python_vosk_method`, `python_vosk_do_method`
- Allowlisted callables: `Model`, `KaldiRecognizer`, `SetLogLevel`, `SpkModel`
- Allowlisted methods: `AcceptWaveform`, `Result`, `PartialResult`, `FinalResult`, `Reset`, `SetWords`, `SetPartialWords`, `SetGrammar`
- Allowlisted attributes: none
- API source: https://alphacephei.com/vosk/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
