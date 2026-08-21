# @aily-project/lib-rplcd

Curated RPLCD integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import RPLCD.i2c as _python_lib_rplcd`
- Install on target: `python3 -m pip install RPLCD`
- Blocks (5): `python_rplcd_call`, `python_rplcd_do`, `python_rplcd_method`, `python_rplcd_do_method`, `python_rplcd_attribute`
- Allowlisted callables: `CharLCD`
- Allowlisted methods: `write_string`, `clear`, `create_char`, `home`, `close`
- Allowlisted attributes: `cursor_pos`, `backlight_enabled`, `cursor_mode`, `display_enabled`
- API source: https://rplcd.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
