# @aily-project/lib-jetson-utils

Curated jetson-utils integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import jetson_utils as _python_lib_jetson_utils`
- Install on target: `python3 -m pip install git+https://github.com/dusty-nv/jetson-utils`
- Blocks (5): `jetson_utils_call`, `jetson_utils_do`, `jetson_utils_method`, `jetson_utils_do_method`, `jetson_utils_attribute`
- Allowlisted callables: `videoSource`, `videoOutput`, `cudaAllocMapped`, `cudaFromNumpy`, `cudaToNumpy`, `cudaConvertColor`, `cudaResize`, `cudaCrop`, `cudaOverlay`, `loadImage`, `saveImage`
- Allowlisted methods: `Capture`, `Render`, `IsStreaming`, `Close`, `SetStatus`, `GetWidth`, `GetHeight`, `GetFrameRate`, `GetFrameCount`, `GetLastTimestamp`
- Allowlisted attributes: `width`, `height`, `channels`, `format`, `mapped`, `ptr`, `shape`
- API source: https://github.com/dusty-nv/jetson-utils

Jetson camera/video streaming, CUDA image buffers, image conversion, and display utilities.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
