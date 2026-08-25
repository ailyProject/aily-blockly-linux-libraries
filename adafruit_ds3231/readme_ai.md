# @aily-project/lib-adafruit-ds3231

DS3231 precision real-time-clock blocks for Linux CPython. The 9 blocks cover initialization, date/time access, temperature, power-loss state, calibration, and owned-resource cleanup.

- Target install: `python3 -m pip install adafruit-circuitpython-ds3231 Adafruit-Blinka`
- Python import: `import adafruit_ds3231`
- API source: https://docs.circuitpython.org/projects/ds3231/en/latest/
- Runtime: Adafruit Blinka on Linux CPython; this is not MicroPython firmware.

Initialization accepts a shared I2C object. When the socket is empty it creates and owns `board.I2C()`; close and final cleanup release only that owned bus. Date/time assignment accepts a `datetime`, `time.struct_time`, or a sequence from year through second. Generated code validates calendar fields, requires a year from 2000 through 2099, and recomputes weekday from the date before writing the RTC. The DS3231 has no millisecond support, and calibration must be between -128 and 127. Resource names are mapped into a private generated namespace so they cannot shadow builtins, imports, or helpers.

The npm package installs Blockly assets only. It does not install target Python dependencies, enable I2C, change device permissions, or run sudo. Verify module power and I2C voltage levels before wiring.
