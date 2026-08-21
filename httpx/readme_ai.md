# @aily-project/lib-httpx

Curated HTTPX integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import httpx as _python_lib_httpx`
- Install on target: `python3 -m pip install httpx`
- Blocks (5): `python_httpx_call`, `python_httpx_do`, `python_httpx_method`, `python_httpx_do_method`, `python_httpx_attribute`
- Allowlisted callables: `Client`, `AsyncClient`, `get`, `post`, `put`, `delete`, `request`, `Timeout`, `Limits`
- Allowlisted methods: `get`, `post`, `put`, `delete`, `request`, `close`, `aclose`, `json`, `raise_for_status`, `iter_bytes`, `aiter_bytes`
- Allowlisted attributes: `status_code`, `text`, `content`, `headers`, `cookies`, `url`, `is_success`
- API source: https://www.python-httpx.org/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Async entry points use the repository-wide persistent asyncio bridge and wait synchronously for completion. Close clients and sessions explicitly.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
