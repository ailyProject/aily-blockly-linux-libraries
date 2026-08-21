# @aily-project/lib-pandas

Curated pandas integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pandas as _python_lib_pandas`
- Install on target: `python3 -m pip install pandas`
- Blocks (5): `python_pandas_call`, `python_pandas_do`, `python_pandas_method`, `python_pandas_do_method`, `python_pandas_attribute`
- Allowlisted callables: `DataFrame`, `Series`, `read_csv`, `read_json`, `read_excel`, `concat`, `merge`, `date_range`
- Allowlisted methods: `head`, `tail`, `describe`, `groupby`, `merge`, `join`, `to_csv`, `to_json`, `dropna`, `fillna`, `sort_values`
- Allowlisted attributes: `shape`, `columns`, `index`, `dtypes`, `values`, `empty`
- API source: https://pandas.pydata.org/docs/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
