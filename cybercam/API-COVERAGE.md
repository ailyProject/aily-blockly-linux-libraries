# Onboard Peripherals API Coverage

This inventory defines the base-board boundary of `@aily-project/lib-cybercam` 0.0.1. It exports 10 CyberCAM-specific blocks: 2 ADC, 2 audio, 5 IMU, and 1 identity block. Four existing file block types moved unchanged to `@aily-project/lib-file` and six existing UART block types moved unchanged to `@aily-project/lib-serial` as hidden saved-project compatibility definitions. Twelve existing GPIO/onboard LED/key/PWM block types moved unchanged to `@aily-project/lib-cybercam-gpio`. Twenty-three existing camera/display/KPU block types moved unchanged to `@aily-project/lib-cybercam-cv`; that package adds one new raw camera-read block for a 24-block vision surface.

Durable references used for the hardware review:

- [01Studio CyberCAM GPIO introduction](https://wiki.01studio.cc/docs/cybercam/basic_examples/gpio_intro/)
- [Canaan K230 Linux ADC/IIO guide](https://www.kendryte.com/k230_linux/en/main/app_develop_guide/driver/adc.html)
- [01Studio CyberCAM machine-vision category](https://wiki.01studio.cc/docs/category/%E6%9C%BA%E5%99%A8%E8%A7%86%E8%A7%89-2/)
- [`lib-cybercam-gpio` evidence and coverage](../cybercam_gpio/API-COVERAGE.md)
- [`lib-cybercam-cv` evidence and coverage](../cybercam_cv/API-COVERAGE.md)

## Official Wiki lesson areas

| Lesson area | Retained CyberCAM coverage | Delegated coverage |
|---|---|---|
| Basic examples | K230 IIO ADC0/1 | UART uses `@aily-project/lib-serial` with `/dev/ttyS2`; GPIO, onboard LED/key, and K230 PWM use `@aily-project/lib-cybercam-gpio`; language primitives use `@aily-project/lib-core`; files use `@aily-project/lib-file`; commands use `@aily-project/lib-filesystem` |
| Machine vision | None in the base package | CyberCAM `walnutpi.Sensor`/display/KPU uses `@aily-project/lib-cybercam-cv`; portable OpenCV, drawing, QR/barcode, and AprilTag use `@aily-project/lib-vision` |
| Network | None; CyberCAM has no platform-specific protocol wrapper | Socket and the standard-library HTTP file server use `@aily-project/lib-network`; MQTT uses `@aily-project/lib-paho-mqtt`; Requests HTTP clients use `@aily-project/lib-requests` |
| OS and software | K230 ALSA devices, QMI8658 IMU, and K230 chip ID | CPU temperature and generic system commands use `@aily-project/lib-filesystem`; standard file operations use `@aily-project/lib-file` |
| Sensor modules | None in the base package | GPIO operations use the CyberCAM `board`/`digitalio` mappings in `@aily-project/lib-cybercam-gpio`; portable program structure and values use `@aily-project/lib-core` |

The generic vision package is CyberCAM-compatible and now provides 32 `python_*` image-processing, contour, drawing, and code-recognition blocks (including the 14 types originally migrated from the aggregate CyberCAM package). Four `linux_camera_*` blocks for ordinary V4L2 devices live in the separate Linux-only `@aily-project/lib-camera` package and are not interchangeable with CyberCAM CSI capture. CSI camera blocks now belong to `@aily-project/lib-cybercam-cv`.

CyberCAM `board`/`digitalio` mappings and fixed K230 PWM chip/channel pairs belong to `@aily-project/lib-cybercam-gpio`. UART belongs to the generic pyserial-based `@aily-project/lib-serial`: its hidden legacy definitions preserve the six old `cybercam_uart_*` types, while new projects use `linux_uart_*` and explicitly select `/dev/ttyS2`. Standard file operations belong to `@aily-project/lib-file`: its hidden legacy definitions preserve the four old `cybercam_file_*` types, while new projects use `python_file_*`. The base package retains the named K230 ALSA devices but no longer declares UART or file blocks.

## Moved UART contract

The migrated UART surface is exactly `cybercam_uart_init`, `cybercam_uart_available`, `cybercam_uart_read`, `cybercam_uart_write`, `cybercam_uart_flush`, and `cybercam_uart_close`. Their serialized block type strings and existing fields are preserved in `@aily-project/lib-serial`; they remain registered only for saved-project compatibility and do not appear in its toolbox.

Existing projects that use these types must add `@aily-project/lib-serial` without renaming the blocks. New projects use the corresponding six `linux_uart_*` blocks and set the init device to `/dev/ttyS2`. Loading the new serial package beside an older aggregate `lib-cybercam` release that still registers the same six `cybercam_uart_*` types is unsupported because block definitions and generator handlers would collide.

## Moved file contract

The migrated file surface is exactly `cybercam_file_read`, `cybercam_file_write`, `cybercam_file_exists`, and `cybercam_file_list`. Their serialized block type strings and existing fields are preserved in `@aily-project/lib-file`; they remain registered only for saved-project compatibility and do not appear in its toolbox.

Existing projects that use these types must add `@aily-project/lib-file` without renaming the blocks. New projects use the corresponding four `python_file_*` blocks. Loading the new file package beside an older aggregate `lib-cybercam` release that still registers the same four `cybercam_file_*` types, or beside an older `lib-python-core` release that still registers the same four `python_file_*` types, is unsupported because block definitions and generator handlers would collide.

## Moved GPIO contract

The migrated GPIO surface is exactly four `cybercam_gpio_*` types, `cybercam_led_write`, `cybercam_key_pressed`, and six `cybercam_pwm_*` types. Their block type strings, existing inputs, toolbox defaults, and dropdown machine values are preserved in `@aily-project/lib-cybercam-gpio`; they are no longer declared or registered by this base package.

Existing projects that use any of the 12 migrated types must add `@aily-project/lib-cybercam-gpio`. Loading it beside an older aggregate `lib-cybercam` release that still owns the same types is unsupported because block definitions and generator handlers would collide. The generic gpiozero library does not replace the CyberCAM-specific runtime contract.

## Moved machine-vision contract

The migrated surface is exactly 11 camera/display types and 12 KPU/result types. Their block type strings, existing inputs, and dropdown machine values are preserved in `@aily-project/lib-cybercam-cv`; they are no longer declared or registered by this base package. The new package's coverage file records the camera/display pages, all current KPU wiki subpages, supplemental official CyberCAM-Apps evidence, result fields, and the generic-vision non-duplication boundary.

Existing projects that use any migrated type must add `@aily-project/lib-cybercam-cv`. Loading it beside an older aggregate `lib-cybercam` release that still owns those same 23 types is unsupported because block definitions and generator handlers would collide.

## Evidence-based exclusions

| Excluded capability | Reason |
|---|---|
| Product introduction, assembly, downloads, updates, IDE setup, model training, and app packaging | Documentation or UI/administrative workflow, not a stable runtime API |
| Touch, Wi-Fi management, Bluetooth, generic I2C, SPI, and GPIO interrupts | No stable, verified executable CyberCAM Python contract in the reference snapshot |
| Camera/display/KPU APIs and additional `walnutpi.kpu` names | Owned and evidence-gated by `@aily-project/lib-cybercam-cv`, not the base package |
| Generic language, OpenCV, networking, files, commands, and CPU temperature wrappers | Available from focused functional libraries and therefore outside the CyberCAM base-package boundary |

This boundary keeps the base package tied to CyberCAM ADC, audio, IMU, and identity behavior while allowing file operations, UART, GPIO/PWM, machine vision, and portable functionality to evolve in their owning libraries.

## ADC evidence and runtime boundary

`cybercam_adc_read_raw` and `cybercam_adc_read_voltage` follow Canaan's K230 Linux IIO sysfs contract. They expose only the CyberCAM ADC0/ADC1 rear pads documented by 01Studio, not all six chip channels. The driver is located dynamically because IIO device numbers can vary. Raw values are 12-bit (0-4095); 3.6 V is the board's nominal external full scale, while the K230 pin itself is 1.8 V behind board-level division. The current Canaan page documents the development branch, so an older CyberCAM image may not register the ADC and will receive an explicit runtime error. Precision voltage readings require user calibration.
