# @aily-project/lib-aiohttp

Curated aiohttp integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import aiohttp as _python_lib_aiohttp`
- Install on target: `python3 -m pip install aiohttp`
- Blocks (5): `python_aiohttp_call`, `python_aiohttp_do`, `python_aiohttp_method`, `python_aiohttp_do_method`, `python_aiohttp_attribute`
- Allowlisted callables: `ClientSession`, `ClientTimeout`, `TCPConnector`, `web.Application`
- Allowlisted methods: `get`, `post`, `put`, `delete`, `request`, `close`, `json`, `text`, `read`, `add_routes`
- Allowlisted attributes: `status`, `headers`, `cookies`, `url`, `content_type`
- API source: https://docs.aiohttp.org/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Async entry points use the repository-wide persistent asyncio bridge and wait synchronously for completion. Close clients and sessions explicitly.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
