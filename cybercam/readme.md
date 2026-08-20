# CyberCAM Python

01Studio CyberCAM K230-only Python blocks. Camera, display, KPU, GPIO, PWM, UART, audio, and IMU use CanMV/`walnutpi` APIs, not generic CPython. Portable language, OpenCV, network, and file blocks stay here so CyberCAM projects remain self-contained.

Do not install this library on Raspberry Pi or independent WalnutPi Linux boards. Those boards use `@aily-project/lib-python-core` and `@aily-project/lib-linux-python`.

## Library Info

| Field | Value |
|-------|-------|
| Package | @aily-project/lib-cybercam |
| Version | 1.0.0 |
| Author | ailyProject; hardware APIs by 01Studio |
| Source | https://github.com/01studio-lab/01studio_wiki/tree/main/docs/cybercam |
| License | MIT |

## Supported Boards

01Studio CyberCAM K230 (Python mode)

## Description

Library covers verified Python contracts rather than every physical hardware feature. Network protocol blocks operate over an already configured network. Touch, Wi-Fi management, Bluetooth, generic I2C, SPI, GPIO interrupts, and ADC remain excluded pending verified executable CyberCAM Python APIs.

## Quick Start

1. Enable `@aily-project/lib-cybercam` in Aily Blockly.
2. Place initialization blocks under `cybercam_start`, then place capture, processing, and display blocks under `cybercam_forever`.
