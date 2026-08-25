# SQLite

`@aily-project/lib-sqlite3` 为 `globalThis.Python` 提供跨平台 SQLite 标准库积木，版本固定为 `0.0.1`。目标端只使用 Python 自带的 `sqlite3`，无需安装第三方包。

## 功能

- 以安全净化后的变量名创建连接，并在生成程序的 cleanup 阶段关闭仍然打开的连接。
- `execute`、`query` 和 `executemany` 均返回标准 `sqlite3.Cursor`。
- 支持 `fetchone`、`fetchall`、`rowcount`、`lastrowid`。
- 显式提供 `commit`、`rollback` 和 `close`。
- 连接可返回普通元组，或通过 `sqlite3.Row` 返回支持列名访问的行。

## 参数化 SQL

SQL 和参数是两个独立输入。参数输入未连接时固定生成空元组 `()`。所有外部数据都应放在参数序列或参数字典中，SQL 使用占位符：

```python
db.execute("INSERT INTO items(name) VALUES (?)", (name,))
db.execute("SELECT * FROM items WHERE id = ?", (item_id,))
db.execute("SELECT * FROM items WHERE name = :name", {"name": name})
```

不要用字符串拼接、格式化字符串或 `%` 运算把输入嵌入 SQL。积木不会自动检查 SQL 文本，也不会替用户重写或转义拼接后的 SQL；安全边界是始终使用数据库驱动的占位符绑定。

`executemany` 的第三个输入应是参数行序列，例如 `[("A",), ("B",)]`。其空输入生成 `()`，因此不会执行任何参数行。

## 资源与事务

打开连接时会先声明命名资源为 `None`，并注册条件式 cleanup。每次重新执行连接积木时，如果同名资源仍指向已有连接，生成代码会先关闭旧连接，再创建新连接，避免连接积木位于循环或重复路径时泄漏。显式关闭会将变量重新设为 `None`，所以最终 cleanup 不会二次关闭。无论显式关闭还是同名重连，`close()` 都不会隐式提交尚未提交的事务；写操作完成后应明确使用 `commit`，失败路径可使用 `rollback`。

连接的 timeout 是 SQLite 等待数据库锁释放的秒数，不是查询执行时限。默认值为 5 秒。`fetchone()` 在结果耗尽时返回 `None`；`fetchall()` 会把全部剩余行加载到内存。`rowcount` 对查询通常为 `-1`，`lastrowid` 在不适用时可能为 `None`。

资源名称来自 Blockly 固定字段，但会转换为合法 Python 标识符，并避开 Python 关键字、常见内置名和库内部名称。SQL 方法和行模式均由固定积木或下拉白名单决定，不会把字段文本作为 Python 属性或方法注入生成代码。

参考：[Python `sqlite3` 文档](https://docs.python.org/3/library/sqlite3.html)。
