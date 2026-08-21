# pygame Blockly 库

面向树莓派和 Linux 单板机的 pygame 常用 API 白名单积木。

- 目标端安装：`sudo apt install python3-pygame`
- 积木（5 个）：`python_pygame_call`、`python_pygame_do`、`python_pygame_method`、`python_pygame_do_method`、`python_pygame_attribute`
- 可调用入口：`init`、`quit`、`display.set_mode`、`display.flip`、`event.get`、`time.Clock`、`image.load`、`mixer.Sound`、`font.Font`、`draw.line`、`draw.rect`、`draw.circle`、`transform.scale`
- 对象方法：`fill`、`blit`、`get_rect`、`play`、`stop`、`tick`
- 对象/模块属性：`type`、`key`、`pos`、`button`、`size`
- API 文档：https://www.pygame.org/docs/

参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 与 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。

调用积木返回普通 Python 值；若 API 要求释放资源，请显式调用白名单中的 close/deinit/stop 方法。

Raspberry Pi OS Bookworm/Trixie 中，pip 包应安装到虚拟环境。本 Blockly 包不会自动安装依赖、执行 sudo、启用硬件接口、修改启动配置或更改设备权限。
