# @aily-project/lib-adafruit-ads1x15

Curated CircuitPython ADS1x15 integration for the standalone CPython generator at `globalThis.Python`.

- Imports: `adafruit_ads1x15.ads1115` for `ADS1115`, `adafruit_ads1x15.analog_in` for `AnalogIn`, and `adafruit_ads1x15.ads1x15` for `Pin.A0` through `Pin.A3`.
- Install on target: `python3 -m pip install adafruit-circuitpython-ads1x15`
- Blocks (5): `python_adafruit_ads1x15_call`, `python_adafruit_ads1x15_do`, `python_adafruit_ads1x15_method`, `python_adafruit_ads1x15_do_method`, `python_adafruit_ads1x15_attribute`
- Allowlisted callables: `ADS1115`, `AnalogIn`
- Allowlisted methods: `read`
- Allowlisted attributes: `gain`, `mode`, `data_rate`, `comparator_queue_length`, `comparator_latch`, `comparator_polarity`, `value`, `voltage`, `Pin.A0`, `Pin.A1`, `Pin.A2`, `Pin.A3`
- API source: https://docs.circuitpython.org/projects/ads1x15/en/latest/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.

## Raspberry Pi 5B CPython runtime

Although the PyPI name contains `circuitpython`, this package runs under standard Raspberry Pi OS/Linux CPython through Blinka. It is not MicroPython and does not require CircuitPython firmware.

The generator maps each constructor and pin constant to its actual submodule. Connected objects are used for channel properties such as `value` and `voltage`.

Use current 64-bit Raspberry Pi OS as the primary path. On Bookworm and Trixie, create a virtual environment that can see APT-provided hardware bindings:

```sh
sudo apt install python3-venv python3-libgpiod python3-lgpio i2c-tools
python3 -m venv .venv --system-site-packages
. .venv/bin/activate
python3 -m pip install --upgrade Adafruit-Blinka adafruit-circuitpython-ads1x15
```

Enable the required I2C/SPI interface and verify access to the matching `/dev/i2c-*`, `/dev/spidev*`, GPIO, or PIO device. Do not use `--break-system-packages`; this library never edits `/boot/firmware/config.txt`, udev rules, or group membership.
