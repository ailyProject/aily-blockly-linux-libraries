# @aily-project/lib-neopixel

Curated CircuitPython NeoPixel integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import neopixel as _python_lib_neopixel`
- Install on target: `python3 -m pip install adafruit-circuitpython-neopixel`
- Blocks (5): `python_neopixel_call`, `python_neopixel_do`, `python_neopixel_method`, `python_neopixel_do_method`, `python_neopixel_attribute`
- Allowlisted callables: `NeoPixel`
- Allowlisted methods: `fill`, `show`, `deinit`
- Allowlisted attributes: `brightness`, `auto_write`, `n`, `bpp`
- API source: https://docs.circuitpython.org/projects/neopixel/en/latest/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

Compatibility note: Raspberry Pi 5 requires a supported SPI or PIO backend and the matching device permissions.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.

## Raspberry Pi 5B CPython runtime

Although the PyPI name contains `circuitpython`, this package runs under standard Raspberry Pi OS/Linux CPython through Blinka. It is not MicroPython and does not require CircuitPython firmware.

Use current 64-bit Raspberry Pi OS as the primary path. On Bookworm and Trixie, create a virtual environment that can see APT-provided hardware bindings:

```sh
sudo apt install python3-venv python3-libgpiod python3-lgpio i2c-tools
python3 -m venv .venv --system-site-packages
. .venv/bin/activate
python3 -m pip install --upgrade Adafruit-Blinka adafruit-circuitpython-neopixel
```

Enable the required I2C/SPI interface and verify access to the matching `/dev/i2c-*`, `/dev/spidev*`, GPIO, or PIO device. Do not use `--break-system-packages`; this library never edits `/boot/firmware/config.txt`, udev rules, or group membership.

Support level: conditional. Raspberry Pi 5 requires the current PIO backend and `/dev/pio0` permissions, or an SPI fallback that reserves the SPI bus. Do not use the legacy RPi.GPIO/rpi_ws281x direct-write path.
