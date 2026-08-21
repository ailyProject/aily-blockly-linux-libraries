# @aily-project/lib-rtimulib

Curated RTIMULib integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import RTIMU as _python_lib_rtimulib`
- Install on target: `sudo apt install python3-rtimulib`
- Blocks (4): `rpi_rtimulib_call`, `rpi_rtimulib_do`, `rpi_rtimulib_method`, `rpi_rtimulib_do_method`
- Allowlisted callables: `Settings`, `RTIMU`, `RTPressure`, `RTHumidity`
- Allowlisted methods: `IMUInit`, `IMURead`, `getIMUData`, `IMUGetPollInterval`, `pressureInit`, `pressureRead`, `humidityInit`, `humidityRead`
- Allowlisted attributes: none
- API source: https://github.com/RPi-Distro/RTIMULib

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
