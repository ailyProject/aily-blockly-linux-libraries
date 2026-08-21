# @aily-project/lib-python-socketio

Curated python-socketio integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import socketio as _python_lib_python_socketio`
- Install on target: `python3 -m pip install python-socketio`
- Blocks (5): `python_python_socketio_call`, `python_python_socketio_do`, `python_python_socketio_method`, `python_python_socketio_do_method`, `python_python_socketio_attribute`
- Allowlisted callables: `Client`, `AsyncClient`, `Server`, `AsyncServer`, `WSGIApp`, `ASGIApp`
- Allowlisted methods: `connect`, `disconnect`, `emit`, `send`, `call`, `on`, `event`, `start_background_task`, `sleep`, `transport`
- Allowlisted attributes: `connected`, `sid`, `namespaces`
- API source: https://python-socketio.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Async entry points use the repository-wide persistent asyncio bridge and wait synchronously for completion. Close clients and sessions explicitly.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
