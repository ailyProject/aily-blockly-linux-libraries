# @aily-project/lib-adafruit-ds3231

面向 Linux CPython 的 DS3231 高精度实时时钟积木，共 9 个积木，覆盖初始化、时间读写、温度、掉电标志、校准与资源释放。

- 目标机安装：`python3 -m pip install adafruit-circuitpython-ds3231 Adafruit-Blinka`
- Python 导入：`import adafruit_ds3231`
- API 文档：https://docs.circuitpython.org/projects/ds3231/en/latest/
- 运行时：通过 Adafruit Blinka 在 Linux CPython 上运行，不是 MicroPython 固件库。

初始化积木可以接收已有 I2C 对象；留空时创建并拥有 `board.I2C()`，关闭积木和程序清理只释放这个自建总线，不会关闭外部传入的共享总线。设置时间接受 `datetime`、`time.struct_time` 或含年月日时分秒的序列；生成代码会校验日历字段、限制年份为 2000–2099，并从日期重新计算星期，避免写入无效星期寄存器。DS3231 不支持毫秒，校准值必须在 -128 到 127 之间。设备名称会映射到生成器私有命名空间，不能覆盖 Python 内置名、导入模块或辅助函数。

npm 包只安装 Blockly 静态资产，不会安装目标机 Python 包、启用 I2C、修改设备权限或执行 sudo。接线前请核对模块供电和 I2C 电平。
