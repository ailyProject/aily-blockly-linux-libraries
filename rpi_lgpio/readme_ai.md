# @aily-project/lib-rpi-lgpio

Curated rpi-lgpio integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import RPi.GPIO as _python_lib_rpi_lgpio`
- Install on target: `python3 -m pip install rpi-lgpio`
- Blocks (5): `rpi_lgpio_call`, `rpi_lgpio_do`, `rpi_lgpio_method`, `rpi_lgpio_do_method`, `rpi_lgpio_attribute`
- Allowlisted callables: `setmode`, `setup`, `input`, `output`, `cleanup`, `PWM`, `add_event_detect`, `wait_for_edge`
- Allowlisted methods: `start`, `stop`, `ChangeDutyCycle`, `ChangeFrequency`
- Allowlisted attributes: `BCM`, `BOARD`, `IN`, `OUT`, `HIGH`, `LOW`, `RISING`, `FALLING`, `BOTH`
- API source: https://rpi-lgpio.readthedocs.io/en/latest/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

Compatibility note: Provides the RPi.GPIO API on top of lgpio. Do not install it together with the legacy RPi.GPIO package.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
