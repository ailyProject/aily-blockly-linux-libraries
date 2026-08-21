# @aily-project/lib-rpi-picamera2

Raspberry Pi 5 camera blocks backed by the supported Picamera2/libcamera stack. Do not generate legacy `picamera` imports.

Blocks (7): `rpi_picamera2_init`, `rpi_picamera2_start`, `rpi_picamera2_capture_array`, `rpi_picamera2_capture_file`, `rpi_picamera2_set_control`, `rpi_picamera2_stop`, and `rpi_picamera2_close`.

Typical order: initialize, optionally set controls, start, capture arrays or files, then stop or close. Initialization emits `Picamera2(camera_num)`, `create_preview_configuration(main={"size": (width, height), "format": format})`, and `configure(...)`. `rpi_picamera2_capture_array` returns the main stream as a NumPy array. `rpi_picamera2_capture_file` is a statement and infers the image encoder from the filename.

Only the control machine values `FrameRate`, `ExposureTime`, `AnalogueGain`, and `AwbEnable` are accepted. Generated values are cast to `float`, `int`, `float`, and `bool`, respectively. `ExposureTime` uses microseconds and `AwbEnable` expects a Boolean. The Blockly format value `XRGB888` intentionally maps to Picamera2's valid `XRGB8888` format name.

The generated lifecycle helpers make stop and close idempotent for cleanup by checking Picamera2's `started` and `is_open` states. The library requires the standalone CPython generator at `globalThis.Python`.

Target setup is external to npm. On Raspberry Pi OS install `python3-picamera2` with APT. Virtual environments must be created with `--system-site-packages`. A connected camera and appropriate device permissions are required. npm does not install Picamera2, libcamera, or camera drivers.

Compatibility is intentionally limited to `broadcom:bcm2712:raspberrypi_5`.
