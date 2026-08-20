#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { localizedMessages, localizeDropdown } = require('./locales');

const ROOT = path.resolve(__dirname, '..');
const C = { lifecycle: '#455A64', io: '#00897B', vision: '#1976D2', ai: '#7B1FA2', network: '#0288D1', system: '#EF6C00' };
const dropdown = (name, options) => ({ type: 'field_dropdown', name, options });
const text = (name, value) => ({ type: 'field_input', name, text: value });
const input = (name, check) => ({ type: 'input_value', name, ...(check ? { check } : {}) });
const statements = (name) => ({ type: 'input_statement', name });
const block = (type, message0, args0, colour, connection = 'statement', tooltip = message0) => ({
  type, message0, ...(args0.length ? { args0 } : {}), colour, tooltip, icon: type.includes('camera') ? 'camera' : type.includes('ai_') ? 'robot' : 'settings',
  ...(connection === 'statement' ? { previousStatement: null, nextStatement: null } : connection === 'output' ? { output: 'Any' } : {}),
});

const pins = '${board.digitalPins}';
const baud = [['9600', '9600'], ['19200', '19200'], ['38400', '38400'], ['57600', '57600'], ['115200', '115200']];
const aiSimple = [['Fall detection', 'FALL_DETECT'], ['Hand detection', 'HAND_DETECT'], ['Person detection', 'PERSON_DETECT'], ['Person keypoints', 'PERSON_KEYPOINT'], ['Smoke detection', 'SMOKE_DETECT'], ['Traffic light', 'TRAFFIC_LIGHT_DETECT'], ['YOLO11 classification', 'YOLO11_CLS'], ['YOLO11 detection', 'YOLO11_DET']];
const b = [];
const add = (...items) => b.push(...items);

add(
  block('cybercam_start', 'when CyberCAM starts %1 %2', [statements('DO'), { type: 'input_dummy' }], C.lifecycle, 'hat', 'Run once when the CyberCAM program starts.'),
  block('cybercam_forever', 'CyberCAM forever %1 %2', [statements('DO'), { type: 'input_dummy' }], C.lifecycle, 'hat', 'Run these blocks repeatedly.'),
  block('cybercam_sleep', 'wait %1 seconds', [input('SECONDS', 'Number')], C.lifecycle, 'statement', 'Pause the program for a number of seconds.'),
  block('cybercam_print', 'print %1', [input('VALUE')], C.lifecycle),
  block('cybercam_number', 'number %1', [{ type: 'field_number', name: 'VALUE', value: 0 }], C.lifecycle, 'output'),
  block('cybercam_text', 'text %1', [text('VALUE', '')], C.lifecycle, 'output'),
  block('cybercam_boolean', 'boolean %1', [dropdown('VALUE', [['true', 'TRUE'], ['false', 'FALSE']])], C.lifecycle, 'output'),
  block('cybercam_tuple', 'tuple containing %1', [input('ITEMS')], C.lifecycle, 'output'),
  block('cybercam_list', 'list containing %1', [input('ITEMS')], C.lifecycle, 'output'),
  block('cybercam_set_variable', 'set variable %1 to %2', [text('NAME', 'value'), input('VALUE')], C.lifecycle),
  block('cybercam_get_variable', 'variable %1', [text('NAME', 'value')], C.lifecycle, 'output'),
  block('cybercam_if', 'if %1 do %2 %3', [input('CONDITION', 'Boolean'), statements('DO'), { type: 'input_dummy' }], C.lifecycle),
  block('cybercam_for_each', 'for each %1 in %2 do %3 %4', [text('NAME', 'item'), input('ITEMS'), statements('DO'), { type: 'input_dummy' }], C.lifecycle),
  block('cybercam_gpio_init', 'initialize GPIO %1 pin %2 direction %3 pull %4', [text('NAME', 'pin'), dropdown('PIN', pins), dropdown('DIRECTION', [['input', 'INPUT'], ['output', 'OUTPUT']]), dropdown('PULL', [['none', 'NONE'], ['up', 'UP'], ['down', 'DOWN']])], C.io, 'statement', 'Create a digital IO object using the official board and digitalio modules.'),
  block('cybercam_gpio_write', 'set GPIO %1 to %2', [text('NAME', 'pin'), input('VALUE', 'Boolean')], C.io),
  block('cybercam_gpio_read', 'GPIO %1 value', [text('NAME', 'pin')], C.io, 'output'),
  block('cybercam_gpio_deinit', 'deinitialize GPIO %1', [text('NAME', 'pin')], C.io),
  block('cybercam_led_write', 'set onboard LED to %1', [input('VALUE', 'Boolean')], C.io),
  block('cybercam_key_pressed', 'onboard key is pressed', [], C.io, 'output'),
  block('cybercam_pwm_init', 'initialize PWM %1 target %2', [text('NAME', 'pwm'), dropdown('TARGET', [['GPIO60 / PWM0', '0,0'], ['GPIO61 / PWM1', '0,1'], ['fill light / PWM2', '0,2'], ['buzzer / PWM3', '1,0'], ['backlight / PWM5', '1,2']])], C.io),
  block('cybercam_pwm_frequency', 'set PWM %1 frequency %2 Hz', [text('NAME', 'pwm'), input('FREQUENCY', 'Number')], C.io),
  block('cybercam_pwm_duty', 'set PWM %1 duty cycle %2 (0-1)', [text('NAME', 'pwm'), input('DUTY', 'Number')], C.io),
  ...['enable', 'disable', 'close'].map((op) => block(`cybercam_pwm_${op}`, `${op} PWM %1`, [text('NAME', 'pwm')], C.io)),
  block('cybercam_uart_init', 'initialize UART %1 baud %2', [text('NAME', 'uart'), dropdown('BAUD', baud)], C.io),
  block('cybercam_uart_available', 'UART %1 bytes available', [text('NAME', 'uart')], C.io, 'output'),
  block('cybercam_uart_read', 'UART %1 read %2 bytes', [text('NAME', 'uart'), input('SIZE', 'Number')], C.io, 'output'),
  block('cybercam_uart_write', 'UART %1 write %2', [text('NAME', 'uart'), input('DATA')], C.io),
  block('cybercam_uart_flush', 'flush UART %1 input', [text('NAME', 'uart')], C.io),
  block('cybercam_uart_close', 'close UART %1', [text('NAME', 'uart')], C.io),
);

