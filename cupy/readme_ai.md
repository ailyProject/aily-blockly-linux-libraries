# @aily-project/lib-cupy

Curated CuPy integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import cupy as _python_lib_cupy`
- Install on target: `python3 -m pip install cupy-cuda12x`
- Blocks (5): `cupy_call`, `cupy_do`, `cupy_method`, `cupy_do_method`, `cupy_attribute`
- Allowlisted callables: `array`, `asarray`, `asnumpy`, `zeros`, `ones`, `empty`, `arange`, `linspace`, `concatenate`, `stack`, `matmul`, `dot`, `mean`, `sum`, `max`, `min`, `argmax`, `get_array_module`, `cuda.Device`, `cuda.Stream`, `cuda.Event`
- Allowlisted methods: `get`, `set`, `astype`, `reshape`, `transpose`, `copy`, `fill`, `sum`, `mean`
- Allowlisted attributes: `ndarray`, `float32`, `float16`, `int8`, `int32`, `int64`, `bool_`
- API source: https://docs.cupy.dev/en/stable/

NumPy-style arrays, linear algebra, and streams on Jetson CUDA GPUs.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
