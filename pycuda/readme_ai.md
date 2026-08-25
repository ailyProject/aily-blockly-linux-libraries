# @aily-project/lib-pycuda

Curated PyCUDA integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pycuda.driver as _python_lib_pycuda`
- Install on target: `sudo apt install python3-pycuda`
- Blocks (5): `pycuda_call`, `pycuda_do`, `pycuda_method`, `pycuda_do_method`, `pycuda_attribute`
- Allowlisted callables: `init`, `Device`, `Device.count`, `mem_alloc`, `memcpy_htod`, `memcpy_dtoh`, `memcpy_dtod`, `Stream`, `Event`, `module_from_file`, `get_version`, `get_driver_version`
- Allowlisted methods: `name`, `compute_capability`, `total_memory`, `make_context`, `pop`, `detach`, `synchronize`, `record`, `time_till`, `time_since`, `free`
- Allowlisted attributes: `handle`, `device`, `context`
- API source: https://documen.tician.de/pycuda/

Manage CUDA devices, contexts, memory, streams, events, and compiled modules from Python.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
