# @aily-project/lib-ultralytics

Curated Ultralytics integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import ultralytics as _python_lib_ultralytics`
- Install on target: `python3 -m pip install ultralytics`
- Blocks (5): `python_ultralytics_call`, `python_ultralytics_do`, `python_ultralytics_method`, `python_ultralytics_do_method`, `python_ultralytics_attribute`
- Allowlisted callables: `YOLO`, `RTDETR`, `SAM`, `FastSAM`, `NAS`
- Allowlisted methods: `train`, `val`, `predict`, `export`, `track`, `benchmark`
- Allowlisted attributes: `names`, `model`, `overrides`, `callbacks`
- API source: https://docs.ultralytics.com/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
