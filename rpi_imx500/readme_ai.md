# @aily-project/lib-rpi-imx500

Curated Raspberry Pi IMX500 integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import picamera2.devices.imx500 as _python_lib_rpi_imx500`
- Install on target: `sudo apt install imx500-all python3-picamera2`
- Blocks (5): `rpi_imx500_call`, `rpi_imx500_do`, `rpi_imx500_method`, `rpi_imx500_do_method`, `rpi_imx500_attribute`
- Allowlisted callables: `IMX500`, `NetworkIntrinsics`, `postprocess_nanodet_detection`, `softmax`
- Allowlisted methods: `get_outputs`, `get_output_shapes`, `get_input_size`, `convert_inference_coords`, `set_inference_roi_abs`, `set_inference_aspect_ratio`, `set_auto_aspect_ratio`, `show_network_fw_progress_bar`, `get_kpi_info`, `update_with_defaults`
- Allowlisted attributes: `camera_num`, `config`, `network_intrinsics`, `task`, `inference_rate`, `labels`, `bbox_normalization`, `bbox_order`, `preserve_aspect_ratio`, `postprocess`, `softmax`
- API source: https://www.raspberrypi.com/documentation/accessories/ai-camera.html

Raspberry Pi AI Camera model loading, inference output, ROI, and network metadata APIs.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
