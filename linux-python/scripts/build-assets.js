#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { localizedMessages, localizeDropdown } = require('./locales');

const ROOT = path.resolve(__dirname, '..');
const C = { io: '#00897B', vision: '#1976D2', system: '#EF6C00' };
const dropdown = (name, options) => ({ type: 'field_dropdown', name, options });
const text = (name, value) => ({ type: 'field_input', name, text: value });
const input = (name, check) => ({ type: 'input_value', name, ...(check ? { check } : {}) });
const block = (type, message0, args0, colour, connection = 'statement', tooltip = message0) => ({
  type, message0, ...(args0.length ? { args0 } : {}), colour, tooltip,
  icon: type.includes('camera') ? 'camera' : type.includes('uart') || type.includes('serial') ? 'wifi' : 'settings',
  ...(connection === 'statement' ? { previousStatement: null, nextStatement: null } : connection === 'output' ? { output: 'Any' } : {}),
});

const pins = '${board.digitalPins}';
const baud = [['9600', '9600'], ['19200', '19200'], ['38400', '38400'], ['57600', '57600'], ['115200', '115200']];
const b = [];
const add = (...items) => b.push(...items);

add(
  block('linux_gpio_init', 'initialize GPIO %1 pin %2 direction %3 pull %4', [text('NAME', 'pin'), dropdown('PIN', pins), dropdown('DIRECTION', [['input', 'INPUT'], ['output', 'OUTPUT']]), dropdown('PULL', [['none', 'NONE'], ['up', 'UP'], ['down', 'DOWN']])], C.io, 'statement', 'Create a gpiozero digital pin.'),
  block('linux_gpio_write', 'set GPIO %1 to %2', [text('NAME', 'pin'), input('VALUE', 'Boolean')], C.io),
  block('linux_gpio_read', 'GPIO %1 value', [text('NAME', 'pin')], C.io, 'output'),
  block('linux_gpio_close', 'close GPIO %1', [text('NAME', 'pin')], C.io),
  block('linux_led_write', 'set onboard LED to %1', [input('VALUE', 'Boolean')], C.io),
  block('linux_key_pressed', 'onboard key is pressed', [], C.io, 'output'),
  block('linux_pwm_init', 'initialize PWM %1 pin %2 frequency %3 Hz', [text('NAME', 'pwm'), dropdown('PIN', pins), input('FREQUENCY', 'Number')], C.io),
  block('linux_pwm_duty', 'set PWM %1 duty cycle %2 (0-1)', [text('NAME', 'pwm'), input('DUTY', 'Number')], C.io),
  block('linux_pwm_close', 'close PWM %1', [text('NAME', 'pwm')], C.io),
  block('linux_uart_init', 'initialize serial %1 device %2 baud %3', [text('NAME', 'uart'), text('DEVICE', '/dev/serial0'), dropdown('BAUD', baud)], C.io),
  block('linux_uart_available', 'serial %1 bytes available', [text('NAME', 'uart')], C.io, 'output'),
  block('linux_uart_read', 'serial %1 read %2 bytes', [text('NAME', 'uart'), input('SIZE', 'Number')], C.io, 'output'),
  block('linux_uart_write', 'serial %1 write %2', [text('NAME', 'uart'), input('DATA')], C.io),
  block('linux_uart_flush', 'flush serial %1 input', [text('NAME', 'uart')], C.io),
  block('linux_uart_close', 'close serial %1', [text('NAME', 'uart')], C.io),
);

add(
  block('linux_camera_init', 'initialize camera %1 device %2 width %3 height %4', [text('NAME', 'camera'), text('DEVICE', '/dev/video0'), input('WIDTH', 'Number'), input('HEIGHT', 'Number')], C.vision),
  block('linux_camera_opened', 'camera %1 is open', [text('NAME', 'camera')], C.vision, 'output'),
  block('linux_camera_read', 'camera %1 image', [text('NAME', 'camera')], C.vision, 'output'),
  block('linux_camera_release', 'release camera %1', [text('NAME', 'camera')], C.vision),
);

add(
  block('linux_audio_play', 'play WAV file %1', [input('PATH', 'String')], C.system),
  block('linux_audio_record', 'record WAV to %1 seconds %2 sample rate %3', [input('PATH', 'String'), input('SECONDS', 'Number'), input('RATE', 'Number')], C.system),
);

