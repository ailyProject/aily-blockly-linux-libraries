# @aily-project/lib-onnxruntime

Curated ONNX Runtime integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import onnxruntime as _python_lib_onnxruntime`
- Install on target: `python3 -m pip install onnxruntime`
- Blocks (4): `python_onnxruntime_call`, `python_onnxruntime_do`, `python_onnxruntime_method`, `python_onnxruntime_do_method`
- Allowlisted callables: `InferenceSession`, `SessionOptions`, `get_available_providers`, `get_device`, `set_default_logger_severity`
- Allowlisted methods: `run`, `run_with_iobinding`, `get_inputs`, `get_outputs`, `get_providers`, `set_providers`, `end_profiling`
- Allowlisted attributes: none
- API source: https://onnxruntime.ai/docs/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
