# @aily-project/lib-azure-iot-device

Curated Azure IoT Device integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import azure.iot.device as _python_lib_azure_iot_device`
- Install on target: `python3 -m pip install azure-iot-device`
- Blocks (5): `python_azure_iot_device_call`, `python_azure_iot_device_do`, `python_azure_iot_device_method`, `python_azure_iot_device_do_method`, `python_azure_iot_device_attribute`
- Allowlisted callables: `IoTHubDeviceClient.create_from_connection_string`, `IoTHubDeviceClient.create_from_symmetric_key`, `IoTHubModuleClient.create_from_connection_string`, `Message`, `MethodResponse`
- Allowlisted methods: `connect`, `disconnect`, `send_message`, `receive_message`, `send_method_response`, `patch_twin_reported_properties`, `get_twin`, `shutdown`
- Allowlisted attributes: `connected`, `user_agent`, `custom_properties`, `message_id`, `correlation_id`, `content_type`
- API source: https://learn.microsoft.com/en-us/python/api/overview/azure/iot-device-readme

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
