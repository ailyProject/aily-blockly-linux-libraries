# @aily-project/lib-cuda-python

Curated NVIDIA CUDA Python integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import cuda.bindings.runtime as _python_lib_cuda_python`
- Install on target: `python3 -m pip install cuda-python`
- Blocks (3): `cuda_python_call`, `cuda_python_do`, `cuda_python_attribute`
- Allowlisted callables: `cudaGetDeviceCount`, `cudaGetDevice`, `cudaSetDevice`, `cudaGetDeviceProperties`, `cudaDeviceGetAttribute`, `cudaMalloc`, `cudaFree`, `cudaMemcpy`, `cudaMemcpyAsync`, `cudaMemset`, `cudaStreamCreate`, `cudaStreamDestroy`, `cudaStreamSynchronize`, `cudaDeviceSynchronize`, `cudaGetErrorName`, `cudaGetErrorString`
- Allowlisted methods: none
- Allowlisted attributes: `cudaError_t.cudaSuccess`, `cudaMemcpyKind.cudaMemcpyHostToDevice`, `cudaMemcpyKind.cudaMemcpyDeviceToHost`, `cudaMemcpyKind.cudaMemcpyDeviceToDevice`
- API source: https://nvidia.github.io/cuda-python/cuda-bindings/latest/index.html

Official low-level CUDA Runtime Python bindings for devices, memory, streams, and synchronization.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
