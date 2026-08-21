# @aily-project/lib-pyttsx3

Curated pyttsx3 integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pyttsx3 as _python_lib_pyttsx3`
- Install on target: `python3 -m pip install pyttsx3`
- Blocks (4): `python_pyttsx3_call`, `python_pyttsx3_do`, `python_pyttsx3_method`, `python_pyttsx3_do_method`
- Allowlisted callables: `init`
- Allowlisted methods: `say`, `runAndWait`, `stop`, `getProperty`, `setProperty`, `save_to_file`, `connect`, `disconnect`
- Allowlisted attributes: none
- API source: https://pyttsx3.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
