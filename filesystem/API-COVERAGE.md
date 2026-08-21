# System API Coverage

This inventory defines the runtime and migration boundary of `@aily-project/lib-filesystem` version `0.0.1`. The package name is retained for migration stability. It no longer represents or registers the standard File API; those blocks are owned by `@aily-project/lib-file`.

## Definition inventory

| Surface | Count | Block types | Toolbox status |
|---|---:|---|---|
| System command | 1 | `python_command` | Visible |
| Linux CPU temperature | 1 | `python_cpu_temperature` | Visible |
| **Total** | **2** | Two system-oriented types | **Two toolbox entries** |

## Generated API mapping

| Block | Generated behavior | Platform boundary |
|---|---|---|
| `python_command` | `os.popen(str(command)).read()` | Runs through the target system shell; command syntax and available programs are platform-dependent |
| `python_cpu_temperature` | Reads `/sys/class/thermal/thermal_zone0/temp` through `cat`, converts millidegrees to degrees Celsius | Linux-specific; requires the thermal sysfs node, `cat`, and read permission |

`python_command` must not receive untrusted or insufficiently validated input. Shell metacharacters are interpreted by the target shell, and the invoked command may read, modify, or delete data with the generated program's permissions. This Blockly package does not sandbox commands, request confirmation, or restrict side effects.

The CPU-temperature block assumes Linux thermal zone 0 is the desired sensor. Some systems expose no thermal sysfs node, use another zone, or restrict access; those cases are not abstracted by this block.

## File API migration

The following stable type strings moved from this package to `@aily-project/lib-file`:

- `python_file_read`
- `python_file_write`
- `python_file_exists`
- `python_file_list`

Their type names remain unchanged so serialized Blockly workspaces can recover them after `lib-file` is added. This package does not retain hidden aliases, definitions, localization entries, or generator handlers for those types. A type therefore has one owner and loading `lib-filesystem` together with `lib-file` does not cause duplicate registration.

Existing projects that used any `python_file_*` block must add `@aily-project/lib-file`. Projects that use only `python_command` or `python_cpu_temperature` can continue loading this package alone.

## Generator runtime

The package registers handlers only on the standalone CPython generator at `globalThis.Python.forBlock`. If no Python generator is present, it safely skips registration; it does not fall back to MPY/MicroPython.
