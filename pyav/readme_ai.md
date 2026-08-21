# @aily-project/lib-pyav

Curated PyAV integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import av as _python_lib_pyav`
- Install on target: `sudo apt install python3-av`
- Blocks (5): `python_pyav_call`, `python_pyav_do`, `python_pyav_method`, `python_pyav_do_method`, `python_pyav_attribute`
- Allowlisted callables: `open`, `AudioFrame`, `VideoFrame`, `Packet`
- Allowlisted methods: `demux`, `decode`, `encode`, `mux`, `close`, `add_stream`, `to_ndarray`, `reformat`
- Allowlisted attributes: `streams`, `duration`, `format`, `metadata`, `time_base`, `pts`, `width`, `height`
- API source: https://pyav.org/docs/stable/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
