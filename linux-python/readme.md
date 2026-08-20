# Linux Python Hardware

Shared Raspberry Pi and WalnutPi Linux hardware blocks. Generated code uses `gpiozero`, `pyserial`, OpenCV `VideoCapture`, and ALSA `aplay`/`arecord`.

This library is **not** CyberCAM. Do not install it on `@aily-project/board-cybercam`.

## Library Info

| Field | Value |
| --- | --- |
| Package | @aily-project/lib-linux-python |
| Version | 1.0.0 |
| Compatibility | `spec: true` and `core` lists Raspberry Pi, WalnutPi, and WalnutPi Serial board types |
| License | MIT |

## Blocks

- GPIO / LED / button / PWM via `gpiozero`
- UART via `serial.Serial(device, baud)`
- Camera via `cv2.VideoCapture('/dev/video0')`
- WAV play/record via `aplay` and `arecord`

Pair this library with `@aily-project/lib-python-core` for language, OpenCV image processing, files, and network blocks.
