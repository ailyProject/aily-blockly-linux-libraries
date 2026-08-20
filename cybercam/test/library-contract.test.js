const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, name), 'utf8'));

const REQUIRED_BLOCKS = [
  'cybercam_start', 'cybercam_forever', 'cybercam_sleep', 'cybercam_print',
  'cybercam_number', 'cybercam_text', 'cybercam_boolean', 'cybercam_tuple',
  'cybercam_list', 'cybercam_set_variable', 'cybercam_get_variable',
  'cybercam_if', 'cybercam_for_each',
  'cybercam_gpio_init', 'cybercam_gpio_write', 'cybercam_gpio_read', 'cybercam_gpio_deinit',
  'cybercam_led_write', 'cybercam_key_pressed',
  'cybercam_pwm_init', 'cybercam_pwm_frequency', 'cybercam_pwm_duty',
  'cybercam_pwm_enable', 'cybercam_pwm_disable', 'cybercam_pwm_close',
  'cybercam_uart_init', 'cybercam_uart_available', 'cybercam_uart_read',
  'cybercam_uart_write', 'cybercam_uart_flush', 'cybercam_uart_close',
  'cybercam_camera_init', 'cybercam_camera_opened', 'cybercam_camera_read',
  'cybercam_camera_hmirror', 'cybercam_camera_vflip', 'cybercam_camera_release',
  'cybercam_display_init', 'cybercam_display_rotation', 'cybercam_display_show',
  'cybercam_ide_show', 'cybercam_lcd_direction',
  'cybercam_image_resize', 'cybercam_image_convert', 'cybercam_image_in_range',
  'cybercam_image_components', 'cybercam_image_load', 'cybercam_image_save',
  'cybercam_draw_rectangle', 'cybercam_draw_circle',
  'cybercam_draw_line', 'cybercam_draw_text',
  'cybercam_qr_decode', 'cybercam_barcode_decode',
  'cybercam_apriltag_init', 'cybercam_apriltag_detect',
  'cybercam_ai_init_simple', 'cybercam_ai_init_face', 'cybercam_ai_init_mask',
  'cybercam_ai_init_hand_keypoint', 'cybercam_ai_init_ocr',
  'cybercam_ai_init_licence', 'cybercam_ai_run',
  'cybercam_ai_run_confidence', 'cybercam_ai_run_thresholds',
  'cybercam_result_length', 'cybercam_result_item', 'cybercam_result_property',
  'cybercam_socket_init', 'cybercam_socket_address', 'cybercam_socket_connect',
  'cybercam_socket_bind', 'cybercam_socket_listen', 'cybercam_socket_accept',
  'cybercam_socket_send', 'cybercam_socket_receive', 'cybercam_socket_close',
  'cybercam_mqtt_init', 'cybercam_mqtt_connect', 'cybercam_mqtt_publish',
  'cybercam_mqtt_subscribe', 'cybercam_mqtt_on_message',
  'cybercam_mqtt_loop', 'cybercam_mqtt_disconnect',
  'cybercam_http_request', 'cybercam_http_response', 'cybercam_http_server',
  'cybercam_file_read', 'cybercam_file_write', 'cybercam_file_exists',
  'cybercam_file_list', 'cybercam_command',
  'cybercam_audio_play', 'cybercam_audio_record',
  'cybercam_imu_init', 'cybercam_imu_read', 'cybercam_imu_axis',
  'cybercam_imu_calibrate', 'cybercam_imu_close',
  'cybercam_cpu_temperature', 'cybercam_chip_id',
];

const KPU_CLASSES = [
  'FACE_DETECT', 'FACE_MASK', 'FALL_DETECT', 'HAND_DETECT', 'HAND_KEYPOINT',
  'HAND_KEYPOINT_CLS', 'LICENCE_DETECT', 'OCR', 'PERSON_DETECT',
  'PERSON_KEYPOINT', 'SMOKE_DETECT', 'TRAFFIC_LIGHT_DETECT',
  'YOLO11_CLS', 'YOLO11_DET',
];

test('package exposes the complete CyberCAM block contract', () => {
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

  assert.equal(pkg.name, '@aily-project/lib-cybercam');
  assert.equal(pkg.spec, true);
  assert.deepEqual(pkg.compatibility.mode, ['python']);
  assert.deepEqual(pkg.compatibility.core, ['python:k230:cybercam']);
  assert.deepEqual(pkg.compatibility.boards, ['CyberCAM']);
  assert.equal(blocks.length, 101, 'Task 2 should add four blocks to the existing 97-block surface');
  assert.equal(new Set(types).size, blocks.length, 'block types must be unique');
  for (const type of REQUIRED_BLOCKS) {
    assert.ok(types.has(type), `missing block ${type}`);
    assert.ok(toolboxTypes.has(type) || type === 'cybercam_start' || type === 'cybercam_forever', `missing toolbox block ${type}`);
  }
  for (const type of types) {
    assert.ok(toolboxTypes.has(type) || type === 'cybercam_start' || type === 'cybercam_forever', `declared block missing from toolbox ${type}`);
  }
});

test('MQTT message block exposes client and message variable fields plus a statement body', () => {
  const blocks = readJson('block.json');
  const mqttHandler = blocks.find((block) => block.type === 'cybercam_mqtt_on_message');

  assert.ok(mqttHandler, 'missing cybercam_mqtt_on_message');
  assert.deepEqual(
    mqttHandler.args0.map(({ type, name }) => ({ type, name })),
    [
      { type: 'field_input', name: 'NAME' },
      { type: 'field_input', name: 'TOPIC_NAME' },
      { type: 'field_input', name: 'PAYLOAD_NAME' },
      { type: 'input_statement', name: 'DO' },
      { type: 'input_dummy', name: undefined },
    ],
  );
  assert.equal(mqttHandler.previousStatement, null);
  assert.equal(mqttHandler.nextStatement, null);
});

