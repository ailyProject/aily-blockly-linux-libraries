# PyModbus Blockly 库

面向树莓派和 Linux 单板机的 PyModbus 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install pymodbus`
- 积木（5 个）：`python_pymodbus_call`、`python_pymodbus_do`、`python_pymodbus_method`、`python_pymodbus_do_method`、`python_pymodbus_attribute`
- 可调用入口：`ModbusTcpClient`、`ModbusSerialClient`、`ModbusUdpClient`、`AsyncModbusTcpClient`、`AsyncModbusSerialClient`
- 对象方法：`connect`、`close`、`read_coils`、`read_discrete_inputs`、`read_holding_registers`、`read_input_registers`、`write_coil`、`write_register`、`write_registers`
- 对象/模块属性：`connected`
- API 文档：https://www.pymodbus.org/docs

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

异步入口复用仓库级持久 asyncio 事件循环，并同步等待结果；客户端和会话仍需显式关闭。

兼容性说明：PyModbus 大版本 API 变化较多，本包按现代客户端 API 提供白名单。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
