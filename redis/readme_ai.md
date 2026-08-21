# @aily-project/lib-redis

Curated redis-py integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import redis as _python_lib_redis`
- Install on target: `python3 -m pip install redis`
- Blocks (5): `python_redis_call`, `python_redis_do`, `python_redis_method`, `python_redis_do_method`, `python_redis_attribute`
- Allowlisted callables: `Redis`, `StrictRedis`, `from_url`
- Allowlisted methods: `get`, `set`, `delete`, `incr`, `decr`, `publish`, `subscribe`, `hset`, `hget`, `lpush`, `rpop`, `scan_iter`, `ping`, `close`
- Allowlisted attributes: `connection_pool`
- API source: https://redis.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
