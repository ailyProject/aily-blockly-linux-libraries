# Core

Python 基础语法、程序结构、变量和基础数据。

- npm 包：`@aily-project/lib-core`
- Blockly 积木：13 个（工具箱可见 11 个）
- 运行环境：`devmode: "python"`，并加载独立 CPython generator runtime
- 目标端依赖：CPython 标准库（仅使用 time）

## 积木

- `python_start`
- `python_forever`
- `python_sleep`
- `python_print`
- `python_number`
- `python_text`
- `python_boolean`
- `python_tuple`
- `python_list`
- `python_set_variable`
- `python_get_variable`
- `python_if`
- `python_for_each`

该库只向 `globalThis.Python.forBlock` 注册生成器；没有 Python runtime 时安全跳过，不会回退到 MPY/MicroPython。
