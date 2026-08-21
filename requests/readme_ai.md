# @aily-project/lib-requests

CPython Blockly Requests client for CyberCAM Linux, Raspberry Pi 5, WalnutPi 2B, and general Linux.

The package declares 24 block types: 22 public `python_requests_*` blocks plus hidden migration-compatible `python_http_request` and `python_http_response`. Runtime dependency: `requests>=2.32.3,<3`.

Generation contract:

- Import Requests only as the private alias `_python_requests`.
- Modern request, upload, and download paths merge explicit options and then default `timeout` to `(3.05, 30)`. An explicit `timeout: None` is preserved.
- Request methods, response properties, option modes, and exception types are allow-listed; never interpolate dropdown values as arbitrary Python members.
- A disconnected CLIENT input targets the module-level API; a connected CLIENT expression targets that Session-like object.
- Body modes are mutually exclusive: JSON emits `json`, form/raw emits `data`, and multipart emits `files`.
- Content, network, and TLS option blocks return kwargs dictionaries. Merge-options gives the right mapping precedence.
- TLS defaults to verification. CA-bundle mode requires a path. Insecure mode is explicit and must remain visibly warned as test-only.
- Session variables are sanitized, predeclared, closed explicitly, and registered for guarded cleanup.
- Upload files are opened in binary mode inside `with`; streamed responses and downloads are always closed.
- `python_requests_try` catches only the selected `requests.exceptions` subclass and preserves the exception variable through the shared Python name-scope protocol.
- `python_requests_for_chunks` skips empty keep-alive chunks and closes its Response in `finally`.
- `.json()` and `.raise_for_status()` remain separate operations because JSON validity and HTTP success are independent.

Stable hidden types:

- `python_http_request`: exact historical schema and generation behavior: GET `params`, POST `json`, PUT `data`, DELETE ignores DATA, no timeout.
- `python_http_response`: exact historical `status_code`, `text`, and `json()` properties.

These two types moved from `@aily-project/lib-network`. Do not load this package with an older network or python-core package that still registers them.

Requires the standalone CPython generator at `globalThis.Python`; never register to MPY or MicroPython generators.