add(
  block('cybercam_camera_init', 'initialize camera %1 width %2 height %3 sensor %4', [text('NAME', 'camera'), input('WIDTH', 'Number'), input('HEIGHT', 'Number'), dropdown('SENSOR_ID', [['onboard CSI2', '2'], ['default', '0']])], C.vision),
  block('cybercam_camera_opened', 'camera %1 is open', [text('NAME', 'camera')], C.vision, 'output'),
  block('cybercam_camera_read', 'camera %1 image', [text('NAME', 'camera')], C.vision, 'output'),
  block('cybercam_camera_hmirror', 'camera %1 horizontal mirror %2', [text('NAME', 'camera'), input('ENABLED', 'Boolean')], C.vision),
  block('cybercam_camera_vflip', 'camera %1 vertical flip %2', [text('NAME', 'camera'), input('ENABLED', 'Boolean')], C.vision),
  block('cybercam_camera_release', 'release camera %1', [text('NAME', 'camera')], C.vision),
  block('cybercam_display_init', 'initialize onboard display', [], C.vision),
  block('cybercam_display_rotation', 'set display rotation %1', [dropdown('ROTATION', [['0°', '0'], ['180°', '2']])], C.vision),
  block('cybercam_display_show', 'show image %1 on display', [input('IMAGE')], C.vision),
  block('cybercam_ide_show', 'show image %1 in IDE', [input('IMAGE')], C.vision),
  block('cybercam_lcd_direction', 'current display direction', [], C.vision, 'output'),
  block('cybercam_image_resize', 'resize image %1 width %2 height %3', [input('IMAGE'), input('WIDTH', 'Number'), input('HEIGHT', 'Number')], C.vision, 'output'),
  block('cybercam_image_convert', 'convert image %1 using %2', [input('IMAGE'), dropdown('CONVERSION', [['BGR to gray', 'COLOR_BGR2GRAY'], ['BGR to LAB', 'COLOR_BGR2LAB'], ['BGR to RGB', 'COLOR_BGR2RGB'], ['gray to BGR', 'COLOR_GRAY2BGR']])], C.vision, 'output'),
  block('cybercam_image_in_range', 'image %1 mask lower %2 upper %3', [input('IMAGE'), input('LOWER'), input('UPPER')], C.vision, 'output'),
  block('cybercam_image_components', 'connected components of %1 connectivity %2', [input('IMAGE'), dropdown('CONNECTIVITY', [['4', '4'], ['8', '8']])], C.vision, 'output'),
  block('cybercam_image_load', 'load image file %1', [input('PATH', 'String')], C.vision, 'output'),
  block('cybercam_image_save', 'save image %1 to file %2', [input('IMAGE'), input('PATH', 'String')], C.vision),
  block('cybercam_draw_rectangle', 'draw rectangle on %1 from x %2 y %3 to x %4 y %5 color %6 thickness %7', [input('IMAGE'), input('X1', 'Number'), input('Y1', 'Number'), input('X2', 'Number'), input('Y2', 'Number'), input('COLOR'), input('THICKNESS', 'Number')], C.vision),
  block('cybercam_draw_circle', 'draw circle on %1 x %2 y %3 radius %4 color %5 thickness %6', [input('IMAGE'), input('X', 'Number'), input('Y', 'Number'), input('RADIUS', 'Number'), input('COLOR'), input('THICKNESS', 'Number')], C.vision),
  block('cybercam_draw_line', 'draw line on %1 from x %2 y %3 to x %4 y %5 color %6 thickness %7', [input('IMAGE'), input('X1', 'Number'), input('Y1', 'Number'), input('X2', 'Number'), input('Y2', 'Number'), input('COLOR'), input('THICKNESS', 'Number')], C.vision),
  block('cybercam_draw_text', 'draw text %1 on %2 x %3 y %4 scale %5 color %6 thickness %7', [input('TEXT'), input('IMAGE'), input('X', 'Number'), input('Y', 'Number'), input('SCALE', 'Number'), input('COLOR'), input('THICKNESS', 'Number')], C.vision),
  block('cybercam_qr_decode', 'decode QR codes in %1', [input('IMAGE')], C.vision, 'output'),
  block('cybercam_barcode_decode', 'decode barcodes in %1', [input('IMAGE')], C.vision, 'output'),
  block('cybercam_apriltag_init', 'initialize AprilTag detector %1 family %2', [text('NAME', 'tags'), dropdown('FAMILY', [['tag16h5', 'tag16h5'], ['tag25h7', 'tag25h7'], ['tag25h9', 'tag25h9'], ['tag36h10', 'tag36h10'], ['tag36h11', 'tag36h11']])], C.vision),
  block('cybercam_apriltag_detect', 'AprilTag detector %1 detect gray image %2', [text('NAME', 'tags'), input('IMAGE')], C.vision, 'output'),
);

