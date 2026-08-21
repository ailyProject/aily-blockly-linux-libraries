# @aily-project/lib-adafruit-mlx90614

Curated CircuitPython MLX90614 integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import adafruit_mlx90614 as _python_lib_adafruit_mlx90614`
- Install on target: `python3 -m pip install adafruit-circuitpython-mlx90614`
- Blocks (3): `python_adafruit_mlx90614_call`, `python_adafruit_mlx90614_do`, `python_adafruit_mlx90614_attribute`
- Allowlisted callables: `MLX90614`
- Allowlisted methods: none
- Allowlisted attributes: `ambient_temperature`, `object_temperature`
- API source: https://docs.circuitpython.org/projects/mlx90614/en/latest/

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
python3 -m pip install --upgrade Adafruit-Blinka adafruit-circuitpython-mlx90614
```

Enable the required I2C/SPI interface and verify access to the matching `/dev/i2c-*`, `/dev/spidev*`, GPIO, or PIO device. Do not use `--break-system-packages`; this library never edits `/boot/firmware/config.txt`, udev rules, or group membership.
