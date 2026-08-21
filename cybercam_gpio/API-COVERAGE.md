# GPIO / LED / PWM API Coverage

This inventory defines the evidence and ownership boundary of `@aily-project/lib-cybercam-gpio` 0.0.1. The package owns 12 existing CyberCAM-specific block types moved unchanged from `@aily-project/lib-cybercam`: four general GPIO lifecycle blocks, two fixed onboard-device blocks, and six K230 PWM lifecycle blocks.

Primary official sources:

- [CyberCAM GPIO introduction and pin mapping](https://wiki.01studio.cc/docs/cybercam/basic_examples/gpio_intro/)
- [CyberCAM Python GPIO example](https://wiki.01studio.cc/docs/cybercam/basic_examples/gpio_python/)
- [CyberCAM onboard LED example](https://wiki.01studio.cc/docs/cybercam/basic_examples/led/)
- [CyberCAM onboard key example](https://wiki.01studio.cc/docs/cybercam/basic_examples/key/)
- [CyberCAM PWM fill-light example](https://wiki.01studio.cc/docs/cybercam/basic_examples/pwm_light/)
- [Commit-pinned CyberCAM Blinka board mapping](https://github.com/walnutpi/Adafruit_Blinka/blob/11c5135a68889d3627a6a7cf4087aab2cf1e24b9/src/adafruit_blinka/board/walnutpi/cybercam.py)

## Owned block surface

| Capability | Count | Block types and generated contract |
|---|---:|---|
| Digital GPIO lifecycle | 4 | `cybercam_gpio_init`, `cybercam_gpio_write`, `cybercam_gpio_read`, `cybercam_gpio_deinit`; `board.IO<n>` with `DigitalInOut`, `Direction`, `Pull`, `.value`, and `.deinit()` |
| Onboard devices | 2 | `cybercam_led_write` uses `board.LED`; `cybercam_key_pressed` uses pull-up `board.KEY` and returns the inverted value because the key is active-low |
| K230 PWM lifecycle | 6 | `cybercam_pwm_init`, `cybercam_pwm_frequency`, `cybercam_pwm_duty`, `cybercam_pwm_enable`, `cybercam_pwm_disable`, `cybercam_pwm_close`; `periphery.PWM(chip, channel)` with property/method operations |
| **Total** | **12** | Existing serialized type strings and field contracts are preserved |

The PWM target machine values remain `(0,0)` for GPIO60/PWM0, `(0,1)` for GPIO61/PWM1, `(0,2)` for fill light/PWM2, `(1,0)` for buzzer/PWM3, and `(1,2)` for display backlight/PWM5. These values are hardware identifiers rather than translated display text and must not change across locales.

The Blinka board module exports IO14/15/16/17/60/61 directly, while UART2, key, light, buzzer, and LED pins are exported through the aliases `TX2`, `RX2`, `KEY`, `LIGHT`, `BEEP`, and `LED`. The generator therefore maps selected pin values 11, 12, 21, 46, 47, and 52 to those names and uses `board.IO<n>` only for the remaining board-profile choices. The library does not expand `${board.digitalPins}` or assume nonexistent `board.IO11`, `board.IO12`, `board.IO46`, or `board.IO47` attributes.

TX2/RX2 are shared with CyberCAM UART2. Serial ownership belongs to `@aily-project/lib-serial`: new projects use its six toolbox-visible `linux_uart_*` types and must set `DEVICE` to `/dev/ttyS2`; the six `cybercam_uart_*` definitions are hidden compatibility registrations for legacy serialized workspaces only. GPIO and UART2 must not claim TX2/RX2 concurrently.

K230 PWM0/PWM1/PWM2 share one frequency, and PWM3/PWM4/PWM5 share another frequency. Frequency assignments are therefore group-wide hardware constraints rather than independent per-channel settings. The CyberCAM system uses PWM5 for the default display backlight, so PWM3 cannot independently use hardware PWM for the buzzer while the default PWM5 backlight remains active; changing PWM3 frequency conflicts with the backlight group's frequency.

## Split and non-duplication boundary

| Capability | Owning package or status | Reason |
|---|---|---|
| CyberCAM digital GPIO, onboard LED/key, and fixed K230 PWM targets | `@aily-project/lib-cybercam-gpio` | Board modules and chip/channel mappings are CyberCAM-specific |
| K230 IIO ADC0/ADC1 | `@aily-project/lib-cybercam` | ADC uses the Linux IIO sysfs contract, not `digitalio` or `periphery.PWM` |
| CyberCAM UART2 (`/dev/ttyS2`) | `@aily-project/lib-serial` | New projects use six visible `linux_uart_*` types; six `cybercam_uart_*` definitions are hidden solely for legacy-workspace compatibility |
| K230 ALSA audio, QMI8658 IMU, and chip ID | `@aily-project/lib-cybercam` | Together with ADC, these form the ten-block base CyberCAM package |
| Portable GPIO, configurable LED/button, and software PWM | `@aily-project/lib-gpio` | gpiozero and ordinary Linux pin numbering are not interchangeable with CyberCAM APIs |
| CSI camera, onboard display, and KPU | `@aily-project/lib-cybercam-cv` | Machine-vision hardware and runtime are maintained separately |
| Generic I2C, SPI, interrupts, and pin-multiplexing setup | Not claimed here | The supplied lessons do not establish a complete stable Blockly/runtime contract for these capabilities |

Existing projects keep the 12 block type strings, field names, dropdown machine values, and defaults. They must add `@aily-project/lib-cybercam-gpio` after the split. Loading this package together with an older aggregate `@aily-project/lib-cybercam` version that still defines the same types is unsupported because Blockly definitions and `Python.forBlock` handlers would collide.

The updated serial package owns the hidden handlers for the six legacy `cybercam_uart_*` types. Do not load it together with an older base CyberCAM release that still registers those UART definitions and generator handlers.

The generated program requires the aily CPython generator runtime and a CyberCAM image that provides compatible `board`, `digitalio`, and `periphery` modules. Package installation does not provision target modules, enable kernel interfaces, or grant device permissions.
