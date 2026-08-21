# @aily-project/lib-luma-oled

Curated luma.oled integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import luma.oled.device as _python_lib_luma_oled`
- Install on target: `python3 -m pip install luma.oled`
- Blocks (5): `python_luma_oled_call`, `python_luma_oled_do`, `python_luma_oled_method`, `python_luma_oled_do_method`, `python_luma_oled_attribute`
- Allowlisted callables: `ssd1306`, `ssd1325`, `ssd1331`, `sh1106`
- Allowlisted methods: `display`, `clear`, `show`, `hide`, `contrast`, `cleanup`
- Allowlisted attributes: `width`, `height`, `size`, `mode`, `bounding_box`
- API source: https://luma-oled.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
