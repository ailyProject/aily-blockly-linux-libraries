# @aily-project/lib-jetson-gpio

Curated Jetson.GPIO integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import Jetson.GPIO as _python_lib_jetson_gpio`
- Install on target: `python3 -m pip install Jetson.GPIO`
- Blocks (5): `jetson_gpio_call`, `jetson_gpio_do`, `jetson_gpio_method`, `jetson_gpio_do_method`, `jetson_gpio_attribute`
- Allowlisted callables: `setwarnings`, `setmode`, `getmode`, `setup`, `input`, `output`, `cleanup`, `gpio_function`, `add_event_detect`, `remove_event_detect`, `event_detected`, `add_event_callback`, `wait_for_edge`, `PWM`
- Allowlisted methods: `start`, `stop`, `ChangeDutyCycle`, `ChangeFrequency`
- Allowlisted attributes: `BOARD`, `BCM`, `CVM`, `TEGRA_SOC`, `IN`, `OUT`, `HIGH`, `LOW`, `RISING`, `FALLING`, `BOTH`, `PUD_UP`, `PUD_DOWN`, `JETSON_INFO`, `VERSION`
- API source: https://github.com/NVIDIA/jetson-gpio

Digital I/O, edge detection, and hardware PWM for the Jetson 40-pin expansion header.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
