/* System commands and Linux CPU temperature compatibility helpers. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Python System received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

  const ORDER_CALL = Python.ORDER_FUNCTION_CALL ?? 2.2;
  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const define = (type, generator) => { Python.forBlock[type] = generator; };
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || fallback;
  const output = (code, order = ORDER_CALL) => [code, order];

  define('python_command', (block, generator) => {
    generator.addImport('os', 'import os');
    return output(`os.popen(str(${value(generator, block, 'COMMAND', "''")})).read()`);
  });
  define('python_cpu_temperature', (_block, generator) => {
    generator.addImport('os', 'import os');
    return output("int(os.popen('cat /sys/class/thermal/thermal_zone0/temp').read()) / 1000", ORDER_NONE);
  });
});
