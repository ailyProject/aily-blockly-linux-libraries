# @aily-project/lib-soundfile

Curated SoundFile integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import soundfile as _python_lib_soundfile`
- Install on target: `python3 -m pip install soundfile`
- Blocks (5): `python_soundfile_call`, `python_soundfile_do`, `python_soundfile_method`, `python_soundfile_do_method`, `python_soundfile_attribute`
- Allowlisted callables: `read`, `write`, `blocks`, `info`, `SoundFile`
- Allowlisted methods: `read`, `write`, `seek`, `tell`, `flush`, `close`, `blocks`
- Allowlisted attributes: `samplerate`, `channels`, `frames`, `format`, `subtype`, `closed`
- API source: https://python-soundfile.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
