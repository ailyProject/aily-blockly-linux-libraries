# @aily-project/lib-dbus-next

Curated dbus-next integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import dbus_next.aio as _python_lib_dbus_next`
- Install on target: `python3 -m pip install dbus-next`
- Blocks (5): `python_dbus_next_call`, `python_dbus_next_do`, `python_dbus_next_method`, `python_dbus_next_do_method`, `python_dbus_next_attribute`
- Allowlisted callables: `MessageBus`
- Allowlisted methods: `connect`, `disconnect`, `introspect`, `get_proxy_object`, `call`, `export`, `unexport`, `request_name`
- Allowlisted attributes: `unique_name`
- API source: https://python-dbus-next.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Async entry points use the repository-wide persistent asyncio bridge and wait synchronously for completion. Close clients and sessions explicitly.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
