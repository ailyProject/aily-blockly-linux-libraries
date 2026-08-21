const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const REPOSITORY_ROOT = path.resolve(ROOT, '..');
const LOCALES = ['zh_cn', 'en', 'zh_hk', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'ar'];
const PUBLIC_TYPES = [
  'python_requests_session_init',
  'python_requests_session_defaults',
  'python_requests_session_close',
  'python_requests_request',
  'python_requests_get',
  'python_requests_send_body',
  'python_requests_content_options',
  'python_requests_network_options',
  'python_requests_tls_options',
  'python_requests_merge_options',
  'python_requests_auth',
  'python_requests_timeout',
  'python_requests_proxies',
  'python_requests_upload_file',
  'python_requests_response_property',
  'python_requests_response_json',
  'python_requests_response_lookup',
  'python_requests_response_set_encoding',
  'python_requests_raise_for_status',
  'python_requests_try',
  'python_requests_for_chunks',
  'python_requests_download',
];
const LEGACY_TYPES = ['python_http_request', 'python_http_response'];
const BLOCK_TYPES = [...PUBLIC_TYPES, ...LEGACY_TYPES];
const TOOLBOX_TYPES = [
  ...PUBLIC_TYPES.slice(0, 14),
  'python_requests_for_chunks',
  'python_requests_download',
  ...PUBLIC_TYPES.slice(14, 20),
];

const readJson = (...parts) => JSON.parse(fs.readFileSync(path.join(ROOT, ...parts), 'utf8'));
const placeholders = (text) => (String(text).match(/%(\d+)/g) || []).map((item) => Number(item.slice(1)));
const sorted = (values) => [...values].sort((left, right) => left - right);

function visitToolbox(node, callback) {
  if (!node || typeof node !== 'object') return;
  callback(node);
  for (const child of Array.isArray(node.contents) ? node.contents : []) visitToolbox(child, callback);
}

function loadGenerator() {
  const codeDict = { imports: {}, variables: {}, functions: {}, cleanups: {} };
  const Python = {
    forBlock: {},
    ORDER_ATOMIC: 0,
    ORDER_MEMBER: 2.1,
    ORDER_FUNCTION_CALL: 2.2,
    ORDER_NONE: 99,
    INDENT: '    ',
    codeDict,
    addImport(key, code) { codeDict.imports[key] ??= code; },
    addVariable(key, code) { codeDict.variables[key] ??= code; },
    addFunction(key, code) { codeDict.functions[key] ??= code; },
    addCleanup(key, code) { codeDict.cleanups[key] ??= code; },
    valueToCode(block, name) { return block.values?.[name] || ''; },
    statementToCode(block, name) { return block.statements?.[name] || ''; },
  };
  const context = vm.createContext({ Python, console });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'generator.js'), 'utf8'), context, {
    filename: path.join(ROOT, 'generator.js'),
  });
  return Python;
}

test('package declares the 22 public and 2 hidden compatibility blocks', () => {
  const pkg = readJson('package.json');
  const blocks = readJson('block.json');

  assert.equal(pkg.name, '@aily-project/lib-requests');
  assert.equal(pkg.spec, true);
  assert.equal(blocks.length, 24);
  assert.deepEqual(blocks.map(({ type }) => type), BLOCK_TYPES);
  assert.equal(new Set(BLOCK_TYPES).size, BLOCK_TYPES.length);

  for (const block of blocks) {
    assert.equal(typeof block.message0, 'string', `${block.type} message0`);
    assert.ok(Array.isArray(block.args0), `${block.type} args0`);
    const expected = Array.from({ length: block.args0.length }, (_, index) => index + 1);
    const actual = placeholders(block.message0);
    assert.deepEqual(sorted(actual), expected, `${block.type} placeholders must cover every args0 entry`);
    assert.equal(new Set(actual).size, actual.length, `${block.type} repeats a placeholder`);
    assert.equal(typeof block.tooltip, 'string', `${block.type} tooltip`);
    assert.ok(block.tooltip.trim(), `${block.type} has an empty tooltip`);
    assert.equal(typeof block.colour, 'string', `${block.type} colour`);
    assert.equal(typeof block.icon, 'string', `${block.type} icon`);
    assert.ok(
      Object.hasOwn(block, 'output') || (block.previousStatement === null && block.nextStatement === null),
      `${block.type} must be an output or statement block`,
    );
  }
});

test('toolbox exposes exactly the 22 modern blocks and valid fields and inputs', () => {
  const blocks = readJson('block.json');
  const toolbox = readJson('toolbox.json');
  const definitions = new Map(blocks.map((block) => [block.type, block]));
  const toolboxTypes = [];
  const categories = [];

  visitToolbox(toolbox, (node) => {
    if (node.kind === 'category') categories.push(node.name);
    if (node.kind !== 'block') return;
    toolboxTypes.push(node.type);
    const definition = definitions.get(node.type);
    assert.ok(definition, `toolbox references undeclared block ${node.type}`);
    const argsByName = new Map((definition.args0 || []).filter((arg) => arg.name).map((arg) => [arg.name, arg]));
    for (const name of Object.keys(node.fields || {})) {
      assert.match(argsByName.get(name)?.type || '', /^field_/, `${node.type} toolbox field ${name} is invalid`);
    }
    for (const name of Object.keys(node.inputs || {})) {
      assert.match(argsByName.get(name)?.type || '', /^input_/, `${node.type} toolbox input ${name} is invalid`);
    }
  });

  assert.equal(toolbox.kind, 'category');
  assert.equal(toolbox.name, 'Python Requests');
  assert.deepEqual(toolboxTypes, TOOLBOX_TYPES);
  assert.equal(new Set(toolboxTypes).size, toolboxTypes.length, 'toolbox repeats a block');
  assert.deepEqual(categories.slice(1), [
    'Sessions',
    'Requests and options',
    'Upload and download',
    'Responses and errors',
  ]);
  for (const legacy of LEGACY_TYPES) assert.ok(!toolboxTypes.includes(legacy), `${legacy} must remain hidden`);
});

