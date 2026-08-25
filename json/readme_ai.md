# JSON Blockly Library

This library targets standard CPython on Linux single-board computers. It uses the json standard library and requires no extra pip dependency.

## Surface

- Serialize Python values with dumps, including allowlisted Unicode escaping, indentation, and key-order options.
- Parse strings, bytes, or bytearrays with loads.
- Read and write JSON files explicitly as UTF-8.
- Test whether text or encoded bytes contain valid JSON.
- Get and set keys on the Python dictionaries that represent JSON objects.

## Resource and exception semantics

- UTF-8 file helpers always use with, so file handles close on both success and failure.
- Reads do not catch FileNotFoundError, PermissionError, OSError, UnicodeDecodeError, or JSONDecodeError.
- Writes do not catch I/O errors, TypeError, ValueError, or circular-reference failures and use standard w-mode replacement semantics.
- Validation converts only JSONDecodeError and UnicodeDecodeError into false. Unsupported input types still raise TypeError.
- dumps, loads, mapping get, and mapping assignment retain their normal CPython exceptions.
- Configuration fields are mapped through fixed allowlists and are never emitted as executable Python source fragments.

API reference: https://docs.python.org/3/library/json.html
