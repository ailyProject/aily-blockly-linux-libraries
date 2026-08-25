# GStreamer Blockly 库

在 Linux、树莓派和 Jetson 上创建摄像头、编解码、推流和显示管线。

- 目标端安装：`sudo apt install python3-gi gir1.2-gstreamer-1.0 gstreamer1.0-tools`
- 积木（5 个）：`gstreamer_call`、`gstreamer_do`、`gstreamer_method`、`gstreamer_do_method`、`gstreamer_attribute`
- 可调用入口：`init`、`parse_launch`、`version`、`version_string`、`debug_set_active`、`debug_set_default_threshold`
- 对象方法：`set_state`、`get_state`、`get_bus`、`get_by_name`、`send_event`、`set_property`、`get_property`、`timed_pop_filtered`、`pop`、`have_pending`、`is_playing`、`seek_simple`
- 对象/模块属性：`State.PLAYING`、`State.PAUSED`、`State.READY`、`State.NULL`、`MessageType.ERROR`、`MessageType.EOS`、`MessageType.STATE_CHANGED`、`Format.TIME`、`SeekFlags.FLUSH`、`SeekFlags.KEY_UNIT`、`CLOCK_TIME_NONE`、`type`
- API 文档：https://gstreamer.freedesktop.org/documentation/tutorials/basic/hello-world.html

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。
