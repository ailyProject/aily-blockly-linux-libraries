# @aily-project/lib-torchvision

Curated TorchVision integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import torchvision as _python_lib_torchvision`
- Install on target: `python3 -m pip install torchvision`
- Blocks (5): `torchvision_call`, `torchvision_do`, `torchvision_method`, `torchvision_do_method`, `torchvision_attribute`
- Allowlisted callables: `models.resnet18`, `models.resnet50`, `models.mobilenet_v3_small`, `models.mobilenet_v3_large`, `models.detection.fasterrcnn_resnet50_fpn`, `transforms.Compose`, `transforms.Resize`, `transforms.CenterCrop`, `transforms.ToTensor`, `transforms.Normalize`, `io.read_image`, `io.write_jpeg`, `ops.nms`, `ops.box_iou`
- Allowlisted methods: `to`, `cpu`, `cuda`, `eval`, `train`, `forward`
- Allowlisted attributes: `__version__`
- API source: https://pytorch.org/vision/stable/

Common PyTorch vision models, preprocessing transforms, image I/O, and detection operators.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
