# @aily-project/lib-pyusb

Curated PyUSB integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import usb.core as _python_lib_pyusb`
- Install on target: `python3 -m pip install pyusb`
- Blocks (5): `linux_pyusb_call`, `linux_pyusb_do`, `linux_pyusb_method`, `linux_pyusb_do_method`, `linux_pyusb_attribute`
- Allowlisted callables: `find`, `show_devices`
- Allowlisted methods: `set_configuration`, `write`, `read`, `ctrl_transfer`, `reset`, `is_kernel_driver_active`, `detach_kernel_driver`
- Allowlisted attributes: `idVendor`, `idProduct`, `bus`, `address`, `manufacturer`, `product`, `serial_number`
- API source: https://pyusb.github.io/pyusb/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
