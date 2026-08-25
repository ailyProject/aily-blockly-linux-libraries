# @aily-project/lib-pytorch

Curated PyTorch integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import torch as _python_lib_pytorch`
- Install on target: `python3 -m pip install --no-cache-dir "$TORCH_INSTALL"`
- Blocks (5): `pytorch_call`, `pytorch_do`, `pytorch_method`, `pytorch_do_method`, `pytorch_attribute`
- Allowlisted callables: `tensor`, `as_tensor`, `from_numpy`, `zeros`, `ones`, `empty`, `arange`, `linspace`, `stack`, `cat`, `matmul`, `no_grad`, `inference_mode`, `load`, `save`, `device`, `cuda.is_available`, `cuda.device_count`, `cuda.get_device_name`
- Allowlisted methods: `to`, `cpu`, `cuda`, `numpy`, `detach`, `clone`, `reshape`, `permute`, `unsqueeze`, `squeeze`, `eval`, `train`, `forward`
- Allowlisted attributes: `__version__`, `float32`, `float16`, `bfloat16`, `int8`, `int32`, `int64`, `bool`
- API source: https://docs.nvidia.com/deeplearning/frameworks/install-pytorch-jetson-platform/

Build tensors and run GPU inference with NVIDIA PyTorch builds for JetPack.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
