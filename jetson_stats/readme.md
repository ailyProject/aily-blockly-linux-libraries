# jetson-stats / jtop Blockly 库

读取 Jetson 的 CPU、GPU、内存、温度、功耗、风扇和功耗模式。

- 目标端安装：`sudo python3 -m pip install -U jetson-stats`
- 积木（5 个）：`jetson_stats_call`、`jetson_stats_do`、`jetson_stats_method`、`jetson_stats_do_method`、`jetson_stats_attribute`
- 可调用入口：`jtop`
- 对象方法：`start`、`close`、`ok`、`loop`
- 对象/模块属性：`board`、`stats`、`cpu`、`gpu`、`memory`、`engines`、`temperature`、`power`、`fan`、`jetson_clocks`、`nvpmodel`
- API 文档：https://github.com/rbonghi/jetson_stats

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