add(
  block('cybercam_ai_init_simple', 'initialize AI %1 model %2 path %3 size %4', [text('NAME', 'detector'), dropdown('MODEL', aiSimple), input('MODEL_PATH', 'String'), input('MODEL_SIZE', 'Number')], C.ai),
  block('cybercam_ai_init_face', 'initialize face detector %1 model %2 anchors %3 size %4', [text('NAME', 'detector'), input('MODEL_PATH', 'String'), input('ANCHORS_PATH', 'String'), input('MODEL_SIZE', 'Number')], C.ai),
  block('cybercam_ai_init_mask', 'initialize mask detector %1 detection model %2 anchors %3 size %4 mask model %5', [text('NAME', 'detector'), input('DETECT_MODEL', 'String'), input('ANCHORS_PATH', 'String'), input('MODEL_SIZE', 'Number'), input('MASK_MODEL', 'String')], C.ai),
  block('cybercam_ai_init_hand_keypoint', 'initialize hand AI %1 type %2 detection model %3 keypoint model %4', [text('NAME', 'detector'), dropdown('MODEL', [['keypoints', 'HAND_KEYPOINT'], ['gesture classification', 'HAND_KEYPOINT_CLS']]), input('DETECT_MODEL', 'String'), input('KEYPOINT_MODEL', 'String')], C.ai),
  block('cybercam_ai_init_ocr', 'initialize OCR %1 detection %2 recognition %3 dictionary %4 detection size %5 recognition width %6 height %7', [text('NAME', 'ocr'), input('DETECT_MODEL', 'String'), input('RECOGNITION_MODEL', 'String'), input('DICTIONARY', 'String'), input('DETECT_SIZE', 'Number'), input('RECOGNITION_WIDTH', 'Number'), input('RECOGNITION_HEIGHT', 'Number')], C.ai),
  block('cybercam_ai_init_licence', 'initialize license-plate AI %1 detection %2 recognition %3 anchors %4 labels %5 detection size %6 recognition width %7 height %8', [text('NAME', 'licence'), input('DETECT_MODEL', 'String'), input('RECOGNITION_MODEL', 'String'), input('ANCHORS_PATH', 'String'), input('LABELS'), input('DETECT_SIZE', 'Number'), input('RECOGNITION_WIDTH', 'Number'), input('RECOGNITION_HEIGHT', 'Number')], C.ai),
  block('cybercam_ai_run', 'AI %1 run on %2', [text('NAME', 'detector'), input('IMAGE')], C.ai, 'output'),
  block('cybercam_ai_run_confidence', 'AI %1 run on %2 confidence %3', [text('NAME', 'detector'), input('IMAGE'), input('CONFIDENCE', 'Number')], C.ai, 'output'),
  block('cybercam_ai_run_thresholds', 'AI %1 run on %2 confidence %3 NMS %4', [text('NAME', 'detector'), input('IMAGE'), input('CONFIDENCE', 'Number'), input('NMS', 'Number')], C.ai, 'output'),
  block('cybercam_result_length', 'result list %1 length', [input('RESULTS')], C.ai, 'output'),
  block('cybercam_result_item', 'result list %1 item %2', [input('RESULTS'), input('INDEX', 'Number')], C.ai, 'output'),
  block('cybercam_result_property', 'result %1 property %2', [input('RESULT'), dropdown('PROPERTY', [['confidence', 'reliability'], ['x', 'x'], ['y', 'y'], ['width', 'w'], ['height', 'h'], ['label', 'label'], ['text', 'text'], ['keypoints', 'keypoints'], ['corners', 'corners']])], C.ai, 'output'),
);

