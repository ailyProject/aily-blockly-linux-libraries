# @aily-project/lib-sqlite3

CPython-only SQLite blocks registered exclusively on `globalThis.Python.forBlock`. Version: `0.0.1`. Target dependency: Python standard-library `sqlite3` only.

Public block types:

| Type | Generated meaning | Result |
|---|---|---|
| `python_sqlite_connect` | `sqlite3.connect(database, timeout=...)`, optional `sqlite3.Row` factory | named connection resource plus cleanup |
| `python_sqlite_execute` | `connection.execute(sql, params)` | cursor |
| `python_sqlite_query` | `connection.execute(sql, params)` | cursor |
| `python_sqlite_executemany` | `connection.executemany(sql, parameter_rows)` | cursor |
| `python_sqlite_fetchone` | `cursor.fetchone()` | next row or `None` |
| `python_sqlite_fetchall` | `cursor.fetchall()` | remaining rows |
| `python_sqlite_commit` | `connection.commit()` | statement |
| `python_sqlite_rollback` | `connection.rollback()` | statement |
| `python_sqlite_rowcount` | `cursor.rowcount` | number, commonly `-1` for SELECT |
| `python_sqlite_lastrowid` | `cursor.lastrowid` | row id or `None` |
| `python_sqlite_close` | conditional close, then assign `None` | statement |

The SQL and parameters sockets are deliberately separate. A missing parameters input generates `()`. User data must be bound through `?` or named placeholders; never construct SQL with concatenation, interpolation, f-strings, or `%` formatting. Both positional sequences and named dictionaries are passed unchanged to `sqlite3`.

Connections are declared as `None` and closed conditionally by generated cleanup. Before every connect assignment, generated code closes a non-`None` connection already held under the same sanitized name; this prevents repeated or looped initialization from leaking connections. Explicit close also assigns `None`. Neither explicit close nor reconnect commits pending changes. The connection timeout controls how long SQLite waits for a locked table; it is not a query deadline. `fetchall` can consume substantial memory.

All resource-name fields are normalized to safe Python identifiers and checked against keywords, selected builtins, generated aliases, and the reserved `_python_` prefix. Row mode is a fixed `TUPLE`/`ROW` allowlist. No field value is emitted as an arbitrary Python method or attribute.

Authoritative reference: [Python `sqlite3`](https://docs.python.org/3/library/sqlite3.html).
