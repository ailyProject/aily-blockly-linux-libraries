# @aily-project/lib-pymavlink

Curated pymavlink integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pymavlink.mavutil as _python_lib_pymavlink`
- Install on target: `python3 -m pip install pymavlink`
- Blocks (5): `python_pymavlink_call`, `python_pymavlink_do`, `python_pymavlink_method`, `python_pymavlink_do_method`, `python_pymavlink_attribute`
- Allowlisted callables: `mavlink_connection`, `mode_string_v10`, `all_printable`, `periodic_event`
- Allowlisted methods: `wait_heartbeat`, `recv_match`, `mode_mapping`, `set_mode`, `close`, `write`, `param_fetch_all`
- Allowlisted attributes: `target_system`, `target_component`, `mav`, `flightmode`, `messages`
- API source: https://mavlink.io/en/mavgen_python/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
