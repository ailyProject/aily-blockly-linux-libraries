# @aily-project/lib-matplotlib

Curated Matplotlib pyplot integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import matplotlib.pyplot as _python_lib_matplotlib`
- Install on target: `sudo apt install python3-matplotlib`
- Blocks (5): `python_matplotlib_call`, `python_matplotlib_do`, `python_matplotlib_method`, `python_matplotlib_do_method`, `python_matplotlib_attribute`
- Allowlisted callables: `figure`, `subplots`, `plot`, `scatter`, `bar`, `imshow`, `hist`, `title`, `xlabel`, `ylabel`, `legend`, `savefig`, `show`, `close`
- Allowlisted methods: `plot`, `scatter`, `bar`, `imshow`, `set_title`, `set_xlabel`, `set_ylabel`, `legend`, `grid`
- Allowlisted attributes: `figure`, `axes`, `lines`, `images`
- API source: https://matplotlib.org/stable/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
