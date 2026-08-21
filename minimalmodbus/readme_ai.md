# @aily-project/lib-minimalmodbus

Curated MinimalModbus integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import minimalmodbus as _python_lib_minimalmodbus`
- Install on target: `python3 -m pip install minimalmodbus`
- Blocks (5): `python_minimalmodbus_call`, `python_minimalmodbus_do`, `python_minimalmodbus_method`, `python_minimalmodbus_do_method`, `python_minimalmodbus_attribute`
- Allowlisted callables: `Instrument`
- Allowlisted methods: `read_register`, `write_register`, `read_registers`, `write_registers`, `read_bit`, `write_bit`, `read_string`, `write_string`
- Allowlisted attributes: `address`, `mode`, `serial`, `clear_buffers_before_each_transaction`
- API source: https://minimalmodbus.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
