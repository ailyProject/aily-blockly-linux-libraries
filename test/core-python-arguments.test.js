'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const CORE = path.join(ROOT, 'core');
const LOCALES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ko', 'pt', 'ru', 'zh_cn', 'zh_hk'];
const NEW_TYPES = [
  'python_arguments',
  'python_keyword_arguments',
  'python_get_item',
  'python_set_item',
  'python_set_attribute',
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function placeholderNumbers(message) {
  return [...message.matchAll(/%(\d+)/g)]
    .map((match) => Number(match[1]))
    .sort((left, right) => left - right);
}

function expectedPlaceholders(count) {
  return Array.from({ length: count }, (_, index) => index + 1);
}

function loadCoreGenerator() {
  const Python = {
    forBlock: Object.create(null),
    ORDER_ATOMIC: 0,
    ORDER_NONE: 99,
    addImport() {},
    addSetup() {},
    addLoop() {},
    valueToCode() {},
    statementToCode() {},
    quote_() {},
  };
  vm.runInNewContext(
    fs.readFileSync(path.join(CORE, 'generator.js'), 'utf8'),
    { Python },
    { filename: 'core/generator.js', timeout: 1_000 },
  );
  return Python;
}

function blockWithFields(fields = {}) {
  return {
    getFieldValue(name) {
      return Object.hasOwn(fields, name) ? fields[name] : null;
    },
  };
}

function generatorWithValues(values = {}, quote = (value) => JSON.stringify(value)) {
  const valueCalls = [];
  const quoteCalls = [];
  return {
    valueCalls,
    quoteCalls,
    valueToCode(_block, name, order) {
      valueCalls.push([name, order]);
      return values[name] || '';
    },
    quote_(value) {
      quoteCalls.push(value);
      return quote(value, quoteCalls.length - 1);
    },
  };
}

test('five CPython composition blocks have exact sockets, placeholders, toolbox refs, and locales', () => {
  const blocks = readJson(path.join(CORE, 'block.json'));
  const byType = new Map(blocks.map((block) => [block.type, block]));
  assert.equal(blocks.length, 18);
  assert.equal(byType.size, blocks.length, 'core block types must be unique');

  const argumentsBlock = byType.get('python_arguments');
  assert.deepEqual(
    argumentsBlock.args0,
    Array.from({ length: 6 }, (_, index) => ({
      type: 'input_value',
      name: `VALUE${index}`,
    })),
  );
  assert.equal(argumentsBlock.output, 'Any');

  const keywordArgumentsBlock = byType.get('python_keyword_arguments');
  assert.deepEqual(
    keywordArgumentsBlock.args0,
    Array.from({ length: 6 }, (_, index) => ([
      { type: 'field_input', name: `KEY${index}`, text: '' },
      { type: 'input_value', name: `VALUE${index}` },
    ])).flat(),
  );
  assert.equal(keywordArgumentsBlock.output, 'Any');

  assert.deepEqual(byType.get('python_get_item').args0, [
    { type: 'input_value', name: 'OBJECT' },
    { type: 'input_value', name: 'KEY' },
  ]);
  assert.equal(byType.get('python_get_item').output, 'Any');
  assert.deepEqual(byType.get('python_set_item').args0, [
    { type: 'input_value', name: 'OBJECT' },
    { type: 'input_value', name: 'KEY' },
    { type: 'input_value', name: 'VALUE' },
  ]);
  assert.equal(byType.get('python_set_item').previousStatement, null);
  assert.equal(byType.get('python_set_item').nextStatement, null);
  assert.deepEqual(byType.get('python_set_attribute').args0, [
    { type: 'input_value', name: 'OBJECT' },
    { type: 'field_input', name: 'ATTRIBUTE', text: 'value' },
    { type: 'input_value', name: 'VALUE' },
  ]);
  assert.equal(byType.get('python_set_attribute').previousStatement, null);
  assert.equal(byType.get('python_set_attribute').nextStatement, null);

  for (const type of NEW_TYPES) {
    const block = byType.get(type);
    assert.ok(block, `${type}: missing block`);
    assert.deepEqual(
      placeholderNumbers(block.message0),
      expectedPlaceholders(block.args0.length),
      `${type}: block placeholders`,
    );
  }

  const toolboxTypes = readJson(path.join(CORE, 'toolbox.json')).contents.map((entry) => entry.type);
  assert.equal(toolboxTypes.length, 16);
  const firstNewType = toolboxTypes.indexOf(NEW_TYPES[0]);
  assert.notEqual(firstNewType, -1);
  assert.deepEqual(toolboxTypes.slice(firstNewType, firstNewType + NEW_TYPES.length), NEW_TYPES);
  for (const type of NEW_TYPES) {
    assert.equal(toolboxTypes.filter((candidate) => candidate === type).length, 1, `${type}: toolbox refs`);
  }

  for (const localeName of LOCALES) {
    const locale = readJson(path.join(CORE, 'i18n', `${localeName}.json`));
    for (const type of NEW_TYPES) {
      const localized = locale[type];
      const block = byType.get(type);
      assert.ok(localized, `${localeName}/${type}: missing translation`);
      assert.equal(localized.args0.length, block.args0.length, `${localeName}/${type}: args0`);
      assert.ok(localized.args0.every((argument) => argument === null), `${localeName}/${type}: inheritance`);
      assert.deepEqual(
        placeholderNumbers(localized.message0),
        expectedPlaceholders(block.args0.length),
        `${localeName}/${type}: placeholders`,
      );
      assert.equal(typeof localized.tooltip, 'string', `${localeName}/${type}: tooltip`);
      assert.ok(localized.tooltip.length > 0, `${localeName}/${type}: empty tooltip`);
    }
  }

  for (const readme of ['readme.md', 'readme_ai.md']) {
    const text = fs.readFileSync(path.join(CORE, readme), 'utf8');
    for (const type of NEW_TYPES) {
      assert.ok(text.includes(type), `${readme}: missing ${type}`);
    }
  }
});

test('python_arguments emits a compact ordered list and skips every unconnected socket', () => {
  const Python = loadCoreGenerator();
  const generator = generatorWithValues({
    VALUE0: 'first_value',
    VALUE2: 'second_value',
    VALUE5: 'last_value',
  });
  const result = Python.forBlock.python_arguments(blockWithFields(), generator);
  assert.deepEqual([...result], ['[first_value, second_value, last_value]', 0]);
  assert.deepEqual(
    generator.valueCalls,
    Array.from({ length: 6 }, (_, index) => [`VALUE${index}`, 99]),
  );

  const empty = Python.forBlock.python_arguments(
    blockWithFields(),
    generatorWithValues(),
  );
  assert.deepEqual([...empty], ['[]', 0]);
});

test('python_keyword_arguments skips blank keys and delegates hostile keys to quote_', () => {
  const Python = loadCoreGenerator();
  const hostileKey = `x': __import__('os').system('unsafe') #`;
  const generator = generatorWithValues(
    { VALUE2: 'payload' },
    (_key, index) => `'safe_key_${index}'`,
  );
  const block = blockWithFields({
    KEY0: '',
    KEY1: '   ',
    KEY2: hostileKey,
    KEY3: null,
    KEY4: ' timeout ',
    KEY5: '',
  });
  const result = Python.forBlock.python_keyword_arguments(block, generator);

  assert.deepEqual([...result], ["{'safe_key_0': payload, 'safe_key_1': None}", 0]);
  assert.ok(!result[0].includes(hostileKey), 'raw hostile key reached generated Python');
  assert.deepEqual(generator.quoteCalls, [hostileKey, 'timeout']);
  assert.deepEqual(generator.valueCalls, [['VALUE2', 99], ['VALUE4', 99]]);

  const emptyGenerator = generatorWithValues();
  const empty = Python.forBlock.python_keyword_arguments(blockWithFields(), emptyGenerator);
  assert.deepEqual([...empty], ['{}', 0]);
  assert.deepEqual(emptyGenerator.quoteCalls, []);
  assert.deepEqual(emptyGenerator.valueCalls, []);
});

test('item access emits parenthesized subscription expressions and assignments', () => {
  const Python = loadCoreGenerator();
  const values = { OBJECT: 'pixels', KEY: 'pixel_index', VALUE: 'colour' };

  const getResult = Python.forBlock.python_get_item(
    blockWithFields(),
    generatorWithValues(values),
  );
  assert.deepEqual([...getResult], ['(pixels)[pixel_index]', 0]);

  const setResult = Python.forBlock.python_set_item(
    blockWithFields(),
    generatorWithValues(values),
  );
  assert.equal(setResult, '(pixels)[pixel_index] = colour\n');
});

test('attribute assignment accepts only the declared safe identifier grammar', () => {
  const Python = loadCoreGenerator();
  const values = { OBJECT: 'device', VALUE: 'new_value' };

  for (const attribute of ['brightness', 'Value2', 'motor_1']) {
    const result = Python.forBlock.python_set_attribute(
      blockWithFields({ ATTRIBUTE: attribute }),
      generatorWithValues(values),
    );
    assert.equal(result, `(device).${attribute} = new_value\n`);
  }

  const invalidAttributes = [
    '',
    '_private',
    '9lives',
    'two.parts',
    'x; __import__("os").system("unsafe")',
    'naïve',
  ];
  for (const attribute of invalidAttributes) {
    const result = Python.forBlock.python_set_attribute(
      blockWithFields({ ATTRIBUTE: attribute }),
      generatorWithValues(values),
    );
    assert.equal(result, '(device).value = new_value\n', `unsafe attribute accepted: ${attribute}`);
    assert.ok(!result.includes(attribute) || attribute === '', `unsafe attribute leaked: ${attribute}`);
  }
});

test('the core generator registers all block definitions, including the five new blocks', () => {
  const Python = loadCoreGenerator();
  const blockTypes = readJson(path.join(CORE, 'block.json')).map((block) => block.type).sort();
  assert.deepEqual(Object.keys(Python.forBlock).sort(), blockTypes);
});
