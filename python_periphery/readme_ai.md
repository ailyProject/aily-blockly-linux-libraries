# @aily-project/lib-python-periphery

Curated python-periphery integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import periphery as _python_lib_python_periphery`
- Install on target: `python3 -m pip install python-periphery`
- Blocks (5): `linux_periphery_call`, `linux_periphery_do`, `linux_periphery_method`, `linux_periphery_do_method`, `linux_periphery_attribute`
- Allowlisted callables: `GPIO`, `LED`, `PWM`, `SPI`, `I2C`, `Serial`, `MMIO`
- Allowlisted methods: `open`, `read`, `write`, `poll`, `transfer`, `read_event`, `close`
- Allowlisted attributes: `direction`, `edge`, `bias`, `frequency`, `duty_cycle`, `period`, `fd`
- API source: https://python-periphery.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
