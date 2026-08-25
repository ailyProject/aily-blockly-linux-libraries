'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PACKAGE_ROOT = path.join(ROOT, 'adafruit_blinka');
const WALNUT_BOARD = path.resolve(ROOT, '..', 'aily-blockly-linux-boards', 'walnutpi_2', 'board.json');
const LOCALES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ko', 'pt', 'ru', 'zh_cn', 'zh_hk'];
const BASE_BOARD_ATTRIBUTES = [
  'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D17', 'D18',
  'SCL', 'SDA', 'SCLK', 'MOSI', 'MISO', 'CE0', 'CE1',
];
const OBJECT_ATTRIBUTES = ['value', 'direction', 'pull', 'duty_cycle', 'frequency', 'in_waiting'];

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function walnutPinAttributes() {
  const board = JSON.parse(fs.readFileSync(WALNUT_BOARD, 'utf8'));
  return [...new Set(board.digitalPins.map(([label]) => {
    const match = label.match(/^([A-Z]+\d+|LED|KEY)\b/);
    if (!match) throw new Error(`unrecognized WalnutPi pin label: ${label}`);
    return match[1];
  }))];
}

function updateGenerator(moduleAttributes) {
  const file = path.join(PACKAGE_ROOT, 'generator.js');
  let source = fs.readFileSync(file, 'utf8');
  source = source.replace(
    /  const boardAttributes = new Set\(\[[\s\S]*?\n  \]\);/,
    "  const boardAttributes = allowlist(spec.moduleAttributes || [], 'module attribute');",
  );
  const marker = source.lastIndexOf('})(globalThis, ');
  if (marker < 0) throw new Error('Adafruit Blinka embedded generator spec not found');
  const suffix = source.slice(marker + '})(globalThis, '.length).trim();
  const end = suffix.match(/\}\s*\);\s*$/);
  if (!end) throw new Error('Adafruit Blinka embedded generator spec is not JSON');
  const spec = JSON.parse(suffix.slice(0, end.index + 1));
  spec.attributes = [...moduleAttributes, ...OBJECT_ATTRIBUTES];
  spec.moduleAttributes = moduleAttributes;
  fs.writeFileSync(file, `${source.slice(0, marker)}})(globalThis, ${JSON.stringify(spec, null, 2)});\n`, 'utf8');
  return spec;
}

function updateBlocks(attributes) {
  const file = path.join(PACKAGE_ROOT, 'block.json');
  const blocks = JSON.parse(fs.readFileSync(file, 'utf8'));
  const block = blocks.find((candidate) => candidate.type === 'python_adafruit_blinka_attribute');
  if (!block) throw new Error('Adafruit Blinka attribute block missing');
  block.args0[1].options = attributes.map((attribute) => [attribute, attribute]);
  writeJson(file, blocks);

  for (const locale of LOCALES) {
    const localeFile = path.join(PACKAGE_ROOT, 'i18n', `${locale}.json`);
    const messages = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
    messages.python_adafruit_blinka_attribute.args0[1].options = block.args0[1].options;
    writeJson(localeFile, messages);
  }
}

function updateReadmes(attributes, walnutAttributes) {
  const chineseFile = path.join(PACKAGE_ROOT, 'readme.md');
  let chinese = fs.readFileSync(chineseFile, 'utf8');
  chinese = chinese.replace(
    /^- 对象\/模块属性：.*$/m,
    `- 对象/模块属性：${attributes.map((name) => `\`${name}\``).join('、')}`,
  );
  const chineseSection = [
    '## WalnutPi 2B CPython 运行层',
    '',
    'WalnutPi 2B 官方 Python 教程使用 Blinka。属性积木已加入板载 `LED`、`KEY`，以及该板 40-pin 排针的 PB/PI/PL 管脚名称；例如 `board.PB6` 可连接到 `DigitalInOut`。I²C/SPI/UART/PWM 仍需先按 WalnutPi 文档配置引脚复用和设备权限。',
    '',
    `WalnutPi 管脚白名单：${walnutAttributes.map((name) => `\`${name}\``).join('、')}。`,
    '',
  ].join('\n');
  if (!chinese.includes('## WalnutPi 2B CPython 运行层')) {
    chinese = chinese.replace('## Raspberry Pi 5B 的 CPython 运行层', `${chineseSection}## Raspberry Pi 5B 的 CPython 运行层`);
  }
  fs.writeFileSync(chineseFile, chinese, 'utf8');

  const englishFile = path.join(PACKAGE_ROOT, 'readme_ai.md');
  let english = fs.readFileSync(englishFile, 'utf8');
  english = english.replace(
    /^- Allowlisted attributes:.*$/m,
    `- Allowlisted attributes: ${attributes.map((name) => `\`${name}\``).join(', ')}`,
  );
  const englishSection = [
    '## WalnutPi 2B CPython runtime',
    '',
    'The official WalnutPi 2B Python path uses Blinka. The attribute block includes the onboard `LED` and `KEY` plus the PB/PI/PL names from the board 40-pin map; for example, `board.PB6` can be passed to `DigitalInOut`. Configure pin multiplexing and device permissions separately for I2C, SPI, UART, and PWM.',
    '',
    `WalnutPi pin allowlist: ${walnutAttributes.map((name) => `\`${name}\``).join(', ')}.`,
    '',
  ].join('\n');
  if (!english.includes('## WalnutPi 2B CPython runtime')) {
    english = english.replace('## Raspberry Pi 5B CPython runtime', `${englishSection}## Raspberry Pi 5B CPython runtime`);
  }
  fs.writeFileSync(englishFile, english, 'utf8');
}

const walnutAttributes = walnutPinAttributes();
const moduleAttributes = [...BASE_BOARD_ATTRIBUTES, ...walnutAttributes];
const spec = updateGenerator(moduleAttributes);
updateBlocks(spec.attributes);
updateReadmes(spec.attributes, walnutAttributes);
console.log(`Synchronized ${moduleAttributes.length} Blinka board attributes (${walnutAttributes.length} from WalnutPi 2B).`);

