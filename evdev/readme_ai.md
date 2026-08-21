# @aily-project/lib-evdev

Curated python-evdev integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import evdev as _python_lib_evdev`
- Install on target: `sudo apt install python3-evdev`
- Blocks (5): `linux_evdev_call`, `linux_evdev_do`, `linux_evdev_method`, `linux_evdev_do_method`, `linux_evdev_attribute`
- Allowlisted callables: `InputDevice`, `UInput`, `list_devices`, `categorize`
- Allowlisted methods: `read`, `read_loop`, `async_read_loop`, `grab`, `ungrab`, `close`, `write`
- Allowlisted attributes: `path`, `name`, `phys`, `uniq`, `fd`
- API source: https://python-evdev.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
