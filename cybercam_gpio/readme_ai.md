# @aily-project/lib-cybercam-gpio

CyberCAM K230-specific GPIO, onboard LED/key, and PWM package.

Version: 0.0.1

Runtime: standalone CPython generator at `globalThis.Python`

Target: `canaan:k230:cybercam`

Blocks (12): `cybercam_gpio_init`, `cybercam_gpio_write`, `cybercam_gpio_read`, `cybercam_gpio_deinit`, `cybercam_led_write`, `cybercam_key_pressed`, `cybercam_pwm_init`, `cybercam_pwm_frequency`, `cybercam_pwm_duty`, `cybercam_pwm_enable`, `cybercam_pwm_disable`, `cybercam_pwm_close`.

All 12 types moved unchanged from `@aily-project/lib-cybercam`. Existing workspaces keep their serialized type strings, input names, dropdown machine values, and toolbox defaults; they add this package after the split. Do not load it beside an older aggregate `lib-cybercam` release that still registers these types.

GPIO uses the CyberCAM image's `board` and `digitalio` modules. Selected pin values 11, 12, 21, 46, 47, and 52 map to `board.TX2`, `board.RX2`, `board.KEY`, `board.LIGHT`, `board.BEEP`, and `board.LED`; other pins already supplied by the board profile map to `board.IO<n>`. Do not expand `${board.digitalPins}` or generate nonexistent `board.IO11`, `board.IO12`, `board.IO46`, or `board.IO47`. The onboard key is pull-up and active-low. Digital resources use `deinit()`.

TX2 and RX2 are also the CyberCAM UART2 pins. New serial projects use the six toolbox-visible `linux_uart_*` types from `@aily-project/lib-serial` and must set `DEVICE` to `/dev/ttyS2`; its six `cybercam_uart_*` definitions are hidden and exist only to deserialize legacy workspaces. Do not initialize TX2/RX2 as GPIO while UART2 is in use.

PWM uses `periphery.PWM(chip, channel)` with fixed K230 targets: GPIO60/PWM0 `(0,0)`, GPIO61/PWM1 `(0,1)`, fill light/PWM2 `(0,2)`, buzzer/PWM3 `(1,0)`, and backlight/PWM5 `(1,2)`. PWM0/1/2 share one frequency and PWM3/4/5 share another, so channels in a group cannot have independent frequencies. The CyberCAM system uses PWM5 for the default display backlight; consequently PWM3 cannot independently drive the buzzer with hardware PWM while that backlight remains in use. PWM resources use `close()`.

Do not substitute the generic `linux_*` GPIO blocks: `@aily-project/lib-gpio` uses gpiozero and ordinary Linux pin numbering rather than CyberCAM board objects and K230 PWM chip/channel pairs. Installing this Blockly package does not provision target Python modules or device permissions.

The authoritative pin aliases are recorded in the commit-pinned CyberCAM Blinka board definition linked from `API-COVERAGE.md`. See that file for official lesson mapping and exclusions.
