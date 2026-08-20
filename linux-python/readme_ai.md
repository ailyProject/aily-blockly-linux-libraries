# Linux Python Hardware

gpiozero, pyserial, OpenCV VideoCapture, and ALSA blocks for Raspberry Pi and WalnutPi Linux. Not CyberCAM CanMV.

## Library Info
- **Name**: @aily-project/lib-linux-python
- **Version**: 1.0.0

## Block Definitions

| Block Type | Connection | Parameters | ABS Format |
|------------|------------|------------|------------|
| `linux_gpio_init` | Statement | NAME, PIN, DIRECTION, PULL | `linux_gpio_init("pin", PIN, OUTPUT, NONE)` |
| `linux_gpio_write` | Statement | NAME, VALUE | `linux_gpio_write("pin", logic_boolean(TRUE))` |
| `linux_gpio_read` | Value | NAME | `linux_gpio_read("pin")` |
| `linux_gpio_close` | Statement | NAME | `linux_gpio_close("pin")` |
| `linux_led_write` | Statement | VALUE | `linux_led_write(logic_boolean(TRUE))` |
| `linux_key_pressed` | Value | (none) | `linux_key_pressed()` |
| `linux_pwm_init` | Statement | NAME, PIN, FREQUENCY | `linux_pwm_init("pwm", PIN, 1000)` |
| `linux_pwm_duty` | Statement | NAME, DUTY | `linux_pwm_duty("pwm", 0.5)` |
| `linux_pwm_close` | Statement | NAME | `linux_pwm_close("pwm")` |
| `linux_uart_init` | Statement | NAME, DEVICE, BAUD | `linux_uart_init("uart", "/dev/serial0", 115200)` |
| `linux_uart_available` | Value | NAME | `linux_uart_available("uart")` |
| `linux_uart_read` | Value | NAME, SIZE | `linux_uart_read("uart", 1)` |
| `linux_uart_write` | Statement | NAME, DATA | `linux_uart_write("uart", data)` |
| `linux_uart_flush` | Statement | NAME | `linux_uart_flush("uart")` |
| `linux_uart_close` | Statement | NAME | `linux_uart_close("uart")` |
| `linux_camera_init` | Statement | NAME, DEVICE, WIDTH, HEIGHT | `linux_camera_init("camera", "/dev/video0", 640, 480)` |
| `linux_camera_opened` | Value | NAME | `linux_camera_opened("camera")` |
| `linux_camera_read` | Value | NAME | `linux_camera_read("camera")` |
| `linux_camera_release` | Statement | NAME | `linux_camera_release("camera")` |
| `linux_audio_play` | Statement | PATH | `linux_audio_play(text("/tmp/audio.wav"))` |
| `linux_audio_record` | Statement | PATH, SECONDS, RATE | `linux_audio_record(path, 5, 16000)` |

## Notes

Use with `@aily-project/lib-python-core`. Do not mix with `@aily-project/lib-cybercam`.
