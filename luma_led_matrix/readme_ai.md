# @aily-project/lib-luma-led-matrix

Curated luma.led_matrix integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import luma.led_matrix.device as _python_lib_luma_led_matrix`
- Install on target: `python3 -m pip install luma.led_matrix`
- Blocks (5): `python_luma_led_matrix_call`, `python_luma_led_matrix_do`, `python_luma_led_matrix_method`, `python_luma_led_matrix_do_method`, `python_luma_led_matrix_attribute`
- Allowlisted callables: `max7219`, `ws2812`
- Allowlisted methods: `display`, `clear`, `show`, `hide`, `contrast`, `cleanup`
- Allowlisted attributes: `width`, `height`, `size`, `mode`, `bounding_box`
- API source: https://luma-led-matrix.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
