/* Raspberry Pi SPI initialization, full-duplex transfer, read/write, and cleanup through py-spidev. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addCleanup', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Raspberry Pi SPI received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
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
  const nameOf = (block, fallback = 'spi') => safeName(field(block, 'NAME', fallback), fallback);
  const busNumber = (raw) => {
    const match = String(raw ?? 'SPI0').match(/(\d+)\D*$/);
    return match ? String(Number(match[1])) : '0';
  };
  const output = (code) => [code, ORDER_CALL];

  define('rpi_spi_init', (block, generator) => {
    const name = nameOf(block);
    const tag = `spi_${name}`;
    const device = field(block, 'DEVICE', '0') === '1' ? '1' : '0';
    const requestedMode = field(block, 'MODE', '0');
    const mode = ['0', '1', '2', '3'].includes(requestedMode) ? requestedMode : '0';
    const bits = field(block, 'BITS', '8') === '16' ? '16' : '8';
    generator.addImport('spidev', 'import spidev');
    generator.addVariable(tag, `${name} = None`);
    generator.addCleanup(tag, `if ${name} is not None:\n    ${name}.close()`);
    return [
      `${name} = spidev.SpiDev()`,
      `${name}.open(${busNumber(field(block, 'BUS', 'SPI0'))}, ${device})`,
      `${name}.mode = ${mode}`,
      `${name}.max_speed_hz = int(${value(generator, block, 'SPEED', '500000')})`,
      `${name}.bits_per_word = ${bits}`,
      '',
    ].join('\n');
  });
  define('rpi_spi_transfer', (block, generator) =>
    output(`${nameOf(block)}.xfer2(${value(generator, block, 'DATA', '[]')})`));
  define('rpi_spi_read', (block, generator) =>
    output(`${nameOf(block)}.readbytes(int(${value(generator, block, 'LENGTH', '1')}))`));
  define('rpi_spi_write', (block, generator) =>
    `${nameOf(block)}.writebytes2(${value(generator, block, 'DATA', '[]')})\n`);
  define('rpi_spi_close', (block) => `${nameOf(block)}.close()\n`);
});
