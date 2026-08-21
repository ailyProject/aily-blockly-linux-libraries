# schedule Blockly 库

面向树莓派和 Linux 单板机的 schedule 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install schedule`
- 积木（5 个）：`python_schedule_call`、`python_schedule_do`、`python_schedule_method`、`python_schedule_do_method`、`python_schedule_attribute`
- 可调用入口：`every`、`run_pending`、`run_all`、`clear`、`cancel_job`、`get_jobs`、`idle_seconds`、`repeat`
- 对象方法：`at`、`until`、`to`、`do`、`tag`
- 对象/模块属性：`next_run`、`period`、`unit`、`latest`、`start_day`、`tags`、`seconds`、`minutes`、`hours`、`days`、`weeks`、`monday`、`tuesday`、`wednesday`、`thursday`、`friday`、`saturday`、`sunday`
- API 文档：https://schedule.readthedocs.io/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
