# @aily-project/lib-nvidia-vpi

Curated NVIDIA VPI integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import vpi as _python_lib_nvidia_vpi`
- Install on target: `sudo apt install python3-vpi3`
- Blocks (5): `nvidia_vpi_call`, `nvidia_vpi_do`, `nvidia_vpi_method`, `nvidia_vpi_do_method`, `nvidia_vpi_attribute`
- Allowlisted callables: `asimage`, `asarray`, `Image`, `Array`, `Pyramid`, `Stream`, `execute`, `mixchannels`
- Allowlisted methods: `convert`, `rescale`, `box_filter`, `gaussian_filter`, `median_filter`, `bilateral_filter`, `erode`, `dilate`, `canny`, `eqhist`, `histogram`, `minmaxloc`, `lock_cpu`, `lock_cuda`, `sync`
- Allowlisted attributes: `Backend.CPU`, `Backend.CUDA`, `Backend.PVA`, `Format.RGB8`, `Format.RGBA8`, `Format.BGR8`, `Format.GRAY8`, `Interp.NEAREST`, `Interp.LINEAR`, `Border.CLAMP`, `width`, `height`, `size`, `format`
- API source: https://docs.nvidia.com/vpi/python/index.html

Run hardware-accelerated vision algorithms on Jetson CPU, CUDA, and PVA backends.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
