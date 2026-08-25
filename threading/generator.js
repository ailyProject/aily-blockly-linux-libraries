/* User-facing background tasks and synchronization built on Python standard libraries. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addFunction', 'valueToCode', 'statementToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Python Threading received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

  const ORDER_CALL = Python.ORDER_FUNCTION_CALL ?? 2.2;
  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const define = (type, generator) => { Python.forBlock[type] = generator; };
  const field = (block, name, fallback = '') => block.getFieldValue(name) ?? fallback;
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || fallback;
  const output = (code, order = ORDER_CALL) => [code, order];
  const PYTHON_KEYWORDS = new Set([
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
    'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
    'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
    'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
  ]);
  const PYTHON_BUILTINS = new Set([
    'abs', 'all', 'any', 'bool', 'bytes', 'dict', 'float', 'input', 'int',
    'len', 'list', 'map', 'max', 'min', 'object', 'open', 'print', 'range',
    'set', 'str', 'sum', 'tuple', 'type', 'zip', 'Exception', 'RuntimeError',
    'TimeoutError', 'TypeError', 'ValueError',
  ]);
  const GENERATED_IDENTIFIERS = new Set([
    'threading', 'queue', '_python_threading', '_python_queue',
  ]);
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result) || PYTHON_BUILTINS.has(result)
        || GENERATED_IDENTIFIERS.has(result) || result.startsWith('_python_')) result += '_';
    return result || fallback;
  };
  const nameOf = (block, fallback) => safeName(field(block, 'NAME', fallback), fallback);
  const addThreadingImport = (generator) => generator.addImport('threading', 'import threading as _python_threading');
  const addQueueImport = (generator) => generator.addImport('queue', 'import queue as _python_queue');
  const declareResource = (generator, kind, name) => generator.addVariable(`${kind}_${name}`, `${name} = None`);
  const booleanField = (block, name) => field(block, name, 'TRUE') === 'FALSE' ? 'False' : 'True';
  const statement = (generator, block, name) => {
    const indent = generator.INDENT || '    ';
    const lines = (generator.statementToCode(block, name) || '')
      .replace(/\r\n/g, '\n')
      .split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    return lines
      .map((line) => line.startsWith(indent) ? line.slice(indent.length) : line)
      .join('\n');
  };
  const indentBody = (body) => body.split('\n').map((line) => `    ${line}`).join('\n');
  const addBodyFunction = (generator, key, functionName, block) => {
    const body = statement(generator, block, 'DO') || 'pass';
    generator.addFunction(key, `def ${functionName}():\n${indentBody(body)}`);
  };
  const modeOf = (block) => {
    const mode = field(block, 'MODE', 'BLOCK');
    return ['BLOCK', 'TRY', 'TIMEOUT'].includes(mode) ? mode : 'BLOCK';
  };
  const acquireCall = (name, mode, timeout) => {
    if (mode === 'TRY') return `${name}.acquire(blocking=False)`;
    if (mode === 'TIMEOUT') return `${name}.acquire(timeout=${timeout})`;
    return `${name}.acquire()`;
  };
  const queuePutCall = (name, item, mode, timeout) => {
    if (mode === 'TRY') return `${name}.put_nowait(${item})`;
    if (mode === 'TIMEOUT') return `${name}.put(${item}, timeout=${timeout})`;
    return `${name}.put(${item})`;
  };
  const queueGetCall = (name, mode, timeout) => {
    if (mode === 'TRY') return `${name}.get_nowait()`;
    if (mode === 'TIMEOUT') return `${name}.get(timeout=${timeout})`;
    return `${name}.get()`;
  };

  define('python_thread_start', (block, generator) => {
    const name = nameOf(block, 'worker');
    const functionName = `_python_thread_task_${name}`;
    addThreadingImport(generator);
    declareResource(generator, 'thread', name);
    addBodyFunction(generator, `thread_task_${name}`, functionName, block);
    return `${name} = _python_threading.Thread(target=${functionName}, name=${JSON.stringify(name)}, daemon=${booleanField(block, 'DAEMON')})\n${name}.start()\n`;
  });
  define('python_thread_join', (block, generator) =>
    `${nameOf(block, 'worker')}.join(${value(generator, block, 'TIMEOUT', 'None')})\n`);
  define('python_thread_is_alive', (block) => output(`${nameOf(block, 'worker')}.is_alive()`));
  define('python_timer_start', (block, generator) => {
    const name = nameOf(block, 'timer');
    const functionName = `_python_timer_task_${name}`;
    addThreadingImport(generator);
    declareResource(generator, 'timer', name);
    addBodyFunction(generator, `timer_task_${name}`, functionName, block);
    return `${name} = _python_threading.Timer(${value(generator, block, 'DELAY', '1')}, ${functionName})\n${name}.daemon = ${booleanField(block, 'DAEMON')}\n${name}.start()\n`;
  });
  define('python_timer_cancel', (block) => `${nameOf(block, 'timer')}.cancel()\n`);

  define('python_lock_create', (block, generator) => {
    const name = nameOf(block, 'lock');
    addThreadingImport(generator);
    declareResource(generator, 'lock', name);
    return `${name} = _python_threading.Lock()\n`;
  });
  define('python_lock_acquire', (block, generator) => {
    const name = nameOf(block, 'lock');
    return output(acquireCall(name, modeOf(block), value(generator, block, 'TIMEOUT', '5')));
  });
  define('python_lock_release', (block) => `${nameOf(block, 'lock')}.release()\n`);
  define('python_lock_locked', (block) => output(`${nameOf(block, 'lock')}.locked()`));

  define('python_event_create', (block, generator) => {
    const name = nameOf(block, 'ready');
    addThreadingImport(generator);
    declareResource(generator, 'event', name);
    return `${name} = _python_threading.Event()\n`;
  });
  define('python_event_set', (block) => `${nameOf(block, 'ready')}.set()\n`);
  define('python_event_clear', (block) => `${nameOf(block, 'ready')}.clear()\n`);
  define('python_event_wait', (block, generator) =>
    output(`${nameOf(block, 'ready')}.wait(${value(generator, block, 'TIMEOUT', 'None')})`));
  define('python_event_is_set', (block) => output(`${nameOf(block, 'ready')}.is_set()`));

  define('python_queue_create', (block, generator) => {
    const name = nameOf(block, 'jobs');
    addQueueImport(generator);
    declareResource(generator, 'queue', name);
    return `${name} = _python_queue.Queue(maxsize=${value(generator, block, 'MAXSIZE', '0')})\n`;
  });
  define('python_queue_put', (block, generator) => {
    const name = nameOf(block, 'jobs');
    const item = value(generator, block, 'ITEM', 'None');
    return `${queuePutCall(name, item, modeOf(block), value(generator, block, 'TIMEOUT', '5'))}\n`;
  });
  define('python_queue_get', (block, generator) => {
    const name = nameOf(block, 'jobs');
    return output(queueGetCall(name, modeOf(block), value(generator, block, 'TIMEOUT', '5')));
  });
  define('python_queue_task_done', (block) => `${nameOf(block, 'jobs')}.task_done()\n`);
  define('python_queue_join', (block) => `${nameOf(block, 'jobs')}.join()\n`);
  define('python_queue_qsize', (block) => output(`${nameOf(block, 'jobs')}.qsize()`));
  define('python_queue_empty', (block) => output(`${nameOf(block, 'jobs')}.empty()`));
});
