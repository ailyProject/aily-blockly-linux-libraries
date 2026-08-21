# @aily-project/lib-core

Python 基础语法、程序结构、变量和基础数据。
Blocks (18): python_start, python_forever, python_sleep, python_print, python_number, python_text, python_boolean, python_tuple, python_list, python_arguments, python_keyword_arguments, python_get_item, python_set_item, python_set_attribute, python_set_variable, python_get_variable, python_if, python_for_each.
Use `python_arguments` to build a compact positional-argument list from up to six connected values. Use `python_keyword_arguments` to build a dictionary from up to six key/value rows; blank keys are skipped and keys are quoted safely by the CPython generator.
Use `python_get_item` and `python_set_item` for indexed or keyed access. `python_set_attribute` accepts only ASCII attribute names matching `^[A-Za-z][A-Za-z0-9_]*$` and falls back to `value` for invalid input.
Target dependencies: CPython 标准库（仅使用 time）.
Requires the standalone CPython generator at globalThis.Python; block type names are migration-stable.
