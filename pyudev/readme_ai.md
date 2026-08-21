# @aily-project/lib-pyudev

Curated pyudev integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pyudev as _python_lib_pyudev`
- Install on target: `python3 -m pip install pyudev`
- Blocks (5): `linux_pyudev_call`, `linux_pyudev_do`, `linux_pyudev_method`, `linux_pyudev_do_method`, `linux_pyudev_attribute`
- Allowlisted callables: `Context`, `Monitor`, `MonitorObserver`, `Devices.from_path`, `Devices.from_device_file`, `Devices.from_device_number`
- Allowlisted methods: `list_devices`, `filter_by`, `enable_receiving`, `start`, `stop`, `poll`
- Allowlisted attributes: `device_path`, `device_node`, `subsystem`, `sys_name`, `properties`, `parent`
- API source: https://pyudev.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
