# @aily-project/lib-jetson-inference

Curated jetson-inference integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import jetson_inference as _python_lib_jetson_inference`
- Install on target: `build and install https://github.com/dusty-nv/jetson-inference`
- Blocks (5): `jetson_inference_call`, `jetson_inference_do`, `jetson_inference_method`, `jetson_inference_do_method`, `jetson_inference_attribute`
- Allowlisted callables: `detectNet`, `imageNet`, `segNet`, `poseNet`, `actionNet`, `backgroundNet`
- Allowlisted methods: `Detect`, `Classify`, `Segment`, `Process`, `GetNetworkFPS`, `PrintProfilerTimes`, `GetClassDesc`, `GetClassLabel`, `GetNumClasses`
- Allowlisted attributes: `ClassID`, `Confidence`, `Left`, `Top`, `Right`, `Bottom`, `Width`, `Height`, `Center`, `Area`
- API source: https://github.com/dusty-nv/jetson-inference

Jetson image classification, object detection, segmentation, pose, and action inference.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
