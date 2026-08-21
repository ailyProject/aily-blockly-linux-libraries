/* Python program structure, variables, and basic data primitives. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ["addImport","addSetup","addLoop","valueToCode","statementToCode","quote_"];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Python Core received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

  const ORDER_ATOMIC = Python.ORDER_ATOMIC ?? 0;
  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const define = (type, generator) => { Python.forBlock[type] = generator; };
  const field = (block, name, fallback = '') => block.getFieldValue(name) ?? fallback;
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || fallback;
  const statement = (generator, block, name) => {
    const indent = generator.INDENT || '    ';
    const lines = (generator.statementToCode(block, name) || '')
      .replace(/\r\n/g, '\n')
      .split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    return lines
      .map(line => line.startsWith(indent) ? line.slice(indent.length) : line)
      .join('\n');
  };
  const PYTHON_KEYWORDS = new Set([
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
    'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
    'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
    'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
  ]);
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result)) result += '_';
    return result || fallback;
  };
  const NAME_SCOPE_KEY = Symbol.for('@aily-project/python-name-scopes');
  const scopesOf = (generator) => generator[NAME_SCOPE_KEY] || [];
  const resolveName = (generator, name, fallback) => {
    const rawName = String(name || fallback);
    const scopes = scopesOf(generator);
    for (let index = scopes.length - 1; index >= 0; index--) {
      if (scopes[index].has(rawName)) return scopes[index].get(rawName);
    }
    return safeName(rawName, fallback);
  };
  const output = (code, order = ORDER_ATOMIC) => [code, order];
  define('python_start', (block, generator) => {
    generator.addSetup('python_start', statement(generator, block, 'DO') || 'pass', true);
    return '';
  });
  define('python_forever', (block, generator) => {
    generator.addLoop('python_forever', statement(generator, block, 'DO') || 'pass', true);
    return '';
  });
  define('python_sleep', (block, generator) => {
    generator.addImport('time', 'import time');
    return `time.sleep(${value(generator, block, 'SECONDS', '1')})\n`;
  });
  define('python_print', (block, generator) => `print(${value(generator, block, 'VALUE', "''")})\n`);
  define('python_number', (block) => output(String(field(block, 'VALUE', '0')), ORDER_ATOMIC));
  define('python_text', (block, generator) => output(generator.quote_(field(block, 'VALUE', '')), ORDER_ATOMIC));
  define('python_boolean', (block) => output(field(block, 'VALUE', 'TRUE') === 'TRUE' ? 'True' : 'False', ORDER_ATOMIC));
  define('python_tuple', (block, generator) => {
    const items = value(generator, block, 'ITEMS', '');
    return output(items ? `(${items},)` : '()', ORDER_ATOMIC);
  });
  define('python_list', (block, generator) => output(`[${value(generator, block, 'ITEMS', '')}]`, ORDER_ATOMIC));
  define('python_arguments', (block, generator) => {
    const values = [];
    for (let index = 0; index < 6; index++) {
      const code = value(generator, block, `VALUE${index}`, '');
      if (code) values.push(code);
    }
    return output(`[${values.join(', ')}]`, ORDER_ATOMIC);
  });
  define('python_keyword_arguments', (block, generator) => {
    const pairs = [];
    for (let index = 0; index < 6; index++) {
      const key = String(field(block, `KEY${index}`, '')).trim();
      if (!key) continue;
      const code = value(generator, block, `VALUE${index}`, 'None');
      pairs.push(`${generator.quote_(key)}: ${code}`);
    }
    return output(`{${pairs.join(', ')}}`, ORDER_ATOMIC);
  });
  define('python_get_item', (block, generator) => output(
    `(${value(generator, block, 'OBJECT')})[${value(generator, block, 'KEY')}]`,
    ORDER_ATOMIC,
  ));
  define('python_set_item', (block, generator) => (
    `(${value(generator, block, 'OBJECT')})[${value(generator, block, 'KEY')}] = ${value(generator, block, 'VALUE')}\n`
  ));
  define('python_set_attribute', (block, generator) => {
    const requested = field(block, 'ATTRIBUTE', 'value');
    const attribute = /^[A-Za-z][A-Za-z0-9_]*$/.test(requested) ? requested : 'value';
    return `(${value(generator, block, 'OBJECT')}).${attribute} = ${value(generator, block, 'VALUE')}\n`;
  });
  define('python_set_variable', (block, generator) => `${resolveName(generator, field(block, 'NAME', 'value'), 'value')} = ${value(generator, block, 'VALUE')}\n`);
  define('python_get_variable', (block, generator) => output(resolveName(generator, field(block, 'NAME', 'value'), 'value'), ORDER_ATOMIC));
  define('python_if', (block, generator) => {
    const body = statement(generator, block, 'DO') || 'pass';
    return `if ${value(generator, block, 'CONDITION', 'False')}:\n${body.split('\n').map(line => line ? `    ${line}` : '').join('\n')}\n`;
  });
  define('python_for_each', (block, generator) => {
    const body = statement(generator, block, 'DO') || 'pass';
    return `for ${safeName(field(block, 'NAME', 'item'), 'item')} in ${value(generator, block, 'ITEMS', '[]')}:\n${body.split('\n').map(line => line ? `    ${line}` : '').join('\n')}\n`;
  });
});
