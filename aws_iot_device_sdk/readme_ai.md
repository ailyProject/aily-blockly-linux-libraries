# @aily-project/lib-aws-iot-device-sdk

Curated AWS IoT Device SDK v2 integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import awsiot.mqtt_connection_builder as _python_lib_aws_iot_device_sdk`
- Install on target: `python3 -m pip install awsiotsdk`
- Blocks (4): `python_aws_iot_device_sdk_call`, `python_aws_iot_device_sdk_do`, `python_aws_iot_device_sdk_method`, `python_aws_iot_device_sdk_do_method`
- Allowlisted callables: `mtls_from_path`, `mtls_from_bytes`, `websockets_with_default_aws_signing`
- Allowlisted methods: `connect`, `disconnect`, `publish`, `subscribe`, `unsubscribe`, `resubscribe_existing_topics`, `result`
- Allowlisted attributes: none
- API source: https://aws.github.io/aws-iot-device-sdk-python-v2/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
