# @aily-project/lib-psutil

Curated psutil integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import psutil as _python_lib_psutil`
- Install on target: `python3 -m pip install psutil`
- Blocks (5): `linux_psutil_call`, `linux_psutil_do`, `linux_psutil_method`, `linux_psutil_do_method`, `linux_psutil_attribute`
- Allowlisted callables: `cpu_percent`, `cpu_count`, `virtual_memory`, `disk_usage`, `disk_partitions`, `net_if_addrs`, `net_io_counters`, `sensors_temperatures`, `boot_time`, `pids`, `Process`
- Allowlisted methods: `cpu_percent`, `memory_info`, `io_counters`, `open_files`, `connections`, `terminate`, `kill`, `wait`
- Allowlisted attributes: `pid`, `total`, `available`, `percent`, `used`, `free`, `rss`, `vms`
- API source: https://psutil.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
