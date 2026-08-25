/* Friendly gpiozero motors, servos, distance sensors, rotary encoders, and buzzers. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addFunction', 'addCleanup', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`GPIO Zero Devices received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

  const ORDER_MEMBER = Python.ORDER_MEMBER ?? 2.1;
  const ORDER_MULTIPLICATIVE = Python.ORDER_MULTIPLICATIVE ?? 5.1;
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
    'TimeoutError', 'TypeError', 'ValueError',
  ]);
  const GENERATED_IDENTIFIERS = new Set([
    'gpiozero', 'AngularServo', 'Buzzer', 'DistanceSensor', 'Motor',
    'RotaryEncoder', 'TonalBuzzer', '_aily_gpiozero_unit',
    '_aily_gpiozero_optional_seconds', '_aily_gpiozero_angular_servo',
    '_aily_gpiozero_distance_sensor', '_aily_gpiozero_buzzer_play',
    '_aily_gpiozero_buzzer_on', '_aily_gpiozero_buzzer_stop',
  ]);
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result) || PYTHON_BUILTINS.has(result)
        || GENERATED_IDENTIFIERS.has(result) || result.startsWith('_aily_gpiozero')) result += '_';
    return result || fallback;
  };
  const nameOf = (block, fallback) => safeName(field(block, 'NAME', fallback), fallback);
  const pinNumber = (pin, fallback = '17') => {
    const match = String(pin ?? '').match(/(\d+)\s*$/);
    return match ? String(Number.parseInt(match[1], 10)) : fallback;
  };
  const addImport = (generator) => generator.addImport(
    'gpiozero_devices',
    'from gpiozero import AngularServo, Buzzer, DistanceSensor, Motor, RotaryEncoder, TonalBuzzer',
  );
  const declareResource = (generator, kind, name) => {
    const tag = `gpiozero_devices_${kind}_${name}`;
    generator.addVariable(tag, `${name} = None`);
    generator.addCleanup(tag, `if ${name} is not None:\n    ${name}.close()`);
  };
  const replaceResource = (generator, kind, name, expression) => {
    declareResource(generator, kind, name);
    return `if ${name} is not None:\n    ${name}.close()\n${name} = ${expression}\n`;
  };
  const closeResource = (name, before = '') => [
    `if ${name} is not None:`,
    ...(before ? before.split('\n').map((line) => `    ${line}`) : []),
    `    ${name}.close()`,
    `    ${name} = None`,
    '',
  ].join('\n');
  const addCommonHelpers = (generator) => {
    addImport(generator);
    generator.addFunction('gpiozero_devices_validation_helpers', [
      'def _aily_gpiozero_unit(value):',
      '    value = float(value)',
      '    if not 0.0 <= value <= 1.0:',
      "        raise ValueError('speed must be between 0 and 1')",
      '    return value',
      '',
      'def _aily_gpiozero_optional_seconds(value):',
      '    value = float(value)',
      '    return None if value <= 0.0 else value',
      '',
      'def _aily_gpiozero_angular_servo(pin, minimum, maximum, initial):',
      '    minimum = float(minimum)',
      '    maximum = float(maximum)',
      '    initial = float(initial)',
      '    if minimum == maximum:',
      "        raise ValueError('servo minimum and maximum angles must differ')",
      '    lower = min(minimum, maximum)',
      '    upper = max(minimum, maximum)',
      '    if not lower <= initial <= upper:',
      "        raise ValueError('servo initial angle is outside its configured range')",
      '    return AngularServo(pin, min_angle=minimum, max_angle=maximum, initial_angle=initial)',
      '',
      'def _aily_gpiozero_distance_sensor(echo, trigger, maximum, threshold):',
      '    maximum = float(maximum)',
      '    threshold = float(threshold)',
      '    if maximum <= 0.0:',
      "        raise ValueError('maximum distance must be positive')",
      '    if not 0.0 < threshold <= maximum:',
      "        raise ValueError('threshold distance must be positive and no greater than maximum distance')",
      '    return DistanceSensor(echo=echo, trigger=trigger, max_distance=maximum, threshold_distance=threshold)',
    ].join('\n'));
  };
  const addBuzzerHelpers = (generator) => {
    addImport(generator);
    generator.addFunction('gpiozero_devices_buzzer_helpers', [
      'def _aily_gpiozero_buzzer_play(device, tone):',
      '    if isinstance(device, TonalBuzzer):',
      '        device.play(tone)',
      '    else:',
      '        device.on()',
      '',
      'def _aily_gpiozero_buzzer_on(device):',
      '    if isinstance(device, TonalBuzzer):',
      "        device.play('A4')",
      '    else:',
      '        device.on()',
      '',
      'def _aily_gpiozero_buzzer_stop(device):',
      '    if isinstance(device, TonalBuzzer):',
      '        device.stop()',
      '    else:',
      '        device.off()',
    ].join('\n'));
  };

  define('linux_gpiozero_motor_init', (block, generator) => {
    const name = nameOf(block, 'motor');
    const forwardPin = pinNumber(field(block, 'FORWARD_PIN', '17'), '17');
    const backwardPin = pinNumber(field(block, 'BACKWARD_PIN', '18'), '18');
    const pwmModes = { PWM: 'True', DIGITAL: 'False' };
    const pwm = pwmModes[field(block, 'OUTPUT_MODE', 'PWM')] || pwmModes.PWM;
    addImport(generator);
    return replaceResource(generator, 'motor', name, `Motor(forward=${forwardPin}, backward=${backwardPin}, pwm=${pwm})`);
  });
  define('linux_gpiozero_motor_forward', (block, generator) => {
    addCommonHelpers(generator);
    return `${nameOf(block, 'motor')}.forward(speed=_aily_gpiozero_unit(${value(generator, block, 'SPEED', '1')}))\n`;
  });
  define('linux_gpiozero_motor_backward', (block, generator) => {
    addCommonHelpers(generator);
    return `${nameOf(block, 'motor')}.backward(speed=_aily_gpiozero_unit(${value(generator, block, 'SPEED', '1')}))\n`;
  });
  define('linux_gpiozero_motor_stop', (block) => `${nameOf(block, 'motor')}.stop()\n`);
  define('linux_gpiozero_motor_value', (block) => output(`${nameOf(block, 'motor')}.value`));
  define('linux_gpiozero_motor_close', (block) => closeResource(nameOf(block, 'motor'), `${nameOf(block, 'motor')}.stop()`));

  define('linux_gpiozero_angular_servo_init', (block, generator) => {
    const name = nameOf(block, 'servo');
    const pin = pinNumber(field(block, 'PIN', '18'), '18');
    addImport(generator);
    addCommonHelpers(generator);
    const expression = `_aily_gpiozero_angular_servo(${pin}, ${value(generator, block, 'MIN_ANGLE', '-90')}, ${value(generator, block, 'MAX_ANGLE', '90')}, ${value(generator, block, 'INITIAL_ANGLE', '0')})`;
    return replaceResource(generator, 'angular_servo', name, expression);
  });
  define('linux_gpiozero_angular_servo_set', (block, generator) => `${nameOf(block, 'servo')}.angle = float(${value(generator, block, 'ANGLE', '0')})\n`);
  define('linux_gpiozero_angular_servo_read', (block) => output(`${nameOf(block, 'servo')}.angle`));
  define('linux_gpiozero_angular_servo_detach', (block) => `${nameOf(block, 'servo')}.detach()\n`);
  define('linux_gpiozero_angular_servo_close', (block) => closeResource(nameOf(block, 'servo'), `${nameOf(block, 'servo')}.detach()`));

  define('linux_gpiozero_distance_init', (block, generator) => {
    const name = nameOf(block, 'distance');
    const trigger = pinNumber(field(block, 'TRIGGER_PIN', '23'), '23');
    const echo = pinNumber(field(block, 'ECHO_PIN', '24'), '24');
    addImport(generator);
    addCommonHelpers(generator);
    const expression = `_aily_gpiozero_distance_sensor(${echo}, ${trigger}, ${value(generator, block, 'MAX_DISTANCE', '1')}, ${value(generator, block, 'THRESHOLD', '0.3')})`;
    return replaceResource(generator, 'distance', name, expression);
  });
  define('linux_gpiozero_distance_read', (block) => {
    const name = nameOf(block, 'distance');
    const units = { CM: `(${name}.distance * 100.0)`, M: `${name}.distance` };
    return output(units[field(block, 'UNIT', 'CM')] || units.CM, ORDER_MULTIPLICATIVE);
  });
  define('linux_gpiozero_distance_in_range', (block) => output(`${nameOf(block, 'distance')}.in_range`));
  define('linux_gpiozero_distance_wait', (block, generator) => {
    addCommonHelpers(generator);
    const methods = { IN_RANGE: 'wait_for_in_range', OUT_OF_RANGE: 'wait_for_out_of_range' };
    const method = methods[field(block, 'STATE', 'IN_RANGE')] || methods.IN_RANGE;
    return `${nameOf(block, 'distance')}.${method}(timeout=_aily_gpiozero_optional_seconds(${value(generator, block, 'TIMEOUT', '0')}))\n`;
  });
  define('linux_gpiozero_distance_close', (block) => closeResource(nameOf(block, 'distance')));

  define('linux_gpiozero_rotary_init', (block, generator) => {
    const name = nameOf(block, 'encoder');
    const a = pinNumber(field(block, 'A_PIN', '17'), '17');
    const b = pinNumber(field(block, 'B_PIN', '18'), '18');
    const wrapModes = { TRUE: 'True', FALSE: 'False' };
    const wrap = wrapModes[field(block, 'WRAP', 'FALSE')] || wrapModes.FALSE;
    addImport(generator);
    const maxSteps = value(generator, block, 'MAX_STEPS', '0');
    return replaceResource(generator, 'rotary', name, `RotaryEncoder(${a}, ${b}, max_steps=max(0, int(${maxSteps})), wrap=${wrap})`);
  });
  define('linux_gpiozero_rotary_steps', (block) => output(`${nameOf(block, 'encoder')}.steps`));
  define('linux_gpiozero_rotary_reset', (block) => `${nameOf(block, 'encoder')}.steps = 0\n`);
  define('linux_gpiozero_rotary_wait', (block, generator) => {
    addCommonHelpers(generator);
    const methods = {
      ANY: 'wait_for_rotate',
      CLOCKWISE: 'wait_for_rotate_clockwise',
      COUNTER_CLOCKWISE: 'wait_for_rotate_counter_clockwise',
    };
    const method = methods[field(block, 'DIRECTION', 'ANY')] || methods.ANY;
    return `${nameOf(block, 'encoder')}.${method}(timeout=_aily_gpiozero_optional_seconds(${value(generator, block, 'TIMEOUT', '0')}))\n`;
  });
  define('linux_gpiozero_rotary_close', (block) => closeResource(nameOf(block, 'encoder')));

  define('linux_gpiozero_buzzer_init', (block, generator) => {
    const name = nameOf(block, 'buzzer');
    const pin = pinNumber(field(block, 'PIN', '17'), '17');
    const constructors = { SIMPLE: 'Buzzer', TONAL: 'TonalBuzzer' };
    const constructor = constructors[field(block, 'MODE', 'SIMPLE')] || constructors.SIMPLE;
    addImport(generator);
    return replaceResource(generator, 'buzzer', name, `${constructor}(${pin})`);
  });
  define('linux_gpiozero_buzzer_play', (block, generator) => {
    addBuzzerHelpers(generator);
    return `_aily_gpiozero_buzzer_play(${nameOf(block, 'buzzer')}, ${value(generator, block, 'TONE', "'A4'")})\n`;
  });
  define('linux_gpiozero_buzzer_on', (block, generator) => {
    addBuzzerHelpers(generator);
    return `_aily_gpiozero_buzzer_on(${nameOf(block, 'buzzer')})\n`;
  });
  define('linux_gpiozero_buzzer_off', (block, generator) => {
    addBuzzerHelpers(generator);
    return `_aily_gpiozero_buzzer_stop(${nameOf(block, 'buzzer')})\n`;
  });
  define('linux_gpiozero_buzzer_stop', (block, generator) => {
    addBuzzerHelpers(generator);
    return `_aily_gpiozero_buzzer_stop(${nameOf(block, 'buzzer')})\n`;
  });
  define('linux_gpiozero_buzzer_close', (block, generator) => {
    addBuzzerHelpers(generator);
    const name = nameOf(block, 'buzzer');
    return closeResource(name, `_aily_gpiozero_buzzer_stop(${name})`);
  });
});
