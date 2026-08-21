# @aily-project/lib-tflite-runtime

Curated LiteRT / TFLite Runtime integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import tflite_runtime.interpreter as _python_lib_tflite_runtime`
- Install on target: `python3 -m pip install tflite-runtime`
- Blocks (4): `python_tflite_runtime_call`, `python_tflite_runtime_do`, `python_tflite_runtime_method`, `python_tflite_runtime_do_method`
- Allowlisted callables: `Interpreter`, `load_delegate`
- Allowlisted methods: `allocate_tensors`, `get_input_details`, `get_output_details`, `set_tensor`, `get_tensor`, `invoke`, `resize_tensor_input`, `get_signature_runner`
- Allowlisted attributes: none
- API source: https://ai.google.dev/edge/litert

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

Compatibility note: Install the current wheel in a virtual environment; the old Debian python3-tflite-runtime package is not the recommended current path.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