add(
  block('cybercam_socket_init', 'initialize socket %1 family %2 type %3', [text('NAME', 'sock'), dropdown('FAMILY', [['IPv4', 'AF_INET'], ['IPv6', 'AF_INET6']]), dropdown('TYPE', [['TCP', 'SOCK_STREAM'], ['UDP', 'SOCK_DGRAM']])], C.network),
  block('cybercam_socket_address', 'network address host %1 port %2', [input('HOST', 'String'), input('PORT', 'Number')], C.network, 'output'),
  block('cybercam_socket_connect', 'socket %1 connect to %2', [text('NAME', 'sock'), input('ADDRESS')], C.network),
  block('cybercam_socket_bind', 'socket %1 bind to %2', [text('NAME', 'sock'), input('ADDRESS')], C.network),
  block('cybercam_socket_listen', 'socket %1 listen backlog %2', [text('NAME', 'sock'), input('BACKLOG', 'Number')], C.network),
  block('cybercam_socket_accept', 'socket %1 accept connection', [text('NAME', 'sock')], C.network, 'output'),
  block('cybercam_socket_send', 'socket %1 send %2', [text('NAME', 'sock'), input('DATA')], C.network),
  block('cybercam_socket_receive', 'socket %1 receive %2 bytes', [text('NAME', 'sock'), input('SIZE', 'Number')], C.network, 'output'),
  block('cybercam_socket_close', 'close socket %1', [text('NAME', 'sock')], C.network),
  block('cybercam_mqtt_init', 'initialize MQTT client %1', [text('NAME', 'client')], C.network),
  block('cybercam_mqtt_connect', 'MQTT %1 connect host %2 port %3 keepalive %4', [text('NAME', 'client'), input('HOST', 'String'), input('PORT', 'Number'), input('KEEPALIVE', 'Number')], C.network),
  block('cybercam_mqtt_publish', 'MQTT %1 publish topic %2 message %3', [text('NAME', 'client'), input('TOPIC', 'String'), input('MESSAGE')], C.network),
  block('cybercam_mqtt_subscribe', 'MQTT %1 subscribe topic %2', [text('NAME', 'client'), input('TOPIC', 'String')], C.network),
  block('cybercam_mqtt_on_message', 'when MQTT %1 receives message set topic %2 payload %3 do %4 %5', [text('NAME', 'client'), text('TOPIC_NAME', 'topic'), text('PAYLOAD_NAME', 'payload'), statements('DO'), { type: 'input_dummy' }], C.network),
  block('cybercam_mqtt_loop', 'MQTT %1 loop forever', [text('NAME', 'client')], C.network),
  block('cybercam_mqtt_disconnect', 'disconnect MQTT %1', [text('NAME', 'client')], C.network),
  block('cybercam_http_request', 'HTTP %1 URL %2 data %3', [dropdown('METHOD', [['GET', 'GET'], ['POST', 'POST'], ['PUT', 'PUT'], ['DELETE', 'DELETE']]), input('URL', 'String'), input('DATA')], C.network, 'output'),
  block('cybercam_http_response', 'HTTP response %1 property %2', [input('RESPONSE'), dropdown('PROPERTY', [['status code', 'status_code'], ['text', 'text'], ['JSON', 'json()']])], C.network, 'output'),
  block('cybercam_http_server', 'serve current directory with HTTP host %1 port %2', [input('HOST', 'String'), input('PORT', 'Number')], C.network),
);

