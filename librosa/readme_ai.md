# @aily-project/lib-librosa

Curated librosa integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import librosa as _python_lib_librosa`
- Install on target: `python3 -m pip install librosa`
- Blocks (2): `python_librosa_call`, `python_librosa_do`
- Allowlisted callables: `load`, `stream`, `get_duration`, `resample`, `stft`, `istft`, `amplitude_to_db`, `db_to_amplitude`, `beat.beat_track`, `feature.melspectrogram`, `feature.mfcc`
- Allowlisted methods: none
- Allowlisted attributes: none
- API source: https://librosa.org/doc/latest/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
