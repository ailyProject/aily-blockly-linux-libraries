# 四线步进电机

通过四个 gpiozero `OutputDevice` 输出确定性的全步或半步序列，面向 Raspberry Pi 与兼容 Linux 单板机上的四输入外部步进电机驱动器。

- npm 包：`@aily-project/lib-stepper`
- Blockly 积木：6 个
- Python 依赖：`gpiozero` 与目标板可用的 GPIO backend
- 运行环境：标准 CPython，仅注册到 `globalThis.Python`

## 积木

- `linux_stepper_init`：选择四个驱动输入、全步/半步、每转步数，以及移动后保持或释放线圈。
- `linux_stepper_move`：按有符号整数步数与正 RPM 移动；负数反向。
- `linux_stepper_rotate`：按有符号角度和 RPM 移动，角度换算到最近的整数步。
- `linux_stepper_position`：返回初始化后的开环命令位置，不是编码器反馈。
- `linux_stepper_release`：将四个驱动输入全部置低，但保留 GPIO 资源。
- `linux_stepper_close`：释放线圈并关闭全部 GPIO 资源。

生成器注入固定的四相序列 helper。初始化会检查四个 GPIO 不重复、模式属于白名单，并要求“每转步数”为正整数；移动要求步数为整数且 RPM 为正数。同名控制器重新初始化前会关闭旧资源，程序退出时也会自动执行清理。

“每转步数”是当前全步或半步序列下实际需要发送的序列步数，必须结合电机步距角、减速比和模式设置。例如某些 28BYJ-48 组合的标称值与实际减速比存在差异，应根据硬件资料或校准结果填写。角度与位置都是开环命令值，堵转、丢步和齿隙不会被检测。

## 必须使用外部驱动器

**GPIO 只能连接 ULN2003、H 桥或其他兼容驱动器的逻辑输入，绝不能直接连接或驱动电机线圈。**电机电源必须满足线圈电压和峰值电流要求；驱动器、外部电源和单板机通常需要共地。GPIO 是 3.3V 逻辑，应确认驱动器输入兼容。

软件逐步时序受 Linux 调度影响，适合低速教育、原型和轻负载场景，不是实时运动控制器。过高 RPM 可能导致抖动、失步或电机不转。需要加减速、精准同步、限位或高转速时应使用专用步进驱动芯片/控制器。

本包不会安装 gpiozero、配置 GPIO backend、修改设备权限或系统启动配置。

GPIO 输出 API 依据：[gpiozero OutputDevice 文档](https://gpiozero.readthedocs.io/en/stable/api_output.html)。
