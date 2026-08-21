# File API Coverage

This document defines the API, dependency, and migration boundary of `@aily-project/lib-file` version `0.0.1`. The package registers exactly eight Blockly definitions: four general `python_file_*` types visible in the toolbox and four hidden `cybercam_file_*` compatibility types.

Primary Python sources:

- [Built-in `open()`](https://docs.python.org/3/library/functions.html#open)
- [Reading and writing files](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)
- [`io.IOBase` context management and closing](https://docs.python.org/3/library/io.html#io.IOBase)
- [`os.path.exists()`](https://docs.python.org/3/library/os.path.html#os.path.exists)
- [`os.listdir()`](https://docs.python.org/3/library/os.html#os.listdir)

## Definition inventory

| Surface | Count | Block types | Toolbox status |
|---|---:|---|---|
| General Python file API | 4 | `python_file_read`, `python_file_write`, `python_file_exists`, `python_file_list` | Visible; use for new projects |
| CyberCAM legacy compatibility | 4 | `cybercam_file_read`, `cybercam_file_write`, `cybercam_file_exists`, `cybercam_file_list` | Hidden; old serialized workspaces only |
| **Total** | **8** | Four public plus four compatibility definitions | **Four toolbox entries** |

## Public API mapping

| Block type | Generated standard API | Contract |
|---|---|---|
| `python_file_read` | `with open(path, 'r', encoding='utf-8')` and `file.read()` | Returns the whole file as `str`; the context manager closes the stream |
| `python_file_write` | `with open(path, mode, encoding='utf-8')` and `file.write(str(content))` | Statement block; `mode` is constrained to `w` or `a`; the context manager closes the stream |
| `python_file_exists` | `os.path.exists(path)` | Returns a Boolean existence result using the local platform's path rules |
| `python_file_list` | `os.listdir(path)` | Returns a list of entry names in arbitrary order; excludes `.` and `..` |

All generated operations use Python built-ins or the `os` standard library. The npm package does not install a Python distribution or any Python dependency.

### Text and write-mode contract

The library intentionally covers UTF-8 text only. It does not expose binary modes, an encoding selector, `errors`, `newline`, buffering, random access, or a persistent user-managed file handle. This prevents a text block from accidentally generating an invalid binary-plus-encoding combination. Binary assets require a separate bytes-capable API.

The public write dropdown maps exactly as follows:

| Field value | Python mode | Behavior |
|---|---|---|
| `w` | write | Create the file if absent; otherwise truncate it before writing |
| `a` | append | Create the file if absent; otherwise append at the end |

Converting content through `str(content)` preserves the behavior of the migrated block types. It is not a claim that Python text streams natively accept every value: the underlying `TextIOBase.write()` contract accepts `str`. The conversion is therefore part of this Blockly API's migration-stable semantics.

Both helpers use a `with` statement. Python guarantees that the file object is closed when the suite exits, including when an exception propagates. No separate close block or generator cleanup hook is required for these one-shot operations. Read loads the complete text into memory and is not a bounded or streaming read.

### Paths and errors

Toolbox-visible path shadows are:

| Block type | Toolbox default |
|---|---|
| `python_file_read` | `file.txt` |
| `python_file_write` | `file.txt` |
| `python_file_exists` | `file.txt` |
| `python_file_list` | `.` |

These are relative paths resolved by Python against the process current working directory. The package does not normalize them, expand `~`, create parent directories, apply a sandbox, or assume CyberCAM's `/data` mount for new blocks.

Normal Python behavior is preserved. Examples include `FileNotFoundError` for a missing read target, `PermissionError` when access is denied, `NotADirectoryError` when `os.listdir()` receives a non-directory, and `UnicodeDecodeError` for input that is not valid UTF-8. The package does not catch or replace these exceptions. `os.path.exists()` can return `False` for a missing path and may also return `False` when the platform cannot obtain status because permission is denied; callers that must distinguish those cases need a lower-level status API outside this package.

## Hidden CyberCAM compatibility mapping

The four `cybercam_file_*` definitions preserve the historical field names, input names, statement/output shapes, UTF-8 helper behavior, and `os` calls used by saved CyberCAM workspaces. They are registered in `block.json` and `generator.js` but absent from `toolbox.json`.

| Compatibility type | Missing-input generator fallback |
|---|---|
| `cybercam_file_read` | `/data/file.txt` |
| `cybercam_file_write` | `/data/file.txt` |
| `cybercam_file_exists` | `/data` |
| `cybercam_file_list` | `/data` |

The fallback is used only when an input produces no code. A loaded workspace normally supplies its serialized path and is not rewritten during migration.

## Ownership and migration boundary

| Types | Previous owner | Current owner |
|---|---|---|
| `python_file_read`, `python_file_write`, `python_file_exists`, `python_file_list` | old aggregate `@aily-project/lib-python-core` | `@aily-project/lib-file` |
| `cybercam_file_read`, `cybercam_file_write`, `cybercam_file_exists`, `cybercam_file_list` | old aggregate `@aily-project/lib-cybercam` | `@aily-project/lib-file` as hidden compatibility definitions |

Do not load the split file package alongside an old `lib-python-core` release that still registers the public types or an old `lib-cybercam` release that still registers the hidden types. Duplicate Blockly definitions and `Python.forBlock` handlers have order-dependent ownership and can overwrite one another. The corresponding current aggregate packages must delegate these types exclusively to `lib-file`.

System command execution and Linux CPU-temperature retrieval are deliberately excluded. They are not file APIs, `os.popen()` executes a shell command, and `/sys/class/thermal/...` is a Linux-specific interface. Neither behavior belongs to this cross-platform standard file package.

The generator registers only against `globalThis.Python`. If that object is absent, registration is skipped safely; if it is present but lacks a required standalone CPython generator method, initialization fails with an explicit compatibility error. There is no MPY/MicroPython fallback.
