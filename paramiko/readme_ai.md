# @aily-project/lib-paramiko

Curated Paramiko integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import paramiko as _python_lib_paramiko`
- Install on target: `python3 -m pip install paramiko`
- Blocks (4): `python_paramiko_call`, `python_paramiko_do`, `python_paramiko_method`, `python_paramiko_do_method`
- Allowlisted callables: `SSHClient`, `Transport`, `SFTPClient`, `AutoAddPolicy`, `RSAKey`, `Ed25519Key`
- Allowlisted methods: `connect`, `exec_command`, `open_sftp`, `close`, `set_missing_host_key_policy`, `load_system_host_keys`, `load_host_keys`, `get_host_keys`, `get_transport`, `is_active`, `is_authenticated`, `put`, `get`, `listdir`, `open`
- Allowlisted attributes: none
- API source: https://www.paramiko.org/

Security: prefer `load_system_host_keys` or `load_host_keys` to verify known host keys. `AutoAddPolicy` automatically trusts unknown hosts and should be used only in controlled or temporary environments.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
