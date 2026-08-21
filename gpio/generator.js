/* Linux gpiozero digital I/O, LED, Button, and PWM. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ["addImport","addVariable","addFunction","addCleanup","valueToCode"];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Linux GPIO & PWM received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
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
  const pinNumber = (pin, fallback = '17') => {
    const match = String(pin ?? '').match(/(\d+)\s*$/);
    return match ? String(Number.parseInt(match[1], 10)) : fallback;
  };
  const addTimingHelpers = (generator) => {
    generator.addFunction('linux_gpio_timing_helpers', [
      'def _linux_optional_seconds(value):',
      '    value = float(value)',
      '    return None if value <= 0 else value',
      '',
      'def _linux_blink_count(value):',
      '    value = int(value)',
      '    return None if value <= 0 else value',
    ].join('\n'));
  };
  define('linux_gpio_init', (block, generator) => {
    const name = nameOf(block, 'pin');
    const pin = pinNumber(field(block, 'PIN', '17'), '17');
    const direction = field(block, 'DIRECTION', 'OUTPUT');
    const pull = field(block, 'PULL', 'NONE');
    generator.addImport('gpiozero', 'from gpiozero import DigitalInputDevice, DigitalOutputDevice, PWMOutputDevice, LED, Button');
    declareResource(generator, `gpio_${name}`, name, 'close');
    if (direction === 'INPUT') {
      const pullUp = pull === 'UP' ? 'True' : pull === 'DOWN' ? 'False' : 'None';
      const activeState = pull === 'NONE' ? ', active_state=True' : '';
      return `${name} = DigitalInputDevice(${pin}, pull_up=${pullUp}${activeState})\n`;
    }
    return `${name} = DigitalOutputDevice(${pin})\n`;
  });
  define('linux_gpio_write', (block, generator) => {
    const name = nameOf(block, 'pin');
    return `${name}.value = int(bool(${value(generator, block, 'VALUE', 'False')}))\n`;
  });
  define('linux_gpio_read', (block) => output(`${nameOf(block, 'pin')}.pin.state`, ORDER_MEMBER));
  define('linux_gpio_close', (block) => `${nameOf(block, 'pin')}.close()\n`);
  define('linux_led_init', (block, generator) => {
    const name = nameOf(block, 'led');
    const pin = pinNumber(field(block, 'PIN', '17'), '17');
    const activeHigh = field(block, 'ACTIVE_HIGH', 'TRUE') === 'TRUE' ? 'True' : 'False';
    generator.addImport('gpiozero', 'from gpiozero import DigitalInputDevice, DigitalOutputDevice, PWMOutputDevice, LED, Button');
    declareResource(generator, `gpio_led_${name}`, name, 'close');
    return `${name} = LED(${pin}, active_high=${activeHigh})\n`;
  });
  define('linux_led_action', (block) => {
    const actions = { ON: 'on', OFF: 'off', TOGGLE: 'toggle' };
    const action = actions[field(block, 'ACTION', 'ON')] || 'on';
    return `${nameOf(block, 'led')}.${action}()\n`;
  });
  define('linux_led_blink', (block, generator) => {
    addTimingHelpers(generator);
    const name = nameOf(block, 'led');
    const onTime = value(generator, block, 'ON_TIME', '1');
    const offTime = value(generator, block, 'OFF_TIME', '1');
    const count = value(generator, block, 'COUNT', '0');
    return `${name}.blink(on_time=float(${onTime}), off_time=float(${offTime}), n=_linux_blink_count(${count}), background=True)\n`;
  });
  define('linux_button_init', (block, generator) => {
    const name = nameOf(block, 'button');
    const pin = pinNumber(field(block, 'PIN', '27'), '27');
    const pull = field(block, 'PULL', 'UP');
    const activeHigh = field(block, 'ACTIVE_HIGH', 'TRUE') === 'TRUE' ? 'True' : 'False';
    const pullArgs = pull === 'UP'
      ? 'pull_up=True'
      : pull === 'DOWN'
        ? 'pull_up=False'
        : `pull_up=None, active_state=${activeHigh}`;
    const bounceTime = value(generator, block, 'BOUNCE_TIME', '0.05');
    const holdTime = value(generator, block, 'HOLD_TIME', '1');
    generator.addImport('gpiozero', 'from gpiozero import DigitalInputDevice, DigitalOutputDevice, PWMOutputDevice, LED, Button');
    addTimingHelpers(generator);
    declareResource(generator, `gpio_button_${name}`, name, 'close');
    return `${name} = Button(${pin}, ${pullArgs}, bounce_time=_linux_optional_seconds(${bounceTime}), hold_time=max(0.0, float(${holdTime})))\n`;
  });
  define('linux_button_pressed', (block) => output(`${nameOf(block, 'button')}.is_pressed`, ORDER_MEMBER));
  define('linux_button_held', (block) => output(`${nameOf(block, 'button')}.is_held`, ORDER_MEMBER));
  define('linux_button_wait', (block, generator) => {
    addTimingHelpers(generator);
    const method = field(block, 'EVENT', 'PRESS') === 'RELEASE' ? 'wait_for_release' : 'wait_for_press';
    return `${nameOf(block, 'button')}.${method}(timeout=_linux_optional_seconds(${value(generator, block, 'TIMEOUT', '0')}))\n`;
  });
  define('linux_led_write', (block, generator) => {
    generator.addImport('gpiozero', 'from gpiozero import DigitalInputDevice, DigitalOutputDevice, PWMOutputDevice, LED, Button');
    generator.addVariable('gpio_linux_led', '_linux_led = LED(17)');
    if (typeof generator.addCleanup === 'function') {
      generator.addCleanup('gpio_linux_led', 'if _linux_led is not None:\n    _linux_led.close()');
    }
    return `_linux_led.value = int(bool(${value(generator, block, 'VALUE', 'True')}))\n`;
  });
  define('linux_key_pressed', (_block, generator) => {
    generator.addImport('gpiozero', 'from gpiozero import DigitalInputDevice, DigitalOutputDevice, PWMOutputDevice, LED, Button');
    generator.addVariable('gpio_linux_key', '_linux_key = Button(27, pull_up=True)');
    if (typeof generator.addCleanup === 'function') {
      generator.addCleanup('gpio_linux_key', 'if _linux_key is not None:\n    _linux_key.close()');
    }
    return output('_linux_key.is_pressed', ORDER_MEMBER);
  });
  define('linux_pwm_init', (block, generator) => {
    const name = nameOf(block, 'pwm');
    const pin = pinNumber(field(block, 'PIN', '18'), '18');
    generator.addImport('gpiozero', 'from gpiozero import DigitalInputDevice, DigitalOutputDevice, PWMOutputDevice, LED, Button');
    declareResource(generator, `pwm_${name}`, name, 'close');
    return `${name} = PWMOutputDevice(${pin}, frequency=${value(generator, block, 'FREQUENCY', '1000')})\n`;
  });
  define('linux_pwm_duty', (block, generator) => `${nameOf(block, 'pwm')}.value = ${value(generator, block, 'DUTY', '0.5')}\n`);
  define('linux_pwm_frequency', (block, generator) => `${nameOf(block, 'pwm')}.frequency = ${value(generator, block, 'FREQUENCY', '1000')}\n`);
  define('linux_pwm_close', (block) => `${nameOf(block, 'pwm')}.close()\n`);
});
