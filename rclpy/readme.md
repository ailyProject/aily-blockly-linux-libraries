# ROS 2 rclpy Blockly 库

面向树莓派和 Linux 单板机的 ROS 2 rclpy 常用 API 白名单积木。

- 目标端安装：`Install the ROS 2 rclpy package with the matching ROS distribution via APT`
- 积木（5 个）：`python_rclpy_call`、`python_rclpy_do`、`python_rclpy_method`、`python_rclpy_do_method`、`python_rclpy_attribute`
- 可调用入口：`init`、`shutdown`、`ok`、`spin`、`spin_once`、`create_node`
- 对象方法：`create_publisher`、`create_subscription`、`create_timer`、`create_client`、`create_service`、`get_logger`、`destroy_node`、`publish`
- 对象/模块属性：`context`、`default_callback_group`
- API 文档：https://docs.ros.org/en/ros2_packages/rolling/api/rclpy/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

兼容性说明：rclpy 必须匹配已安装的 ROS 2 发行版，不能当作普通 PyPI 依赖。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
