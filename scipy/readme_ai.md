# @aily-project/lib-scipy

Curated SciPy Signal integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import scipy.signal as _python_lib_scipy`
- Install on target: `python3 -m pip install scipy`
- Blocks (3): `python_scipy_call`, `python_scipy_do`, `python_scipy_attribute`
- Allowlisted callables: `butter`, `sosfilt`, `sosfiltfilt`, `filtfilt`, `find_peaks`, `welch`, `periodogram`, `convolve`, `correlate`, `resample`, `spectrogram`, `stft`, `istft`
- Allowlisted methods: none
- Allowlisted attributes: `shape`, `dtype`, `ndim`, `size`
- API source: https://docs.scipy.org/doc/scipy/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
