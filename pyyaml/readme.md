# PyYAML Blockly 库

面向树莓派和 Linux 单板机的 PyYAML 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install PyYAML`
- 积木（3 个）：`python_pyyaml_call`、`python_pyyaml_do`、`python_pyyaml_attribute`
- 可调用入口：`safe_load`、`safe_load_all`、`safe_dump`、`safe_dump_all`
- 对象方法：无
- 对象/模块属性：`SafeLoader`、`CSafeLoader`、`SafeDumper`、`CSafeDumper`
- API 文档：https://pyyaml.org/wiki/PyYAMLDocumentation

安全说明：本库仅暴露安全的加载入口，不暴露 `yaml.load`、`yaml.unsafe_load` 等可能构造任意 Python 对象的不安全反序列化入口。

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
