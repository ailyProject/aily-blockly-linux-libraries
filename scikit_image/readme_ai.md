# @aily-project/lib-scikit-image

Curated scikit-image I/O integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import skimage.io as _python_lib_scikit_image`
- Install on target: `python3 -m pip install scikit-image`
- Blocks (5): `python_scikit_image_call`, `python_scikit_image_do`, `python_scikit_image_method`, `python_scikit_image_do_method`, `python_scikit_image_attribute`
- Allowlisted callables: `imread`, `imsave`, `imshow`, `show`, `imread_collection`, `concatenate_images`
- Allowlisted methods: `reload`, `concatenate`
- Allowlisted attributes: `shape`, `dtype`, `ndim`, `size`
- API source: https://scikit-image.org/docs/stable/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
