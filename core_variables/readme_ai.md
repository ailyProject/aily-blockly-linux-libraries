# @aily-project/lib-core-variables

Standard Blockly variable blocks for Linux CPython projects.

Blocks (3): `variables_get`, `variables_set`, `math_change`.

The package validates matching handlers on `globalThis.Python.forBlock` and never overwrites existing implementations. Variable identity and naming remain owned by the Blockly workspace variable model.
The toolbox uses the standard dynamic `VARIABLE` category. Its empty `contents` array is retained for the host package validator; Blockly resolves the flyout through `custom`.
