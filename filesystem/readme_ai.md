# @aily-project/lib-filesystem

Version: 0.0.1.
System command and Linux CPU-temperature blocks. The `filesystem` package name is retained for migration stability; this package is not the standard File API library.
Public blocks (2): `python_command`, `python_cpu_temperature`.
The four stable types `python_file_read`, `python_file_write`, `python_file_exists`, and `python_file_list` moved to `@aily-project/lib-file`. Old projects using them must add `lib-file`; only that package registers those types, so there is no duplicate registration.
Target dependencies: CPython standard library. `python_command` invokes the target shell and must not receive untrusted input. `python_cpu_temperature` is Linux-specific and depends on `/sys/class/thermal/thermal_zone0/temp` plus `cat`.
Requires the standalone CPython generator at `globalThis.Python`; it does not fall back to MPY/MicroPython.
