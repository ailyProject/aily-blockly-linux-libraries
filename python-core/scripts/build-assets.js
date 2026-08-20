#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { localizedMessages, localizeDropdown } = require('./locales');

const ROOT = path.resolve(__dirname, '..');
const C = { lifecycle: '#455A64', vision: '#1976D2', network: '#0288D1', system: '#EF6C00' };
const dropdown = (name, options) => ({ type: 'field_dropdown', name, options });
const text = (name, value) => ({ type: 'field_input', name, text: value });
const input = (name, check) => ({ type: 'input_value', name, ...(check ? { check } : {}) });
const statements = (name) => ({ type: 'input_statement', name });
const block = (type, message0, args0, colour, connection = 'statement', tooltip = message0) => ({
  type, message0, ...(args0.length ? { args0 } : {}), colour, tooltip,
  icon: type.includes('image') || type.includes('draw') || type.includes('qr') || type.includes('barcode') || type.includes('apriltag')
    ? 'camera'
    : type.includes('socket') || type.includes('mqtt') || type.includes('http')
      ? 'wifi'
      : 'settings',
  ...(connection === 'statement' ? { previousStatement: null, nextStatement: null } : connection === 'output' ? { output: 'Any' } : {}),
});

const b = [];
const add = (...items) => b.push(...items);

add(
  block('python_start', 'when program starts %1 %2', [statements('DO'), { type: 'input_dummy' }], C.lifecycle, 'hat', 'Run once when the Python program starts.'),
  block('python_forever', 'forever %1 %2', [statements('DO'), { type: 'input_dummy' }], C.lifecycle, 'hat', 'Run these blocks repeatedly.'),
  block('python_sleep', 'wait %1 seconds', [input('SECONDS', 'Number')], C.lifecycle, 'statement', 'Pause the program for a number of seconds.'),
  block('python_print', 'print %1', [input('VALUE')], C.lifecycle),
  block('python_number', 'number %1', [{ type: 'field_number', name: 'VALUE', value: 0 }], C.lifecycle, 'output'),
  block('python_text', 'text %1', [text('VALUE', '')], C.lifecycle, 'output'),
  block('python_boolean', 'boolean %1', [dropdown('VALUE', [['true', 'TRUE'], ['false', 'FALSE']])], C.lifecycle, 'output'),
  block('python_tuple', 'tuple containing %1', [input('ITEMS')], C.lifecycle, 'output'),
  block('python_list', 'list containing %1', [input('ITEMS')], C.lifecycle, 'output'),
  block('python_set_variable', 'set variable %1 to %2', [text('NAME', 'value'), input('VALUE')], C.lifecycle),
  block('python_get_variable', 'variable %1', [text('NAME', 'value')], C.lifecycle, 'output'),
  block('python_if', 'if %1 do %2 %3', [input('CONDITION', 'Boolean'), statements('DO'), { type: 'input_dummy' }], C.lifecycle),
  block('python_for_each', 'for each %1 in %2 do %3 %4', [text('NAME', 'item'), input('ITEMS'), statements('DO'), { type: 'input_dummy' }], C.lifecycle),
);

add(
  block('python_image_resize', 'resize image %1 width %2 height %3', [input('IMAGE'), input('WIDTH', 'Number'), input('HEIGHT', 'Number')], C.vision, 'output'),
  block('python_image_convert', 'convert image %1 using %2', [input('IMAGE'), dropdown('CONVERSION', [['BGR to gray', 'COLOR_BGR2GRAY'], ['BGR to LAB', 'COLOR_BGR2LAB'], ['BGR to RGB', 'COLOR_BGR2RGB'], ['gray to BGR', 'COLOR_GRAY2BGR']])], C.vision, 'output'),
  block('python_image_in_range', 'image %1 mask lower %2 upper %3', [input('IMAGE'), input('LOWER'), input('UPPER')], C.vision, 'output'),
  block('python_image_components', 'connected components of %1 connectivity %2', [input('IMAGE'), dropdown('CONNECTIVITY', [['4', '4'], ['8', '8']])], C.vision, 'output'),
  block('python_image_load', 'load image file %1', [input('PATH', 'String')], C.vision, 'output'),
  block('python_image_save', 'save image %1 to file %2', [input('IMAGE'), input('PATH', 'String')], C.vision),
  block('python_draw_rectangle', 'draw rectangle on %1 from x %2 y %3 to x %4 y %5 color %6 thickness %7', [input('IMAGE'), input('X1', 'Number'), input('Y1', 'Number'), input('X2', 'Number'), input('Y2', 'Number'), input('COLOR'), input('THICKNESS', 'Number')], C.vision),
  block('python_draw_circle', 'draw circle on %1 x %2 y %3 radius %4 color %5 thickness %6', [input('IMAGE'), input('X', 'Number'), input('Y', 'Number'), input('RADIUS', 'Number'), input('COLOR'), input('THICKNESS', 'Number')], C.vision),
  block('python_draw_line', 'draw line on %1 from x %2 y %3 to x %4 y %5 color %6 thickness %7', [input('IMAGE'), input('X1', 'Number'), input('Y1', 'Number'), input('X2', 'Number'), input('Y2', 'Number'), input('COLOR'), input('THICKNESS', 'Number')], C.vision),
  block('python_draw_text', 'draw text %1 on %2 x %3 y %4 scale %5 color %6 thickness %7', [input('TEXT'), input('IMAGE'), input('X', 'Number'), input('Y', 'Number'), input('SCALE', 'Number'), input('COLOR'), input('THICKNESS', 'Number')], C.vision),
  block('python_qr_decode', 'decode QR codes in %1', [input('IMAGE')], C.vision, 'output'),
  block('python_barcode_decode', 'decode barcodes in %1', [input('IMAGE')], C.vision, 'output'),
  block('python_apriltag_init', 'initialize AprilTag detector %1 family %2', [text('NAME', 'tags'), dropdown('FAMILY', [['tag16h5', 'tag16h5'], ['tag25h7', 'tag25h7'], ['tag25h9', 'tag25h9'], ['tag36h10', 'tag36h10'], ['tag36h11', 'tag36h11']])], C.vision),
  block('python_apriltag_detect', 'AprilTag detector %1 detect gray image %2', [text('NAME', 'tags'), input('IMAGE')], C.vision, 'output'),
);

