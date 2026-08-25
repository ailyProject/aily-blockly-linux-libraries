# @aily-project/lib-core

Program structure, common containers, and migration-compatible foundation blocks for Linux CPython projects.

- Registered block types: 18
- Toolbox-visible block types: 8
- Visible blocks: python_sleep, python_tuple, python_list, python_arguments, python_keyword_arguments, python_get_item, python_set_item, python_set_attribute.

All 18 historical types remain registered in `block.json` and `generator.js`, so existing projects continue to load. `python_start` and `python_forever` are program-structure blocks used by project templates and are not shown in the regular toolbox.

These eight legacy blocks have standard Blockly equivalents in the new `core-*` libraries. They remain registered for migration compatibility but are hidden from this toolbox to prevent duplicates: python_print, python_number, python_text, python_boolean, python_set_variable, python_get_variable, python_if, python_for_each.

Use `python_arguments` to build a compact positional-argument list from up to six connected values. Use `python_keyword_arguments` to build a dictionary from up to six key/value rows; blank keys are skipped and keys are quoted safely by the CPython generator.
Use `python_get_item` and `python_set_item` for indexed or keyed access. `python_set_attribute` accepts only ASCII attribute names matching `^[A-Za-z][A-Za-z0-9_]*$` and falls back to `value` for invalid input.
Target dependency: the CPython standard library (`time` only).
Requires the standalone CPython generator at globalThis.Python; block type names are migration-stable.
