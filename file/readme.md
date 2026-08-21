# File

`@aily-project/lib-file` 是一个只依赖 CPython 标准能力的跨平台文件操作库，提供 UTF-8 文本读写、路径存在判断和目录列举。包版本固定为 `0.0.1`。

- npm 包：`@aily-project/lib-file`
- 已注册 Blockly 定义：8 个
- 工具箱可见积木：4 个通用 `python_file_*` 定义
- 隐藏兼容定义：4 个 `cybercam_file_*` 定义
- 运行环境：`devmode: "python"`，使用独立 CPython generator runtime
- 目标端依赖：仅 Python 内置函数及 `os` 标准库，无需安装第三方 Python 包

## 工具箱公开积木（4）

| 积木 type | 生成语义 | 返回值或效果 |
|---|---|---|
| `python_file_read` | `open(path, 'r', encoding='utf-8')` 后读取全部文本 | `str` |
| `python_file_write` | 按 `w` 或 `a` 模式写入 UTF-8 文本 | 覆盖写入或追加写入 |
| `python_file_exists` | `os.path.exists(path)` | `bool` |
| `python_file_list` | `os.listdir(path)` | 目录项名称组成的 `list[str]` |

工具箱中的默认路径是相对于 Python 进程当前工作目录的普通路径：读取、写入和存在判断默认使用 `file.txt`，目录列举默认使用 `.`。这些只是可编辑的 Blockly shadow 默认值；库不会把它们改写为绝对路径，也不会自动创建缺失的父目录。

写入积木的模式下拉框具有标准 Python 语义：

- `w`：写入前截断已有文件；文件不存在时创建。
- `a`：从文件末尾追加；文件不存在时创建。

读取和写入 helper 都使用 `with open(...)`，因此正常结束或发生异常时都会关闭文件。文本编码固定为 UTF-8。读取会一次返回整个文件，处理不受信任的大文件时应留意内存占用。本版本不提供二进制读写；图片、音频、模型等原始字节数据不能通过这些文本积木无损处理。

为保持从原聚合包迁移后的生成结果稳定，`python_file_write` 会先执行 `str(content)` 再写入。它因此可接受数字等普通 Python 值，但这是一项 Blockly 兼容便利，不应误解为内置 `file.write()` 可直接接受任意对象；Python 的文本流 `write()` 本身要求 `str`。文件不存在、权限不足、目标不是目录或内容不是合法 UTF-8 等运行时错误会继续由 Python 抛出，不会被库静默吞掉。

Python 官方文档说明了 [`open()` 的模式、编码和文本/二进制区别](https://docs.python.org/3/library/functions.html#open)，并推荐以 [`with` 管理文件对象](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)，以便在异常路径上也可靠关闭资源。目录列举和路径判断分别遵循 [`os.listdir()`](https://docs.python.org/3/library/os.html#os.listdir) 与 [`os.path.exists()`](https://docs.python.org/3/library/os.path.html#os.path.exists) 的标准行为；`os.listdir()` 返回的名称顺序未定义，并且不包含 `.`、`..`。

## CyberCAM 隐藏兼容定义（4）

以下 type 从旧版 `@aily-project/lib-cybercam` 迁入本包，仅用于恢复已序列化的旧工程，不出现在 `toolbox.json` 中：

- `cybercam_file_read`
- `cybercam_file_write`
- `cybercam_file_exists`
- `cybercam_file_list`

它们保留原有字段、输入结构及生成语义。输入缺失时，读写 handler 的历史回退路径为 `/data/file.txt`，存在判断和目录列举 handler 的历史回退路径为 `/data`；正常加载的旧工作区仍以自身保存的路径输入为准。新工程应只放置公开的 `python_file_*` 积木，并按实际工作目录或挂载点填写路径。

## 拆分与加载边界

公开的 `python_file_*` type 原属于旧聚合包 `@aily-project/lib-python-core`；隐藏的 `cybercam_file_*` type 原属于旧聚合包 `@aily-project/lib-cybercam`。迁移后，`@aily-project/lib-file` 是这 8 个 type 及其 `Python.forBlock` handler 的唯一 owner。

不要把本包与仍注册上述 type 的旧版聚合包同时加载：

- 旧版 `lib-python-core` 会与 4 个 `python_file_*` 定义重复。
- 旧版 `lib-cybercam` 会与 4 个 `cybercam_file_*` 定义重复。

重复 owner 可能导致 Blockly 定义或 generator handler 被覆盖。项目升级时应同步使用已经移除这些定义的拆分后聚合包版本。

系统命令执行和 Linux CPU 温度不是标准文件 API，不属于 `lib-file`。它们应由对应的系统功能包负责；本包不会生成 `os.popen()`、读取 Linux thermal sysfs，也不依赖特定板卡路径。

该库只向 `globalThis.Python.forBlock` 注册生成器。`globalThis.Python` 不存在时安全跳过，不会回退到 MPY/MicroPython；若对象存在但缺少所需 CPython generator 方法，则抛出明确的兼容性错误。
