# Core Variables

面向 Linux CPython 项目的基础变量积木库。

- npm 包：`@aily-project/lib-core-variables`
- 积木：读取变量、设置变量、按数值修改变量
- 代码生成：复用应用内置的 Blockly CPython 标准生成器
- 目标端依赖：仅 CPython 标准语义，无额外安装项

变量名由 Blockly 工作区变量模型管理，并由 CPython 生成器安全处理。
工具箱使用 Blockly 标准动态变量类别，因此“创建变量”按钮和变量列表会随工作区状态自动更新。
