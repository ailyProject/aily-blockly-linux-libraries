# @aily-project/lib-pynmea2

Curated pynmea2 integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pynmea2 as _python_lib_pynmea2`
- Install on target: `python3 -m pip install pynmea2`
- Blocks (5): `python_pynmea2_call`, `python_pynmea2_do`, `python_pynmea2_method`, `python_pynmea2_do_method`, `python_pynmea2_attribute`
- Allowlisted callables: `parse`, `NMEASentence`, `LatLonFix`, `ProprietarySentence`
- Allowlisted methods: `render`, `identifier`
- Allowlisted attributes: `latitude`, `longitude`, `altitude`, `timestamp`, `num_sats`, `gps_qual`, `spd_over_grnd`, `true_course`
- API source: https://github.com/Knio/pynmea2

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
