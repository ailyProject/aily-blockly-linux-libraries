# Python Core

Portable CPython blocks for language primitives, OpenCV, QR/barcode/AprilTag, socket/MQTT/HTTP, files, and system commands.

This library is **not** a hardware board library. It does not generate GPIO, PWM, UART, camera, display, KPU, audio, or IMU code.

## Library Info

| Field | Value |
| --- | --- |
| Package | @aily-project/lib-python-core |
| Version | 1.0.0 |
| Compatibility | `spec: true`; visible on CyberCAM, Raspberry Pi, WalnutPi, and WalnutPi Serial |
| License | MIT |

## What this library covers

- Program lifecycle: `python_start`, `python_forever`, sleep, print
- Language primitives: number, text, boolean, tuple, list, variables, `if`, `for each`
- OpenCV image load/save, convert, mask, connected components, drawing
- `pyzbar` QR and barcode decode, `pupil_apriltags` detector
- `socket`, Paho MQTT, `requests`, and `http.server`
- UTF-8 text files, directory listing, `os.popen`, Linux thermal-zone CPU temperature

## What stays out

| Capability | Why it is not here |
| --- | --- |
| GPIO / PWM / UART | Raspberry Pi and WalnutPi use `gpiozero`/`pyserial`; CyberCAM uses `board`/`digitalio`/`periphery` |
| Camera / display | CyberCAM uses `walnutpi.Sensor`/`Display`; Linux boards use OpenCV `VideoCapture` |
| KPU AI | `walnutpi.kpu` exists only on CyberCAM CanMV |
| Audio / IMU | CyberCAM uses `K230I2SINNO` and QMI8658; Linux boards use ALSA/`gpiozero` |

Use `@aily-project/lib-linux-python` on Raspberry Pi and WalnutPi. Use `@aily-project/lib-cybercam` on CyberCAM.

## Quick Start

1. Enable `@aily-project/lib-python-core` in a Python project.
2. Place initialization under `python_start`, then looping work under `python_forever`.
