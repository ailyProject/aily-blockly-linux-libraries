# @aily-project/lib-zeroconf

Curated python-zeroconf integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import zeroconf as _python_lib_zeroconf`
- Install on target: `python3 -m pip install zeroconf`
- Blocks (5): `python_zeroconf_call`, `python_zeroconf_do`, `python_zeroconf_method`, `python_zeroconf_do_method`, `python_zeroconf_attribute`
- Allowlisted callables: `Zeroconf`, `ServiceInfo`, `ServiceBrowser`, `ServiceStateChange`
- Allowlisted methods: `register_service`, `update_service`, `unregister_service`, `unregister_all_services`, `close`, `get_service_info`, `add_service_listener`
- Allowlisted attributes: `name`, `type`, `addresses`, `port`, `properties`, `server`
- API source: https://python-zeroconf.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
