# @aily-project/lib-hailo-platform

Curated HailoRT Python integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import hailo_platform as _python_lib_hailo_platform`
- Install on target: `sudo apt install hailo-all`
- Blocks (4): `python_hailo_platform_call`, `python_hailo_platform_do`, `python_hailo_platform_method`, `python_hailo_platform_do_method`
- Allowlisted callables: `HEF`, `VDevice`, `Device`, `ConfigureParams`, `InferVStreams`, `InputVStreamParams`, `OutputVStreamParams`
- Allowlisted methods: `configure`, `create_infer_model`, `activate`, `wait_for_async_ready`, `run_async`, `infer`, `get_input_vstream_infos`, `get_output_vstream_infos`
- Allowlisted attributes: none
- API source: https://www.raspberrypi.com/documentation/computers/ai.html

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

Compatibility note: Use hailo-all for AI HAT+/AI Kit or hailo-h10-all for AI HAT+ 2; those stacks cannot coexist.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
