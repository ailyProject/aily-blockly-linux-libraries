# @aily-project/lib-python-can

Curated python-can integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import can as _python_lib_python_can`
- Install on target: `python3 -m pip install python-can`
- Blocks (5): `python_python_can_call`, `python_python_can_do`, `python_python_can_method`, `python_python_can_do_method`, `python_python_can_attribute`
- Allowlisted callables: `Bus`, `Message`, `Notifier`, `Listener`, `BufferedReader`
- Allowlisted methods: `send`, `recv`, `shutdown`, `send_periodic`, `stop_all_periodic_tasks`, `get_message`
- Allowlisted attributes: `arbitration_id`, `data`, `is_extended_id`, `is_remote_frame`, `timestamp`, `channel`
- API source: https://python-can.readthedocs.io/en/stable/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
