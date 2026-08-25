# GPIO Zero 外围设备

面向 Raspberry Pi 与兼容 Linux 单板机的友好外围设备积木，生成标准 CPython 代码并调用官方 `gpiozero` API。

- npm 包：`@aily-project/lib-gpiozero-devices`
- Blockly 积木：27 个
- Python 依赖：`gpiozero` 与目标板可用的 GPIO backend
- 运行环境：独立 CPython generator runtime，仅注册到 `globalThis.Python`

## 功能

- `Motor`：初始化双输入电机驱动、正转、反转、停止、读取有符号速度和关闭。
- `AngularServo`：配置角度范围、设置/读取角度、停止脉冲和关闭；允许 `min_angle > max_angle` 来反转角度方向。
- `DistanceSensor`：初始化 HC-SR04 类模块，以米或厘米读取距离，判断阈值并等待进入/离开范围。
- `RotaryEncoder`：读取或清零有符号步数，并等待任意、顺时针或逆时针旋转。
- `Buzzer` / `TonalBuzzer`：在初始化时选择简单或音调模式，播放音调、开、关、停止和关闭。

名称字段会转换为安全的 Python 标识符。输出模式、距离单位、等待事件、编码器方向、回绕方式和蜂鸣器模式均使用固定机器值白名单。初始化同名资源前会关闭旧对象；程序退出时生成器也会注入 `close()` 清理。

## 接线与电气安全

GPIO 是 3.3V 逻辑，不能直接承受 5V。

- **HC-SR04 的 Echo 通常输出 5V，必须经过合适的电阻分压器或电平转换器后才能连接 GPIO。**Trigger 可由 3.3V GPIO 驱动。积木不会替代电气保护。
- 直流电机和舵机不能由 GPIO 供电。电机必须经过 H 桥/电机驱动器，舵机应使用满足峰值电流的独立电源；外部电源与单板机通常需要共地。
- `Motor` 的两个引脚连接驱动器逻辑输入，而不是电机线圈。
- 编码器和蜂鸣器模块也必须符合目标板的电压、电流和上拉要求。

超声波最大距离与阈值以米为单位；超时值不大于 0 时表示无限等待。Motor 速度必须在 0 到 1 之间。AngularServo 的两个端点不能相等，初始角度必须位于两端点围成的区间内，无论端点是正序还是反序。`TonalBuzzer` 的音调可使用 `A4` 一类 gpiozero 音名；对简单 Buzzer 使用“播放”会持续打开蜂鸣器。

本包不会安装 Python 依赖、选择 GPIO backend、修改设备权限或系统启动配置。目标系统必须允许运行用户访问 GPIO 字符设备。

API 依据：[gpiozero Output Devices](https://gpiozero.readthedocs.io/en/stable/api_output.html)、[Input Devices](https://gpiozero.readthedocs.io/en/stable/api_input.html) 与 [Internal Devices](https://gpiozero.readthedocs.io/en/stable/api_internal.html)。
