# @aily-project/lib-watchdog

Curated watchdog Observer integration for the standalone CPython generator at `globalThis.Python`.

- Imports: `import watchdog.observers as _python_lib_watchdog_observers`; `import watchdog.events as _python_lib_watchdog_events`
- Install on target: `python3 -m pip install watchdog`
- Blocks (5): `linux_watchdog_call`, `linux_watchdog_do`, `linux_watchdog_method`, `linux_watchdog_do_method`, `linux_watchdog_attribute`
- Allowlisted callables: `Observer`, `LoggingEventHandler`, `FileSystemEventHandler`, `PatternMatchingEventHandler`
- Allowlisted methods: `schedule`, `start`, `stop`, `join`, `unschedule`, `unschedule_all`, `is_alive`
- Allowlisted attributes: `daemon`, `name`
- API source: https://python-watchdog.readthedocs.io/

`Observer` is imported from `watchdog.observers`; the three event handlers are imported from `watchdog.events` and can be passed to `Observer.schedule`.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
