# Core Math

面向 Linux CPython 项目的基础数学积木库。

- npm 包：`@aily-project/lib-core-math`
- 积木：数字、算术、常用函数、三角函数、常量、数值属性、统计、取模、约束、随机数和 atan2
- 代码生成：复用应用内置的 Blockly CPython 标准生成器
- 目标端依赖：CPython 标准库；具体积木按需生成 `math`、`random`、`statistics` 导入

本包不会覆盖应用已经安装的标准数学生成器。
