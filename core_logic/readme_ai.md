# @aily-project/lib-core-logic

Standard Blockly logic blocks for Linux CPython projects.

Blocks (8): `controls_if`, `controls_ifelse`, `logic_compare`, `logic_operation`, `logic_negate`, `logic_boolean`, `logic_null`, `logic_ternary`.

Use `controls_ifelse` when a fixed else branch is preferable to the mutable `controls_if` shape.

The package validates matching handlers on `globalThis.Python.forBlock`. It does not register, replace, or wrap those handlers. With no CPython generator present it exits silently so an installed dependency is safe while another project mode is open.
