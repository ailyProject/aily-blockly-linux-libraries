# hidapi Blockly 库

面向树莓派和 Linux 单板机的 hidapi 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install hidapi`
- 积木（4 个）：`linux_hidapi_call`、`linux_hidapi_do`、`linux_hidapi_method`、`linux_hidapi_do_method`
- 可调用入口：`device`、`enumerate`
- 对象方法：`open`、`open_path`、`write`、`read`、`send_feature_report`、`get_feature_report`、`get_manufacturer_string`、`get_product_string`、`get_serial_number_string`、`close`、`set_nonblocking`
- 对象/模块属性：无
- API 文档：https://github.com/trezor/cython-hidapi

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
