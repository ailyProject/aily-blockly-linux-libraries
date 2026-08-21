# @aily-project/lib-fastapi

Curated FastAPI integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import fastapi as _python_lib_fastapi`
- Install on target: `python3 -m pip install fastapi`
- Blocks (5): `python_fastapi_call`, `python_fastapi_do`, `python_fastapi_method`, `python_fastapi_do_method`, `python_fastapi_attribute`
- Allowlisted callables: `FastAPI`, `APIRouter`, `Depends`, `HTTPException`, `WebSocket`, `BackgroundTasks`
- Allowlisted methods: `get`, `post`, `put`, `delete`, `patch`, `websocket`, `include_router`, `add_middleware`
- Allowlisted attributes: `routes`, `openapi_url`, `docs_url`, `title`, `version`, `state`
- API source: https://fastapi.tiangolo.com/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
