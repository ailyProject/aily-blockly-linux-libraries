# Core Text

面向 Linux CPython 项目的基础文字积木库。

- npm 包：`@aily-project/lib-core-text`
- 积木：文字、连接、追加、长度、空值判断、查找、取字符、截取、大小写、去空格、打印、计数、替换和反转
- 代码生成：复用应用内置的 Blockly CPython 标准生成器
- 目标端依赖：仅 CPython 标准语义，无额外安装项

`text_getSubstring` 与当前 Blockly 内置积木保持一致：起点支持“从开头计数 / 从末尾计数 / 第一个字符”，终点支持“从开头计数 / 从末尾计数 / 最后一个字符”，并按选项动态显示或隐藏索引输入。下拉字段本身保存 JSON state；兼容旧 XML 时使用与 Blockly 一致的 `at1` / `at2` mutation。
