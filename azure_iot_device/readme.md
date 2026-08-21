# Azure IoT Device Blockly 库

面向树莓派和 Linux 单板机的 Azure IoT Device 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install azure-iot-device`
- 积木（5 个）：`python_azure_iot_device_call`、`python_azure_iot_device_do`、`python_azure_iot_device_method`、`python_azure_iot_device_do_method`、`python_azure_iot_device_attribute`
- 可调用入口：`IoTHubDeviceClient.create_from_connection_string`、`IoTHubDeviceClient.create_from_symmetric_key`、`IoTHubModuleClient.create_from_connection_string`、`Message`、`MethodResponse`
- 对象方法：`connect`、`disconnect`、`send_message`、`receive_message`、`send_method_response`、`patch_twin_reported_properties`、`get_twin`、`shutdown`
- 对象/模块属性：`connected`、`user_agent`、`custom_properties`、`message_id`、`correlation_id`、`content_type`
- API 文档：https://learn.microsoft.com/en-us/python/api/overview/azure/iot-device-readme

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
