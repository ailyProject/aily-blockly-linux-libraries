# @aily-project/lib-pytesseract

Curated pytesseract integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pytesseract as _python_lib_pytesseract`
- Install on target: `python3 -m pip install pytesseract`
- Blocks (3): `python_pytesseract_call`, `python_pytesseract_do`, `python_pytesseract_attribute`
- Allowlisted callables: `image_to_string`, `image_to_data`, `image_to_boxes`, `image_to_osd`, `get_languages`
- Allowlisted methods: none
- Allowlisted attributes: `Output.DICT`, `Output.STRING`, `Output.DATAFRAME`
- API source: https://github.com/madmaze/pytesseract

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

Compatibility note: Requires the external Tesseract OCR executable and language data.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
