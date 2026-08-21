# @aily-project/lib-aiocoap

Curated aiocoap integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import aiocoap as _python_lib_aiocoap`
- Install on target: `python3 -m pip install aiocoap`
- Blocks (5): `python_aiocoap_call`, `python_aiocoap_do`, `python_aiocoap_method`, `python_aiocoap_do_method`, `python_aiocoap_attribute`
- Allowlisted callables: `Context.create_client_context`, `Context.create_server_context`, `Message`, `resource.Site`, `resource.Resource`
- Allowlisted methods: `request`, `render_get`, `render_post`, `add_resource`, `shutdown`
- Allowlisted attributes: `code`, `payload`, `uri`, `remote`, `opt`
- API source: https://aiocoap.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Async entry points use the repository-wide persistent asyncio bridge and wait synchronously for completion. Close clients and sessions explicitly.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
