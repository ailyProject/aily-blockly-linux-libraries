# @aily-project/lib-tensorrt

Curated NVIDIA TensorRT integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import tensorrt as _python_lib_tensorrt`
- Install on target: `install the TensorRT Python bindings supplied with NVIDIA JetPack`
- Blocks (5): `nvidia_tensorrt_call`, `nvidia_tensorrt_do`, `nvidia_tensorrt_method`, `nvidia_tensorrt_do_method`, `nvidia_tensorrt_attribute`
- Allowlisted callables: `Logger`, `Runtime`, `Builder`, `OnnxParser`, `Refitter`, `volume`, `nptype`, `init_libnvinfer_plugins`, `get_plugin_registry`
- Allowlisted methods: `deserialize_cuda_engine`, `create_execution_context`, `create_network`, `create_builder_config`, `build_serialized_network`, `parse`, `parse_from_file`, `set_input_shape`, `set_tensor_address`, `execute_async_v3`, `get_tensor_shape`, `get_tensor_name`, `get_tensor_mode`
- Allowlisted attributes: `__version__`, `Logger.WARNING`, `Logger.ERROR`, `Logger.INFO`, `NetworkDefinitionCreationFlag.EXPLICIT_BATCH`, `TensorIOMode.INPUT`, `TensorIOMode.OUTPUT`, `float32`, `float16`, `int8`, `int32`, `bool`, `bfloat16`
- API source: https://docs.nvidia.com/deeplearning/tensorrt/latest/api/python-api.html

Build, load, and execute TensorRT inference engines on Jetson.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
