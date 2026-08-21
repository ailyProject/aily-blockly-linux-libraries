# @aily-project/lib-rpi-spi

Raspberry Pi SPI communication through the stable `py-spidev` API.

Blocks (5): rpi_spi_init, rpi_spi_transfer, rpi_spi_read, rpi_spi_write, rpi_spi_close.

Generated API surface: `spidev.SpiDev`, `open`, `mode`, `max_speed_hz`, `bits_per_word`, `xfer2`, `readbytes`, `writebytes2`, and `close`. Board values such as `SPI0` are converted to the trailing numeric bus index.

Target requirements: install `spidev` (often provided by `python3-spidev`), enable SPI, expose the expected `/dev/spidev*` device, and grant the runtime user access. Installing the npm package does not install Python dependencies, run `sudo`, enable kernel interfaces, or change device permissions.

The kernel controller must support the selected mode, speed, and bits-per-word; py-spidev raises an OS error for unsupported settings.

Compatible board type: `broadcom:bcm2712:raspberrypi_5`.

Requires the standalone CPython generator at `globalThis.Python`; block type names are migration-stable.
