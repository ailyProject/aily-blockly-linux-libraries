# @aily-project/lib-bleak

Curated Bleak Bluetooth LE integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import bleak as _python_lib_bleak`
- Install on target: `python3 -m pip install bleak`
- Blocks (5): `python_bleak_call`, `python_bleak_do`, `python_bleak_method`, `python_bleak_do_method`, `python_bleak_attribute`
- Allowlisted callables: `BleakScanner`, `BleakScanner.discover`, `BleakScanner.find_device_by_address`, `BleakScanner.find_device_by_name`, `BleakClient`
- Allowlisted methods: `connect`, `disconnect`, `read_gatt_char`, `write_gatt_char`, `start_notify`, `stop_notify`
- Allowlisted attributes: `is_connected`, `address`, `name`, `details`, `mtu_size`, `services`, `backend_id`, `rssi`, `local_name`, `manufacturer_data`, `service_data`, `service_uuids`, `tx_power`
- API source: https://bleak.readthedocs.io/

`rssi`, `local_name`, `manufacturer_data`, `service_data`, `service_uuids`, and `tx_power` belong to `AdvertisementData` supplied to scan callbacks. `BLEDevice.metadata` is not available in Bleak 3.0.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Async entry points use the repository-wide persistent asyncio bridge and wait synchronously for completion. Close clients and sessions explicitly.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
