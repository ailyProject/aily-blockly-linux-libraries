/* Validate the standard Blockly CPython handlers used by this toolbox. */
(function (root, requiredTypes) {
  'use strict';

  const Python = root.Python;
  // Libraries can remain installed while a non-Python project is open.
  if (Python == null) return;
  if (Python.forBlock == null || typeof Python.forBlock !== 'object') {
    throw new Error('Core Loops received an incompatible CPython generator; missing forBlock');
  }
  const missing = requiredTypes.filter((type) => typeof Python.forBlock[type] !== 'function');
  if (missing.length) {
    throw new Error(`Core Loops received an incompatible CPython generator; missing handlers: ${missing.join(', ')}`);
  }
})(globalThis, [
  'controls_repeat_ext',
  'controls_repeat',
  'controls_whileUntil',
  'controls_for',
  'controls_forEach',
  'controls_flow_statements',
]);
