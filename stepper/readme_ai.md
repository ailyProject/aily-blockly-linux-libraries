# @aily-project/lib-stepper

Deterministic four-output step sequencing for standard Linux CPython using gpiozero `OutputDevice` instances.

Blocks (6): `linux_stepper_init`, `linux_stepper_move`, `linux_stepper_rotate`, `linux_stepper_position`, `linux_stepper_release`, and `linux_stepper_close`.

Initialization selects four distinct driver-input GPIOs, a fixed full-step or half-step sequence, positive integer sequence steps per revolution, and whether coils remain energized after a move. Signed integer steps and signed angles control direction; RPM must be positive. Rotation rounds to the nearest representable sequence step. Position is commanded open-loop position since initialization, not measured shaft feedback.

The generator injects one deterministic Python helper class, safely normalizes resource identifiers, validates the mode and numeric configuration, closes a previous same-name controller before replacement, and registers cleanup for all four outputs. Explicit release drives all four outputs low. Explicit close releases and closes every output and clears the generated resource variable.

**Never connect motor windings directly to SBC GPIO pins.** The four selected pins are logic signals for a ULN2003 board, an H-bridge, or another compatible external driver. Provide a correctly rated motor supply, confirm 3.3V logic compatibility, and normally join the driver and SBC grounds.

Linux scheduling makes this software sequencer suitable for low-speed education and prototyping, not hard real-time motion. It does not implement acceleration, end stops, current control, stall detection, or coordinated multi-axis motion. Use a dedicated motion controller when those properties matter.

Target provisioning must supply gpiozero, a suitable GPIO backend, and device permissions. This npm package does not install or configure them. The generator registers only on `globalThis.Python`.
