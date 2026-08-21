# @aily-project/lib-pillow

Curated Pillow Image integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import PIL.Image as _python_lib_pillow`
- Install on target: `python3 -m pip install Pillow`
- Blocks (5): `python_pillow_call`, `python_pillow_do`, `python_pillow_method`, `python_pillow_do_method`, `python_pillow_attribute`
- Allowlisted callables: `open`, `new`, `fromarray`, `merge`
- Allowlisted methods: `save`, `resize`, `crop`, `rotate`, `transpose`, `convert`, `filter`, `show`
- Allowlisted attributes: `size`, `mode`, `width`, `height`, `format`
- API source: https://pillow.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
