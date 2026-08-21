# @aily-project/lib-uvicorn

Curated Uvicorn integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import uvicorn as _python_lib_uvicorn`
- Install on target: `python3 -m pip install uvicorn`
- Blocks (5): `python_uvicorn_call`, `python_uvicorn_do`, `python_uvicorn_method`, `python_uvicorn_do_method`, `python_uvicorn_attribute`
- Allowlisted callables: `run`, `Config`, `Server`
- Allowlisted methods: `run`
- Allowlisted attributes: `started`, `should_exit`, `force_exit`, `config`
- API source: https://www.uvicorn.org/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Uvicorn `run` entry points execute directly in the current thread without the asyncio bridge, avoiding nested server event loops.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
