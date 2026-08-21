# @aily-project/lib-luma-lcd

Curated luma.lcd integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import luma.lcd.device as _python_lib_luma_lcd`
- Install on target: `python3 -m pip install luma.lcd`
- Blocks (5): `python_luma_lcd_call`, `python_luma_lcd_do`, `python_luma_lcd_method`, `python_luma_lcd_do_method`, `python_luma_lcd_attribute`
- Allowlisted callables: `st7735`, `st7789`, `ili9341`, `pcd8544`
- Allowlisted methods: `display`, `clear`, `show`, `hide`, `contrast`, `cleanup`
- Allowlisted attributes: `width`, `height`, `size`, `mode`, `bounding_box`
- API source: https://luma-lcd.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
