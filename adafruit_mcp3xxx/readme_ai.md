# @aily-project/lib-adafruit-mcp3xxx

Curated CircuitPython MCP3xxx integration for the standalone CPython generator at `globalThis.Python`.

- Imports: `adafruit_mcp3xxx.mcp3008` for `MCP3008` and `P0` through `P7`, and `adafruit_mcp3xxx.analog_in` for `AnalogIn`.
- Install on target: `python3 -m pip install adafruit-circuitpython-mcp3xxx`
- Blocks (5): `python_adafruit_mcp3xxx_call`, `python_adafruit_mcp3xxx_do`, `python_adafruit_mcp3xxx_method`, `python_adafruit_mcp3xxx_do_method`, `python_adafruit_mcp3xxx_attribute`
- Allowlisted callables: `MCP3008`, `AnalogIn`
- Allowlisted methods: `read`
- Allowlisted attributes: `P0`, `P1`, `P2`, `P3`, `P4`, `P5`, `P6`, `P7`, `value`, `voltage`, `reference_voltage`
- API source: https://docs.circuitpython.org/projects/mcp3xxx/en/latest/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.

## Raspberry Pi 5B CPython runtime

Although the PyPI name contains `circuitpython`, this package runs under standard Raspberry Pi OS/Linux CPython through Blinka. It is not MicroPython and does not require CircuitPython firmware.

The generator maps each constructor and pin constant to its actual submodule. Connected objects are used for channel properties such as `value`, `voltage`, and `reference_voltage`.

Use current 64-bit Raspberry Pi OS as the primary path. On Bookworm and Trixie, create a virtual environment that can see APT-provided hardware bindings:

```sh
sudo apt install python3-venv python3-libgpiod python3-lgpio i2c-tools
python3 -m venv .venv --system-site-packages
. .venv/bin/activate
python3 -m pip install --upgrade Adafruit-Blinka adafruit-circuitpython-mcp3xxx
```

Enable the required I2C/SPI interface and verify access to the matching `/dev/i2c-*`, `/dev/spidev*`, GPIO, or PIO device. Do not use `--break-system-packages`; this library never edits `/boot/firmware/config.txt`, udev rules, or group membership.