add(
  block('python_socket_init', 'initialize socket %1 family %2 type %3', [text('NAME', 'sock'), dropdown('FAMILY', [['IPv4', 'AF_INET'], ['IPv6', 'AF_INET6']]), dropdown('TYPE', [['TCP', 'SOCK_STREAM'], ['UDP', 'SOCK_DGRAM']])], C.network),
  block('python_socket_address', 'network address host %1 port %2', [input('HOST', 'String'), input('PORT', 'Number')], C.network, 'output'),
  block('python_socket_connect', 'socket %1 connect to %2', [text('NAME', 'sock'), input('ADDRESS')], C.network),
  block('python_socket_bind', 'socket %1 bind to %2', [text('NAME', 'sock'), input('ADDRESS')], C.network),
  block('python_socket_listen', 'socket %1 listen backlog %2', [text('NAME', 'sock'), input('BACKLOG', 'Number')], C.network),
  block('python_socket_accept', 'socket %1 accept connection', [text('NAME', 'sock')], C.network, 'output'),
  block('python_socket_send', 'socket %1 send %2', [text('NAME', 'sock'), input('DATA')], C.network),
  block('python_socket_receive', 'socket %1 receive %2 bytes', [text('NAME', 'sock'), input('SIZE', 'Number')], C.network, 'output'),
  block('python_socket_close', 'close socket %1', [text('NAME', 'sock')], C.network),
  block('python_mqtt_init', 'initialize MQTT client %1', [text('NAME', 'client')], C.network),
  block('python_mqtt_connect', 'MQTT %1 connect host %2 port %3 keepalive %4', [text('NAME', 'client'), input('HOST', 'String'), input('PORT', 'Number'), input('KEEPALIVE', 'Number')], C.network),
  block('python_mqtt_publish', 'MQTT %1 publish topic %2 message %3', [text('NAME', 'client'), input('TOPIC', 'String'), input('MESSAGE')], C.network),
  block('python_mqtt_subscribe', 'MQTT %1 subscribe topic %2', [text('NAME', 'client'), input('TOPIC', 'String')], C.network),
  block('python_mqtt_on_message', 'when MQTT %1 receives message set topic %2 payload %3 do %4 %5', [text('NAME', 'client'), text('TOPIC_NAME', 'topic'), text('PAYLOAD_NAME', 'payload'), statements('DO'), { type: 'input_dummy' }], C.network),
  block('python_mqtt_loop', 'MQTT %1 loop forever', [text('NAME', 'client')], C.network),
  block('python_mqtt_disconnect', 'disconnect MQTT %1', [text('NAME', 'client')], C.network),
  block('python_http_request', 'HTTP %1 URL %2 data %3', [dropdown('METHOD', [['GET', 'GET'], ['POST', 'POST'], ['PUT', 'PUT'], ['DELETE', 'DELETE']]), input('URL', 'String'), input('DATA')], C.network, 'output'),
  block('python_http_response', 'HTTP response %1 property %2', [input('RESPONSE'), dropdown('PROPERTY', [['status code', 'status_code'], ['text', 'text'], ['JSON', 'json()']])], C.network, 'output'),
  block('python_http_server', 'serve current directory with HTTP host %1 port %2', [input('HOST', 'String'), input('PORT', 'Number')], C.network),
);

add(
  block('python_file_read', 'read text file %1', [input('PATH', 'String')], C.system, 'output'),
  block('python_file_write', '%1 text file %2 content %3', [dropdown('MODE', [['write', 'w'], ['append', 'a']]), input('PATH', 'String'), input('CONTENT')], C.system),
  block('python_file_exists', 'path %1 exists', [input('PATH', 'String')], C.system, 'output'),
  block('python_file_list', 'list directory %1', [input('PATH', 'String')], C.system, 'output'),
  block('python_command', 'run system command %1', [input('COMMAND', 'String')], C.system, 'output'),
  block('python_cpu_temperature', 'CPU temperature °C', [], C.system, 'output'),
);

