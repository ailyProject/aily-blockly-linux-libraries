# @aily-project/lib-rpi-sense-hat

Curated Sense HAT integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import sense_hat as _python_lib_rpi_sense_hat`
- Install on target: `sudo apt install sense-hat`
- Blocks (5): `rpi_sense_hat_call`, `rpi_sense_hat_do`, `rpi_sense_hat_method`, `rpi_sense_hat_do_method`, `rpi_sense_hat_attribute`
- Allowlisted callables: `SenseHat`
- Allowlisted methods: `show_message`, `show_letter`, `clear`, `set_pixel`, `get_pixel`, `set_pixels`, `get_pixels`, `get_temperature`, `get_humidity`, `get_pressure`, `get_orientation`, `get_accelerometer_raw`, `get_gyroscope_raw`
- Allowlisted attributes: `low_light`, `rotation`, `gamma`, `stick`
- API source: https://www.raspberrypi.com/documentation/accessories/sense-hat.html

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
