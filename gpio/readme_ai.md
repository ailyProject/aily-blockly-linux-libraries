# @aily-project/lib-gpio

Linux GPIO, configurable LED/Button, and PWM using gpiozero.
Blocks (17): linux_gpio_init, linux_gpio_write, linux_gpio_read, linux_gpio_close, linux_led_init, linux_led_action, linux_led_blink, linux_button_init, linux_button_pressed, linux_button_held, linux_button_wait, linux_led_write, linux_key_pressed, linux_pwm_init, linux_pwm_duty, linux_pwm_frequency, linux_pwm_close.
Toolbox-visible blocks: 15. `linux_led_write` (fixed GPIO17) and `linux_key_pressed` (fixed GPIO27) remain registered only for saved-project compatibility and must not be presented as onboard devices.
`linux_gpio_read` emits the physical pin state. Pull-free input initialization supplies gpiozero's required `active_state`. A zero blink count means forever; zero debounce/timeout means disabled/no timeout respectively.
Target dependencies: gpiozero 与目标板可用的 GPIO backend.
Installing the npm package does not install gpiozero or a GPIO backend and does not grant access to `/dev/gpiochip*`; target provisioning and device permissions are external requirements.
Requires the standalone CPython generator at globalThis.Python; block type names are migration-stable.
