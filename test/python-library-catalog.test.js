'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'catalog', 'python-libraries.json');
const LOCALES = [
  'ar',
  'de',
  'en',
  'es',
  'fr',
  'ja',
  'ko',
  'pt',
  'ru',
  'zh_cn',
  'zh_hk',
];
const PACKAGE_FILES = [
  'block.json',
  'generator.js',
  ...LOCALES.map((locale) => `i18n/${locale}.json`),
  'package.json',
  'readme.md',
  'readme_ai.md',
  'toolbox.json',
].sort();
const PATH_NAME = /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/;
const ID = /^[a-z][a-z0-9_]*$/;
const COLOURS = {
  'raspberry-pi': '#C51A4A',
  'hardware-io': '#00897B',
  industrial: '#00897B',
  system: '#455A64',
  network: '#0288D1',
  sensors: '#00897B',
  actuators: '#00897B',
  display: '#1976D2',
  'vision-ai': '#1976D2',
  'data-science': '#7B1FA2',
  audio: '#EF6C00',
  'iot-cloud': '#0288D1',
  robotics: '#00897B',
};
const TAGS = {
  'raspberry-pi': 'io',
  'hardware-io': 'io',
  industrial: 'io',
  system: 'system',
  network: 'communication',
  sensors: 'io',
  actuators: 'io',
  display: 'display',
  'vision-ai': 'display',
  'data-science': 'data',
  audio: 'audio',
  'iot-cloud': 'communication',
  robotics: 'io',
};
const METADATA_KEYS = [
  'author',
  'compatibility',
  'dependencies',
  'description',
  'description_en',
  'description_zh_cn',
  'devDependencies',
  'homepage',
  'keywords',
  'license',
  'name',
  'nickname',
  ...LOCALES.map((locale) => `nickname_${locale}`),
  'spec',
  'tags',
  'version',
].sort();
const MICRO_PYTHON_RUNTIME_MARKERS = [
  ['MicroPython runtime name', /\bmicropython\b/i],
  ['MPY generator global', /\bMPY\b/],
  ['machine module import', /\b(?:from\s+machine\s+import|import\s+machine\b)/i],
  ['machine module access', /\bmachine\s*\./i],
  ['MicroPython u-module', /\b(?:uasyncio|ubinascii|uos|usocket|ustruct|utime)\b/i],
  ['MicroPython WLAN API', /\bnetwork\s*\.\s*WLAN\b/],
  ['Pyboard API', /\bpyb\s*\./i],
];

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  const text = readText(file);
  try {
    return JSON.parse(text);
  } catch (error) {
    error.message = `${path.relative(ROOT, file)}: ${error.message}`;
    throw error;
  }
}

function relativeFiles(directory) {
  const files = [];
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(absolute);
      } else {
        files.push(path.relative(directory, absolute).split(path.sep).join('/'));
      }
    }
  }
  visit(directory);
  return files.sort();
}

function dropdown(name, values) {
  return {
    type: 'field_dropdown',
    name,
    options: values.map((value) => [value, value]),
  };
}

function input(name) {
  return { type: 'input_value', name };
}

function expectedBlocks(library) {
  const common = {
    colour: COLOURS[library.category],
    icon: 'settings',
  };
  const blocks = [
    {
      type: `${library.blockPrefix}_call`,
      message0: `${library.title} call or create %1 arguments %2 keyword arguments %3`,
      args0: [dropdown('TARGET', library.callables), input('ARGS'), input('KWARGS')],
      ...common,
      tooltip: `Call an allowlisted ${library.title} function or constructor and return its result.`,
      output: 'Any',
    },
    {
      type: `${library.blockPrefix}_do`,
      message0: `run ${library.title} %1 arguments %2 keyword arguments %3`,
      args0: [dropdown('TARGET', library.callables), input('ARGS'), input('KWARGS')],
      ...common,
      tooltip: `Run an allowlisted ${library.title} function or constructor as a statement.`,
      previousStatement: null,
      nextStatement: null,
    },
  ];

  if (library.methods.length) {
    blocks.push(
      {
        type: `${library.blockPrefix}_method`,
        message0: `${library.title} object %1 call method %2 arguments %3 keyword arguments %4`,
        args0: [
          input('OBJECT'),
          dropdown('METHOD', library.methods),
          input('ARGS'),
          input('KWARGS'),
        ],
        ...common,
        tooltip: `Call an allowlisted ${library.title} object method and return its result.`,
        output: 'Any',
      },
      {
        type: `${library.blockPrefix}_do_method`,
        message0: `run ${library.title} object %1 method %2 arguments %3 keyword arguments %4`,
        args0: [
          input('OBJECT'),
          dropdown('METHOD', library.methods),
          input('ARGS'),
          input('KWARGS'),
        ],
        ...common,
        tooltip: `Run an allowlisted ${library.title} object method as a statement.`,
        previousStatement: null,
        nextStatement: null,
      },
    );
  }

  if (library.attributes.length) {
    blocks.push({
      type: `${library.blockPrefix}_attribute`,
      message0: `${library.title} object %1 attribute %2`,
      args0: [input('OBJECT'), dropdown('ATTRIBUTE', library.attributes)],
      ...common,
      tooltip: `Read an allowlisted ${library.title} object or module attribute.`,
      output: 'Any',
    });
  }
  return blocks;
}

