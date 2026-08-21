# @aily-project/lib-scapy

Curated Scapy integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import scapy.all as _python_lib_scapy`
- Install on target: `python3 -m pip install scapy`
- Blocks (5): `python_scapy_call`, `python_scapy_do`, `python_scapy_method`, `python_scapy_do_method`, `python_scapy_attribute`
- Allowlisted callables: `sniff`, `send`, `sendp`, `sr`, `sr1`, `rdpcap`, `wrpcap`, `Ether`, `IP`, `IPv6`, `TCP`, `UDP`, `ARP`, `ICMP`, `Raw`
- Allowlisted methods: `show`, `summary`, `haslayer`, `getlayer`, `sprintf`
- Allowlisted attributes: `src`, `dst`, `sport`, `dport`, `payload`, `time`
- API source: https://scapy.readthedocs.io/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