add(
  block('cybercam_file_read', 'read text file %1', [input('PATH', 'String')], C.system, 'output'),
  block('cybercam_file_write', '%1 text file %2 content %3', [dropdown('MODE', [['write', 'w'], ['append', 'a']]), input('PATH', 'String'), input('CONTENT')], C.system),
  block('cybercam_file_exists', 'path %1 exists', [input('PATH', 'String')], C.system, 'output'),
  block('cybercam_file_list', 'list directory %1', [input('PATH', 'String')], C.system, 'output'),
  block('cybercam_command', 'run system command %1', [input('COMMAND', 'String')], C.system, 'output'),
  block('cybercam_audio_play', 'play WAV file %1', [input('PATH', 'String')], C.system),
  block('cybercam_audio_record', 'record WAV to %1 seconds %2 sample rate %3', [input('PATH', 'String'), input('SECONDS', 'Number'), input('RATE', 'Number')], C.system),
  block('cybercam_imu_init', 'initialize QMI8658 IMU %1 bus %2 address %3', [text('NAME', 'imu'), input('BUS', 'Number'), input('ADDRESS', 'Number')], C.system),
  block('cybercam_imu_read', 'IMU %1 six-axis values', [text('NAME', 'imu')], C.system, 'output'),
  block('cybercam_imu_axis', 'IMU %1 axis %2', [text('NAME', 'imu'), dropdown('AXIS', [['acceleration X (g)', '0'], ['acceleration Y (g)', '1'], ['acceleration Z (g)', '2'], ['gyro X (dps)', '3'], ['gyro Y (dps)', '4'], ['gyro Z (dps)', '5']])], C.system, 'output'),
  block('cybercam_imu_calibrate', 'calibrate IMU %1 samples %2', [text('NAME', 'imu'), input('SAMPLES', 'Number')], C.system),
  block('cybercam_imu_close', 'close IMU %1', [text('NAME', 'imu')], C.system),
  block('cybercam_cpu_temperature', 'K230 CPU temperature °C', [], C.system, 'output'),
  block('cybercam_chip_id', 'K230 unique chip ID', [], C.system, 'output'),
);

