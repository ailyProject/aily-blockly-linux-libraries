# Paramiko Blockly 库

面向树莓派和 Linux 单板机的 Paramiko 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install paramiko`
- 积木（4 个）：`python_paramiko_call`、`python_paramiko_do`、`python_paramiko_method`、`python_paramiko_do_method`
- 可调用入口：`SSHClient`、`Transport`、`SFTPClient`、`AutoAddPolicy`、`RSAKey`、`Ed25519Key`
- 对象方法：`connect`、`exec_command`、`open_sftp`、`close`、`set_missing_host_key_policy`、`load_system_host_keys`、`load_host_keys`、`get_host_keys`、`get_transport`、`is_active`、`is_authenticated`、`put`、`get`、`listdir`、`open`
- 对象/模块属性：无
- API 文档：https://www.paramiko.org/

安全提示：默认应优先调用 `load_system_host_keys` 或 `load_host_keys` 校验已知主机密钥；`AutoAddPolicy` 会自动信任未知主机，只应在受控或临时环境中使用。

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
