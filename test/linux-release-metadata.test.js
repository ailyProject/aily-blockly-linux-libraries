'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const SCRIPT_NAMES = [
  'genjson.js',
  'genjson-ai.js',
  'generate-info.js',
  'generate-libraries-index.js',
  'generate-package-folder-map.js',
];
const LOCALES = ['en', 'zh_cn', 'zh_hk', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'ar'];
const INFO_FIELDS = [
  '$schema',
  'category',
  'communication',
  'displayName',
  'functions',
  'hardwareType',
  'name',
  'subcategory',
  'supportedCores',
  'tags',
  'voltage',
].sort();
const INDEX_LIBRARY_FIELDS = [
  'category',
  'communication',
  'compatibleHardware',
  'displayName',
  'functions',
  'hardwareType',
  'name',
  'subcategory',
  'supportedCores',
  'tags',
  'voltage',
].sort();
const ARRAY_FIELDS = [
  'communication',
  'functions',
  'hardwareType',
  'supportedCores',
  'tags',
  'voltage',
];

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writePackage(rootDir, folderName, overrides = {}, toolboxIcon = `icon-${folderName}`) {
  const packageJson = {
    name: `@aily-project-linux/lib-${folderName.replaceAll('_', '-')}`,
    nickname: folderName,
    version: '1.0.0',
    description: `${folderName} description`,
    compatibility: {
      type: ['vendor:soc:board-b', 'vendor:soc:board-a'],
      voltage: [5, 3.3],
    },
    keywords: ['python', 'linux'],
    tags: ['system'],
    homepage: `https://example.com/${folderName}`,
    ...overrides,
  };
  writeJson(path.join(rootDir, folderName, 'package.json'), packageJson);
  if (toolboxIcon !== null) {
    writeJson(path.join(rootDir, folderName, 'toolbox.json'), { icon: toolboxIcon });
  }
}

function createFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aily-linux-metadata-'));
  fs.mkdirSync(path.join(rootDir, 'scripts'));
  for (const scriptName of SCRIPT_NAMES) {
    fs.copyFileSync(
      path.join(ROOT, 'scripts', scriptName),
      path.join(rootDir, 'scripts', scriptName),
    );
  }

  writePackage(rootDir, 'zeta', {
    nickname: 'BME280 I2C Sensor',
    keywords: ['python', 'linux', 'bme280', 'i2c'],
    tags: ['sensor'],
    tested: true,
  });
  writePackage(rootDir, 'alpha', {
    name: '@aily-project-linux/lib-alpha',
    nickname: 'Alpha',
    tags: ['communication'],
  });
  writePackage(rootDir, 'core', { tags: ['core'] });
  writePackage(rootDir, 'core_math', { tags: ['core'] });
  writePackage(rootDir, 'hidden', { hide: true }, null);
  writePackage(rootDir, 'unrelated', { name: '@example/not-a-library' }, null);

  writeJson(path.join(rootDir, 'catalog', 'python-libraries.json'), {
    schemaVersion: 1,
    libraries: [
      {
        id: 'alpha',
        category: 'network',
        compatibility: 'blinka',
        boardTypes: ['vendor:soc:board-b', 'vendor:soc:board-a'],
      },
    ],
  });
  return rootDir;
}

function createRealMetadataFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aily-linux-real-metadata-'));
  fs.mkdirSync(path.join(rootDir, 'scripts'));
  for (const scriptName of SCRIPT_NAMES) {
    fs.copyFileSync(
      path.join(ROOT, 'scripts', scriptName),
      path.join(rootDir, 'scripts', scriptName),
    );
  }
  fs.mkdirSync(path.join(rootDir, 'catalog'));
  fs.copyFileSync(
    path.join(ROOT, 'catalog', 'python-libraries.json'),
    path.join(rootDir, 'catalog', 'python-libraries.json'),
  );

  const { getPublishablePackages } = require('../scripts/genjson');
  for (const { folderName } of getPublishablePackages(ROOT)) {
    const targetDir = path.join(rootDir, folderName);
    fs.mkdirSync(targetDir);
    fs.copyFileSync(
      path.join(ROOT, folderName, 'package.json'),
      path.join(targetDir, 'package.json'),
    );
    fs.copyFileSync(
      path.join(ROOT, folderName, 'toolbox.json'),
      path.join(targetDir, 'toolbox.json'),
    );
  }
  return rootDir;
}

function assertInfoSchema(info) {
  assert.deepEqual(Object.keys(info).sort(), INFO_FIELDS);
  for (const field of ['$schema', 'name', 'displayName', 'category', 'subcategory']) {
    assert.equal(typeof info[field], 'string', `info.${field}`);
  }
  for (const field of ARRAY_FIELDS) {
    assert.ok(Array.isArray(info[field]), `info.${field}`);
  }
  assert.equal(info.$schema, 'library-info-schema');
  for (const field of ['communication', 'functions', 'hardwareType', 'supportedCores', 'tags']) {
    assert.ok(info[field].every((value) => typeof value === 'string' && value), `info.${field}`);
  }
  assert.ok(info.voltage.every((value) => typeof value === 'number'));
}