const categoryGroups = [
  ['Program', C.lifecycle, b.filter((x) => x.colour === C.lifecycle && !['python_start', 'python_forever'].includes(x.type)).map((x) => x.type)],
  ['OpenCV and codes', C.vision, b.filter((x) => x.colour === C.vision).map((x) => x.type)],
  ['Network', C.network, b.filter((x) => x.colour === C.network).map((x) => x.type)],
  ['Files and system', C.system, b.filter((x) => x.colour === C.system).map((x) => x.type)],
];
const numericDefaults = { SECONDS: 1, WIDTH: 640, HEIGHT: 480, SIZE: 1024, X: 10, Y: 30, X1: 10, Y1: 10, X2: 100, Y2: 100, RADIUS: 10, THICKNESS: 2, SCALE: 1, PORT: 1883, KEEPALIVE: 60, BACKLOG: 1 };
const textDefaults = { PATH: '/tmp/file.txt', HOST: 'localhost', URL: 'https://example.com', TOPIC: '/python/data', COMMAND: 'uname -a', TEXT: 'Python' };
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
const toolbox = { kind: 'category', name: 'Python', colour: C.lifecycle, contents: categoryGroups.map(([name, colour, types]) => ({ kind: 'category', name, colour, contents: types.map(toolboxItem) })) };

const languageMeta = {
  zh_cn: ['Python 核心', ['程序', 'OpenCV 与码识别', '网络', '文件与系统']],
  en: ['Python Core', categoryGroups.map((group) => group[0])],
  zh_hk: ['Python 核心', ['程式', 'OpenCV 與碼識別', '網絡', '檔案與系統']],
  ja: ['Python コア', ['プログラム', 'OpenCV とコード認識', 'ネットワーク', 'ファイルとシステム']],
  ko: ['Python 코어', ['프로그램', 'OpenCV 및 코드 인식', '네트워크', '파일 및 시스템']],
  de: ['Python-Kern', ['Programm', 'OpenCV und Codes', 'Netzwerk', 'Dateien und System']],
  fr: ['Noyau Python', ['Programme', 'OpenCV et codes', 'Réseau', 'Fichiers et système']],
  es: ['Núcleo Python', ['Programa', 'OpenCV y códigos', 'Red', 'Archivos y sistema']],
  pt: ['Núcleo Python', ['Programa', 'OpenCV e códigos', 'Rede', 'Arquivos e sistema']],
  ru: ['Ядро Python', ['Программа', 'OpenCV и коды', 'Сеть', 'Файлы и система']],
  ar: ['نواة بايثون', ['البرنامج', 'OpenCV والرموز', 'الشبكة', 'الملفات والنظام']],
};
const placeholders = (text) => String(text).match(/%\d+/g) || [];
const standaloneTooltips = {
  zh_cn: ['程序启动时执行一次。', '重复执行其中的积木。', '暂停程序指定的秒数。'],
  zh_hk: ['程式啟動時執行一次。', '重複執行其中的積木。', '暫停程式指定的秒數。'],
  ja: ['プログラムの起動時に一度実行します。', '中のブロックを繰り返し実行します。', '指定した秒数だけプログラムを停止します。'],
  ko: ['프로그램 시작 시 한 번 실행합니다.', '안의 블록을 반복 실행합니다.', '지정한 시간(초) 동안 프로그램을 일시 정지합니다.'],
  de: ['Beim Start des Programms einmal ausführen.', 'Die enthaltenen Blöcke wiederholt ausführen.', 'Das Programm für die angegebene Anzahl Sekunden anhalten.'],
  fr: ['Exécuter une fois au démarrage du programme.', 'Exécuter les blocs contenus de manière répétée.', 'Suspendre le programme pendant le nombre de secondes indiqué.'],
  es: ['Ejecutar una vez al iniciar el programa.', 'Ejecutar repetidamente los bloques contenidos.', 'Pausar el programa durante el número de segundos indicado.'],
  pt: ['Executar uma vez ao iniciar o programa.', 'Executar repetidamente os blocos contidos.', 'Pausar o programa pelo número de segundos indicado.'],
  ru: ['Выполнить один раз при запуске программы.', 'Повторно выполнять вложенные блоки.', 'Приостановить программу на указанное число секунд.'],
  ar: ['التنفيذ مرة واحدة عند بدء البرنامج.', 'تنفيذ الكتل الموجودة بشكل متكرر.', 'إيقاف البرنامج مؤقتًا لعدد الثواني المحدد.'],
};
const standaloneTooltipTypes = ['python_start', 'python_forever', 'python_sleep'];
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
if (!process.argv.includes('--check')) console.log(changed ? 'Python core assets generated.' : 'Python core assets already current.');
