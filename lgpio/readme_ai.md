# @aily-project/lib-lgpio

Curated lgpio integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import lgpio as _python_lib_lgpio`
- Install on target: `sudo apt install python3-lgpio`
- Blocks (5): `linux_lgpio_call`, `linux_lgpio_do`, `linux_lgpio_method`, `linux_lgpio_do_method`, `linux_lgpio_attribute`
- Allowlisted callables: `gpiochip_open`, `gpiochip_close`, `gpio_claim_input`, `gpio_claim_output`, `gpio_read`, `gpio_write`, `tx_pwm`, `callback`
- Allowlisted methods: `cancel`
- Allowlisted attributes: `RISING_EDGE`, `FALLING_EDGE`, `BOTH_EDGES`, `SET_PULL_UP`, `SET_PULL_DOWN`, `SET_PULL_NONE`
- API source: https://github.com/joan2937/lg

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
