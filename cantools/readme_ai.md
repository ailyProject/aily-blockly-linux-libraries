# @aily-project/lib-cantools

Curated cantools integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import cantools as _python_lib_cantools`
- Install on target: `python3 -m pip install cantools`
- Blocks (5): `python_cantools_call`, `python_cantools_do`, `python_cantools_method`, `python_cantools_do_method`, `python_cantools_attribute`
- Allowlisted callables: `database.load_file`, `database.load_string`, `database.load`
- Allowlisted methods: `encode_message`, `decode_message`, `get_message_by_name`, `refresh`, `as_dbc_string`
- Allowlisted attributes: `messages`, `nodes`, `buses`, `name`, `frame_id`, `signals`
- API source: https://cantools.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
