# Core

Linux CPython 项目的程序结构、通用容器和兼容基础积木。

- npm 包：`@aily-project/lib-core`
- 已注册积木：18 个
- 工具箱可见积木：8 个
- 运行环境：独立 CPython generator runtime
- 目标端依赖：CPython 标准库（仅使用 `time`）

## 工具箱可见积木（8 个）

- `python_sleep`
- `python_tuple`
- `python_list`
- `python_arguments`：将最多 6 个已连接值紧凑地组成位置参数列表
- `python_keyword_arguments`：将最多 6 组键值组成关键字参数字典；空键会被跳过
- `python_get_item`：按键或索引读取对象元素
- `python_set_item`：按键或索引设置对象元素
- `python_set_attribute`：设置经过安全校验的对象属性

## 隐藏的兼容积木

`block.json` 和 `generator.js` 仍注册全部 18 个历史类型，因此旧项目可以继续加载。`python_start` 与 `python_forever` 是项目模板使用的程序结构积木，不显示在普通工具箱中。

以下 8 个历史积木已有新的 `core-*` 标准 Blockly 等价项。为避免工具箱重复，它们不再显示，但仍保持注册：

- `python_print`
- `python_number`
- `python_text`
- `python_boolean`
- `python_set_variable`
- `python_get_variable`
- `python_if`
- `python_for_each`

该库只向 `globalThis.Python.forBlock` 注册生成器；没有 Python runtime 时安全跳过，不会回退到 MPY/MicroPython。
