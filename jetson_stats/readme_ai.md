# @aily-project/lib-jetson-stats

Curated jetson-stats / jtop integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import jtop as _python_lib_jetson_stats`
- Install on target: `sudo python3 -m pip install -U jetson-stats`
- Blocks (5): `jetson_stats_call`, `jetson_stats_do`, `jetson_stats_method`, `jetson_stats_do_method`, `jetson_stats_attribute`
- Allowlisted callables: `jtop`
- Allowlisted methods: `start`, `close`, `ok`, `loop`
- Allowlisted attributes: `board`, `stats`, `cpu`, `gpu`, `memory`, `engines`, `temperature`, `power`, `fan`, `jetson_clocks`, `nvpmodel`
- API source: https://github.com/rbonghi/jetson_stats

Monitor Jetson CPU, GPU, memory, thermals, power, fans, and power modes.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
