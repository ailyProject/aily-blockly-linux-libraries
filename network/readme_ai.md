# @aily-project/lib-network

Portable standard-library CPython networking blocks for CyberCAM Linux, Raspberry Pi 5, and WalnutPi 2B.

Socket blocks (22): `python_socket_init`, `python_socket_address`, `python_socket_address_part`, `python_socket_connect`, `python_socket_bind`, `python_socket_listen`, `python_socket_accept`, `python_socket_accept_into`, `python_socket_send`, `python_socket_receive`, `python_socket_send_to`, `python_socket_receive_from`, `python_socket_receive_from_into`, `python_socket_set_timeout`, `python_socket_set_blocking`, `python_socket_set_option`, `python_socket_ready`, `python_socket_endpoint`, `python_socket_encode`, `python_socket_decode`, `python_socket_shutdown`, `python_socket_close`.

The library contains 23 blocks: the 22 Socket blocks above plus `python_http_server`, which serves the current directory through CPython `http.server`. It has no third-party runtime dependency.

The former Requests client types `python_http_request` and `python_http_response` moved to `@aily-project/lib-requests`. This package intentionally no longer registers them, preventing duplicate block definitions when both libraries are loaded.

Generation contract:

- `python_socket_send` uses `sendall`; `str` is encoded as UTF-8 while bytes-like payloads are preserved.
- Address resolution constrains both family and socket type through `getaddrinfo`.
- Prefer `python_socket_accept_into` and `python_socket_receive_from_into` for Blockly-friendly tuple unpacking.
- `SO_REUSEADDR`, `SO_BROADCAST`, `SO_KEEPALIVE`, and `TCP_NODELAY` are allow-listed; arbitrary constants are never interpolated.
- TCP `recv()` returns bytes and `b''` means peer closure. UDP keeps datagram boundaries, and a short receive buffer truncates a datagram.
- Socket variables are sanitized Python identifiers and registered for guarded cleanup.
- Module imports use private aliases, generated identifiers avoid Python builtins, and tuple-unpack blocks reject colliding destination names.

The migration-stable `python_socket_*` types are retained. Legacy `cybercam_socket_*` aliases are intentionally not registered; migrate those workspaces to the corresponding `python_socket_*` types.

Requires the standalone CPython generator at `globalThis.Python`; it never registers to MPY or MicroPython generators.
