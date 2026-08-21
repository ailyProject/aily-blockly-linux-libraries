/* Linux UART/serial initialization, I/O, buffer handling, and cleanup. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ["addImport","addVariable","addFunction","addCleanup","valueToCode","quote_"];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Linux Serial received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
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
  const declareResource = (generator, tag, name, cleanup) => {
    generator.addVariable(tag, `${name} = None`);
    if (cleanup && typeof generator.addCleanup === 'function') {
      generator.addCleanup(tag, `if ${name} is not None:\n    ${name}.${cleanup}()`);
    }
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
  const nameOf = (block, fallback) => safeName(field(block, 'NAME', fallback), fallback);
  const output = (code, order = ORDER_CALL) => [code, order];
  const addPayloadHelper = (generator) => {
    generator.addImport('serial_builtins', 'import builtins as _serial_builtins');
    generator.addFunction('serial_payload', [
      'def _serial_payload(data):',
      '    if _serial_builtins.isinstance(data, _serial_builtins.str):',
      "        return data.encode('utf-8')",
      '    if _serial_builtins.isinstance(data, (_serial_builtins.bytes, _serial_builtins.bytearray, _serial_builtins.memoryview)):',
      '        return data',
      "    raise _serial_builtins.TypeError('serial payload must be str or bytes-like')",
    ].join('\n'));
  };
  define('linux_uart_init', (block, generator) => {
    const name = nameOf(block, 'uart');
    generator.addImport('serial', 'import serial');
    declareResource(generator, `uart_${name}`, name, 'close');
    return `${name} = serial.Serial(${generator.quote_(field(block, 'DEVICE', '/dev/serial0'))}, ${field(block, 'BAUD', '115200')})\n`;
  });
  define('linux_uart_available', (block) => output(`${nameOf(block, 'uart')}.in_waiting`, ORDER_MEMBER));
  define('linux_uart_read', (block, generator) => output(`${nameOf(block, 'uart')}.read(${value(generator, block, 'SIZE', '1')})`));
  define('linux_uart_write', (block, generator) => {
    addPayloadHelper(generator);
    return `${nameOf(block, 'uart')}.write(_serial_payload(${value(generator, block, 'DATA', "b''")}))\n`;
  });
  define('linux_uart_flush', (block) => `${nameOf(block, 'uart')}.reset_input_buffer()\n`);
  define('linux_uart_close', (block) => `${nameOf(block, 'uart')}.close()\n`);

  // Migration-stable CyberCAM aliases. They stay registered for saved projects,
  // but are intentionally omitted from toolbox.json in favour of linux_uart_*.
  define('cybercam_uart_init', (block, generator) => {
    const name = nameOf(block, 'uart');
    generator.addImport('serial', 'import serial');
    declareResource(generator, `uart_${name}`, name, 'close');
    return `${name} = serial.Serial("/dev/ttyS2", ${field(block, 'BAUD', '115200')})\n`;
  });
  define('cybercam_uart_available', (block) => output(`${nameOf(block, 'uart')}.inWaiting()`, ORDER_CALL));
  define('cybercam_uart_read', (block, generator) => output(`${nameOf(block, 'uart')}.read(${value(generator, block, 'SIZE', '1')})`, ORDER_CALL));
  define('cybercam_uart_write', (block, generator) => `${nameOf(block, 'uart')}.write(${value(generator, block, 'DATA', "b''")})\n`);
  define('cybercam_uart_flush', (block) => `${nameOf(block, 'uart')}.flushInput()\n`);
  define('cybercam_uart_close', (block) => `${nameOf(block, 'uart')}.close()\n`);
});
