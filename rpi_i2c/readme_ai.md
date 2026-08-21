# @aily-project/lib-rpi-i2c

Raspberry Pi 5 I2C/SMBus register, block, and repeated-start transactions through smbus2.
Blocks (9): rpi_i2c_init, rpi_i2c_read_byte_data, rpi_i2c_write_byte_data, rpi_i2c_read_word_data, rpi_i2c_write_word_data, rpi_i2c_read_i2c_block, rpi_i2c_write_i2c_block, rpi_i2c_write_read, rpi_i2c_close.
The BUS field uses `${board.i2c}`; values such as I2C1, I2C2, and /dev/i2c-1 are converted to the matching SMBus number.
The word-data blocks use SMBus 16-bit little-endian word semantics. SMBus I2C block reads and writes are normally limited to 32 bytes; the device and kernel adapter may impose a lower limit.
Target requirements: install smbus2 inside the runtime virtual environment with `python3 -m pip install smbus2`, enable I2C so a `/dev/i2c-*` device exists, and grant the runtime user access to that device (normally through the system `i2c` group and a new login session). On Raspberry Pi OS Bookworm and later, do not install with pip directly into the system Python.
Compatibility is declared for Raspberry Pi 5 only.
Requires the standalone CPython generator at globalThis.Python.