const categoryGroups = [
  ['Lifecycle', C.lifecycle, b.filter((x) => x.colour === C.lifecycle && !['cybercam_start', 'cybercam_forever'].includes(x.type)).map((x) => x.type)],
  ['IO and peripherals', C.io, b.filter((x) => x.colour === C.io).map((x) => x.type)],
  ['Camera and display', C.vision, b.filter((x) => x.colour === C.vision && !x.type.includes('image_') && !x.type.includes('draw_') && !x.type.includes('decode') && !x.type.includes('apriltag')).map((x) => x.type)],
  ['OpenCV and codes', C.vision, b.filter((x) => x.colour === C.vision && (x.type.includes('image_') || x.type.includes('draw_') || x.type.includes('decode') || x.type.includes('apriltag'))).map((x) => x.type)],
  ['KPU AI', C.ai, b.filter((x) => x.colour === C.ai).map((x) => x.type)],
  ['Network', C.network, b.filter((x) => x.colour === C.network).map((x) => x.type)],
  ['Files and images', C.system, b.filter((x) => ['cybercam_file_read', 'cybercam_file_write', 'cybercam_file_exists', 'cybercam_file_list', 'cybercam_command'].includes(x.type)).map((x) => x.type)],
  ['Audio, IMU and system', C.system, b.filter((x) => x.colour === C.system && !['cybercam_file_read', 'cybercam_file_write', 'cybercam_file_exists', 'cybercam_file_list', 'cybercam_command'].includes(x.type)).map((x) => x.type)],
];
const numericDefaults = { SECONDS: 1, WIDTH: 640, HEIGHT: 480, FREQUENCY: 1000, DUTY: 0.5, SIZE: 1024, X: 10, Y: 30, X1: 10, Y1: 10, X2: 100, Y2: 100, RADIUS: 10, THICKNESS: 2, SCALE: 1, MODEL_SIZE: 640, CONFIDENCE: 0.5, NMS: 0.45, PORT: 1883, KEEPALIVE: 60, RATE: 16000, BUS: 1, ADDRESS: 106, SAMPLES: 100, DETECT_SIZE: 640, RECOGNITION_WIDTH: 512, RECOGNITION_HEIGHT: 32 };
const textDefaults = { PATH: '/data/file.txt', MODEL_PATH: '/data/model.kmodel', DETECT_MODEL: '/data/detect.kmodel', RECOGNITION_MODEL: '/data/recognition.kmodel', KEYPOINT_MODEL: '/data/keypoint.kmodel', MASK_MODEL: '/data/mask.kmodel', ANCHORS_PATH: '/data/anchors.bin', DICTIONARY: '/data/dict.txt', HOST: 'localhost', URL: 'https://example.com', TOPIC: '/cybercam/data', COMMAND: 'uname -a', TEXT: 'CyberCAM' };
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
const toolbox = { kind: 'category', name: 'CyberCAM', colour: C.lifecycle, contents: categoryGroups.map(([name, colour, types]) => ({ kind: 'category', name, colour, contents: types.map(toolboxItem) })) };

