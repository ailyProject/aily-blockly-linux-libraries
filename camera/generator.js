/* Linux V4L2 camera capture through OpenCV. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addCleanup', 'valueToCode', 'quote_'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Linux Camera received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
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
    generator.addCleanup(tag, `if ${name} is not None:\n    ${name}.${cleanup}()`);
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

  define('linux_camera_init', (block, generator) => {
    const name = nameOf(block, 'camera');
    generator.addImport('cv2', 'import cv2');
    declareResource(generator, `camera_${name}`, name, 'release');
    return `${name} = cv2.VideoCapture(${generator.quote_(field(block, 'DEVICE', '/dev/video0'))})\n${name}.set(cv2.CAP_PROP_FRAME_WIDTH, ${value(generator, block, 'WIDTH', '640')})\n${name}.set(cv2.CAP_PROP_FRAME_HEIGHT, ${value(generator, block, 'HEIGHT', '480')})\n`;
  });
  define('linux_camera_opened', (block) => output(`${nameOf(block, 'camera')}.isOpened()`));
  define('linux_camera_read', (block) => output(`${nameOf(block, 'camera')}.read()[1]`, ORDER_MEMBER));
  define('linux_camera_release', (block) => `${nameOf(block, 'camera')}.release()\n`);
});
