# @aily-project/lib-gpiod

Curated libgpiod v2 integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import gpiod as _python_lib_gpiod`
- Install on target: `sudo apt install python3-libgpiod`
- Blocks (5): `linux_gpiod_call`, `linux_gpiod_do`, `linux_gpiod_method`, `linux_gpiod_do_method`, `linux_gpiod_attribute`
- Allowlisted callables: `request_lines`, `LineSettings`
- Allowlisted methods: `get_value`, `get_values`, `set_value`, `set_values`, `wait_edge_events`, `read_edge_events`, `reconfigure_lines`, `release`
- Allowlisted attributes: `line.Direction.INPUT`, `line.Direction.OUTPUT`, `line.Value.ACTIVE`, `line.Value.INACTIVE`, `line.Edge.RISING`, `line.Edge.FALLING`, `line.Edge.BOTH`
- API source: https://libgpiod.readthedocs.io/en/stable/python_api.html

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

Compatibility note: Targets the libgpiod v2 request_lines API, not the removed v1 Chip.get_line API.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
