# DepthAI v3 Blockly 库

面向树莓派和 Linux 单板机的 DepthAI v3 常用 API 白名单积木。

- 目标端安装：`python3 -m pip install depthai`
- 积木（5 个）：`python_depthai_call`、`python_depthai_do`、`python_depthai_method`、`python_depthai_do_method`、`python_depthai_attribute`
- 可调用入口：`Pipeline`、`Device`
- 对象方法：`create`、`build`、`start`、`stop`、`run`、`wait`、`requestOutput`、`createOutputQueue`、`get`、`tryGet`、`send`、`close`、`isRunning`
- 对象/模块属性：`node.Camera`、`node.ColorCamera`、`node.MonoCamera`、`node.ImageManip`、`node.NeuralNetwork`、`node.StereoDepth`
- API 文档：https://docs.luxonis.com/software-v3/depthai/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

兼容性说明：面向 DepthAI v3；旧 v2 的 ColorCamera/XLinkOut 图不兼容。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
