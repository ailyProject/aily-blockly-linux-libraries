# @aily-project/lib-pyaudio

Curated PyAudio integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pyaudio as _python_lib_pyaudio`
- Install on target: `sudo apt install python3-pyaudio`
- Blocks (5): `python_pyaudio_call`, `python_pyaudio_do`, `python_pyaudio_method`, `python_pyaudio_do_method`, `python_pyaudio_attribute`
- Allowlisted callables: `PyAudio`
- Allowlisted methods: `open`, `terminate`, `get_device_count`, `get_device_info_by_index`, `get_default_input_device_info`, `is_format_supported`, `read`, `write`, `start_stream`, `stop_stream`, `close`
- Allowlisted attributes: `paInt16`, `paFloat32`, `paUInt8`
- API source: https://people.csail.mit.edu/hubert/pyaudio/docs/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
