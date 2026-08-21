# @aily-project/lib-websockets

Curated websockets integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import websockets as _python_lib_websockets`
- Install on target: `python3 -m pip install websockets`
- Blocks (5): `python_websockets_call`, `python_websockets_do`, `python_websockets_method`, `python_websockets_do_method`, `python_websockets_attribute`
- Allowlisted callables: `connect`, `serve`, `broadcast`
- Allowlisted methods: `send`, `recv`, `close`, `ping`, `pong`, `wait_closed`
- Allowlisted attributes: `remote_address`, `local_address`, `state`, `close_code`, `close_reason`, `subprotocol`, `latency`, `request`, `response`
- API version note: targets the new `Connection` returned by the top-level asyncio `connect` API in websockets 17; it exposes `state` rather than the legacy `closed` attribute.
- API source: https://websockets.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Async entry points use the repository-wide persistent asyncio bridge and wait synchronously for completion. Close clients and sessions explicitly.

Compatibility note: The package has major-version API differences; test against the installed version.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