const categoryGroups = [
  ['IO and peripherals', C.io, b.filter((x) => x.colour === C.io).map((x) => x.type)],
  ['Camera', C.vision, b.filter((x) => x.colour === C.vision).map((x) => x.type)],
  ['Audio', C.system, b.filter((x) => x.colour === C.system).map((x) => x.type)],
];
const numericDefaults = { FREQUENCY: 1000, DUTY: 0.5, SIZE: 1024, WIDTH: 640, HEIGHT: 480, SECONDS: 5, RATE: 16000 };
const textDefaults = { PATH: '/tmp/audio.wav' };
const shadowFor = (arg) => {
  if (arg.check === 'Number') return { type: 'math_number', fields: { NUM: numericDefaults[arg.name] ?? 0 } };
  if (arg.check === 'Boolean') return { type: 'logic_boolean', fields: { BOOL: 'TRUE' } };
  return { type: 'text', fields: { TEXT: textDefaults[arg.name] ?? '' } };
};
const toolboxItem = (type) => {
  const definition = b.find((item) => item.type === type);
  const inputs = Object.fromEntries((definition.args0 || []).filter((arg) => arg.type === 'input_value').map((arg) => [arg.name, { shadow: shadowFor(arg) }]));
  return { kind: 'block', type, ...(Object.keys(inputs).length ? { inputs } : {}) };
};
const toolbox = { kind: 'category', name: 'Linux Hardware', colour: C.io, contents: categoryGroups.map(([name, colour, types]) => ({ kind: 'category', name, colour, contents: types.map(toolboxItem) })) };

const languageMeta = {
  zh_cn: ['Linux 硬件', ['IO 与外设', '摄像头', '音频']],
  en: ['Linux Hardware', categoryGroups.map((group) => group[0])],
  zh_hk: ['Linux 硬件', ['IO 與周邊', '相機', '音訊']],
  ja: ['Linux ハードウェア', ['IO と周辺機器', 'カメラ', '音声']],
  ko: ['Linux 하드웨어', ['IO 및 주변 장치', '카메라', '오디오']],
  de: ['Linux-Hardware', ['E/A und Peripherie', 'Kamera', 'Audio']],
  fr: ['Matériel Linux', ['E/S et périphériques', 'Caméra', 'Audio']],
  es: ['Hardware Linux', ['E/S y periféricos', 'Cámara', 'Audio']],
  pt: ['Hardware Linux', ['E/S e periféricos', 'Câmera', 'Áudio']],
  ru: ['Оборудование Linux', ['Ввод-вывод', 'Камера', 'Аудио']],
  ar: ['عتاد لينكس', ['الإدخال والإخراج', 'الكاميرا', 'الصوت']],
};
const placeholders = (text) => String(text).match(/%\d+/g) || [];
const standaloneTooltips = {
  zh_cn: ['使用 gpiozero 创建数字引脚。'],
  zh_hk: ['使用 gpiozero 建立數碼引腳。'],
  ja: ['gpiozero でデジタルピンを作成します。'],
  ko: ['gpiozero로 디지털 핀을 만듭니다.'],
  de: ['Einen digitalen Pin mit gpiozero erstellen.'],
  fr: ['Créer une broche numérique avec gpiozero.'],
  es: ['Crear un pin digital con gpiozero.'],
  pt: ['Criar um pino digital com gpiozero.'],
  ru: ['Создать цифровой вывод с помощью gpiozero.'],
  ar: ['إنشاء طرف رقمي باستخدام gpiozero.'],
};
const standaloneTooltipTypes = ['linux_gpio_init'];
const makeLocale = (localeName) => {
  const [toolboxName, labels] = languageMeta[localeName];
  const locale = { toolbox_name: toolboxName, toolbox_categories: labels, toolbox_labels: Object.fromEntries(categoryGroups.map((group, index) => [group[0], labels[index]])) };
  const translated = localeName === 'en' ? b.map((item) => item.message0) : localizedMessages(localeName);
  if (translated.length !== b.length) throw new Error(`${localeName} has ${translated.length} messages; expected ${b.length}`);
  for (const [index, item] of b.entries()) {
    const message0 = translated[index];
    if (placeholders(message0).sort().join(',') !== placeholders(item.message0).sort().join(',')) throw new Error(`${localeName} changed placeholders for ${item.type}`);
    const tooltipIndex = standaloneTooltipTypes.indexOf(item.type);
    const tooltip = localeName === 'en' ? item.tooltip : tooltipIndex >= 0 ? standaloneTooltips[localeName][tooltipIndex] : message0;
    locale[item.type] = { message0, tooltip };
    for (const key of ['args0', 'args1', 'args2']) {
      if (item[key]) locale[item.type][key] = item[key].map((arg) => arg && arg.type === 'field_dropdown' && Array.isArray(arg.options) ? {
        options: arg.options.map(([label, machineValue]) => [localeName === 'en' ? label : localizeDropdown(localeName, label), machineValue]),
      } : null);
    }
  }
  return locale;
};

const assets = new Map([
  ['block.json', b],
  ['toolbox.json', toolbox],
  ...Object.keys(languageMeta).map((locale) => [`i18n/${locale}.json`, makeLocale(locale)]),
]);
let changed = false;
for (const [relative, data] of assets) {
  const file = path.join(ROOT, relative);
  const content = `${JSON.stringify(data, null, 2)}\n`;
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) {
      console.error(`${relative} is not generated from scripts/build-assets.js`);
      process.exitCode = 1;
    }
  } else if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    changed = true;
  }
}
if (!process.argv.includes('--check')) console.log(changed ? 'Linux Python assets generated.' : 'Linux Python assets already current.');
