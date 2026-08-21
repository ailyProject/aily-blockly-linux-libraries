# @aily-project/lib-adafruit-io

Curated Adafruit IO integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import Adafruit_IO as _python_lib_adafruit_io`
- Install on target: `python3 -m pip install adafruit-io`
- Blocks (5): `python_adafruit_io_call`, `python_adafruit_io_do`, `python_adafruit_io_method`, `python_adafruit_io_do_method`, `python_adafruit_io_attribute`
- Allowlisted callables: `Client`, `MQTTClient`, `Feed`, `Data`
- Allowlisted methods: `feeds`, `create_feed`, `send`, `receive`, `data`, `delete`, `connect`, `disconnect`, `loop_background`, `subscribe`, `publish`
- Allowlisted attributes: `key`, `name`, `id`, `value`, `created_at`
- API source: https://adafruit-io-python-client.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
