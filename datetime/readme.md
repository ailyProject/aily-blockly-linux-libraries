# 日期与时间 Blockly 库

该库面向 Linux 单板机上的标准 CPython，使用 datetime 与 time 标准库，不需要安装额外的 pip 依赖。

## 能力

- 获取本地当前时间和带 UTC 时区的当前时间。
- 获取 POSIX 秒时间戳。
- 以 monotonic_ns 为基础获取单调毫秒或微秒计数，适合计算耗时，不可当作日期时间。
- 构造、strftime 格式化、strptime 解析 datetime。
- 在 POSIX 时间戳与本地或 UTC datetime 之间转换。
- 读取年、月、日、时、分、秒、微秒、星期和年内日序。
- 生成及解析 ISO 8601 文本。
- 按毫秒暂停当前线程。

## 时间与异常语义

- 当前本地时间和本地时间戳转换返回不带时区的 naive datetime；UTC 操作返回带 datetime.timezone.utc 的 aware datetime。
- POSIX 时间戳来自系统墙上时钟，可能被系统校时；单调计数只保证同一进程运行期内适合比较差值。
- 构造、解析、格式化和时区转换沿用 CPython 标准异常，例如 ValueError、TypeError、OverflowError 或 OSError，不捕获也不替换。
- 毫秒睡眠直接调用 time.sleep；负值仍会由 CPython 抛出 ValueError。
- 所有下拉字段都映射到固定白名单，用户字段不会作为 Python 标识符或源代码直接拼接。

参考文档：https://docs.python.org/3/library/datetime.html
