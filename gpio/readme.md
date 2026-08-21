# GPIO & PWM

基于 gpiozero 的 Linux GPIO、可配置 LED/按键和 PWM。

- npm 包：`@aily-project/lib-gpio`
- Blockly 积木：17 个（工具箱可见 15 个）
- 运行环境：`devmode: "python"`，并加载独立 CPython generator runtime
- 目标端依赖：gpiozero 与目标板可用的 GPIO backend

npm 安装本 Blockly 包不会安装 `gpiozero`、GPIO backend，也不会修改设备权限。目标系统必须提供可用的 GPIO backend，并允许运行用户访问相应的 GPIO 字符设备（通常为 `/dev/gpiochip*`）；具体用户组与 udev 规则取决于发行版。

## 积木

- `linux_gpio_init`
- `linux_gpio_write`
- `linux_gpio_read`
- `linux_gpio_close`
- `linux_led_init`
- `linux_led_action`
- `linux_led_blink`
- `linux_button_init`
- `linux_button_pressed`
- `linux_button_held`
- `linux_button_wait`
- `linux_pwm_init`
- `linux_pwm_duty`
- `linux_pwm_frequency`
- `linux_pwm_close`

`linux_led_write`（固定 GPIO17）与 `linux_key_pressed`（固定 GPIO27）仅为旧工程兼容而保留，已从工具箱隐藏；Raspberry Pi 并不存在可由这两个编号通用表示的“板载 LED/按键”。新工程应使用可选择引脚的 LED/Button 初始化积木。

没有上下拉电阻的输入会显式设置 gpiozero 所需的 `active_state`；通用 GPIO 读取使用物理引脚状态，不受逻辑有效电平反转。Button 的消抖时间设为 0 表示禁用消抖，等待超时或 LED 闪烁次数设为 0 表示无限等待/持续闪烁。

API 选择依据：[Raspberry Pi 官方 Python GPIO 指南](https://www.raspberrypi.com/documentation/computers/os.html#use-gpio-from-python)与 [GPIO Zero 文档](https://gpiozero.readthedocs.io/en/stable/)。

该库只向 `globalThis.Python.forBlock` 注册生成器；没有 Python runtime 时安全跳过，不会回退到 MPY/MicroPython。
