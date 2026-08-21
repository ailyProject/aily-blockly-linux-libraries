# @aily-project/lib-sounddevice

Curated python-sounddevice integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import sounddevice as _python_lib_sounddevice`
- Install on target: `python3 -m pip install sounddevice`
- Blocks (5): `python_sounddevice_call`, `python_sounddevice_do`, `python_sounddevice_method`, `python_sounddevice_do_method`, `python_sounddevice_attribute`
- Allowlisted callables: `play`, `rec`, `playrec`, `wait`, `stop`, `query_devices`, `query_hostapis`, `InputStream`, `OutputStream`, `Stream`
- Allowlisted methods: `start`, `stop`, `abort`, `close`, `read`, `write`
- Allowlisted attributes: `active`, `closed`, `latency`, `samplerate`, `channels`, `dtype`
- API source: https://python-sounddevice.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