const languageMeta = {
  zh_cn: ['CyberCAM Python', ['程序', 'IO 与外设', '摄像头与屏幕', 'OpenCV 与码识别', 'KPU 人工智能', '网络', '文件与图像', '音频、IMU 与系统']],
  en: ['CyberCAM Python', categoryGroups.map((group) => group[0])],
  zh_hk: ['CyberCAM Python', ['程式', 'IO 與周邊', '相機與螢幕', 'OpenCV 與碼識別', 'KPU 人工智能', '網絡', '檔案與圖像', '音訊、IMU 與系統']],
  ja: ['CyberCAM Python', ['プログラム', 'IO と周辺機器', 'カメラと画面', 'OpenCV とコード認識', 'KPU AI', 'ネットワーク', 'ファイルと画像', '音声・IMU・システム']],
  ko: ['CyberCAM Python', ['프로그램', 'IO 및 주변 장치', '카메라 및 화면', 'OpenCV 및 코드 인식', 'KPU AI', '네트워크', '파일 및 이미지', '오디오·IMU·시스템']],
  de: ['CyberCAM Python', ['Programm', 'E/A und Peripherie', 'Kamera und Anzeige', 'OpenCV und Codes', 'KPU-KI', 'Netzwerk', 'Dateien und Bilder', 'Audio, IMU und System']],
  fr: ['CyberCAM Python', ['Programme', 'E/S et périphériques', 'Caméra et écran', 'OpenCV et codes', 'IA KPU', 'Réseau', 'Fichiers et images', 'Audio, IMU et système']],
  es: ['CyberCAM Python', ['Programa', 'E/S y periféricos', 'Cámara y pantalla', 'OpenCV y códigos', 'IA KPU', 'Red', 'Archivos e imágenes', 'Audio, IMU y sistema']],
  pt: ['CyberCAM Python', ['Programa', 'E/S e periféricos', 'Câmera e tela', 'OpenCV e códigos', 'IA KPU', 'Rede', 'Arquivos e imagens', 'Áudio, IMU e sistema']],
  ru: ['CyberCAM Python', ['Программа', 'Ввод-вывод', 'Камера и экран', 'OpenCV и коды', 'ИИ KPU', 'Сеть', 'Файлы и изображения', 'Аудио, IMU и система']],
  ar: ['CyberCAM Python', ['البرنامج', 'الإدخال والإخراج', 'الكاميرا والشاشة', 'OpenCV والرموز', 'ذكاء KPU', 'الشبكة', 'الملفات والصور', 'الصوت وIMU والنظام']],
};
const placeholders = (text) => String(text).match(/%\d+/g) || [];
const standaloneTooltips = {
  zh_cn: ['CyberCAM 程序启动时执行一次。', '重复执行其中的积木。', '暂停程序指定的秒数。', '使用官方 board 与 digitalio 模块创建数字 IO 对象。'],
  zh_hk: ['CyberCAM 程式啟動時執行一次。', '重複執行其中的積木。', '暫停程式指定的秒數。', '使用官方 board 與 digitalio 模組建立數碼 IO 物件。'],
  ja: ['CyberCAM プログラムの起動時に一度実行します。', '中のブロックを繰り返し実行します。', '指定した秒数だけプログラムを停止します。', '公式の board と digitalio モジュールでデジタル IO オブジェクトを作成します。'],
  ko: ['CyberCAM 프로그램 시작 시 한 번 실행합니다.', '안의 블록을 반복 실행합니다.', '지정한 시간(초) 동안 프로그램을 일시 정지합니다.', '공식 board 및 digitalio 모듈로 디지털 IO 객체를 만듭니다.'],
  de: ['Beim Start des CyberCAM-Programms einmal ausführen.', 'Die enthaltenen Blöcke wiederholt ausführen.', 'Das Programm für die angegebene Anzahl Sekunden anhalten.', 'Ein digitales E/A-Objekt mit den offiziellen Modulen board und digitalio erstellen.'],
  fr: ['Exécuter une fois au démarrage du programme CyberCAM.', 'Exécuter les blocs contenus de manière répétée.', 'Suspendre le programme pendant le nombre de secondes indiqué.', 'Créer un objet d’E/S numérique avec les modules officiels board et digitalio.'],
  es: ['Ejecutar una vez al iniciar el programa CyberCAM.', 'Ejecutar repetidamente los bloques contenidos.', 'Pausar el programa durante el número de segundos indicado.', 'Crear un objeto de E/S digital con los módulos oficiales board y digitalio.'],
  pt: ['Executar uma vez ao iniciar o programa CyberCAM.', 'Executar repetidamente os blocos contidos.', 'Pausar o programa pelo número de segundos indicado.', 'Criar um objeto de E/S digital com os módulos oficiais board e digitalio.'],
  ru: ['Выполнить один раз при запуске программы CyberCAM.', 'Повторно выполнять вложенные блоки.', 'Приостановить программу на указанное число секунд.', 'Создать объект цифрового ввода-вывода с помощью официальных модулей board и digitalio.'],
  ar: ['التنفيذ مرة واحدة عند بدء برنامج CyberCAM.', 'تنفيذ الكتل الموجودة بشكل متكرر.', 'إيقاف البرنامج مؤقتًا لعدد الثواني المحدد.', 'إنشاء كائن إدخال وإخراج رقمي باستخدام وحدتي board وdigitalio الرسميتين.'],
};
const standaloneTooltipTypes = ['cybercam_start', 'cybercam_forever', 'cybercam_sleep', 'cybercam_gpio_init'];
const makeLocale = (localeName) => {
  const [toolboxName, labels] = languageMeta[localeName];
  const locale = { toolbox_name: toolboxName, toolbox_categories: labels, toolbox_labels: Object.fromEntries(categoryGroups.map((group, index) => [group[0], labels[index]])) };
  const translated = localeName === 'en' ? b.map((item) => item.message0) : localizedMessages(localeName, b);
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
if (!process.argv.includes('--check')) console.log(changed ? 'CyberCAM assets generated.' : 'CyberCAM assets already current.');
