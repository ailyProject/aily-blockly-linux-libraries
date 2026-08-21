# @aily-project/lib-influxdb-client

Curated InfluxDB Client integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import influxdb_client as _python_lib_influxdb_client`
- Install on target: `python3 -m pip install influxdb-client`
- Blocks (5): `python_influxdb_client_call`, `python_influxdb_client_do`, `python_influxdb_client_method`, `python_influxdb_client_do_method`, `python_influxdb_client_attribute`
- Allowlisted callables: `InfluxDBClient`, `Point`, `WriteOptions`, `Dialect`
- Allowlisted methods: `write_api`, `query_api`, `delete_api`, `write`, `query`, `query_data_frame`, `health`, `ready`, `close`, `delete`
- Allowlisted attributes: `version`, `status`, `message`, `name`, `tags`, `fields`
- API source: https://influxdb-client.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
