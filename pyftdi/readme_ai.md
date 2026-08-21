# @aily-project/lib-pyftdi

Curated PyFtdi GPIO integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pyftdi.gpio as _python_lib_pyftdi`
- Install on target: `python3 -m pip install pyftdi`
- Blocks (5): `linux_pyftdi_call`, `linux_pyftdi_do`, `linux_pyftdi_method`, `linux_pyftdi_do_method`, `linux_pyftdi_attribute`
- Allowlisted callables: `GpioController`, `GpioAsyncController`
- Allowlisted methods: `configure`, `set_direction`, `write`, `read`, `exchange`, `close`
- Allowlisted attributes: `frequency`, `direction`, `pins`
- API source: https://eblot.github.io/pyftdi/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
