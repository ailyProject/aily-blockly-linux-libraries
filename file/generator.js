/* Cross-platform text-file, path-existence, and directory-listing operations. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addFunction', 'valueToCode', 'quote_'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Python File received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
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

  const addFileHelpers = (generator) => {
    generator.addFunction('python_file_helpers', [
      'def _python_read_text(path):',
      "    with open(path, 'r', encoding='utf-8') as file:",
      '        return file.read()',
      '',
      "def _python_write_text(path, content, mode='w'):",
      "    with open(path, mode, encoding='utf-8') as file:",
      '        return file.write(str(content))',
    ].join('\n'));
  };
  define('python_file_read', (block, generator) => {
    addFileHelpers(generator);
    return output(`_python_read_text(${value(generator, block, 'PATH', "'file.txt'")})`);
  });
  define('python_file_write', (block, generator) => {
    addFileHelpers(generator);
    return `_python_write_text(${value(generator, block, 'PATH', "'file.txt'")}, ${value(generator, block, 'CONTENT', "''")}, ${generator.quote_(field(block, 'MODE', 'w'))})\n`;
  });
  define('python_file_exists', (block, generator) => {
    generator.addImport('os', 'import os');
    return output(`os.path.exists(${value(generator, block, 'PATH', "'file.txt'")})`);
  });
  define('python_file_list', (block, generator) => {
    generator.addImport('os', 'import os');
    return output(`os.listdir(${value(generator, block, 'PATH', "'.'")})`);
  });

  // Migration-stable CyberCAM aliases. They remain registered for saved
  // workspaces but are intentionally omitted from toolbox.json.
  const addCyberCamFileHelpers = (generator) => {
    generator.addFunction('cybercam_file_helpers', [
      'def _cybercam_read_text(path):',
      "    with open(path, 'r', encoding='utf-8') as file:",
      '        return file.read()',
      '',
      "def _cybercam_write_text(path, content, mode='w'):",
      "    with open(path, mode, encoding='utf-8') as file:",
      '        return file.write(str(content))',
    ].join('\n'));
  };
  define('cybercam_file_read', (block, generator) => {
    addCyberCamFileHelpers(generator);
    return output(`_cybercam_read_text(${value(generator, block, 'PATH', "'/data/file.txt'")})`);
  });
  define('cybercam_file_write', (block, generator) => {
    addCyberCamFileHelpers(generator);
    return `_cybercam_write_text(${value(generator, block, 'PATH', "'/data/file.txt'")}, ${value(generator, block, 'CONTENT', "''")}, ${generator.quote_(field(block, 'MODE', 'w'))})\n`;
  });
  define('cybercam_file_exists', (block, generator) => {
    generator.addImport('os', 'import os');
    return output(`os.path.exists(${value(generator, block, 'PATH', "'/data'")})`);
  });
  define('cybercam_file_list', (block, generator) => {
    generator.addImport('os', 'import os');
    return output(`os.listdir(${value(generator, block, 'PATH', "'/data'")})`);
  });
});
