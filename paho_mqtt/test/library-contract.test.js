const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const REPOSITORY_ROOT = path.resolve(ROOT, '..');
const LOCALES = ['zh_cn', 'en', 'zh_hk', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'ar'];
const BLOCK_TYPES = [
  'python_mqtt_init',
  'python_mqtt_set_auth',
  'python_mqtt_set_tls',
  'python_mqtt_set_will',
  'python_mqtt_set_websocket_options',
  'python_mqtt_set_reconnect_delay',
  'python_mqtt_connect',
  'python_mqtt_on_connect',
  'python_mqtt_on_message',
  'python_mqtt_on_disconnect',
  'python_mqtt_publish',
  'python_mqtt_publish_wait',
  'python_mqtt_subscribe',
  'python_mqtt_unsubscribe',
  'python_mqtt_decode_payload',
  'python_mqtt_is_connected',
  'python_mqtt_loop_start',
  'python_mqtt_loop_stop',
  'python_mqtt_loop_once',
  'python_mqtt_loop',
  'python_mqtt_disconnect',
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

test('package declares exactly the 21-block Paho MQTT surface', () => {
  const pkg = readJson('package.json');
  const blocks = readJson('block.json');

  assert.equal(pkg.name, '@aily-project/lib-paho-mqtt');
  assert.equal(pkg.spec, true);
  assert.equal(blocks.length, 21);
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

test('toolbox exposes every block once and only references valid fields and inputs', () => {
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
  assert.equal(toolbox.name, 'Paho MQTT');
  assert.deepEqual(toolboxTypes, BLOCK_TYPES);
  assert.equal(new Set(toolboxTypes).size, toolboxTypes.length, 'toolbox repeats a block');
  assert.deepEqual(categories.slice(1), [
    'Client and security',
    'Events',
    'Publish and subscribe',
    'Network loop',
  ]);
});

test('generator registers one implementation for every declared block', () => {
  const blocks = readJson('block.json');
  const Python = loadGenerator();
  const registered = Object.keys(Python.forBlock);

  assert.deepEqual(registered, BLOCK_TYPES);
  for (const { type } of blocks) assert.equal(typeof Python.forBlock[type], 'function', `missing generator ${type}`);
});

test('all 11 locales preserve block placeholders, args0, and dropdown machine values', () => {
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

test('block types are unique across every top-level repository library', () => {
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
});
