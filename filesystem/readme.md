# System

系统命令和 Linux CPU 温度积木。`filesystem` 包名仅为迁移稳定而保留，本包不再提供标准文件 API。

- npm 包：`@aily-project/lib-filesystem`
- 版本：`0.0.1`
- Blockly 积木：2 个（工具箱可见 2 个）
- 运行环境：`devmode: "python"`，并加载独立 CPython generator runtime
- 目标端依赖：CPython 标准库；CPU 温度块还依赖 Linux sysfs 与 `cat`

## 积木

- `python_command`：通过目标系统的 shell 执行命令并读取输出
- `python_cpu_temperature`：读取 `/sys/class/thermal/thermal_zone0/temp`

## 文件积木迁移

原来的 4 个 `python_file_*` type 已迁至 `@aily-project/lib-file`：

- `python_file_read`
- `python_file_write`
- `python_file_exists`
- `python_file_list`

type 名称保持不变，但只由 `lib-file` 注册，两个包不会重复注册同一积木。旧工程若使用这些文件积木，需要增加 `@aily-project/lib-file`。

## 安全与平台边界

`python_command` 会将输入交给目标系统的 shell。不要执行不可信或未经校验的输入；命令的可用性、语法、权限和副作用由目标系统决定。

`python_cpu_temperature` 是 Linux 专用能力，依赖 thermal sysfs 节点和 `cat`。设备没有该节点、节点布局不同或当前用户无读取权限时，生成的程序会失败。

该库只向 `globalThis.Python.forBlock` 注册生成器；没有 Python runtime 时安全跳过，不会回退到 MPY/MicroPython。