test('legacy block schemas remain serialization-compatible', () => {
  const definitions = new Map(readJson('block.json').map((block) => [block.type, block]));
  const request = definitions.get('python_http_request');
  const response = definitions.get('python_http_response');

  assert.deepEqual(request.args0.map(({ type, name }) => ({ type, name })), [
    { type: 'field_dropdown', name: 'METHOD' },
    { type: 'input_value', name: 'URL' },
    { type: 'input_value', name: 'DATA' },
  ]);
  assert.deepEqual(request.args0[0].options.map((option) => option[1]), ['GET', 'POST', 'PUT', 'DELETE']);
  assert.deepEqual(response.args0.map(({ type, name }) => ({ type, name })), [
    { type: 'input_value', name: 'RESPONSE' },
    { type: 'field_dropdown', name: 'PROPERTY' },
  ]);
  assert.deepEqual(response.args0[1].options.map((option) => option[1]), ['status_code', 'text', 'json()']);
});

test('generator registers one implementation for every declared block', () => {
  const Python = loadGenerator();
  assert.deepEqual(Object.keys(Python.forBlock), BLOCK_TYPES);
  for (const type of BLOCK_TYPES) assert.equal(typeof Python.forBlock[type], 'function', `missing generator ${type}`);
});

test('all 11 locales preserve placeholders, args, and dropdown machine values', () => {
  const blocks = readJson('block.json');
  const toolbox = readJson('toolbox.json');
  const categoryNames = toolbox.contents.filter((entry) => entry.kind === 'category').map(({ name }) => name);
  const localeFiles = fs.readdirSync(path.join(ROOT, 'i18n'))
    .filter((name) => name.endsWith('.json'))
    .map((name) => path.basename(name, '.json'))
    .sort();
  assert.deepEqual(localeFiles, [...LOCALES].sort());

  for (const localeName of LOCALES) {
    const locale = readJson('i18n', `${localeName}.json`);
    assert.ok(locale.toolbox_name, `${localeName} toolbox_name`);
    assert.equal(locale.toolbox_categories?.length, categoryNames.length, `${localeName} toolbox_categories`);
    for (const category of categoryNames) {
      assert.ok(locale.toolbox_labels?.[category], `${localeName} toolbox label ${category}`);
    }

    for (const block of blocks) {
      const localized = locale[block.type];
      assert.ok(localized, `${localeName} missing ${block.type}`);
      assert.ok(localized.message0, `${localeName} missing ${block.type}.message0`);
      assert.ok(localized.tooltip, `${localeName} missing ${block.type}.tooltip`);
      assert.deepEqual(
        sorted(placeholders(localized.message0)),
        sorted(placeholders(block.message0)),
        `${localeName} changed ${block.type} placeholders`,
      );
      assert.equal(
        new Set(placeholders(localized.message0)).size,
        placeholders(localized.message0).length,
        `${localeName} repeats a ${block.type} placeholder`,
      );
      assert.deepEqual(
        sorted(placeholders(localized.tooltip)),
        sorted(placeholders(block.tooltip)),
        `${localeName} changed ${block.type} tooltip placeholders`,
      );
      assert.equal(localized.args0?.length, block.args0.length, `${localeName} changed ${block.type}.args0 length`);

      block.args0.forEach((arg, index) => {
        if (arg.type !== 'field_dropdown') return;
        const localizedOptions = localized.args0[index]?.options;
        assert.ok(Array.isArray(localizedOptions), `${localeName} missing ${block.type}.args0[${index}].options`);
        assert.deepEqual(
          localizedOptions.map((option) => option[1]),
          arg.options.map((option) => option[1]),
          `${localeName} changed ${block.type} dropdown machine values`,
        );
      });
    }
  }
});

test('migrated types have one owner across all top-level libraries', () => {
  const occurrences = new Map();
  const libraryDirectories = fs.readdirSync(REPOSITORY_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(REPOSITORY_ROOT, entry.name, 'block.json')))
    .map((entry) => entry.name)
    .sort();

  for (const directory of libraryDirectories) {
    const file = path.join(REPOSITORY_ROOT, directory, 'block.json');
    const definitions = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.ok(Array.isArray(definitions), `${path.relative(REPOSITORY_ROOT, file)} must contain an array`);
    for (const definition of definitions) {
      const locations = occurrences.get(definition.type) || [];
      locations.push(`${directory}/block.json`);
      occurrences.set(definition.type, locations);
    }
  }

  const duplicates = [...occurrences]
    .filter(([, locations]) => locations.length > 1)
    .map(([type, locations]) => `${type}: ${locations.join(', ')}`);
  assert.deepEqual(duplicates, [], `duplicate repository block types:\n${duplicates.join('\n')}`);
  for (const legacy of LEGACY_TYPES) assert.deepEqual(occurrences.get(legacy), ['requests/block.json']);
  assert.deepEqual(occurrences.get('python_http_server'), ['network/block.json']);
});