test('all confirmed walnutpi KPU classes are represented', () => {
  const text = fs.readFileSync(path.join(ROOT, 'block.json'), 'utf8')
    + fs.readFileSync(path.join(ROOT, 'generator.js'), 'utf8');
  for (const className of KPU_CLASSES) assert.match(text, new RegExp(`\\b${className}\\b`));
});

test('FACE_DETECT and FACE_MASK expose landmark points and nested x/y paths', () => {
  const blocks = readJson('block.json');
  const localeNames = ['zh_cn', 'en', 'zh_hk', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'ar'];
  const landmarks = ['left_eye', 'right_eye', 'nose', 'left_mouth', 'right_mouth'];
  const expectedValues = landmarks.flatMap((landmark) => [landmark, `${landmark}.x`, `${landmark}.y`]);
  const resultProperty = blocks.find((block) => block.type === 'cybercam_result_property');
  const propertyField = resultProperty?.args0?.find((arg) => arg.name === 'PROPERTY');
  const machineValues = propertyField?.options?.map((option) => option[1]) || [];

  for (const value of expectedValues) {
    assert.ok(machineValues.includes(value), `missing FACE_DETECT/FACE_MASK result path ${value}`);
  }

  for (const localeName of localeNames) {
    const locale = readJson(path.join('i18n', `${localeName}.json`));
    const localizedValues = locale.cybercam_result_property.args0[1].options.map((option) => option[1]);
    for (const value of expectedValues) {
      assert.ok(localizedValues.includes(value), `${localeName} missing result path ${value}`);
    }
  }
});

test('all 11 locales cover every block and toolbox label', () => {
  const blocks = readJson('block.json');
  const localeNames = ['zh_cn', 'en', 'zh_hk', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'ar'];
  for (const localeName of localeNames) {
    const locale = readJson(path.join('i18n', `${localeName}.json`));
    assert.ok(locale.toolbox_name, `${localeName} toolbox_name`);
    assert.equal(locale.toolbox_categories?.length, 8, `${localeName} toolbox_categories`);
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
      (block.args0 || []).forEach((arg, index) => {
        if (arg.type !== 'field_dropdown' || !Array.isArray(arg.options)) return;
        const sourceLabels = arg.options.map((option) => option[0]);
        const localizedLabels = localized.args0[index].options.map((option) => option[0]);
        const translatable = sourceLabels.some((label) => /[A-Za-z]/.test(label) && !/^(?:IPv[46]|TCP|UDP|GET|POST|PUT|DELETE|JSON|tag\d+h\d+|\d+(?:°)?|GPIO\d+ \/ PWM\d+)$/.test(label));
        if (translatable) assert.notDeepEqual(localizedLabels, sourceLabels, `${localeName} copied ${block.type} dropdown labels`);
      });
    }
  }
});

test('API coverage documents every official lesson area and exactly 14 confirmed KPU classes', () => {
  const coverage = fs.readFileSync(path.join(ROOT, 'API-COVERAGE.md'), 'utf8');
  const lessonAreas = ['Basic examples', 'Machine vision', 'Network', 'OS and software', 'Sensor modules'];
  for (const area of lessonAreas) assert.match(coverage, new RegExp(`\\b${area}\\b`), `missing lesson area ${area}`);
  const rows = coverage.match(/^\| `kpu\.[A-Z0-9_]+` \|/gm) || [];
  assert.equal(rows.length, 14, 'coverage must contain exactly 14 confirmed KPU class rows');
  for (const className of KPU_CLASSES) assert.ok(coverage.includes(`| \`kpu.${className}\` |`), `missing KPU class ${className}`);
  assert.match(coverage, /Evidence-based exclusions/);
});

test('public descriptions state the evidence boundary and configured-network requirement', () => {
  const coverage = fs.readFileSync(path.join(ROOT, 'API-COVERAGE.md'), 'utf8');
  const readme = fs.readFileSync(path.join(ROOT, 'readme.md'), 'utf8');
  const readmeAi = fs.readFileSync(path.join(ROOT, 'readme_ai.md'), 'utf8');
  const pkg = readJson('package.json');
  const combinedDocs = `${coverage}\n${readme}\n${readmeAi}`;

  for (const capability of ['touch', 'Wi-Fi management', 'Bluetooth', 'generic I2C', 'SPI', 'GPIO interrupts', 'ADC']) {
    assert.match(coverage, new RegExp(capability.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `missing exclusion for ${capability}`);
  }
  assert.match(combinedDocs, /already configured network/i);
  assert.doesNotMatch(pkg.description_en, /\bcomplete\b/i);
  assert.doesNotMatch(readme, /\bComplete Python blocks\b/i);
  assert.doesNotMatch(readmeAi, /\bComplete Python blocks\b/i);
});

test('readme_ai keeps at least 1 KiB below the 15360-byte UTF-8 limit', () => {
  const bytes = fs.readFileSync(path.join(ROOT, 'readme_ai.md')).byteLength;
  assert.ok(bytes <= 15360 - 1024, `readme_ai.md is ${bytes} bytes; expected at most 14336`);
});
