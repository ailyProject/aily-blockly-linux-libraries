# @aily-project/lib-file

Cross-platform standard-library file operations for the standalone CPython generator at `globalThis.Python`. Package version: `0.0.1`. There are no third-party target dependencies.

The package registers eight Blockly definitions and exposes four general types in the toolbox:

`python_file_read`, `python_file_write`, `python_file_exists`, `python_file_list`.

The toolbox path shadows are `file.txt` for read, write, and existence checks, and `.` for directory listing. They are relative to the Python process working directory and remain user-editable. The library does not create missing parent directories.

`python_file_read` opens the path with mode `r` and `encoding='utf-8'`, reads the complete text, and returns `str`. `python_file_write` offers `w` (truncate/create) and `a` (append/create), converts its content with `str(content)` for migration-stable behavior, and writes UTF-8 text. Both helpers use `with open(...)`, so the stream is closed on normal and exceptional exits. These blocks are text-only; they do not preserve arbitrary binary data. Reading the entire file can consume substantial memory.

`python_file_exists` generates `os.path.exists(path)`. `python_file_list` generates `os.listdir(path)` and returns entry names in arbitrary order without `.` or `..`. Normal Python exceptions for missing files, permissions, invalid UTF-8, or non-directory list targets are not suppressed.

Four additional definitions are hidden from the toolbox and retained solely for serialized CyberCAM workspace compatibility:

`cybercam_file_read`, `cybercam_file_write`, `cybercam_file_exists`, `cybercam_file_list`.

Their missing-input fallbacks remain `/data/file.txt` for read/write and `/data` for existence/list operations. New projects must use the public `python_file_*` types.

The public types were migrated from the old aggregate `@aily-project/lib-python-core`; the hidden types were migrated from the old aggregate `@aily-project/lib-cybercam`. Do not co-load this package with an old aggregate release that still owns the same block types and `Python.forBlock` handlers. System-command execution and Linux CPU-temperature access are intentionally outside this package.

Authoritative references: Python [`open()`](https://docs.python.org/3/library/functions.html#open), [reading and writing files](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files), [`os.path.exists()`](https://docs.python.org/3/library/os.path.html#os.path.exists), and [`os.listdir()`](https://docs.python.org/3/library/os.html#os.listdir).
