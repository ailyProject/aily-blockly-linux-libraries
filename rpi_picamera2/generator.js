/* Raspberry Pi Picamera2 camera capture through the supported libcamera stack. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addFunction', 'addCleanup', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Picamera2 received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
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
  const nameOf = (block, fallback) => safeName(field(block, 'NAME', fallback), fallback);
  const output = (code, order = ORDER_CALL) => [code, order];
  const FORMAT_MAP = Object.freeze({
    RGB888: 'RGB888',
    BGR888: 'BGR888',
    // Keep the compact Blockly value while emitting Picamera2's official format name.
    XRGB888: 'XRGB8888',
  });
  const CONTROL_NAMES = new Set(['FrameRate', 'ExposureTime', 'AnalogueGain', 'AwbEnable']);
  const CONTROL_CASTS = Object.freeze({
    FrameRate: 'float',
    ExposureTime: 'int',
    AnalogueGain: 'float',
    AwbEnable: 'bool',
  });

  const addLifecycleHelpers = (generator) => {
    generator.addFunction('rpi_picamera2_lifecycle_helpers', [
      'def _rpi_picamera2_safe_stop(camera):',
      "    if camera is not None and getattr(camera, 'started', False):",
      '        camera.stop()',
      '',
      'def _rpi_picamera2_safe_close(camera):',
      '    if camera is None:',
      '        return',
      '    _rpi_picamera2_safe_stop(camera)',
      "    if getattr(camera, 'is_open', False):",
      '        camera.close()',
    ].join('\n'));
  };

  define('rpi_picamera2_init', (block, generator) => {
    const name = nameOf(block, 'camera');
    const cameraNum = value(generator, block, 'CAMERA_NUM', '0');
    const width = value(generator, block, 'WIDTH', '640');
    const height = value(generator, block, 'HEIGHT', '480');
    const requestedFormat = field(block, 'FORMAT', 'RGB888');
    const format = FORMAT_MAP[requestedFormat] || FORMAT_MAP.RGB888;
    generator.addImport('picamera2', 'from picamera2 import Picamera2');
    generator.addVariable(`rpi_picamera2_${name}`, `${name} = None`);
    addLifecycleHelpers(generator);
    generator.addCleanup(`rpi_picamera2_${name}`, `_rpi_picamera2_safe_close(${name})`);
    return `_rpi_picamera2_safe_close(${name})\n${name} = Picamera2(int(${cameraNum}))\n${name}.configure(${name}.create_preview_configuration(main={"size": (int(${width}), int(${height})), "format": "${format}"}))\n`;
  });

  define('rpi_picamera2_start', (block) => `${nameOf(block, 'camera')}.start()\n`);
  define('rpi_picamera2_capture_array', (block) => output(`${nameOf(block, 'camera')}.capture_array()`));
  define('rpi_picamera2_capture_file', (block, generator) =>
    `${nameOf(block, 'camera')}.capture_file(${value(generator, block, 'PATH', "'/tmp/rpi_picamera2.jpg'")})\n`);
  define('rpi_picamera2_set_control', (block, generator) => {
    const requestedControl = field(block, 'CONTROL', 'FrameRate');
    const control = CONTROL_NAMES.has(requestedControl) ? requestedControl : 'FrameRate';
    const controlValue = value(generator, block, 'VALUE', control === 'AwbEnable' ? 'True' : '30');
    return `${nameOf(block, 'camera')}.set_controls({"${control}": ${CONTROL_CASTS[control]}(${controlValue})})\n`;
  });
  define('rpi_picamera2_stop', (block, generator) => {
    addLifecycleHelpers(generator);
    return `_rpi_picamera2_safe_stop(${nameOf(block, 'camera')})\n`;
  });
  define('rpi_picamera2_close', (block, generator) => {
    addLifecycleHelpers(generator);
    return `_rpi_picamera2_safe_close(${nameOf(block, 'camera')})\n`;
  });
});
