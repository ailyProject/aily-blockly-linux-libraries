# Core Logic

面向 Linux CPython 项目的基础逻辑积木库。

- npm 包：`@aily-project/lib-core-logic`
- 积木：可变分支条件、固定 if/else、比较、与/或/非、布尔值、空值、条件表达式
- 代码生成：复用应用内置的 Blockly CPython 标准生成器
- 目标端依赖：仅 CPython 标准语义，无额外安装项

本包的 `generator.js` 只验证标准 handler 是否可用，不会覆盖应用已经安装的生成器实现。
