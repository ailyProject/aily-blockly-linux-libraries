# @aily-project/lib-flask

Curated Flask integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import flask as _python_lib_flask`
- Install on target: `python3 -m pip install Flask`
- Blocks (5): `python_flask_call`, `python_flask_do`, `python_flask_method`, `python_flask_do_method`, `python_flask_attribute`
- Allowlisted callables: `Flask`, `Blueprint`, `jsonify`, `redirect`, `render_template`
- Allowlisted methods: `route`, `get`, `post`, `run`, `register_blueprint`, `add_url_rule`, `make_response`
- Allowlisted attributes: `config`, `url_map`, `name`, `debug`, `testing`, `request.method`, `request.args`, `request.json`
- API source: https://flask.palletsprojects.com/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
