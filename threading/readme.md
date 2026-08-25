# Threading

`@aily-project/lib-threading` 是面向 `globalThis.Python` 的 CPython 标准并发库，版本固定为 `0.0.1`。它使用 Python 自带的 `threading` 与 `queue`，无需安装第三方包。

## 后台任务与 Timer

“启动后台任务”积木会把 statement body 生成为独立命名函数，创建同名 `Thread` 资源并立即调用 `start()`。Timer 使用相同方式生成一次性回调，并在指定延迟后执行。资源名会净化为安全 Python 标识符；生成函数名、导入别名和方法均不是用户可注入字段。

daemon 线程不会阻止 Python 进程退出，进程关闭时也可能在工作尚未完成时直接结束它。非 daemon 线程会让进程等待其自然结束。库不会强行停止线程，也不会在 cleanup 中无限 join；需要确定完成时应显式使用 join。后台函数中的未捕获异常由 Python 线程异常机制报告，不会自动传回启动线程。

join 的 timeout 输入为空时生成 `None`，表示无限等待；提供数字时最多等待相应秒数。join 本身不返回“是否完成”，应随后使用 `is_alive` 判断。Timer 的 `cancel()` 只在回调尚未开始时有效；Timer 同样可使用通用 join 和 `is_alive` 积木。

## Lock 与 Event

Lock 是非重入互斥锁。acquire 有三个固定模式：

- `wait`：无限等待，忽略 timeout 输入。
- `try once`：非阻塞尝试，忽略 timeout，立即返回布尔值。
- `wait with timeout`：最多等待输入秒数并返回布尔值。

释放未锁定的 Lock 会抛出 `RuntimeError`。`locked()` 只是瞬时快照，不能代替 acquire 作为同步保证。

Event 初始为 clear。`set()` 会唤醒当前等待者，`clear()` 让之后的等待重新阻塞。Event wait 的 timeout 为空时无限等待，有数字时最多等待相应秒数，并返回事件是否已 set。`is_set()` 同样只是瞬时状态。

## Queue

Queue 是线程安全 FIFO 队列。`maxsize=0` 表示无界。put/get 具有与 Lock acquire 相同的三种等待模式；非阻塞或超时失败分别由 Python 抛出 `queue.Full` 或 `queue.Empty`。

每次成功 get 后，消费者完成处理时应调用一次 `task_done()`。`join()` 没有 timeout，并会一直等待到每个已入队任务都收到对应的 `task_done()`；多调用会抛出 `ValueError`，少调用会永久等待。`qsize()` 与 `empty()` 只提供近似快照，不能据此保证下一次 get/put 不阻塞。

线程共享同一进程内存。跨线程更新多个相关值时应使用 Lock；在线程间传递工作项时优先使用 Queue；通知状态时使用 Event。CPython 的 GIL 不等同于业务数据的同步，也不让复合操作自动成为线程安全操作。

参考：[threading](https://docs.python.org/3/library/threading.html) 与 [queue](https://docs.python.org/3/library/queue.html)。
