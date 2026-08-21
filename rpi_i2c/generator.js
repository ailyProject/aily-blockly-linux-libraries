/* Raspberry Pi I2C/SMBus access through smbus2. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addFunction', 'addCleanup', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Raspberry Pi I2C / SMBus received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
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
  const addSmbusImport = (generator) => {
    generator.addImport('smbus2', 'from smbus2 import SMBus, i2c_msg');
  };
  const declareResource = (generator, tag, name) => {
    generator.addVariable(tag, `${name} = None`);
    generator.addCleanup(tag, `if ${name} is not None:\n    ${name}.close()`);
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
  const nameOf = (block, fallback = 'i2c') => safeName(field(block, 'NAME', fallback), fallback);
  const busNumber = (bus) => {
    const raw = String(bus ?? 'I2C1').trim();
    const match = raw.match(/i2c[^0-9]*(\d+)/i) || raw.match(/(\d+)\s*$/);
    if (!match) return '1';
    const parsed = Number.parseInt(match[1], 10);
    return Number.isSafeInteger(parsed) && parsed >= 0 ? String(parsed) : '1';
  };
  const integer = (code) => `int(${code})`;
  const addByteListHelper = (generator) => {
    generator.addFunction(
      'rpi_i2c_byte_list',
      "def _rpi_i2c_byte_list(values):\n    result = [int(value) for value in values]\n    if any(value < 0 or value > 255 for value in result):\n        raise ValueError('I2C byte values must be between 0 and 255')\n    return result",
    );
  };
  const addWriteReadHelper = (generator) => {
    addSmbusImport(generator);
    addByteListHelper(generator);
    generator.addFunction(
      'rpi_i2c_write_read',
      "def _rpi_i2c_write_read(bus, address, write_data, read_length):\n    write_message = i2c_msg.write(int(address), _rpi_i2c_byte_list(write_data))\n    read_message = i2c_msg.read(int(address), int(read_length))\n    bus.i2c_rdwr(write_message, read_message)\n    return list(read_message)",
    );
  };

  define('rpi_i2c_init', (block, generator) => {
    const name = nameOf(block);
    addSmbusImport(generator);
    declareResource(generator, `rpi_i2c_${name}`, name);
    return `if ${name} is not None:\n    ${name}.close()\n${name} = SMBus(${busNumber(field(block, 'BUS', 'I2C1'))})\n`;
  });
  define('rpi_i2c_read_byte_data', (block, generator) => output(
    `${nameOf(block)}.read_byte_data(${integer(value(generator, block, 'ADDRESS', '0x50'))}, ${integer(value(generator, block, 'REGISTER', '0'))})`,
  ));
  define('rpi_i2c_write_byte_data', (block, generator) =>
    `${nameOf(block)}.write_byte_data(${integer(value(generator, block, 'ADDRESS', '0x50'))}, ${integer(value(generator, block, 'REGISTER', '0'))}, ${integer(value(generator, block, 'DATA', '0'))})\n`);
  define('rpi_i2c_read_word_data', (block, generator) => output(
    `${nameOf(block)}.read_word_data(${integer(value(generator, block, 'ADDRESS', '0x50'))}, ${integer(value(generator, block, 'REGISTER', '0'))})`,
  ));
  define('rpi_i2c_write_word_data', (block, generator) =>
    `${nameOf(block)}.write_word_data(${integer(value(generator, block, 'ADDRESS', '0x50'))}, ${integer(value(generator, block, 'REGISTER', '0'))}, ${integer(value(generator, block, 'DATA', '0'))})\n`);
  define('rpi_i2c_read_i2c_block', (block, generator) => output(
    `${nameOf(block)}.read_i2c_block_data(${integer(value(generator, block, 'ADDRESS', '0x50'))}, ${integer(value(generator, block, 'REGISTER', '0'))}, ${integer(value(generator, block, 'LENGTH', '16'))})`,
  ));
  define('rpi_i2c_write_i2c_block', (block, generator) => {
    addByteListHelper(generator);
    return `${nameOf(block)}.write_i2c_block_data(${integer(value(generator, block, 'ADDRESS', '0x50'))}, ${integer(value(generator, block, 'REGISTER', '0'))}, _rpi_i2c_byte_list(${value(generator, block, 'DATA', '[0]')}))\n`;
  });
  define('rpi_i2c_write_read', (block, generator) => {
    addWriteReadHelper(generator);
    return output(`_rpi_i2c_write_read(${nameOf(block)}, ${value(generator, block, 'ADDRESS', '0x50')}, ${value(generator, block, 'WRITE_DATA', '[0]')}, ${value(generator, block, 'READ_LENGTH', '1')})`);
  });
  define('rpi_i2c_close', (block) => `${nameOf(block)}.close()\n`);
});
