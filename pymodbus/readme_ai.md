# @aily-project/lib-pymodbus

Curated PyModbus integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pymodbus.client as _python_lib_pymodbus`
- Install on target: `python3 -m pip install pymodbus`
- Blocks (5): `python_pymodbus_call`, `python_pymodbus_do`, `python_pymodbus_method`, `python_pymodbus_do_method`, `python_pymodbus_attribute`
- Allowlisted callables: `ModbusTcpClient`, `ModbusSerialClient`, `ModbusUdpClient`, `AsyncModbusTcpClient`, `AsyncModbusSerialClient`
- Allowlisted methods: `connect`, `close`, `read_coils`, `read_discrete_inputs`, `read_holding_registers`, `read_input_registers`, `write_coil`, `write_register`, `write_registers`
- Allowlisted attributes: `connected`
- API source: https://www.pymodbus.org/docs

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Async entry points use the repository-wide persistent asyncio bridge and wait synchronously for completion. Close clients and sessions explicitly.

Compatibility note: PyModbus has frequent major API changes; the dropdown surface follows the modern client API.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
