# @aily-project/lib-rpi-hardware-pwm

Curated Raspberry Pi Hardware PWM integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import rpi_hardware_pwm as _python_lib_rpi_hardware_pwm`
- Install on target: `python3 -m pip install rpi-hardware-pwm`
- Blocks (5): `rpi_hardware_pwm_call`, `rpi_hardware_pwm_do`, `rpi_hardware_pwm_method`, `rpi_hardware_pwm_do_method`, `rpi_hardware_pwm_attribute`
- Allowlisted callables: `HardwarePWM`
- Allowlisted methods: `start`, `stop`, `change_duty_cycle`, `change_frequency`
- Allowlisted attributes: `duty_cycle`, `frequency_hz`, `pwm_channel`, `chip`
- API source: https://github.com/Pioreactor/rpi_hardware_pwm

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
