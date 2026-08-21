# Serial API Coverage

This inventory defines the runtime and migration boundary of `@aily-project/lib-serial`. The package registers exactly 12 Blockly definitions: six general `linux_uart_*` types visible in the toolbox and six hidden `cybercam_uart_*` types retained solely for serialized-workspace compatibility.

Primary sources:

- [PySerial installation](https://pyserial.readthedocs.io/en/latest/pyserial.html#installation)
- [PySerial `Serial` API](https://pyserial.readthedocs.io/en/latest/pyserial_api.html#serial.Serial)
- [PyPI `pyserial`](https://pypi.org/project/pyserial/)
- [Python standard-library index](https://docs.python.org/3/library/index.html)
- [01Studio CyberCAM UART lesson](https://wiki.01studio.cc/docs/cybercam/basic_examples/uart/)

## Dependency identity

The generated statement `import serial` imports the module supplied by the third-party **PySerial** distribution. It is not a Python standard-library module. The distribution name and import name intentionally differ:

```text
installation: python -m pip install pyserial
import:       import serial
```

A Linux distribution or board image may preinstall PySerial under a system package such as `python3-serial`, but that packaging choice does not make it part of Python's standard library. The Blockly npm package does not install PySerial, enable a UART, or modify `/dev/tty*` ownership and permissions.

## Definition inventory

| Surface | Count | Block types | Toolbox status |
|---|---:|---|---|
| General Linux UART | 6 | `linux_uart_init`, `linux_uart_available`, `linux_uart_read`, `linux_uart_write`, `linux_uart_flush`, `linux_uart_close` | Visible; use for all new projects |
| CyberCAM legacy compatibility | 6 | `cybercam_uart_init`, `cybercam_uart_available`, `cybercam_uart_read`, `cybercam_uart_write`, `cybercam_uart_flush`, `cybercam_uart_close` | Hidden; serialized old-workspace loading only |
| **Total registered definitions** | **12** | Six public plus six compatibility types | **Six toolbox entries** |

The general initializer exposes the device node and baud rate. The CyberCAM compatibility initializer preserves its historical fixed `/dev/ttyS2` contract and does not add a device field. Toolbox-visible `linux_uart_*` handlers use modern PySerial names; hidden compatibility handlers preserve their historical deprecated aliases where needed for old generated behavior.

## Verified public API mapping

| Block operation | Generated PySerial API | Verified behavior |
|---|---|---|
| Initialize | `serial.Serial(device, baudrate)` | Opens immediately when `device` is supplied; defaults include 8 data bits, no parity, one stop bit, no flow control, and `timeout=None` |
| Bytes available | `uart.in_waiting` | Integer count of bytes in the receive buffer |
| Read | `uart.read(size)` | Returns `bytes`; with default `timeout=None`, waits until the requested size is read |
| Write | `uart.write(_serial_payload(data))` | `str` is UTF-8 encoded; `bytes`, `bytearray`, and `memoryview` pass through unchanged; other types raise `TypeError` |
| Discard received data | `uart.reset_input_buffer()` | Clears the input buffer |
| Close | `uart.close()` | Closes the port immediately |

PySerial documents `inWaiting()` and `flushInput()` as deprecated since version 3.0; the current names are `in_waiting` and `reset_input_buffer()`. The toolbox-visible blocks generate the current forms. The hidden CyberCAM compatibility handlers retain the historical aliases only for legacy workspaces. `flush()` has different semantics: it waits until buffered output has been written and must not implement an input-flush block.

The initializer leaves `timeout=None`, so `read(size)` is blocking until the requested count arrives. Polling programs should query `in_waiting` and read only a positive available count.

## CyberCAM UART2 evidence

The 01Studio lesson identifies the left-side UART as UART2 with TX2=IO11 and RX2=IO12 and maps it to `/dev/ttyS2`. Its documented activation procedure is:

```bash
gpio pins
sudo set-device enable uart2
sudo reboot
gpio pins
```

The enable and reboot commands are required only when the first status check does not show UART2 enabled. `set-device` is specific to the CyberCAM/WalnutPi system image. The lesson does not document automatic PySerial installation or non-root device-permission setup, so both remain explicit runtime prerequisites.

The electrical interface is 3.3V TTL. External equipment must share GND and cross TX with RX. A switchable USB-TTL adapter must be set to 3.3V. The CyberCAM 4P cable's red conductor carries 5V and must not power a 3.3V peer; communication normally needs only GND, TX, and RX.

## Migration boundary

The six `cybercam_uart_*` type strings, inputs, and field values remain registered so old serialized projects do not require block replacement. They are intentionally absent from `toolbox.json`; new CyberCAM workspaces must place `linux_uart_init`, set its device field to `/dev/ttyS2`, and use the other `linux_uart_*` operations.

Projects must not load the split serial package with an older aggregate `@aily-project/lib-cybercam` release that still registers the six `cybercam_uart_*` definitions and `Python.forBlock` handlers. The current split base package delegates UART ownership to `@aily-project/lib-serial`.

The library requires the standalone aily CPython generator at `globalThis.Python` and does not fall back to MPY/MicroPython.
