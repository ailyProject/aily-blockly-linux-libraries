# Onboard Peripherals

Package: `@aily-project/lib-cybercam`

Version: 0.0.1

Runtime: standalone CPython generator at `globalThis.Python`

Target: `canaan:k230:cybercam`

This base package exports 10 CyberCAM platform blocks: 2 ADC, 2 audio, 5 IMU, and 1 chip-ID block. The functional split removed 52 generic blocks, moved 4 existing file types unchanged to `@aily-project/lib-file` and 6 existing UART types unchanged to `@aily-project/lib-serial` as hidden saved-project compatibility definitions, moved 12 existing GPIO/onboard LED/key/PWM types unchanged to `@aily-project/lib-cybercam-gpio`, and moved 23 existing camera/display/KPU types unchanged to `@aily-project/lib-cybercam-cv`. The vision package adds `cybercam_camera_read_raw`, so it contains 24 blocks in total.

## Retained block surface

### ADC (2)

`cybercam_adc_read_raw`, `cybercam_adc_read_voltage`.

These blocks retain the CyberCAM-specific IIO ADC pads. ADC0/ADC1 return 12-bit raw values; voltage conversion defaults to the board's nominal 3.6 V full scale. ADC requires a CyberCAM image whose device tree registers the K230 ADC, and precision measurements require calibration.

### Audio, IMU, and device identity (8)

`cybercam_audio_play`, `cybercam_audio_record`, `cybercam_imu_init`, `cybercam_imu_read`, `cybercam_imu_axis`, `cybercam_imu_calibrate`, `cybercam_imu_close`, `cybercam_chip_id`.

Audio uses the fixed K230 ALSA devices. IMU blocks contain the CyberCAM QMI8658 driver. Chip ID reads the K230 device path.

## Moved UART surface

The following 6 existing types now belong to `@aily-project/lib-serial` and retain their serialized identity: `cybercam_uart_init`, `cybercam_uart_available`, `cybercam_uart_read`, `cybercam_uart_write`, `cybercam_uart_flush`, and `cybercam_uart_close`. They remain registered only as hidden saved-project compatibility definitions and are not presented in the toolbox.

Existing projects add `@aily-project/lib-serial` without renaming these blocks. New projects use `linux_uart_init`, `linux_uart_available`, `linux_uart_read`, `linux_uart_write`, `linux_uart_flush`, and `linux_uart_close`; the init block must explicitly select `/dev/ttyS2` on CyberCAM. Do not load the new serial package beside an older aggregate `lib-cybercam` release that still registers the same 6 `cybercam_uart_*` types, because Blockly definitions and `Python.forBlock` handlers would collide.

## Moved file surface

The following 4 existing types now belong to `@aily-project/lib-file` and retain their serialized identity: `cybercam_file_read`, `cybercam_file_write`, `cybercam_file_exists`, and `cybercam_file_list`. They remain registered only as hidden saved-project compatibility definitions and are not presented in the toolbox.

Existing projects add `@aily-project/lib-file` without renaming these blocks. New projects use the toolbox-visible `python_file_read`, `python_file_write`, `python_file_exists`, and `python_file_list`. Do not load the new file package beside an older aggregate `lib-cybercam` release that still registers the same 4 `cybercam_file_*` types, or beside an older `lib-python-core` release that still registers the same 4 `python_file_*` types, because Blockly definitions and `Python.forBlock` handlers would collide.

## Moved GPIO surface

The following 12 existing types now belong to `@aily-project/lib-cybercam-gpio` and retain their serialized identity:

- Digital GPIO (4): `cybercam_gpio_init`, `cybercam_gpio_write`, `cybercam_gpio_read`, `cybercam_gpio_deinit`.
- Onboard resources (2): `cybercam_led_write`, `cybercam_key_pressed`.
- PWM (6): `cybercam_pwm_init`, `cybercam_pwm_frequency`, `cybercam_pwm_duty`, `cybercam_pwm_enable`, `cybercam_pwm_disable`, `cybercam_pwm_close`.

Existing projects do not rename these blocks; they add `@aily-project/lib-cybercam-gpio`. Do not load the new package beside an older aggregate `lib-cybercam` release that still defines the same 12 types, because Blockly definitions and `Python.forBlock` handlers would collide. The generic gpiozero-based `@aily-project/lib-gpio` is not interchangeable with CyberCAM `board`/`digitalio` and K230 `periphery.PWM` APIs.

