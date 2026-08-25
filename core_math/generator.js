/* Validate the standard Blockly CPython handlers used by this toolbox. */
(function (root, requiredTypes) {
  'use strict';

  const Python = root.Python;
  // Libraries can remain installed while a non-Python project is open.
  if (Python == null) return;
  if (Python.forBlock == null || typeof Python.forBlock !== 'object') {
    throw new Error('Core Math received an incompatible CPython generator; missing forBlock');
  }
  const missing = requiredTypes.filter((type) => typeof Python.forBlock[type] !== 'function');
  if (missing.length) {
    throw new Error(`Core Math received an incompatible CPython generator; missing handlers: ${missing.join(', ')}`);
  }
})(globalThis, [
  'math_number',
  'math_arithmetic',
  'math_single',
  'math_trig',
  'math_constant',
  'math_number_property',
  'math_round',
  'math_on_list',
  'math_modulo',
  'math_constrain',
  'math_random_int',
  'math_random_float',
  'math_atan2',
]);