function assertIndexLibrarySchema(library) {
  assert.deepEqual(Object.keys(library).sort(), INDEX_LIBRARY_FIELDS);
  for (const field of ['name', 'displayName', 'category', 'subcategory']) {
    assert.equal(typeof library[field], 'string', `index.${field}`);
  }
  for (const field of [...ARRAY_FIELDS, 'compatibleHardware']) {
    assert.ok(Array.isArray(library[field]), `index.${field}`);
  }
  for (const field of [
    'communication',
    'compatibleHardware',
    'functions',
    'hardwareType',
    'supportedCores',
    'tags',
  ]) {
    assert.ok(library[field].every((value) => typeof value === 'string' && value), `index.${field}`);
  }
  assert.ok(library.voltage.every((value) => typeof value === 'number'));
}

function runScript(rootDir, scriptName, args = []) {
  return spawnSync(process.execPath, [path.join(rootDir, 'scripts', scriptName), ...args], {
    cwd: rootDir,
    encoding: 'utf8',
  });
}

test('Linux metadata scripts generate the complete, sorted release chain', (t) => {
  const rootDir = createFixture();
  t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));

  for (const [scriptName, args] of [
    ['genjson.js', []],
    ['genjson-ai.js', []],
    ['generate-info.js', ['--all']],
    ['generate-libraries-index.js', []],
    ['generate-package-folder-map.js', []],
  ]) {
    const result = runScript(rootDir, scriptName, args);
    assert.equal(result.status, 0, `${scriptName}: ${result.stderr}`);
  }

  const libraries = JSON.parse(fs.readFileSync(path.join(rootDir, 'libraries-linux.json'), 'utf8'));
  assert.deepEqual(
    libraries.map((library) => library.name),
    [
      '@aily-project-linux/lib-zeta',
      '@aily-project-linux/lib-alpha',
      '@aily-project-linux/lib-core',
      '@aily-project-linux/lib-core-math',
    ],
  );
  const alphaLibrary = libraries.find((library) => library.name === '@aily-project-linux/lib-alpha');
  assert.equal(alphaLibrary.icon, 'icon-alpha');
  assert.equal(alphaLibrary.url, 'https://example.com/alpha');
  assert.equal(libraries[0].tested, true);

  const aiLibraries = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'libraries-linux-ai.json'), 'utf8'),
  );
  assert.equal(aiLibraries.length, 4);
  assert.ok(aiLibraries.every((library) => library.icon));
  assert.deepEqual(
    aiLibraries.map((library) => library.name),
    libraries.map((library) => library.name),
  );

  const alphaInfo = JSON.parse(fs.readFileSync(path.join(rootDir, 'alpha', 'info.json'), 'utf8'));
  assertInfoSchema(alphaInfo);
  assert.equal(alphaInfo.category, 'network');
  assert.deepEqual(alphaInfo.supportedCores, ['vendor:soc:board-b', 'vendor:soc:board-a']);
  assert.equal(fs.existsSync(path.join(rootDir, 'hidden', 'info.json')), false);

  const zetaInfo = JSON.parse(fs.readFileSync(path.join(rootDir, 'zeta', 'info.json'), 'utf8'));
  assertInfoSchema(zetaInfo);
  assert.deepEqual(zetaInfo.communication, ['i2c']);
  assert.deepEqual(zetaInfo.hardwareType, ['temperature', 'humidity', 'pressure']);

  const coreInfo = JSON.parse(fs.readFileSync(path.join(rootDir, 'core_math', 'info.json'), 'utf8'));
  assertInfoSchema(coreInfo);
  assert.equal(coreInfo.category, 'core');

  const index = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'libraries-linux-index.json'), 'utf8'),
  );
  assert.deepEqual(Object.keys(index).sort(), ['$schema', 'count', 'generated', 'libraries', 'version']);
  assert.equal(index.$schema, 'libraries-index-schema');
  assert.equal(typeof index.version, 'string');
  assert.equal(typeof index.generated, 'string');
  assert.ok(Array.isArray(index.libraries));
  assert.equal(index.count, 4);
  index.libraries.forEach(assertIndexLibrarySchema);
  assert.deepEqual(
    index.libraries.map((library) => library.name),
    ['lib-alpha', 'lib-core', 'lib-core-math', 'lib-zeta'],
  );

  const folderMap = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'package-folder-map-linux.json'), 'utf8'),
  );
  assert.deepEqual(Object.keys(folderMap), [
    '@aily-project-linux/lib-alpha',
    '@aily-project-linux/lib-core',
    '@aily-project-linux/lib-core-math',
    '@aily-project-linux/lib-zeta',
  ]);
  assert.equal(new Set(Object.values(folderMap)).size, 4);
});

