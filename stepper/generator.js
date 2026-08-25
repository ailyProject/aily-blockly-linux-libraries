/* Deterministic four-output stepper sequencing for Linux CPython and gpiozero. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addFunction', 'addCleanup', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Four-wire Stepper received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

  const ORDER_MEMBER = Python.ORDER_MEMBER ?? 2.1;
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
    'math', 'time', 'OutputDevice', '_AilyFourWireStepper',
  ]);
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result) || PYTHON_BUILTINS.has(result)
        || GENERATED_IDENTIFIERS.has(result) || result.startsWith('_Aily')) result += '_';
    return result || fallback;
  };
  const nameOf = (block) => safeName(field(block, 'NAME', 'stepper'), 'stepper');
  const pinNumber = (pin, fallback) => {
    const match = String(pin ?? '').match(/(\d+)\s*$/);
    return match ? String(Number.parseInt(match[1], 10)) : fallback;
  };
  const addStepperHelper = (generator) => {
    generator.addImport('linux_stepper_math', 'import math');
    generator.addImport('linux_stepper_time', 'import time');
    generator.addImport('linux_stepper_gpiozero', 'from gpiozero import OutputDevice');
    generator.addFunction('linux_four_wire_stepper_helper', [
      'class _AilyFourWireStepper:',
      '    _FULL_SEQUENCE = (',
      '        (1, 0, 0, 1),',
      '        (1, 1, 0, 0),',
      '        (0, 1, 1, 0),',
      '        (0, 0, 1, 1),',
      '    )',
      '    _HALF_SEQUENCE = (',
      '        (1, 0, 0, 1),',
      '        (1, 0, 0, 0),',
      '        (1, 1, 0, 0),',
      '        (0, 1, 0, 0),',
      '        (0, 1, 1, 0),',
      '        (0, 0, 1, 0),',
      '        (0, 0, 1, 1),',
      '        (0, 0, 0, 1),',
      '    )',
      '',
      "    def __init__(self, pins, mode='full', steps_per_revolution=200, hold=False):",
      '        pins = tuple(int(pin) for pin in pins)',
      '        if len(pins) != 4 or len(set(pins)) != 4:',
      "            raise ValueError('stepper requires four distinct GPIO pins')",
      '        steps_value = float(steps_per_revolution)',
      '        if not math.isfinite(steps_value) or not steps_value.is_integer() or steps_value <= 0.0:',
      "            raise ValueError('steps per revolution must be a positive integer')",
      "        if mode not in ('full', 'half'):",
      "            raise ValueError('step mode must be full or half')",
      '        self.steps_per_revolution = int(steps_value)',
      '        self.hold = bool(hold)',
      "        self._sequence = self._FULL_SEQUENCE if mode == 'full' else self._HALF_SEQUENCE",
      '        self._outputs = []',
      '        try:',
      '            for pin in pins:',
      '                self._outputs.append(OutputDevice(pin, initial_value=False))',
      '        except Exception:',
      '            for output in self._outputs:',
      '                output.close()',
      '            raise',
      '        self._index = 0',
      '        self._position = 0',
      '        self._closed = False',
      '',
      '    @property',
      '    def position(self):',
      '        return self._position',
      '',
      '    def _require_open(self):',
      '        if self._closed:',
      "            raise RuntimeError('stepper is closed')",
      '',
      '    def _apply(self, pattern):',
      '        for output, state in zip(self._outputs, pattern):',
      '            output.value = state',
      '',
      '    def move(self, steps, rpm):',
      '        self._require_open()',
      '        steps_value = float(steps)',
      '        if not math.isfinite(steps_value) or not steps_value.is_integer():',
      "            raise ValueError('step count must be an integer')",
      '        steps = int(steps_value)',
      '        rpm = float(rpm)',
      '        if not math.isfinite(rpm) or rpm <= 0.0:',
      "            raise ValueError('RPM must be positive')",
      '        if steps == 0:',
      '            return 0',
      '        delay = 60.0 / (rpm * self.steps_per_revolution)',
      '        direction = 1 if steps > 0 else -1',
      '        for _ in range(abs(steps)):',
      '            self._index = (self._index + direction) % len(self._sequence)',
      '            self._apply(self._sequence[self._index])',
      '            self._position += direction',
      '            time.sleep(delay)',
      '        if not self.hold:',
      '            self.release()',
      '        return steps',
      '',
      '    def rotate(self, angle, rpm):',
      '        angle = float(angle)',
      '        if not math.isfinite(angle):',
      "            raise ValueError('angle must be finite')",
      '        steps = int(round(angle * self.steps_per_revolution / 360.0))',
      '        return self.move(steps, rpm)',
      '',
      '    def release(self):',
      '        self._require_open()',
      '        for output in self._outputs:',
      '            output.off()',
      '',
      '    def close(self):',
      '        if self._closed:',
      '            return',
      '        for output in self._outputs:',
      '            output.off()',
      '            output.close()',
      '        self._closed = True',
    ].join('\n'));
  };
  const declareResource = (generator, name) => {
    const tag = `linux_stepper_${name}`;
    generator.addVariable(tag, `${name} = None`);
    generator.addCleanup(tag, `if ${name} is not None:\n    ${name}.close()`);
  };

  define('linux_stepper_init', (block, generator) => {
    const name = nameOf(block);
    const pins = [
      pinNumber(field(block, 'PIN1', '17'), '17'),
      pinNumber(field(block, 'PIN2', '18'), '18'),
      pinNumber(field(block, 'PIN3', '27'), '27'),
      pinNumber(field(block, 'PIN4', '22'), '22'),
    ];
    const modes = { FULL: "'full'", HALF: "'half'" };
    const holds = { HOLD: 'True', RELEASE: 'False' };
    const mode = modes[field(block, 'MODE', 'FULL')] || modes.FULL;
    const hold = holds[field(block, 'HOLD', 'HOLD')] || holds.HOLD;
    addStepperHelper(generator);
    declareResource(generator, name);
    return [
      `if ${name} is not None:`,
      `    ${name}.close()`,
      `${name} = _AilyFourWireStepper((${pins.join(', ')}), mode=${mode}, steps_per_revolution=${value(generator, block, 'STEPS_PER_REVOLUTION', '200')}, hold=${hold})`,
      '',
    ].join('\n');
  });
  define('linux_stepper_move', (block, generator) => (
    `${nameOf(block)}.move(${value(generator, block, 'STEPS', '0')}, ${value(generator, block, 'RPM', '10')})\n`
  ));
  define('linux_stepper_rotate', (block, generator) => (
    `${nameOf(block)}.rotate(${value(generator, block, 'ANGLE', '0')}, ${value(generator, block, 'RPM', '10')})\n`
  ));
  define('linux_stepper_position', (block) => output(`${nameOf(block)}.position`));
  define('linux_stepper_release', (block) => `${nameOf(block)}.release()\n`);
  define('linux_stepper_close', (block) => {
    const name = nameOf(block);
    return `if ${name} is not None:\n    ${name}.close()\n    ${name} = None\n`;
  });
});
