# @aily-project/lib-w1thermsensor

Curated W1ThermSensor integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import w1thermsensor as _python_lib_w1thermsensor`
- Install on target: `python3 -m pip install w1thermsensor`
- Blocks (5): `python_w1thermsensor_call`, `python_w1thermsensor_do`, `python_w1thermsensor_method`, `python_w1thermsensor_do_method`, `python_w1thermsensor_attribute`
- Allowlisted callables: `W1ThermSensor`, `Unit`
- Allowlisted methods: `get_temperature`, `get_temperatures`, `get_sensor`, `get_available_sensors`
- Allowlisted attributes: `id`, `type`, `slave_file`
- API source: https://github.com/timofurrer/w1thermsensor

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
