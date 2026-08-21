# @aily-project/lib-rpi-buildhat

Curated Build HAT integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import buildhat as _python_lib_rpi_buildhat`
- Install on target: `sudo apt install python3-build-hat`
- Blocks (5): `rpi_buildhat_call`, `rpi_buildhat_do`, `rpi_buildhat_method`, `rpi_buildhat_do_method`, `rpi_buildhat_attribute`
- Allowlisted callables: `Motor`, `MotorPair`, `ColorSensor`, `DistanceSensor`, `ForceSensor`, `Matrix`, `Light`
- Allowlisted methods: `run_for_seconds`, `run_for_degrees`, `start`, `stop`, `get_aposition`, `get_color`, `get_distance`, `get_force`, `on`, `off`
- Allowlisted attributes: `position`, `when_pressed`, `when_released`
- API source: https://www.raspberrypi.com/documentation/accessories/build-hat.html

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

Compatibility note: Raspberry Pi currently documents Build HAT as unsupported on Raspberry Pi OS Trixie; use Bookworm.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
