const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, name), 'utf8'));

const REQUIRED_BLOCKS = [
  'python_start', 'python_forever', 'python_sleep', 'python_print',
  'python_number', 'python_text', 'python_boolean', 'python_tuple',
  'python_list', 'python_set_variable', 'python_get_variable',
  'python_if', 'python_for_each',
  'python_image_resize', 'python_image_convert', 'python_image_in_range',
  'python_image_components', 'python_image_load', 'python_image_save',
  'python_draw_rectangle', 'python_draw_circle',
  'python_draw_line', 'python_draw_text',
  'python_qr_decode', 'python_barcode_decode',
  'python_apriltag_init', 'python_apriltag_detect',
  'python_socket_init', 'python_socket_address', 'python_socket_connect',
  'python_socket_bind', 'python_socket_listen', 'python_socket_accept',
  'python_socket_send', 'python_socket_receive', 'python_socket_close',
  'python_mqtt_init', 'python_mqtt_connect', 'python_mqtt_publish',
  'python_mqtt_subscribe', 'python_mqtt_on_message',
  'python_mqtt_loop', 'python_mqtt_disconnect',
  'python_http_request', 'python_http_response', 'python_http_server',
  'python_file_read', 'python_file_write', 'python_file_exists',
  'python_file_list', 'python_command', 'python_cpu_temperature',
];

const HARDWARE_PREFIXES = [
  'python_gpio', 'python_pwm', 'python_uart', 'python_camera',
  'python_display', 'python_ai', 'python_imu', 'python_audio',
];

test('package exposes the portable Python core contract', () => {
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

  assert.equal(pkg.name, '@aily-project/lib-python-core');
  assert.equal(pkg.spec, true);
  assert.deepEqual(pkg.compatibility.mode, ['python']);
  assert.deepEqual(pkg.compatibility.core, [
    'python:k230:cybercam',
    'linux:python:raspberrypi',
    'linux:python:walnutpi',
    'linux:python:walnutpi-serial',
  ]);
  assert.equal(blocks.length, 52);
  assert.equal(new Set(types).size, blocks.length, 'block types must be unique');
  for (const type of REQUIRED_BLOCKS) {
    assert.ok(types.has(type), `missing block ${type}`);
    assert.ok(toolboxTypes.has(type) || type === 'python_start' || type === 'python_forever', `missing toolbox block ${type}`);
  }
  for (const type of types) {
    assert.ok(toolboxTypes.has(type) || type === 'python_start' || type === 'python_forever', `declared block missing from toolbox ${type}`);
    assert.ok(!HARDWARE_PREFIXES.some((prefix) => type.startsWith(prefix)), `portable library must not include hardware block ${type}`);
  }
});

test('all 11 locales cover every block and toolbox label', () => {
  const blocks = readJson('block.json');
  const localeNames = ['zh_cn', 'en', 'zh_hk', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'ar'];
  for (const localeName of localeNames) {
    const locale = readJson(path.join('i18n', `${localeName}.json`));
    assert.ok(locale.toolbox_name, `${localeName} toolbox_name`);
    assert.equal(locale.toolbox_categories?.length, 4, `${localeName} toolbox_categories`);
    assert.ok(locale.toolbox_labels, `${localeName} toolbox_labels`);
    for (const block of blocks) {
      assert.ok(locale[block.type]?.message0, `${localeName} missing ${block.type}.message0`);
      assert.ok(locale[block.type]?.tooltip, `${localeName} missing ${block.type}.tooltip`);
      (block.args0 || []).forEach((arg, index) => {
        if (arg.type !== 'field_dropdown' || !Array.isArray(arg.options)) return;
        assert.deepEqual(locale[block.type].args0[index].options.map((option) => option[1]), arg.options.map((option) => option[1]), `${localeName} changed ${block.type} machine values`);
      });
    }
  }
});

test('public text is technically localized without corrupting placeholders or dropdown values', () => {
  const blocks = readJson('block.json');
  const english = readJson(path.join('i18n', 'en.json'));
  const nonEnglishLocales = ['zh_cn', 'zh_hk', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'ar'];
  const placeholders = (text) => String(text).match(/%\d+/g) || [];
  const mojibake = /(?:�|锟|绔|鈥|銆|闁|賱|褋|袩|脨|鞚|盲|枚|眉|茅|猫|谩|芒)/;

  assert.equal(mojibake.test(JSON.stringify(readJson('package.json'))), false, 'package metadata contains mojibake');
  for (const block of blocks) {
    assert.deepEqual(placeholders(english[block.type].message0).sort(), placeholders(block.message0).sort(), `en changed ${block.type} placeholders`);
    assert.equal(mojibake.test(english[block.type].message0), false, `en ${block.type} contains mojibake`);
  }

  for (const localeName of nonEnglishLocales) {
    const locale = readJson(path.join('i18n', `${localeName}.json`));
    for (const block of blocks) {
      const localized = locale[block.type];
      assert.deepEqual(placeholders(localized.message0).sort(), placeholders(block.message0).sort(), `${localeName} changed ${block.type} placeholders`);
      assert.deepEqual(placeholders(localized.tooltip).sort(), placeholders(block.tooltip).sort(), `${localeName} changed ${block.type} tooltip placeholders`);
      assert.equal(mojibake.test(JSON.stringify(localized)), false, `${localeName} ${block.type} contains mojibake`);
      assert.notEqual(localized.message0, english[block.type].message0, `${localeName} copied English ${block.type}.message0`);
      assert.notEqual(localized.tooltip, english[block.type].tooltip, `${localeName} copied English ${block.type}.tooltip`);
    }
  }
});

test('readme_ai stays below the 15360-byte UTF-8 limit', () => {
  const bytes = fs.readFileSync(path.join(ROOT, 'readme_ai.md')).byteLength;
  assert.ok(bytes <= 15360 - 1024, `readme_ai.md is ${bytes} bytes; expected at most 14336`);
});
