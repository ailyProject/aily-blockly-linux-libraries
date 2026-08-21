# @aily-project/lib-numpy

Curated NumPy integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import numpy as _python_lib_numpy`
- Install on target: `sudo apt install python3-numpy`
- Blocks (5): `python_numpy_call`, `python_numpy_do`, `python_numpy_method`, `python_numpy_do_method`, `python_numpy_attribute`
- Allowlisted callables: `array`, `asarray`, `zeros`, `ones`, `arange`, `linspace`, `mean`, `std`, `min`, `max`, `concatenate`, `stack`, `reshape`, `load`, `save`
- Allowlisted methods: `reshape`, `astype`, `tolist`, `flatten`, `transpose`, `mean`, `sum`, `min`, `max`
- Allowlisted attributes: `shape`, `dtype`, `ndim`, `size`, `T`
- API source: https://numpy.org/doc/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
