# @aily-project/lib-threading

CPython-only background-task and synchronization blocks registered exclusively on `globalThis.Python.forBlock`. Version: `0.0.1`. Target dependencies are standard-library `threading` and `queue` only.

Block groups:

- Threads: `python_thread_start`, `python_thread_join`, `python_thread_is_alive`.
- Timer: `python_timer_start`, `python_timer_cancel`; timer resources also work with thread join/is-alive.
- Lock: `python_lock_create`, `python_lock_acquire`, `python_lock_release`, `python_lock_locked`.
- Event: `python_event_create`, `python_event_set`, `python_event_clear`, `python_event_wait`, `python_event_is_set`.
- Queue: `python_queue_create`, `python_queue_put`, `python_queue_get`, `python_queue_task_done`, `python_queue_join`, `python_queue_qsize`, `python_queue_empty`.

Thread and Timer body statements are emitted inside generated, safely named zero-argument functions. The resource is then created and started immediately. Resource-name fields are normalized against Python keywords, selected builtins, internal aliases, and the `_python_` prefix. Daemon and operation modes are fixed dropdown allowlists. No field supplies an arbitrary callable, method, or attribute.

Thread join and Event wait use `None` when the timeout socket is empty, meaning no deadline. Lock acquire and Queue put/get expose `BLOCK`, `TRY`, and `TIMEOUT`: BLOCK ignores the timeout socket, TRY uses the non-blocking API, and TIMEOUT uses the numeric socket with a five-second generator fallback. Queue join has no timeout in Python.

Threads are not force-stopped or automatically joined during cleanup. Daemon threads may be terminated abruptly at process shutdown. Timer cancel only works before callback execution begins. Lock and Event state checks, Queue qsize, and Queue empty are momentary snapshots, not synchronization guarantees. Each successful Queue get intended to participate in Queue join must have exactly one later task_done.

Authoritative references: Python [threading](https://docs.python.org/3/library/threading.html) and [queue](https://docs.python.org/3/library/queue.html).
