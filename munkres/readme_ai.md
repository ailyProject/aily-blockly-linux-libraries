# @aily-project/lib-munkres

Curated Munkres integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import munkres as _python_lib_munkres`
- Install on target: `python3 -m pip install munkres`
- Blocks (5): `python_munkres_call`, `python_munkres_do`, `python_munkres_method`, `python_munkres_do_method`, `python_munkres_attribute`
- Allowlisted callables: `Munkres`, `make_cost_matrix`, `print_matrix`
- Allowlisted methods: `compute`
- Allowlisted attributes: `DISALLOWED`
- API source: https://github.com/bmc/munkres

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
