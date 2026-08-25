/* CPython standard-library JSON serialization, UTF-8 file, and mapping helpers. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addFunction', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(
      'JSON received an incompatible CPython generator'
      + (missingMethods.length ? '; missing ' + missingMethods.join(', ') : '')
    );
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
  const output = (code, order = ORDER_CALL) => [code, order];
  const choice = (table, requested, fallback) =>
    Object.prototype.hasOwnProperty.call(table, requested) ? table[requested] : table[fallback];

  const BOOLEANS = Object.freeze({
    FALSE: 'False',
    TRUE: 'True',
  });
  const INDENTS = Object.freeze({
    NONE: 'None',
    TWO: '2',
    FOUR: '4',
  });

  const options = (block) => ({
    ensureAscii: choice(BOOLEANS, field(block, 'ENSURE_ASCII', 'FALSE'), 'FALSE'),
    indent: choice(INDENTS, field(block, 'INDENT', 'NONE'), 'NONE'),
    sortKeys: choice(BOOLEANS, field(block, 'SORT_KEYS', 'FALSE'), 'FALSE'),
  });
  const keywordOptions = (settings) =>
    'ensure_ascii=' + settings.ensureAscii
    + ', indent=' + settings.indent
    + ', sort_keys=' + settings.sortKeys;
  const addJson = (generator) =>
    generator.addImport('python_json_module', 'import json as _aily_json');
  const addFileHelpers = (generator) => {
    addJson(generator);
    generator.addFunction('python_json_utf8_file_helpers', [
      'def _aily_json_read_utf8(path):',
      "    with open(path, 'r', encoding='utf-8') as file:",
      '        return _aily_json.load(file)',
      '',
      'def _aily_json_write_utf8(path, value, ensure_ascii=False, indent=None, sort_keys=False):',
      "    with open(path, 'w', encoding='utf-8') as file:",
      '        return _aily_json.dump(',
      '            value,',
      '            file,',
      '            ensure_ascii=ensure_ascii,',
      '            indent=indent,',
      '            sort_keys=sort_keys,',
      '        )',
    ].join('\n'));
  };
  const addValidationHelper = (generator) => {
    addJson(generator);
    generator.addFunction('python_json_validation_helper', [
      'def _aily_json_is_valid(value):',
      '    try:',
      '        _aily_json.loads(value)',
      '    except (_aily_json.JSONDecodeError, UnicodeDecodeError):',
      '        return False',
      '    return True',
    ].join('\n'));
  };

  define('python_json_dumps', (block, generator) => {
    addJson(generator);
    const settings = options(block);
    return output(
      '_aily_json.dumps('
      + value(generator, block, 'VALUE')
      + ', '
      + keywordOptions(settings)
      + ')'
    );
  });

  define('python_json_loads', (block, generator) => {
    addJson(generator);
    return output('_aily_json.loads(' + value(generator, block, 'TEXT', "''") + ')');
  });

  define('python_json_read_file', (block, generator) => {
    addFileHelpers(generator);
    return output(
      '_aily_json_read_utf8(' + value(generator, block, 'PATH', "'data.json'") + ')'
    );
  });

  define('python_json_write_file', (block, generator) => {
    addFileHelpers(generator);
    const settings = options(block);
    return '_aily_json_write_utf8('
      + value(generator, block, 'PATH', "'data.json'")
      + ', '
      + value(generator, block, 'VALUE')
      + ', '
      + keywordOptions(settings)
      + ')\n';
  });

  define('python_json_is_valid', (block, generator) => {
    addValidationHelper(generator);
    return output('_aily_json_is_valid(' + value(generator, block, 'TEXT', "''") + ')');
  });

  define('python_json_object_get', (block, generator) => {
    const object = value(generator, block, 'OBJECT', '{}');
    const key = value(generator, block, 'KEY', "''");
    const defaultValue = value(generator, block, 'DEFAULT');
    return output('(' + object + ').get(' + key + ', ' + defaultValue + ')');
  });

  define('python_json_object_set', (block, generator) => {
    const object = value(generator, block, 'OBJECT', '{}');
    const key = value(generator, block, 'KEY', "''");
    const assignedValue = value(generator, block, 'VALUE');
    return '(' + object + ')[' + key + '] = ' + assignedValue + '\n';
  });
});
