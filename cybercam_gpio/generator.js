/* CyberCAM GPIO and PWM generator — official 01Studio/walnutpi APIs only. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can outlive a project-mode change. Skip inactive realms
  // instead of registering CPython handlers on Arduino or MicroPython.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addSetup', 'addCleanup', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`CyberCAM GPIO & PWM received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
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
  const BOARD_PIN_ALIASES = {
    '11': 'TX2',
    '12': 'RX2',
    '21': 'KEY',
    '46': 'LIGHT',
    '47': 'BEEP',
    '52': 'LED',
  };
  const pinExpression = (pin) => BOARD_PIN_ALIASES[pin]
    ? `board.${BOARD_PIN_ALIASES[pin]}`
    : `board.IO${pin}`;
  const output = (code, order = ORDER_CALL) => [code, order];

  define('cybercam_gpio_init', (block, generator) => {
    const name = nameOf(block, 'pin');
    const pin = String(field(block, 'PIN', '14'));
    const direction = field(block, 'DIRECTION', 'OUTPUT');
    const pull = field(block, 'PULL', 'NONE');
    generator.addImport('board', 'import board');
    generator.addImport('digitalio', 'from digitalio import DigitalInOut, Direction, Pull');
    declareResource(generator, `gpio_${name}`, name, 'deinit');
    let code = `${name} = DigitalInOut(${pinExpression(pin)})\n${name}.direction = Direction.${direction}\n`;
    if (direction === 'INPUT' && pull !== 'NONE') code += `${name}.pull = Pull.${pull}\n`;
    return code;
  });
  define('cybercam_gpio_write', (block, generator) => {
    const name = nameOf(block, 'pin');
    return `${name}.value = bool(${value(generator, block, 'VALUE', 'False')})\n`;
  });
  define('cybercam_gpio_read', (block) => output(`${nameOf(block, 'pin')}.value`, ORDER_MEMBER));
  define('cybercam_gpio_deinit', (block) => `${nameOf(block, 'pin')}.deinit()\n`);
  define('cybercam_led_write', (block, generator) => {
    const state = value(generator, block, 'VALUE', 'True');
    generator.addImport('board', 'import board');
    generator.addImport('digitalio', 'from digitalio import DigitalInOut, Direction, Pull');
    generator.addVariable('gpio_cybercam_led', '_cybercam_led = DigitalInOut(board.LED)');
    generator.addSetup('gpio_cybercam_led', '_cybercam_led.direction = Direction.OUTPUT');
    if (typeof generator.addCleanup === 'function') {
      generator.addCleanup('gpio_cybercam_led', 'if _cybercam_led is not None:\n    _cybercam_led.deinit()');
    }
    return `_cybercam_led.value = bool(${state})\n`;
  });
  define('cybercam_key_pressed', (_block, generator) => {
    generator.addImport('board', 'import board');
    generator.addImport('digitalio', 'from digitalio import DigitalInOut, Direction, Pull');
    generator.addVariable('gpio_cybercam_key', '_cybercam_key = DigitalInOut(board.KEY)');
    generator.addSetup('gpio_cybercam_key', '_cybercam_key.direction = Direction.INPUT\n_cybercam_key.pull = Pull.UP');
    if (typeof generator.addCleanup === 'function') {
      generator.addCleanup('gpio_cybercam_key', 'if _cybercam_key is not None:\n    _cybercam_key.deinit()');
    }
    return output('not _cybercam_key.value', ORDER_NONE);
  });

  define('cybercam_pwm_init', (block, generator) => {
    const name = nameOf(block, 'pwm');
    const target = String(field(block, 'TARGET', '0,2')).split(',');
    generator.addImport('periphery_pwm', 'from periphery import PWM');
    declareResource(generator, `pwm_${name}`, name, 'close');
    return `${name} = PWM(${target[0]}, ${target[1]})\n`;
  });
  define('cybercam_pwm_frequency', (block, generator) => `${nameOf(block, 'pwm')}.frequency = ${value(generator, block, 'FREQUENCY', '1000')}\n`);
  define('cybercam_pwm_duty', (block, generator) => `${nameOf(block, 'pwm')}.duty_cycle = max(0.0, min(1.0, float(${value(generator, block, 'DUTY', '0.5')})))\n`);
  for (const method of ['enable', 'disable', 'close']) {
    define(`cybercam_pwm_${method}`, (block) => `${nameOf(block, 'pwm')}.${method}()\n`);
  }
});