function assertPlaceholders(message, argumentCount, label) {
  assert.equal(typeof message, 'string', `${label} must be a string`);
  const actual = [...message.matchAll(/%(\d+)/g)]
    .map((match) => Number(match[1]))
    .sort((left, right) => left - right);
  const expected = Array.from({ length: argumentCount }, (_, index) => index + 1);
  assert.deepEqual(actual, expected, `${label} must reference each args0 item exactly once`);
}

function assertRuntimeMarkersAbsent(text, label) {
  for (const [name, pattern] of MICRO_PYTHON_RUNTIME_MARKERS) {
    assert.doesNotMatch(text, pattern, `${label} contains a ${name}`);
  }
}

const catalog = readJson(CATALOG_PATH);
const libraries = catalog.libraries;

test('catalog declares exactly 100 well-formed CPython libraries', () => {
  assert.equal(catalog.schemaVersion, 1);
  assert.equal(catalog.count, 100);
  assert.ok(Array.isArray(libraries));
  assert.equal(libraries.length, 100);

  const ids = new Set();
  const prefixes = new Set();
  for (const library of libraries) {
    assert.match(library.id, ID, `${library.id}: unsafe package id`);
    assert.ok(!ids.has(library.id), `${library.id}: duplicate catalog id`);
    ids.add(library.id);

    assert.equal(typeof library.title, 'string', `${library.id}: title`);
    assert.ok(library.title.length > 0, `${library.id}: empty title`);
    assert.match(library.blockPrefix, ID, `${library.id}: unsafe block prefix`);
    assert.ok(!prefixes.has(library.blockPrefix), `${library.id}: duplicate block prefix`);
    prefixes.add(library.blockPrefix);
    assert.match(library.module, PATH_NAME, `${library.id}: invalid CPython module path`);
    assert.equal(typeof library.pip, 'string', `${library.id}: pip name`);
    assert.ok(library.pip.length > 0, `${library.id}: empty pip name`);
    assert.ok(Object.hasOwn(COLOURS, library.category), `${library.id}: unknown category`);
    assert.ok(['rpi', 'linux'].includes(library.compatibility), `${library.id}: compatibility`);
    assert.equal(typeof library.asyncBridge, 'boolean', `${library.id}: asyncBridge`);
    assert.equal(typeof library.raspberryPiDocs, 'boolean', `${library.id}: raspberryPiDocs`);
    assert.equal(typeof library.install, 'string', `${library.id}: install command`);
    assert.ok(library.install.length > 0, `${library.id}: empty install command`);
    assert.match(library.homepage, /^https:\/\//, `${library.id}: homepage must use HTTPS`);
    assert.equal(typeof library.notesEn, 'string', `${library.id}: notesEn`);
    assert.equal(typeof library.notesZh, 'string', `${library.id}: notesZh`);

    for (const listName of ['callables', 'methods', 'attributes']) {
      const values = library[listName];
      assert.ok(Array.isArray(values), `${library.id}: ${listName} must be an array`);
      if (listName === 'callables') {
        assert.ok(values.length > 0, `${library.id}: callables must not be empty`);
      }
      assert.equal(new Set(values).size, values.length, `${library.id}: duplicate ${listName}`);
      for (const value of values) {
        assert.match(value, PATH_NAME, `${library.id}: invalid ${listName} entry ${value}`);
      }
    }
    const moduleAttributes = library.moduleAttributes ?? [];
    assert.ok(Array.isArray(moduleAttributes), `${library.id}: moduleAttributes must be an array`);
    assert.equal(new Set(moduleAttributes).size, moduleAttributes.length, `${library.id}: duplicate moduleAttributes`);
    for (const value of moduleAttributes) {
      assert.ok(library.attributes.includes(value), `${library.id}: unknown module attribute ${value}`);
    }
  }
});

test('catalog distinguishes CPython from the 26 Blinka-backed driver packages', () => {
  const profiles = catalog.runtimeProfiles;
  assert.match(profiles.default, /Linux CPython/);
  assert.match(profiles.blinka, /Linux CPython/);
  assert.match(profiles.blinka, /not MicroPython/i);
  assert.deepEqual(profiles.compatibilityLayerLibraries, ['adafruit_blinka']);

  const expectedBlinkaDrivers = libraries
    .filter((library) => library.pip.toLowerCase().startsWith('adafruit-circuitpython-'))
    .map((library) => library.id)
    .sort();
  assert.equal(expectedBlinkaDrivers.length, 26);
  assert.deepEqual([...profiles.blinkaLibraries].sort(), expectedBlinkaDrivers);
  assert.equal(new Set(profiles.blinkaLibraries).size, 26);

  for (const id of profiles.blinkaLibraries) {
    const chinese = readText(path.join(ROOT, id, 'readme.md'));
    const english = readText(path.join(ROOT, id, 'readme_ai.md'));
    assert.match(chinese, /CPython/, `${id}: Chinese CPython notice`);
    assert.match(chinese, /Blinka/, `${id}: Chinese Blinka notice`);
    assert.match(chinese, /不是 MicroPython/, `${id}: Chinese runtime distinction`);
    assert.match(english, /CPython/, `${id}: English CPython notice`);
    assert.match(english, /Blinka/, `${id}: English Blinka notice`);
    assert.match(english, /not MicroPython/i, `${id}: English runtime distinction`);
  }

  const blinkaReadme = readText(path.join(ROOT, 'adafruit_blinka', 'readme_ai.md'));
  assert.match(blinkaReadme, /not MicroPython/i);
  assert.match(blinkaReadme, /does not require CircuitPython firmware/i);

  const conditions = catalog.raspberryPi5Conditions;
  assert.match(conditions.baseline, /64-bit Raspberry Pi OS/);
  assert.match(conditions.baseline, /--system-site-packages/);
  assert.deepEqual(Object.keys(conditions.experimental), ['adafruit_dht']);
  assert.deepEqual(
    Object.keys(conditions.conditional).sort(),
    ['adafruit_bno055', 'adafruit_ccs811', 'adafruit_pn532', 'neopixel'],
  );
  assert.match(conditions.conditional.neopixel, /PIO/);
  assert.match(conditions.conditional.adafruit_pn532, /prefer PN532 over SPI/i);
  assert.match(conditions.conditional.adafruit_pn532, /UART is not a recommended/i);
});

test('each catalog package has exactly 17 files and complete package metadata', () => {
  const boardIds = catalog.boardIds;
  const allLinuxBoards = [boardIds.cybercam, boardIds.raspberryPi5, boardIds.walnutPi2B];

  for (const library of libraries) {
    const directory = path.join(ROOT, library.id);
    assert.ok(fs.statSync(directory).isDirectory(), `${library.id}: package directory missing`);
    assert.deepEqual(relativeFiles(directory), PACKAGE_FILES, `${library.id}: package file inventory`);

    const metadata = readJson(path.join(directory, 'package.json'));
    assert.deepEqual(Object.keys(metadata).sort(), METADATA_KEYS, `${library.id}: metadata keys`);
    assert.equal(metadata.name, `@aily-project/lib-${library.id.replaceAll('_', '-')}`);
    assert.equal(metadata.nickname, library.title, `${library.id}: nickname`);
    for (const locale of LOCALES) {
      assert.equal(metadata[`nickname_${locale}`], library.title, `${library.id}: ${locale} nickname`);
    }
    assert.equal(metadata.version, '0.0.1', `${library.id}: version`);
    assert.equal(metadata.description, metadata.description_zh_cn, `${library.id}: Chinese description alias`);
    assert.ok(metadata.description.length > 0, `${library.id}: empty description`);
    assert.equal(
      metadata.description_en,
      `Allowlisted ${library.title} Python API blocks for Raspberry Pi and Linux single-board computers.`,
      `${library.id}: English description`,
    );
    assert.equal(metadata.spec, true, `${library.id}: spec flag`);
    assert.deepEqual(metadata.compatibility, {
      type: library.compatibility === 'rpi' ? [boardIds.raspberryPi5] : allLinuxBoards,
      voltage: [3.3],
    }, `${library.id}: board compatibility`);
    assert.deepEqual(metadata.keywords, [
      'aily',
      'blockly',
      'python',
      'linux',
      'raspberry-pi',
      library.pip,
      library.module,
    ], `${library.id}: keywords`);
    assert.deepEqual(metadata.tags, [TAGS[library.category]], `${library.id}: tags`);
    assert.equal(metadata.author, 'ailyProject', `${library.id}: author`);
    assert.equal(metadata.license, 'MIT', `${library.id}: license`);
    assert.equal(metadata.homepage, library.homepage, `${library.id}: homepage`);
    assert.deepEqual(metadata.dependencies, {}, `${library.id}: dependencies`);
    assert.deepEqual(metadata.devDependencies, {}, `${library.id}: devDependencies`);
  }
});

test('block and toolbox JSON exactly expose the catalog allowlists', () => {
  for (const library of libraries) {
    const directory = path.join(ROOT, library.id);
    const expected = expectedBlocks(library);
    const blocks = readJson(path.join(directory, 'block.json'));
    assert.deepEqual(blocks, expected, `${library.id}: block schema`);

    for (const block of blocks) {
      assertPlaceholders(block.message0, block.args0.length, `${library.id}/${block.type}.message0`);
    }

    const toolbox = readJson(path.join(directory, 'toolbox.json'));
    assert.deepEqual(toolbox, {
      kind: 'category',
      name: library.title,
      colour: COLOURS[library.category],
      contents: expected.map((block) => ({ kind: 'block', type: block.type })),
    }, `${library.id}: toolbox must reference every block exactly once and in order`);
  }
});

test('all 11 locales preserve placeholders and safe dropdown values', () => {
  for (const library of libraries) {
    const directory = path.join(ROOT, library.id);
    const blocks = readJson(path.join(directory, 'block.json'));
    const blockTypes = blocks.map((block) => block.type);
    const localeKeys = ['toolbox_name', 'toolbox_categories', 'toolbox_labels', ...blockTypes].sort();

    for (const localeName of LOCALES) {
      const locale = readJson(path.join(directory, 'i18n', `${localeName}.json`));
      const context = `${library.id}/i18n/${localeName}.json`;
      assert.deepEqual(Object.keys(locale).sort(), localeKeys, `${context}: keys`);
      assert.equal(typeof locale.toolbox_name, 'string', `${context}: toolbox_name`);
      assert.ok(locale.toolbox_name.length > 0, `${context}: empty toolbox_name`);
      assert.deepEqual(locale.toolbox_categories, [], `${context}: toolbox_categories`);
      assert.deepEqual(locale.toolbox_labels, {}, `${context}: toolbox_labels`);

      for (const block of blocks) {
        const localized = locale[block.type];
        assert.deepEqual(
          Object.keys(localized).sort(),
          ['args0', 'message0', 'tooltip'],
          `${context}/${block.type}: keys`,
        );
        assertPlaceholders(
          localized.message0,
          block.args0.length,
          `${context}/${block.type}.message0`,
        );
        assert.equal(typeof localized.tooltip, 'string', `${context}/${block.type}: tooltip`);
        assert.ok(localized.tooltip.length > 0, `${context}/${block.type}: empty tooltip`);
        assert.ok(Array.isArray(localized.args0), `${context}/${block.type}: args0`);
        assert.equal(localized.args0.length, block.args0.length, `${context}/${block.type}: args0 length`);

        for (let index = 0; index < block.args0.length; index += 1) {
          const baseArgument = block.args0[index];
          const localizedArgument = localized.args0[index];
          if (baseArgument.type !== 'field_dropdown') {
            assert.equal(localizedArgument, null, `${context}/${block.type}: input ${index} must inherit`);
            continue;
          }

          // A null dropdown is the supported baseline-locale inheritance form.
          // When labels are supplied, only labels may change; code values and order may not.
          const options = localizedArgument === null
            ? baseArgument.options
            : localizedArgument.options;
          if (localizedArgument !== null) {
            assert.deepEqual(
              Object.keys(localizedArgument),
              ['options'],
              `${context}/${block.type}: dropdown ${index} schema`,
            );
          }
          assert.ok(Array.isArray(options), `${context}/${block.type}: dropdown ${index} options`);
          assert.equal(options.length, baseArgument.options.length, `${context}/${block.type}: option count`);
          for (let optionIndex = 0; optionIndex < options.length; optionIndex += 1) {
            const option = options[optionIndex];
            assert.ok(Array.isArray(option), `${context}/${block.type}: option ${optionIndex}`);
            assert.equal(option.length, 2, `${context}/${block.type}: option ${optionIndex} tuple`);
            assert.equal(typeof option[0], 'string', `${context}/${block.type}: option label`);
            assert.ok(option[0].length > 0, `${context}/${block.type}: empty option label`);
            assert.equal(
              option[1],
              baseArgument.options[optionIndex][1],
              `${context}/${block.type}: dropdown code value changed`,
            );
          }
        }

        if (localeName === 'en') {
          assert.equal(localized.message0, block.message0, `${context}/${block.type}: baseline message`);
          assert.equal(localized.tooltip, block.tooltip, `${context}/${block.type}: baseline tooltip`);
        }
      }
    }
  }
});

function loadGenerator(library) {
  const capturedAllowlists = [];
  class CapturingSet extends Set {
    constructor(values) {
      super(values);
      capturedAllowlists.push([...values]);
    }
  }

  const Python = {
    forBlock: Object.create(null),
    ORDER_MEMBER: 2.1,
    ORDER_FUNCTION_CALL: 2.2,
    ORDER_NONE: 99,
    addImport() {},
    valueToCode() {},
    addVariable() {},
    addFunction() {},
    addCleanup() {},
  };
  const file = path.join(ROOT, library.id, 'generator.js');
  vm.runInNewContext(readText(file), { Python, Set: CapturingSet }, {
    filename: path.relative(ROOT, file),
    timeout: 1_000,
  });
  return { Python, capturedAllowlists };
}

function invokeGenerator(handler, selectedValue) {
  const calls = { imports: [], variables: [], functions: [], cleanups: [] };
  const generator = {
    valueToCode(_block, name) {
      return { OBJECT: 'device', ARGS: '[1]', KWARGS: "{'flag': True}" }[name] || '';
    },
    addImport(...args) {
      calls.imports.push(args);
    },
    addVariable(...args) {
      calls.variables.push(args);
    },
    addFunction(...args) {
      calls.functions.push(args);
    },
    addCleanup(...args) {
      calls.cleanups.push(args);
    },
  };
  const block = { getFieldValue: () => selectedValue };
  const result = handler(block, generator);
  const code = Array.isArray(result) ? result[0] : result;
  return { calls, code, result };
}

test('generators register every block and reject injected dropdown values by fallback', () => {
  const injected = '__import__("os").system("echo injected")';

  for (const library of libraries) {
    const blocks = readJson(path.join(ROOT, library.id, 'block.json'));
    const { Python, capturedAllowlists } = loadGenerator(library);
    assert.deepEqual(
      capturedAllowlists.slice(0, 3),
      [library.callables, library.methods, library.attributes],
      `${library.id}: embedded generator allowlists`,
    );
    assert.deepEqual(
      Object.keys(Python.forBlock).sort(),
      blocks.map((block) => block.type).sort(),
      `${library.id}: generator registrations`,
    );

    const expectations = new Map([
      [`${library.blockPrefix}_call`, `_python_lib_${library.id}.${library.callables[0]}`],
      [`${library.blockPrefix}_do`, `_python_lib_${library.id}.${library.callables[0]}`],
    ]);
    if (library.methods.length) {
      expectations.set(`${library.blockPrefix}_method`, `(device).${library.methods[0]}`);
      expectations.set(`${library.blockPrefix}_do_method`, `(device).${library.methods[0]}`);
    }
    if (library.attributes.length) {
      const firstAttribute = library.attributes[0];
      const attributeTarget = (library.moduleAttributes ?? []).includes(firstAttribute)
        ? `_python_lib_${library.id}.${firstAttribute}`
        : `(device).${firstAttribute}`;
      expectations.set(`${library.blockPrefix}_attribute`, attributeTarget);
    }

    for (const [blockType, fallbackTarget] of expectations) {
      const { calls, code, result } = invokeGenerator(Python.forBlock[blockType], injected);
      assert.equal(typeof code, 'string', `${library.id}/${blockType}: generated code`);
      assert.ok(code.includes(fallbackTarget), `${library.id}/${blockType}: did not use first allowlisted value`);
      assert.ok(!code.includes(injected), `${library.id}/${blockType}: dropdown injection reached Python code`);
      if (blockType === `${library.blockPrefix}_call` || blockType === `${library.blockPrefix}_do`) {
        assert.ok(
          calls.imports.some(([key, statement]) => (
            key === `python_lib_${library.id}`
            && statement === `import ${library.module} as _python_lib_${library.id}`
          )),
          `${library.id}/${blockType}: missing exact CPython import`,
        );
      }
      if (blockType.endsWith('_do') || blockType.endsWith('_do_method')) {
        assert.equal(typeof result, 'string', `${library.id}/${blockType}: statement result`);
        assert.ok(result.endsWith('\n'), `${library.id}/${blockType}: statement newline`);
      } else {
        assert.ok(Array.isArray(result), `${library.id}/${blockType}: expression result`);
        assert.equal(result.length, 2, `${library.id}/${blockType}: expression tuple`);
      }
      if (library.asyncBridge && !blockType.endsWith('_attribute')) {
        assert.ok(code.includes('_python_sbc_async_call'), `${library.id}/${blockType}: async bridge`);
        assert.ok(calls.variables.length > 0, `${library.id}/${blockType}: async state`);
        assert.ok(calls.functions.length > 0, `${library.id}/${blockType}: async function`);
        assert.ok(calls.cleanups.length > 0, `${library.id}/${blockType}: async cleanup`);
      }

      assertRuntimeMarkersAbsent(code, `${library.id}/${blockType} generated code`);
      for (const [, statement] of calls.imports) {
        assertRuntimeMarkersAbsent(statement, `${library.id}/${blockType} generated import`);
      }
    }
  }
});

test('executable assets contain no MicroPython runtime markers', () => {
  for (const library of libraries) {
    for (const fileName of ['block.json', 'generator.js', 'toolbox.json']) {
      const file = path.join(ROOT, library.id, fileName);
      assertRuntimeMarkersAbsent(readText(file), `${library.id}/${fileName}`);
    }
  }
});

test('package names and block types are globally unique, including existing libraries', () => {
  const packageNames = new Map();
  const blockTypes = new Map();
  const packageDirectories = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .filter((name) => (
      fs.existsSync(path.join(ROOT, name, 'package.json'))
      && fs.existsSync(path.join(ROOT, name, 'block.json'))
    ));

  for (const directoryName of packageDirectories) {
    const metadata = readJson(path.join(ROOT, directoryName, 'package.json'));
    const blocks = readJson(path.join(ROOT, directoryName, 'block.json'));
    assert.equal(typeof metadata.name, 'string', `${directoryName}: package name`);
    assert.ok(metadata.name.length > 0, `${directoryName}: empty package name`);
    assert.ok(!packageNames.has(metadata.name), [
      `duplicate package name ${metadata.name}:`,
      packageNames.get(metadata.name),
      directoryName,
    ].filter(Boolean).join(' '));
    packageNames.set(metadata.name, directoryName);

    assert.ok(Array.isArray(blocks), `${directoryName}: block.json must be an array`);
    for (const block of blocks) {
      assert.equal(typeof block.type, 'string', `${directoryName}: block type`);
      assert.ok(block.type.length > 0, `${directoryName}: empty block type`);
      assert.ok(!blockTypes.has(block.type), [
        `duplicate block type ${block.type}:`,
        blockTypes.get(block.type),
        directoryName,
      ].filter(Boolean).join(' '));
      blockTypes.set(block.type, directoryName);
    }
  }

  for (const library of libraries) {
    assert.equal(
      packageNames.get(`@aily-project/lib-${library.id.replaceAll('_', '-')}`),
      library.id,
      `${library.id}: catalog package missing from global scan`,
    );
    for (const block of expectedBlocks(library)) {
      assert.equal(blockTypes.get(block.type), library.id, `${library.id}: global block registration owner`);
    }
  }
});