## Moved machine-vision surface

The following 23 existing types now belong to `@aily-project/lib-cybercam-cv` and retain their serialized identity:

- Camera/display (11): `cybercam_camera_init`, `cybercam_camera_opened`, `cybercam_camera_read`, `cybercam_camera_hmirror`, `cybercam_camera_vflip`, `cybercam_camera_release`, `cybercam_display_init`, `cybercam_display_rotation`, `cybercam_display_show`, `cybercam_ide_show`, `cybercam_lcd_direction`.
- KPU/results (12): `cybercam_ai_init_simple`, `cybercam_ai_init_face`, `cybercam_ai_init_mask`, `cybercam_ai_init_hand_keypoint`, `cybercam_ai_init_ocr`, `cybercam_ai_init_licence`, `cybercam_ai_run`, `cybercam_ai_run_confidence`, `cybercam_ai_run_thresholds`, `cybercam_result_length`, `cybercam_result_item`, `cybercam_result_property`.

The new vision package also adds `cybercam_camera_read_raw`, which returns the complete `(ret, img)` camera result. Existing projects do not rename migrated blocks; they add the new package. Do not load the new package beside an older aggregate `lib-cybercam` release that still defines the same 23 types.

## Delegated generic blocks

Install only the functional libraries a project needs:

| Removed group | Count | Replacement |
|---|---:|---|
| Python lifecycle, syntax, values, variables, and loops | 13 | `@aily-project/lib-core` |
| OpenCV image operations, drawing, QR/barcode, and AprilTag | 14 | `@aily-project/lib-vision` |
| Socket and standard-library HTTP file server | 10 | `@aily-project/lib-network` |
| MQTT | 7 | `@aily-project/lib-paho-mqtt` |
| Requests HTTP client | 2 migrated legacy types hidden + 22 new public types | `@aily-project/lib-requests` |
| Standard file operations | 4 visible + 4 legacy types hidden | `@aily-project/lib-file` |
| System commands and CPU temperature | 2 | `@aily-project/lib-filesystem` |
| CyberCAM UART | 6 migrated; legacy types hidden | `@aily-project/lib-serial` |
| CyberCAM GPIO, onboard LED/key, and PWM | 12 migrated | `@aily-project/lib-cybercam-gpio` |
| CyberCAM camera, display, and KPU | 23 migrated + 1 new | `@aily-project/lib-cybercam-cv` |

For generic language, vision, network, commands, and CPU-temperature blocks, replacement names use the `python_*` prefix instead of the removed `cybercam_*` names, while input names and dropdown machine values stay aligned. MQTT now belongs to `@aily-project/lib-paho-mqtt`; the two migrated `python_http_*` client types are hidden compatibility definitions in `@aily-project/lib-requests`, while new HTTP client work uses `python_requests_*`. The 4 legacy file types are hidden compatibility definitions and do not require renaming; new file work uses `python_file_*`, whose toolbox defaults are `file.txt` for file paths and `.` for directory listing, while the hidden legacy handlers retain `/data/...` fallbacks. Preserve existing input values during migration: generic image shadows use `/tmp/...` instead of `/data/...`, draw-text content uses `Python` instead of `CyberCAM`, listen backlog uses `1` instead of `0`, and MQTT topics use `/python/data` instead of `/cybercam/data`. The 6 legacy UART types and 23 migrated machine-vision types also retain their `cybercam_*` names; new UART work uses `linux_uart_*` with `/dev/ttyS2`.

## Program structure

Use `python_start` and `python_forever` from `@aily-project/lib-core`. Add this package for ADC/audio/IMU/device identity, `lib-network` for sockets and the standard-library HTTP file server, `lib-paho-mqtt` for MQTT, `lib-requests` for HTTP clients, `lib-file` for standard file operations, `lib-filesystem` for system commands and CPU temperature, `lib-serial` for UART, `lib-cybercam-gpio` for digital IO/onboard LED/key/PWM, `lib-cybercam-cv` for CSI camera/display/KPU, and `lib-vision` for portable OpenCV, drawing, and code recognition. For new CyberCAM UART initialization, use `linux_uart_init` and set its device to `/dev/ttyS2`. Exact fields, dropdown machine values, and defaults are defined by the owning package's `block.json`.
