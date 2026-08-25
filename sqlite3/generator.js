/* Safe, parameterized SQLite operations backed by Python's sqlite3 standard library. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addCleanup', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Python SQLite received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

  const ORDER_MEMBER = Python.ORDER_MEMBER ?? 2.1;
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
  const GENERATED_IDENTIFIERS = new Set(['sqlite3', '_python_sqlite3']);
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result) || PYTHON_BUILTINS.has(result)
        || GENERATED_IDENTIFIERS.has(result) || result.startsWith('_python_')) result += '_';
    return result || fallback;
  };
  const nameOf = (block, fallback = 'db') => safeName(field(block, 'NAME', fallback), fallback);
  const addSQLiteImport = (generator) => generator.addImport('sqlite3', 'import sqlite3 as _python_sqlite3');
  const declareConnection = (generator, name) => {
    generator.addVariable(`sqlite_connection_${name}`, `${name} = None`);
    generator.addCleanup(
      `sqlite_connection_${name}`,
      `if ${name} is not None:\n    ${name}.close()`,
    );
  };
  const cursor = (generator, block) => value(generator, block, 'CURSOR', 'None', ORDER_MEMBER);
  const params = (generator, block) => value(generator, block, 'PARAMS', '()');
  const sqlCall = (block, generator, method) => {
    const name = nameOf(block);
    const sql = value(generator, block, 'SQL', "''");
    return output(`${name}.${method}(${sql}, ${params(generator, block)})`);
  };

  define('python_sqlite_connect', (block, generator) => {
    const name = nameOf(block);
    const database = value(generator, block, 'DATABASE', "':memory:'");
    const timeout = value(generator, block, 'TIMEOUT', '5');
    const namedRows = field(block, 'ROW_MODE', 'TUPLE') === 'ROW';
    addSQLiteImport(generator);
    declareConnection(generator, name);
    let code = `if ${name} is not None:\n    ${name}.close()\n`;
    code += `${name} = _python_sqlite3.connect(${database}, timeout=${timeout})\n`;
    if (namedRows) code += `${name}.row_factory = _python_sqlite3.Row\n`;
    return code;
  });
  define('python_sqlite_execute', (block, generator) => sqlCall(block, generator, 'execute'));
  define('python_sqlite_query', (block, generator) => sqlCall(block, generator, 'execute'));
  define('python_sqlite_executemany', (block, generator) => sqlCall(block, generator, 'executemany'));
  define('python_sqlite_fetchone', (block, generator) => output(`(${cursor(generator, block)}).fetchone()`));
  define('python_sqlite_fetchall', (block, generator) => output(`(${cursor(generator, block)}).fetchall()`));
  define('python_sqlite_commit', (block) => `${nameOf(block)}.commit()\n`);
  define('python_sqlite_rollback', (block) => `${nameOf(block)}.rollback()\n`);
  define('python_sqlite_rowcount', (block, generator) => output(`(${cursor(generator, block)}).rowcount`, ORDER_MEMBER));
  define('python_sqlite_lastrowid', (block, generator) => output(`(${cursor(generator, block)}).lastrowid`, ORDER_MEMBER));
  define('python_sqlite_close', (block) => {
    const name = nameOf(block);
    return `if ${name} is not None:\n    ${name}.close()\n    ${name} = None\n`;
  });
});
