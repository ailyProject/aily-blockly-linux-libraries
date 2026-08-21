# redis-py Blockly 库

面向树莓派和 Linux 单板机的 redis-py 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install redis`
- 积木（5 个）：`python_redis_call`、`python_redis_do`、`python_redis_method`、`python_redis_do_method`、`python_redis_attribute`
- 可调用入口：`Redis`、`StrictRedis`、`from_url`
- 对象方法：`get`、`set`、`delete`、`incr`、`decr`、`publish`、`subscribe`、`hset`、`hget`、`lpush`、`rpop`、`scan_iter`、`ping`、`close`
- 对象/模块属性：`connection_pool`
- API 文档：https://redis.readthedocs.io/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
