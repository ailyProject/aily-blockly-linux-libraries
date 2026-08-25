/* DS3231 precision RTC access through Adafruit Blinka on Linux CPython. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addFunction', 'addCleanup', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`DS3231 RTC received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
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
  const output = (code, order = ORDER_MEMBER) => [code, order];
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
    'TypeError', 'ValueError',
  ]);
  const GENERATED_IDENTIFIERS = new Set([
    'adafruit_ds3231', 'board', 'time',
    '_python_ds3231_struct_time', '_python_ds3231_calibration',
  ]);
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result) || PYTHON_BUILTINS.has(result)
        || GENERATED_IDENTIFIERS.has(result) || result.startsWith('_python_ds3231_')) result += '_';
    return result || fallback;
  };
  // Keep device resources out of the module, builtin, and helper namespaces even
  // when a user deliberately chooses names such as board or __builtins__.
  const nameOf = (block) => `_aily_ds3231_${safeName(field(block, 'NAME', 'rtc'), 'rtc')}`;
  const ownedBus = (name) => `_python_ds3231_owned_i2c_${name}`;
  const addRtcImport = (generator) => {
    generator.addImport('adafruit_ds3231', 'import adafruit_ds3231');
  };
  const declareRtc = (generator, name) => {
    const bus = ownedBus(name);
    generator.addVariable(`ds3231_${name}`, `${name} = None\n${bus} = None`);
    generator.addCleanup(`ds3231_${name}`, [
      `if ${bus} is not None:`,
      `    ${bus}.deinit()`,
      `${bus} = None`,
      `${name} = None`,
    ].join('\n'));
  };
  const addStructTimeHelper = (generator) => {
    generator.addImport(
      'python_ds3231_datetime_module',
      'import datetime as _python_ds3231_datetime_module',
    );
    generator.addImport(
      'python_ds3231_time_module',
      'import time as _python_ds3231_time_module',
    );
    generator.addFunction('python_ds3231_struct_time', [
      'def _python_ds3231_struct_time(value):',
      '    if isinstance(value, _python_ds3231_time_module.struct_time):',
      '        values = value',
      "    elif hasattr(value, 'timetuple'):",
      '        values = value.timetuple()',
      '    else:',
      '        values = list(value)',
      '    if len(values) < 6:',
      "        raise ValueError('DS3231 date/time requires at least year, month, day, hour, minute, and second')",
      '    parts = tuple(int(item) for item in values[:6])',
      '    if parts[0] < 2000 or parts[0] > 2099:',
      "        raise ValueError('DS3231 year must be between 2000 and 2099')",
      '    checked = _python_ds3231_datetime_module.datetime(*parts)',
      '    return checked.timetuple()',
    ].join('\n'));
  };
  const addCalibrationHelper = (generator) => {
    generator.addFunction('python_ds3231_calibration', [
      'def _python_ds3231_calibration(value):',
      '    value = int(value)',
      '    if value < -128 or value > 127:',
      "        raise ValueError('DS3231 calibration must be between -128 and 127')",
      '    return value',
    ].join('\n'));
  };

  define('python_ds3231_init', (block, generator) => {
    const name = nameOf(block);
    const bus = ownedBus(name);
    const externalI2c = generator.valueToCode(block, 'I2C', ORDER_NONE);
    addRtcImport(generator);
    declareRtc(generator, name);
    const lines = [
      `if ${bus} is not None:`,
      `    ${bus}.deinit()`,
      `${bus} = None`,
    ];
    if (externalI2c) {
      lines.push(`${name} = adafruit_ds3231.DS3231(${externalI2c})`);
    } else {
      generator.addImport('board', 'import board');
      lines.push(`${bus} = board.I2C()`);
      lines.push(`${name} = adafruit_ds3231.DS3231(${bus})`);
    }
    return `${lines.join('\n')}\n`;
  });
  define('python_ds3231_datetime', (block) => output(`${nameOf(block)}.datetime`));
  define('python_ds3231_set_datetime', (block, generator) => {
    addStructTimeHelper(generator);
    return `${nameOf(block)}.datetime = _python_ds3231_struct_time(${value(generator, block, 'DATETIME')})\n`;
  });
  define('python_ds3231_temperature', (block) => output(`${nameOf(block)}.temperature`));
  define('python_ds3231_force_temperature', (block) => output(`${nameOf(block)}.force_temperature_conversion()`, ORDER_CALL));
  define('python_ds3231_lost_power', (block) => output(`${nameOf(block)}.lost_power`));
  define('python_ds3231_calibration', (block) => output(`${nameOf(block)}.calibration`));
  define('python_ds3231_set_calibration', (block, generator) => {
    addCalibrationHelper(generator);
    return `${nameOf(block)}.calibration = _python_ds3231_calibration(${value(generator, block, 'CALIBRATION', '0')})\n`;
  });
  define('python_ds3231_close', (block) => {
    const name = nameOf(block);
    const bus = ownedBus(name);
    return `if ${bus} is not None:\n    ${bus}.deinit()\n${bus} = None\n${name} = None\n`;
  });
});
