# @aily-project/lib-depthai

Curated DepthAI v3 integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import depthai as _python_lib_depthai`
- Install on target: `python3 -m pip install depthai`
- Blocks (5): `python_depthai_call`, `python_depthai_do`, `python_depthai_method`, `python_depthai_do_method`, `python_depthai_attribute`
- Allowlisted callables: `Pipeline`, `Device`
- Allowlisted methods: `create`, `build`, `start`, `stop`, `run`, `wait`, `requestOutput`, `createOutputQueue`, `get`, `tryGet`, `send`, `close`, `isRunning`
- Allowlisted attributes: `node.Camera`, `node.ColorCamera`, `node.MonoCamera`, `node.ImageManip`, `node.NeuralNetwork`, `node.StereoDepth`
- API source: https://docs.luxonis.com/software-v3/depthai/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

Compatibility note: Targets the DepthAI v3 family; v2 ColorCamera/XLinkOut graphs are not serialization-compatible.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
