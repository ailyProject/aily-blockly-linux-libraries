# GPIO / LED / PWM

`@aily-project/lib-cybercam-gpio` 是 01Studio CyberCAM K230 的板级 GPIO、板载 LED/按键和 PWM 功能库。它从原 `@aily-project/lib-cybercam` 原样接收 12 个既有 block type，避免通用 Linux GPIO 库掩盖 CyberCAM 固定引脚与 K230 PWM 通道语义。

## 积木

- GPIO：`cybercam_gpio_init`、`cybercam_gpio_write`、`cybercam_gpio_read`、`cybercam_gpio_deinit`
- 板载器件：`cybercam_led_write`、`cybercam_key_pressed`
- PWM：`cybercam_pwm_init`、`cybercam_pwm_frequency`、`cybercam_pwm_duty`、`cybercam_pwm_enable`、`cybercam_pwm_disable`、`cybercam_pwm_close`

已有工程不需要重命名这些积木，但拆分后必须安装本包。不要同时加载仍包含上述 12 个定义的旧聚合版 `@aily-project/lib-cybercam`，否则会重复注册 Blockly block 和 Python generator handler。

## 运行时与硬件边界

- GPIO 生成代码使用 CyberCAM 镜像提供的 `board` 与 `digitalio` 模块。已选择的 11、12、21、46、47、52 分别映射到 `board.TX2`、`board.RX2`、`board.KEY`、`board.LIGHT`、`board.BEEP`、`board.LED`；其余已由板卡 profile 提供的数字引脚映射到 `board.IO<n>`。本包不扩展 `${board.digitalPins}`，也不生成 Blinka 中不存在的 `board.IO11`、`board.IO12`、`board.IO46` 或 `board.IO47`。
- TX2/RX2 同时是 CyberCAM UART2 引脚。新串口工程使用 `@aily-project/lib-serial` 工具箱可见的 6 个 `linux_uart_*` type，并将 `DEVICE` 固定为 `/dev/ttyS2`；6 个 `cybercam_uart_*` 仅在该包中隐藏注册以兼容旧工作区。UART2 工作时不要同时将 TX2/RX2 初始化为 GPIO。
- 板载按键使用上拉输入并按低电平有效处理。
- PWM 生成代码使用 `python-periphery` 的 `PWM(chip, channel)`，暴露 GPIO60/PWM0、GPIO61/PWM1、补光灯/PWM2、蜂鸣器/PWM3 和背光/PWM5 的固定映射。
- K230 的 PWM0/PWM1/PWM2 共用一个频率，PWM3/PWM4/PWM5 共用另一个频率，不能为同组通道设置彼此独立的频率。CyberCAM 系统默认以 PWM5 驱动背光，因此 PWM3 蜂鸣器无法在保持默认背光的同时独立使用硬件 PWM；调整 PWM3 的频率会与 PWM5 背光的频率要求冲突。
- GPIO 对象通过 `deinit()` 释放，PWM 对象通过 `close()` 释放。生成器也会在支持 cleanup 的运行时登记兜底清理。
- `@aily-project/lib-gpio` 基于 `gpiozero` 和普通 Linux GPIO 编号，不可替代本包。

项目级 `package.json` 必须设置 `"devmode": "python"`，编辑器构建也必须包含 aily CPython generator runtime。npm 安装本 Blockly 包不会为目标镜像安装 `board`、`digitalio` 或 `python-periphery`，也不会修改设备权限。

## Library Info

| Field | Value |
|---|---|
| Package | `@aily-project/lib-cybercam-gpio` |
| Version | 0.0.1 |
| Blocks | 12 |
| Board | 01Studio CyberCAM K230 (Python mode) |
| Author | ailyProject; hardware APIs by 01Studio |
| License | MIT |

实现依据：[GPIO 引脚说明](https://wiki.01studio.cc/docs/cybercam/basic_examples/gpio_intro/)、[Python GPIO](https://wiki.01studio.cc/docs/cybercam/basic_examples/gpio_python/)、[板载 LED](https://wiki.01studio.cc/docs/cybercam/basic_examples/led/)、[板载按键](https://wiki.01studio.cc/docs/cybercam/basic_examples/key/)、[PWM 补光灯](https://wiki.01studio.cc/docs/cybercam/basic_examples/pwm_light/)与固定版本的 [CyberCAM Blinka board 映射](https://github.com/walnutpi/Adafruit_Blinka/blob/11c5135a68889d3627a6a7cf4087aab2cf1e24b9/src/adafruit_blinka/board/walnutpi/cybercam.py)。完整证据与非重复边界见 `API-COVERAGE.md`。
