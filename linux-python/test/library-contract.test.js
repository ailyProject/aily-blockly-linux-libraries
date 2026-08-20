const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, name), 'utf8'));

const REQUIRED_BLOCKS = [
  'linux_gpio_init', 'linux_gpio_write', 'linux_gpio_read', 'linux_gpio_close',
  'linux_led_write', 'linux_key_pressed',
  'linux_pwm_init', 'linux_pwm_duty', 'linux_pwm_close',
  'linux_uart_init', 'linux_uart_available', 'linux_uart_read',
  'linux_uart_write', 'linux_uart_flush', 'linux_uart_close',
  'linux_camera_init', 'linux_camera_opened', 'linux_camera_read', 'linux_camera_release',
  'linux_audio_play', 'linux_audio_record',
];

test('package exposes the Linux hardware contract', () => {
  const pkg = readJson('package.json');
  const blocks = readJson('block.json');
  const toolbox = readJson('toolbox.json');
  const types = new Set(blocks.map((block) => block.type));
  const toolboxTypes = new Set();

  const visit = (node) => {
    if (node && node.kind === 'block') toolboxTypes.add(node.type);
    for (const child of node && Array.isArray(node.contents) ? node.contents : []) visit(child);
  };
  visit(toolbox);

  assert.equal(pkg.name, '@aily-project/lib-linux-python');
  assert.equal(pkg.spec, true);
  assert.deepEqual(pkg.compatibility.mode, ['python']);
  assert.deepEqual(pkg.compatibility.core, [
    'linux:python:raspberrypi',
    'linux:python:walnutpi',
    'linux:python:walnutpi-serial',
  ]);
  assert.equal(blocks.length, 21);
  for (const type of REQUIRED_BLOCKS) {
    assert.ok(types.has(type), `missing block ${type}`);
    assert.ok(toolboxTypes.has(type), `missing toolbox block ${type}`);
  }
  for (const type of types) {
    assert.doesNotMatch(type, /kpu|display|walnutpi|cybercam/i);
  }
});

test('all 11 locales cover every block and toolbox label', () => {
  const blocks = readJson('block.json');
  const localeNames = ['zh_cn', 'en', 'zh_hk', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'ar'];
  for (const localeName of localeNames) {
    const locale = readJson(path.join('i18n', `${localeName}.json`));
    assert.ok(locale.toolbox_name, `${localeName} toolbox_name`);
    assert.equal(locale.toolbox_categories?.length, 3, `${localeName} toolbox_categories`);
    for (const block of blocks) {
      assert.ok(locale[block.type]?.message0, `${localeName} missing ${block.type}.message0`);
      assert.ok(locale[block.type]?.tooltip, `${localeName} missing ${block.type}.tooltip`);
    }
  }
});

test('public text is technically localized without corrupting placeholders', () => {
  const blocks = readJson('block.json');
  const english = readJson(path.join('i18n', 'en.json'));
  const nonEnglishLocales = ['zh_cn', 'zh_hk', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'ar'];
  const placeholders = (text) => String(text).match(/%\d+/g) || [];

  for (const localeName of nonEnglishLocales) {
    const locale = readJson(path.join('i18n', `${localeName}.json`));
    for (const block of blocks) {
      const localized = locale[block.type];
      assert.deepEqual(placeholders(localized.message0).sort(), placeholders(block.message0).sort(), `${localeName} changed ${block.type} placeholders`);
      assert.notEqual(localized.message0, english[block.type].message0, `${localeName} copied English ${block.type}.message0`);
    }
  }
});
