# @aily-project/lib-adafruit-blinka

Curated Adafruit Blinka integration for the standalone CPython generator at `globalThis.Python`.

This runs on standard Raspberry Pi OS/Linux CPython. It is not MicroPython and does not require CircuitPython firmware.

- Imports are selected by callable: `board` for `I2C`/`SPI` and pin constants, `digitalio` for `DigitalInOut`, `pwmio` for `PWMOut`, and `busio` for `UART`.
- Install on target: `python3 -m pip install Adafruit-Blinka`
- Blocks (5): `python_adafruit_blinka_call`, `python_adafruit_blinka_do`, `python_adafruit_blinka_method`, `python_adafruit_blinka_do_method`, `python_adafruit_blinka_attribute`
- Allowlisted callables: `I2C`, `SPI`, `DigitalInOut`, `PWMOut`, `UART`
- Allowlisted methods: `try_lock`, `unlock`, `scan`, `readfrom_into`, `writeto`, `writeto_then_readfrom`, `configure`, `switch_to_input`, `switch_to_output`, `read`, `readinto`, `write`, `deinit`
- Allowlisted attributes: `D0`, `D1`, `D2`, `D3`, `D4`, `D5`, `D6`, `D17`, `D18`, `SCL`, `SDA`, `SCLK`, `MOSI`, `MISO`, `CE0`, `CE1`, `PB5`, `PB4`, `PB6`, `PB0`, `PB1`, `PB13`, `PB14`, `PI12`, `PI11`, `PI10`, `PI9`, `PI4`, `PI5`, `PI7`, `PI3`, `PI2`, `PI6`, `PI16`, `PI15`, `PL6`, `PL5`, `PI14`, `PL4`, `PL2`, `PI13`, `PL3`, `PI0`, `PI1`, `LED`, `KEY`, `value`, `direction`, `pull`, `duty_cycle`, `frequency`, `in_waiting`
- API source: https://learn.adafruit.com/circuitpython-on-raspberrypi-linux

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.

## WalnutPi 2B CPython runtime

The official WalnutPi 2B Python path uses Blinka. The attribute block includes the onboard `LED` and `KEY` plus the PB/PI/PL names from the board 40-pin map; for example, `board.PB6` can be passed to `DigitalInOut`. Configure pin multiplexing and device permissions separately for I2C, SPI, UART, and PWM.

WalnutPi pin allowlist: `PB5`, `PB4`, `PB6`, `PB0`, `PB1`, `PB13`, `PB14`, `PI12`, `PI11`, `PI10`, `PI9`, `PI4`, `PI5`, `PI7`, `PI3`, `PI2`, `PI6`, `PI16`, `PI15`, `PL6`, `PL5`, `PI14`, `PL4`, `PL2`, `PI13`, `PL3`, `PI0`, `PI1`, `LED`, `KEY`.
## Raspberry Pi 5B CPython runtime

This package is the compatibility layer that brings CircuitPython hardware APIs to Linux CPython.

The generator uses per-callable imports and a fixed mapping: `board.I2C`, `board.SPI`, `digitalio.DigitalInOut`, `pwmio.PWMOut`, and `busio.UART`. Connected attribute objects are preserved; an empty object socket falls back to the aliased `board` module for pin constants.

Use current 64-bit Raspberry Pi OS as the primary path. On Bookworm and Trixie, create a virtual environment that can see APT-provided hardware bindings:

```sh
sudo apt install python3-venv python3-libgpiod python3-lgpio i2c-tools
python3 -m venv .venv --system-site-packages
. .venv/bin/activate
python3 -m pip install --upgrade Adafruit-Blinka
```

Enable the required I2C/SPI interface and verify access to the matching `/dev/i2c-*`, `/dev/spidev*`, GPIO, or PIO device. Do not use `--break-system-packages`; this library never edits `/boot/firmware/config.txt`, udev rules, or group membership.
