# JSON Blockly 库

该库面向 Linux 单板机上的标准 CPython，使用 json 标准库，不需要安装额外的 pip 依赖。

## 能力

- 使用 dumps 将 Python 值序列化为 JSON 文本，可选择保留 UTF-8 字符、缩进和键排序。
- 使用 loads 解析字符串、bytes 或 bytearray。
- 以 UTF-8 编码读取和写入 JSON 文件。
- 判断文本或编码字节是否为合法 JSON。
- 对 JSON 对象对应的 Python 字典执行带默认值的 get 和键赋值。

## 资源与异常语义

- UTF-8 文件辅助函数始终使用 with 打开文件，正常返回或异常时都会关闭文件。
- 文件读取不捕获 FileNotFoundError、PermissionError、OSError、UnicodeDecodeError 或 JSONDecodeError。
- 文件写入不捕获 I/O、TypeError、ValueError 或循环引用异常，也不会把失败改成成功状态；目标文件使用标准 w 模式。
- 合法性检查只把 JSONDecodeError 和无效编码字节的 UnicodeDecodeError 转成 false；不支持的输入类型仍抛出 TypeError。
- dumps 与 loads 保留 CPython json 的标准行为。对象 get/set 也保留 AttributeError、TypeError 等映射异常。
- 所有配置下拉字段都映射到固定白名单，不会把用户字段直接拼接为 Python 源代码。

参考文档：https://docs.python.org/3/library/json.html
