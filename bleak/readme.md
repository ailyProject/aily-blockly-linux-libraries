# Bleak Bluetooth LE Blockly 库

面向树莓派和 Linux 单板机的 Bleak Bluetooth LE 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install bleak`
- 积木（5 个）：`python_bleak_call`、`python_bleak_do`、`python_bleak_method`、`python_bleak_do_method`、`python_bleak_attribute`
- 可调用入口：`BleakScanner`、`BleakScanner.discover`、`BleakScanner.find_device_by_address`、`BleakScanner.find_device_by_name`、`BleakClient`
- 对象方法：`connect`、`disconnect`、`read_gatt_char`、`write_gatt_char`、`start_notify`、`stop_notify`
- 对象/模块属性：`is_connected`、`address`、`name`、`details`、`mtu_size`、`services`、`backend_id`、`rssi`、`local_name`、`manufacturer_data`、`service_data`、`service_uuids`、`tx_power`
- API 文档：https://bleak.readthedocs.io/

`rssi`、`local_name`、`manufacturer_data`、`service_data`、`service_uuids`、`tx_power` 属于扫描回调中的 `AdvertisementData`；Bleak 3.0 的 `BLEDevice` 不再提供 `metadata`。

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

异步入口复用仓库级持久 asyncio 事件循环，并同步等待结果；客户端和会话仍需显式关闭。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