test('metadata scripts fail with a non-zero status on malformed or duplicate package data', (t) => {
  const malformedRoot = createFixture();
  const duplicateRoot = createFixture();
  const missingIconRoot = createFixture();
  const invalidNameRoot = createFixture();
  t.after(() => {
    fs.rmSync(malformedRoot, { recursive: true, force: true });
    fs.rmSync(duplicateRoot, { recursive: true, force: true });
    fs.rmSync(missingIconRoot, { recursive: true, force: true });
    fs.rmSync(invalidNameRoot, { recursive: true, force: true });
  });

  fs.writeFileSync(path.join(malformedRoot, 'alpha', 'package.json'), '{', 'utf8');
  assert.notEqual(runScript(malformedRoot, 'genjson.js').status, 0);

  writePackage(duplicateRoot, 'duplicate', { name: '@aily-project-linux/lib-alpha' });
  assert.notEqual(runScript(duplicateRoot, 'generate-package-folder-map.js').status, 0);

  fs.rmSync(path.join(missingIconRoot, 'alpha', 'toolbox.json'));
  assert.notEqual(runScript(missingIconRoot, 'genjson-ai.js').status, 0);

  writePackage(invalidNameRoot, 'invalid_name', { name: ['@aily-project-linux/lib-invalid'] });
  const invalidNameResult = runScript(invalidNameRoot, 'genjson.js');
  assert.notEqual(invalidNameResult.status, 0);
  assert.match(invalidNameResult.stderr, /name 必须是字符串/);
});

test('the real 142-package metadata completes the full index and map chain', (t) => {
  const rootDir = createRealMetadataFixture();
  t.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));

  for (const [scriptName, args] of [
    ['genjson.js', []],
    ['genjson-ai.js', []],
    ['generate-info.js', ['--all']],
    ['generate-libraries-index.js', []],
    ['generate-package-folder-map.js', []],
  ]) {
    const result = runScript(rootDir, scriptName, args);
    assert.equal(result.status, 0, `${scriptName}: ${result.stderr}`);
  }

  const { getPublishablePackages } = require('../scripts/genjson');
  const packages = getPublishablePackages(ROOT);
  const expectedCores = new Map(packages.map(({ packageJson }) => [
    packageJson.name.replace('@aily-project-linux/', ''),
    packageJson.compatibility.type,
  ]));
  const libraries = JSON.parse(fs.readFileSync(path.join(rootDir, 'libraries-linux.json'), 'utf8'));
  const aiLibraries = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'libraries-linux-ai.json'), 'utf8'),
  );
  const index = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'libraries-linux-index.json'), 'utf8'),
  );
  const folderMap = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'package-folder-map-linux.json'), 'utf8'),
  );
  const catalog = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'catalog', 'python-libraries.json'), 'utf8'),
  );

  assert.equal(packages.length, 142);
  assert.equal(catalog.libraries.length, 113);
  assert.equal(libraries.length, packages.length);
  assert.equal(aiLibraries.length, packages.length);
  assert.equal(index.count, packages.length);
  assert.equal(Object.keys(folderMap).length, packages.length);
  assert.equal(new Set(Object.values(folderMap)).size, packages.length);
  assert.ok(libraries.every((library) => typeof library.icon === 'string' && library.icon));
  assert.ok(aiLibraries.every((library) => typeof library.icon === 'string' && library.icon));
  assert.ok(index.libraries.some((library) => library.communication.length > 0));
  assert.ok(index.libraries.some((library) => library.hardwareType.length > 0));

  for (const library of index.libraries) {
    assertIndexLibrarySchema(library);
    assert.deepEqual(library.supportedCores, expectedCores.get(library.name));
    const folderName = folderMap[`@aily-project-linux/${library.name}`];
    assert.ok(folderName, library.name);
    const info = JSON.parse(fs.readFileSync(path.join(rootDir, folderName, 'info.json'), 'utf8'));
    assertInfoSchema(info);
  }

  const jsonLibrary = index.libraries.find((library) => library.name === 'lib-json');
  assert.ok(jsonLibrary);
  assert.equal(jsonLibrary.communication.includes('uart'), false);
});

test('tags-linux contains exactly the 12 used tags in every locale', () => {
  const { getPublishablePackages } = require('../scripts/genjson');
  const tagsDocument = JSON.parse(fs.readFileSync(path.join(ROOT, 'tags-linux.json'), 'utf8'));
  const packageTags = [...new Set(
    getPublishablePackages(ROOT).flatMap(({ packageJson }) => packageJson.tags || []),
  )].sort();

  assert.equal(tagsDocument.tags.length, 12);
  assert.deepEqual(tagsDocument.tags, packageTags);
  for (const locale of LOCALES) {
    assert.deepEqual(Object.keys(tagsDocument[`tags_${locale}`]), tagsDocument.tags);
    assert.ok(
      Object.values(tagsDocument[`tags_${locale}`])
        .every((value) => typeof value === 'string' && value),
      `tags_${locale}`,
    );
  }
});
