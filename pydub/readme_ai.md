# @aily-project/lib-pydub

Curated pydub integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pydub as _python_lib_pydub`
- Install on target: `python3 -m pip install pydub`
- Blocks (5): `python_pydub_call`, `python_pydub_do`, `python_pydub_method`, `python_pydub_do_method`, `python_pydub_attribute`
- Allowlisted callables: `AudioSegment.silent`, `AudioSegment.from_file`, `AudioSegment.from_wav`
- Allowlisted methods: `export`, `overlay`, `append`, `fade_in`, `fade_out`, `set_frame_rate`, `set_channels`
- Allowlisted attributes: `duration_seconds`, `frame_rate`, `channels`, `sample_width`, `raw_data`
- API source: https://github.com/jiaaro/pydub

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

Compatibility note: Most compressed formats also require FFmpeg.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
