# @aily-project/lib-gpiozero-devices

Friendly CPython Blockly blocks backed by the official gpiozero API.

The package registers 27 block types covering:

- `Motor`: initialize, forward, backward, stop, signed value, and close.
- `AngularServo`: initialize with an angle range, set/read angle, detach, and close; reversed ranges where `min_angle > max_angle` are supported.
- HC-SR04-style `DistanceSensor`: initialize, read metres or centimetres, test `in_range`, wait for a threshold state, and close.
- `RotaryEncoder`: initialize, read/reset steps, wait for rotation direction, and close.
- `Buzzer` / `TonalBuzzer`: select mode at initialization, play, on, off, stop, and close.

All resource names are converted to safe Python identifiers. Dropdown machine values are fixed allowlists. Reinitializing a named object closes the old instance, and every initialized resource also registers generator cleanup.

Target requirements are CPython, gpiozero, a suitable GPIO backend, and permission to access the target GPIO character devices. Installing this npm package does not install those components or alter system configuration.

Electrical requirements:

- GPIO logic is 3.3V only.
- **A typical HC-SR04 Echo output is 5V and must pass through a resistor divider or a proper level shifter before reaching a GPIO input.**
- Motors require an H-bridge or motor driver; the Motor pins are driver logic inputs, never motor coils.
- Servos need a power supply sized for their peak current. External supplies and the SBC normally need a common ground.

Motor speed is validated in the inclusive 0..1 range. Servo endpoints must differ, and the initial angle must lie between them regardless of endpoint order. Distance configuration uses metres. A timeout of zero or less means no timeout. Tonal notes may use gpiozero note strings such as `A4`; playing a simple Buzzer turns it on continuously.

The generator registers only on `globalThis.Python` and never falls back to a MicroPython runtime.
