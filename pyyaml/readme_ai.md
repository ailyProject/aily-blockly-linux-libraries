# @aily-project/lib-pyyaml

Curated PyYAML integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import yaml as _python_lib_pyyaml`
- Install on target: `python3 -m pip install PyYAML`
- Blocks (3): `python_pyyaml_call`, `python_pyyaml_do`, `python_pyyaml_attribute`
- Allowlisted callables: `safe_load`, `safe_load_all`, `safe_dump`, `safe_dump_all`
- Allowlisted methods: none
- Allowlisted attributes: `SafeLoader`, `CSafeLoader`, `SafeDumper`, `CSafeDumper`
- API source: https://pyyaml.org/wiki/PyYAMLDocumentation

Security: this package exposes only safe loading entry points. It intentionally does not expose `yaml.load`, `yaml.unsafe_load`, or other unsafe deserialization entry points that may construct arbitrary Python objects.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
