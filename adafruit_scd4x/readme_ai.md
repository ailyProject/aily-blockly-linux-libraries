# @aily-project/lib-adafruit-scd4x

Curated CircuitPython SCD4x integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import adafruit_scd4x as _python_lib_adafruit_scd4x`
- Install on target: `python3 -m pip install adafruit-circuitpython-scd4x`
- Blocks (5): `python_adafruit_scd4x_call`, `python_adafruit_scd4x_do`, `python_adafruit_scd4x_method`, `python_adafruit_scd4x_do_method`, `python_adafruit_scd4x_attribute`
- Allowlisted callables: `SCD4X`
- Allowlisted methods: `start_periodic_measurement`, `stop_periodic_measurement`, `reinit`, `persist_settings`, `force_calibration`
- Allowlisted attributes: `CO2`, `temperature`, `relative_humidity`, `data_ready`, `measurement_period`, `self_calibration_enabled`
- API source: https://docs.circuitpython.org/projects/scd4x/en/latest/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.

## Raspberry Pi 5B CPython runtime

Although the PyPI name contains `circuitpython`, this package runs under standard Raspberry Pi OS/Linux CPython through Blinka. It is not MicroPython and does not require CircuitPython firmware.

Use current 64-bit Raspberry Pi OS as the primary path. On Bookworm and Trixie, create a virtual environment that can see APT-provided hardware bindings:

```sh
sudo apt install python3-venv python3-libgpiod python3-lgpio i2c-tools
python3 -m venv .venv --system-site-packages
. .venv/bin/activate
python3 -m pip install --upgrade Adafruit-Blinka adafruit-circuitpython-scd4x
```

Enable the required I2C/SPI interface and verify access to the matching `/dev/i2c-*`, `/dev/spidev*`, GPIO, or PIO device. Do not use `--break-system-packages`; this library never edits `/boot/firmware/config.txt`, udev rules, or group membership.
