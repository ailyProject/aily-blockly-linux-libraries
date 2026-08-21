# @aily-project/lib-hidapi

Curated hidapi integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import hid as _python_lib_hidapi`
- Install on target: `python3 -m pip install hidapi`
- Blocks (4): `linux_hidapi_call`, `linux_hidapi_do`, `linux_hidapi_method`, `linux_hidapi_do_method`
- Allowlisted callables: `device`, `enumerate`
- Allowlisted methods: `open`, `open_path`, `write`, `read`, `send_feature_report`, `get_feature_report`, `get_manufacturer_string`, `get_product_string`, `get_serial_number_string`, `close`, `set_nonblocking`
- Allowlisted attributes: none
- API source: https://github.com/trezor/cython-hidapi

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
