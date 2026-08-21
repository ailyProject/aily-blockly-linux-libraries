# @aily-project/lib-schedule

Curated schedule integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import schedule as _python_lib_schedule`
- Install on target: `python3 -m pip install schedule`
- Blocks (5): `python_schedule_call`, `python_schedule_do`, `python_schedule_method`, `python_schedule_do_method`, `python_schedule_attribute`
- Allowlisted callables: `every`, `run_pending`, `run_all`, `clear`, `cancel_job`, `get_jobs`, `idle_seconds`, `repeat`
- Allowlisted methods: `at`, `until`, `to`, `do`, `tag`
- Allowlisted attributes: `next_run`, `period`, `unit`, `latest`, `start_day`, `tags`, `seconds`, `minutes`, `hours`, `days`, `weeks`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`
- API source: https://schedule.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
