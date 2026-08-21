# @aily-project/lib-qrcode

Curated qrcode integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import qrcode as _python_lib_qrcode`
- Install on target: `python3 -m pip install qrcode`
- Blocks (5): `python_qrcode_call`, `python_qrcode_do`, `python_qrcode_method`, `python_qrcode_do_method`, `python_qrcode_attribute`
- Allowlisted callables: `make`, `QRCode`
- Allowlisted methods: `add_data`, `make`, `make_image`, `clear`
- Allowlisted attributes: `version`, `error_correction`, `box_size`, `border`
- API source: https://github.com/lincolnloop/python-qrcode

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
