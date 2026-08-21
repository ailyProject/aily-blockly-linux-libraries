# @aily-project/lib-gpsd-py3

Curated gpsd-py3 integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import gpsd as _python_lib_gpsd_py3`
- Install on target: `python3 -m pip install gpsd-py3`
- Blocks (5): `linux_gpsd_call`, `linux_gpsd_do`, `linux_gpsd_method`, `linux_gpsd_do_method`, `linux_gpsd_attribute`
- Allowlisted callables: `connect`, `get_current`, `get_packets`
- Allowlisted methods: `position`, `altitude`, `movement`, `speed`, `climb`
- Allowlisted attributes: `mode`, `sats`, `lat`, `lon`, `hspeed`, `track`, `time`
- API source: https://pypi.org/project/gpsd-py3/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
