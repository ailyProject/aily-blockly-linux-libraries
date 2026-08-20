/* CyberCAM Python generator — official 01Studio/walnutpi APIs only. */
(function (Python) {
  'use strict';

  if (!Python || !Python.forBlock) throw new Error('CyberCAM requires the Python generator');

  const ORDER_ATOMIC = Python.ORDER_ATOMIC ?? 0;
  const ORDER_MEMBER = Python.ORDER_MEMBER ?? 2.1;
  const ORDER_CALL = Python.ORDER_FUNCTION_CALL ?? 2.2;
  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const define = (type, generator) => { Python.forBlock[type] = generator; };
  const field = (block, name, fallback = '') => block.getFieldValue(name) ?? fallback;
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || fallback;
  const statement = (generator, block, name) => {
    const indent = generator.INDENT || '    ';
    const lines = (generator.statementToCode(block, name) || '')
      .replace(/\r\n/g, '\n')
      .split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    return lines
      .map(line => line.startsWith(indent) ? line.slice(indent.length) : line)
      .join('\n');
  };
  const declareResource = (generator, tag, name, cleanup) => {
    generator.addVariable(tag, `${name} = None`);
    if (cleanup && typeof generator.addCleanup === 'function') {
      generator.addCleanup(tag, `if ${name} is not None:\n    ${name}.${cleanup}()`);
    }
  };
  const PYTHON_KEYWORDS = new Set([
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
    'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
    'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
    'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
  ]);
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result)) result += '_';
    return result || fallback;
  };
  const nameScopes = new WeakMap();
  const withNameScope = (generator, entries, generate) => {
    const scopes = nameScopes.get(generator) || [];
    const scope = new Map(entries.map(([name, alias]) => [String(name), alias]));
    scopes.push(scope);
    nameScopes.set(generator, scopes);
    try {
      return generate();
    } finally {
      scopes.pop();
      if (!scopes.length) nameScopes.delete(generator);
    }
  };
  const resolveName = (generator, name, fallback) => {
    const rawName = String(name || fallback);
    const scopes = nameScopes.get(generator) || [];
    for (let index = scopes.length - 1; index >= 0; index--) {
      if (scopes[index].has(rawName)) return scopes[index].get(rawName);
    }
    return safeName(rawName, fallback);
  };
  const uniqueName = (name, used) => {
    let result = name;
    let suffix = 2;
    while (used.has(result)) result = `${name}_${suffix++}`;
    used.add(result);
    return result;
  };
  const uniqueFunctionKey = (generator, base) => {
    const functions = generator.codeDict?.functions || {};
    let result = base;
    let suffix = 2;
    while (Object.prototype.hasOwnProperty.call(functions, result)) result = `${base}_${suffix++}`;
    return result;
  };
  const nameOf = (block, fallback) => safeName(field(block, 'NAME', fallback), fallback);
  const pinExpression = (pin) => pin === '52' ? 'board.LED' : pin === '21' ? 'board.KEY' : `board.IO${pin}`;
  const output = (code, order = ORDER_CALL) => [code, order];

  define('cybercam_start', (block, generator) => {
    generator.addSetup('cybercam_start', statement(generator, block, 'DO') || 'pass', true);
    return '';
  });
  define('cybercam_forever', (block, generator) => {
    generator.addLoop('cybercam_forever', statement(generator, block, 'DO') || 'pass', true);
    return '';
  });
  define('cybercam_sleep', (block, generator) => {
    generator.addImport('time', 'import time');
    return `time.sleep(${value(generator, block, 'SECONDS', '1')})\n`;
  });
  define('cybercam_print', (block, generator) => `print(${value(generator, block, 'VALUE', "''")})\n`);
  define('cybercam_number', (block) => output(String(field(block, 'VALUE', '0')), ORDER_ATOMIC));
  define('cybercam_text', (block, generator) => output(generator.quote_(field(block, 'VALUE', '')), ORDER_ATOMIC));
  define('cybercam_boolean', (block) => output(field(block, 'VALUE', 'TRUE') === 'TRUE' ? 'True' : 'False', ORDER_ATOMIC));
  define('cybercam_tuple', (block, generator) => {
    const items = value(generator, block, 'ITEMS', '');
    return output(items ? `(${items},)` : '()', ORDER_ATOMIC);
  });
  define('cybercam_list', (block, generator) => output(`[${value(generator, block, 'ITEMS', '')}]`, ORDER_ATOMIC));
  define('cybercam_set_variable', (block, generator) => `${resolveName(generator, field(block, 'NAME', 'value'), 'value')} = ${value(generator, block, 'VALUE')}\n`);
  define('cybercam_get_variable', (block, generator) => output(resolveName(generator, field(block, 'NAME', 'value'), 'value'), ORDER_ATOMIC));
  define('cybercam_if', (block, generator) => {
    const body = statement(generator, block, 'DO') || 'pass';
    return `if ${value(generator, block, 'CONDITION', 'False')}:\n${body.split('\n').map(line => line ? `    ${line}` : '').join('\n')}\n`;
  });
  define('cybercam_for_each', (block, generator) => {
    const body = statement(generator, block, 'DO') || 'pass';
    return `for ${safeName(field(block, 'NAME', 'item'), 'item')} in ${value(generator, block, 'ITEMS', '[]')}:\n${body.split('\n').map(line => line ? `    ${line}` : '').join('\n')}\n`;
  });

  define('cybercam_gpio_init', (block, generator) => {
    const name = nameOf(block, 'pin');
    const pin = String(field(block, 'PIN', '14'));
    const direction = field(block, 'DIRECTION', 'OUTPUT');
    const pull = field(block, 'PULL', 'NONE');
    generator.addImport('board', 'import board');
    generator.addImport('digitalio', 'from digitalio import DigitalInOut, Direction, Pull');
    declareResource(generator, `gpio_${name}`, name, 'deinit');
    let code = `${name} = DigitalInOut(${pinExpression(pin)})\n${name}.direction = Direction.${direction}\n`;
    if (direction === 'INPUT' && pull !== 'NONE') code += `${name}.pull = Pull.${pull}\n`;
    return code;
  });
  define('cybercam_gpio_write', (block, generator) => {
    const name = nameOf(block, 'pin');
    return `${name}.value = bool(${value(generator, block, 'VALUE', 'False')})\n`;
  });
  define('cybercam_gpio_read', (block) => output(`${nameOf(block, 'pin')}.value`, ORDER_MEMBER));
  define('cybercam_gpio_deinit', (block) => `${nameOf(block, 'pin')}.deinit()\n`);
  define('cybercam_led_write', (block, generator) => {
    const state = value(generator, block, 'VALUE', 'True');
    generator.addImport('board', 'import board');
    generator.addImport('digitalio', 'from digitalio import DigitalInOut, Direction, Pull');
    generator.addVariable('gpio_cybercam_led', '_cybercam_led = DigitalInOut(board.LED)');
    generator.addSetup('gpio_cybercam_led', '_cybercam_led.direction = Direction.OUTPUT');
    if (typeof generator.addCleanup === 'function') {
      generator.addCleanup('gpio_cybercam_led', 'if _cybercam_led is not None:\n    _cybercam_led.deinit()');
    }
    return `_cybercam_led.value = bool(${state})\n`;
  });
  define('cybercam_key_pressed', (_block, generator) => {
    generator.addImport('board', 'import board');
    generator.addImport('digitalio', 'from digitalio import DigitalInOut, Direction, Pull');
    generator.addVariable('gpio_cybercam_key', '_cybercam_key = DigitalInOut(board.KEY)');
    generator.addSetup('gpio_cybercam_key', '_cybercam_key.direction = Direction.INPUT\n_cybercam_key.pull = Pull.UP');
    if (typeof generator.addCleanup === 'function') {
      generator.addCleanup('gpio_cybercam_key', 'if _cybercam_key is not None:\n    _cybercam_key.deinit()');
    }
    return output('not _cybercam_key.value', ORDER_NONE);
  });

  define('cybercam_pwm_init', (block, generator) => {
    const name = nameOf(block, 'pwm');
    const target = String(field(block, 'TARGET', '0,2')).split(',');
    generator.addImport('periphery_pwm', 'from periphery import PWM');
    declareResource(generator, `pwm_${name}`, name, 'close');
    return `${name} = PWM(${target[0]}, ${target[1]})\n`;
  });
  define('cybercam_pwm_frequency', (block, generator) => `${nameOf(block, 'pwm')}.frequency = ${value(generator, block, 'FREQUENCY', '1000')}\n`);
  define('cybercam_pwm_duty', (block, generator) => `${nameOf(block, 'pwm')}.duty_cycle = max(0.0, min(1.0, float(${value(generator, block, 'DUTY', '0.5')})))\n`);
  for (const method of ['enable', 'disable', 'close']) {
    define(`cybercam_pwm_${method}`, (block) => `${nameOf(block, 'pwm')}.${method}()\n`);
  }

  define('cybercam_uart_init', (block, generator) => {
    const name = nameOf(block, 'uart');
    generator.addImport('serial', 'import serial');
    declareResource(generator, `uart_${name}`, name, 'close');
    return `${name} = serial.Serial("/dev/ttyS2", ${field(block, 'BAUD', '115200')})\n`;
  });
  define('cybercam_uart_available', (block) => output(`${nameOf(block, 'uart')}.inWaiting()`, ORDER_CALL));
  define('cybercam_uart_read', (block, generator) => output(`${nameOf(block, 'uart')}.read(${value(generator, block, 'SIZE', '1')})`, ORDER_CALL));
  define('cybercam_uart_write', (block, generator) => `${nameOf(block, 'uart')}.write(${value(generator, block, 'DATA', "b''")})\n`);
  define('cybercam_uart_flush', (block) => `${nameOf(block, 'uart')}.flushInput()\n`);
  define('cybercam_uart_close', (block) => `${nameOf(block, 'uart')}.close()\n`);

  define('cybercam_camera_init', (block, generator) => {
    const name = nameOf(block, 'camera');
    const width = value(generator, block, 'WIDTH', '640');
    const height = value(generator, block, 'HEIGHT', '480');
    const sensorId = field(block, 'SENSOR_ID', '2');
    generator.addImport('walnutpi_sensor', 'from walnutpi import Sensor');
    declareResource(generator, `camera_${name}`, name, 'release');
    return `${name} = Sensor.Sensor(${width}, ${height}, id=${sensorId})\n`;
  });
  define('cybercam_camera_opened', (block) => output(`${nameOf(block, 'camera')}.isOpened()`, ORDER_CALL));
  define('cybercam_camera_read', (block) => output(`${nameOf(block, 'camera')}.read()[1]`, ORDER_MEMBER));
  define('cybercam_camera_hmirror', (block, generator) => `${nameOf(block, 'camera')}.set_hmirror(int(bool(${value(generator, block, 'ENABLED', 'True')})))\n`);
  define('cybercam_camera_vflip', (block, generator) => `${nameOf(block, 'camera')}.set_vflip(int(bool(${value(generator, block, 'ENABLED', 'True')})))\n`);
  define('cybercam_camera_release', (block) => `${nameOf(block, 'camera')}.release()\n`);

  define('cybercam_display_init', (_block, generator) => {
    generator.addImport('walnutpi_display', 'from walnutpi import Display');
    generator.addSetup('cybercam_display', 'Display.init()');
    return '';
  });
  define('cybercam_display_rotation', (block, generator) => {
    generator.addImport('walnutpi_display', 'from walnutpi import Display');
    return `Display.set_rotation(${field(block, 'ROTATION', '0')})\n`;
  });
  define('cybercam_display_show', (block, generator) => {
    generator.addImport('walnutpi_display', 'from walnutpi import Display');
    return `Display.show(${value(generator, block, 'IMAGE', 'None')})\n`;
  });
  define('cybercam_ide_show', (block, generator) => {
    generator.addImport('walnutpi_ide', 'from walnutpi import IDE');
    return `IDE.show(${value(generator, block, 'IMAGE', 'None')})\n`;
  });
  define('cybercam_lcd_direction', (_block, generator) => {
    generator.addImport('walnutpi_direction', 'from walnutpi import direction');
    return output('direction.get_lcd()', ORDER_CALL);
  });

  const requireCv2 = (generator) => generator.addImport('cv2', 'import cv2');
  define('cybercam_image_resize', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.resize(${value(generator, block, 'IMAGE')}, (${value(generator, block, 'WIDTH', '320')}, ${value(generator, block, 'HEIGHT', '240')}))`);
  });
  define('cybercam_image_convert', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.cvtColor(${value(generator, block, 'IMAGE')}, cv2.${field(block, 'CONVERSION', 'COLOR_BGR2GRAY')})`);
  });
  define('cybercam_image_in_range', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.inRange(${value(generator, block, 'IMAGE')}, ${value(generator, block, 'LOWER', '(0, 0, 0)')}, ${value(generator, block, 'UPPER', '(255, 255, 255)')})`);
  });
  define('cybercam_image_components', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.connectedComponentsWithStats(${value(generator, block, 'IMAGE')}, connectivity=${field(block, 'CONNECTIVITY', '8')}, ltype=cv2.CV_16U)`);
  });
  define('cybercam_image_load', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.imread(${value(generator, block, 'PATH', "'/data/image.jpg'")})`);
  });
  define('cybercam_image_save', (block, generator) => {
    requireCv2(generator);
    return `cv2.imwrite(${value(generator, block, 'PATH', "'/data/image.jpg'")}, ${value(generator, block, 'IMAGE')})\n`;
  });
  define('cybercam_draw_rectangle', (block, generator) => {
    requireCv2(generator);
    return `cv2.rectangle(${value(generator, block, 'IMAGE')}, (${value(generator, block, 'X1', '0')}, ${value(generator, block, 'Y1', '0')}), (${value(generator, block, 'X2', '100')}, ${value(generator, block, 'Y2', '100')}), ${value(generator, block, 'COLOR', '(0, 255, 0)')}, ${value(generator, block, 'THICKNESS', '2')})\n`;
  });
  define('cybercam_draw_circle', (block, generator) => {
    requireCv2(generator);
    return `cv2.circle(${value(generator, block, 'IMAGE')}, (${value(generator, block, 'X', '0')}, ${value(generator, block, 'Y', '0')}), ${value(generator, block, 'RADIUS', '5')}, ${value(generator, block, 'COLOR', '(0, 255, 0)')}, ${value(generator, block, 'THICKNESS', '2')})\n`;
  });
  define('cybercam_draw_line', (block, generator) => {
    requireCv2(generator);
    return `cv2.line(${value(generator, block, 'IMAGE')}, (${value(generator, block, 'X1', '0')}, ${value(generator, block, 'Y1', '0')}), (${value(generator, block, 'X2', '100')}, ${value(generator, block, 'Y2', '100')}), ${value(generator, block, 'COLOR', '(0, 255, 0)')}, ${value(generator, block, 'THICKNESS', '2')})\n`;
  });
  define('cybercam_draw_text', (block, generator) => {
    requireCv2(generator);
    return `cv2.putText(${value(generator, block, 'IMAGE')}, str(${value(generator, block, 'TEXT', "''")}), (${value(generator, block, 'X', '0')}, ${value(generator, block, 'Y', '30')}), cv2.FONT_HERSHEY_SIMPLEX, ${value(generator, block, 'SCALE', '1')}, ${value(generator, block, 'COLOR', '(0, 255, 0)')}, ${value(generator, block, 'THICKNESS', '2')})\n`;
  });
  define('cybercam_qr_decode', (block, generator) => {
    generator.addImport('pyzbar', 'from pyzbar.pyzbar import decode, ZBarSymbol');
    return output(`decode(${value(generator, block, 'IMAGE')}, symbols=[ZBarSymbol.QRCODE])`);
  });
  define('cybercam_barcode_decode', (block, generator) => {
    generator.addImport('pyzbar', 'from pyzbar.pyzbar import decode, ZBarSymbol');
    return output(`decode(${value(generator, block, 'IMAGE')})`);
  });
  define('cybercam_apriltag_init', (block, generator) => {
    const name = nameOf(block, 'tags');
    generator.addImport('pupil_apriltags', 'from pupil_apriltags import Detector');
    generator.addVariable(`apriltag_${name}`, `${name} = None`);
    return `${name} = Detector(families=${generator.quote_(field(block, 'FAMILY', 'tag36h11'))}, nthreads=1, quad_decimate=2, quad_sigma=0.0, refine_edges=0, decode_sharpening=0, debug=0)\n`;
  });
  define('cybercam_apriltag_detect', (block, generator) => output(`${nameOf(block, 'tags')}.detect(${value(generator, block, 'IMAGE')})`));

  // Confirmed walnutpi.kpu classes: FACE_DETECT, FACE_MASK, FALL_DETECT,
  // HAND_DETECT, HAND_KEYPOINT, HAND_KEYPOINT_CLS, LICENCE_DETECT, OCR,
  // PERSON_DETECT, PERSON_KEYPOINT, SMOKE_DETECT, TRAFFIC_LIGHT_DETECT,
  // YOLO11_CLS and YOLO11_DET.
  const addKpu = (generator) => generator.addImport('walnutpi_kpu', 'from walnutpi import kpu');
  define('cybercam_ai_init_simple', (block, generator) => {
    const name = nameOf(block, 'detector');
    const modelClass = field(block, 'MODEL', 'YOLO11_DET');
    addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.${modelClass}(${value(generator, block, 'MODEL_PATH', "'/data/model.kmodel'")}, ${value(generator, block, 'MODEL_SIZE', '640')})\n`;
  });
  define('cybercam_ai_init_face', (block, generator) => {
    const name = nameOf(block, 'detector'); addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.FACE_DETECT(${value(generator, block, 'MODEL_PATH')}, ${value(generator, block, 'ANCHORS_PATH')}, ${value(generator, block, 'MODEL_SIZE', '320')})\n`;
  });
  define('cybercam_ai_init_mask', (block, generator) => {
    const name = nameOf(block, 'detector'); addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.FACE_MASK(${value(generator, block, 'DETECT_MODEL')}, ${value(generator, block, 'ANCHORS_PATH')}, ${value(generator, block, 'MODEL_SIZE', '320')}, ${value(generator, block, 'MASK_MODEL')})\n`;
  });
  define('cybercam_ai_init_hand_keypoint', (block, generator) => {
    const name = nameOf(block, 'detector'); addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.${field(block, 'MODEL', 'HAND_KEYPOINT')}(hand_det_kmodel=${value(generator, block, 'DETECT_MODEL')}, hand_kp_kmodel=${value(generator, block, 'KEYPOINT_MODEL')})\n`;
  });
  define('cybercam_ai_init_ocr', (block, generator) => {
    const name = nameOf(block, 'ocr'); addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.OCR(${value(generator, block, 'DETECT_MODEL')}, ${value(generator, block, 'RECOGNITION_MODEL')}, ${value(generator, block, 'DICTIONARY')}, ${value(generator, block, 'DETECT_SIZE', '640')}, (${value(generator, block, 'RECOGNITION_WIDTH', '512')}, ${value(generator, block, 'RECOGNITION_HEIGHT', '32')}))\n`;
  });
  define('cybercam_ai_init_licence', (block, generator) => {
    const name = nameOf(block, 'licence'); addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.LICENCE_DETECT(${value(generator, block, 'DETECT_MODEL')}, ${value(generator, block, 'RECOGNITION_MODEL')}, ${value(generator, block, 'ANCHORS_PATH')}, ${value(generator, block, 'LABELS', '[]')}, ${value(generator, block, 'DETECT_SIZE', '640')}, (${value(generator, block, 'RECOGNITION_WIDTH', '220')}, ${value(generator, block, 'RECOGNITION_HEIGHT', '32')}))\n`;
  });
  define('cybercam_ai_run', (block, generator) => output(`${nameOf(block, 'detector')}.run(${value(generator, block, 'IMAGE')})`));
  define('cybercam_ai_run_confidence', (block, generator) => output(`${nameOf(block, 'detector')}.run(${value(generator, block, 'IMAGE')}, ${value(generator, block, 'CONFIDENCE', '0.6')})`));
  define('cybercam_ai_run_thresholds', (block, generator) => output(`${nameOf(block, 'detector')}.run(${value(generator, block, 'IMAGE')}, ${value(generator, block, 'CONFIDENCE', '0.5')}, ${value(generator, block, 'NMS', '0.45')})`));
  define('cybercam_result_length', (block, generator) => output(`len(${value(generator, block, 'RESULTS', '[]')})`));
  define('cybercam_result_item', (block, generator) => output(`${value(generator, block, 'RESULTS', '[]')}[${value(generator, block, 'INDEX', '0')}]`, ORDER_MEMBER));
  define('cybercam_result_property', (block, generator) => output(`${value(generator, block, 'RESULT')}.${field(block, 'PROPERTY', 'reliability')}`, ORDER_MEMBER));

  define('cybercam_socket_init', (block, generator) => {
    const name = nameOf(block, 'sock'); generator.addImport('socket', 'import socket');
    declareResource(generator, `socket_${name}`, name, 'close');
    return `${name} = socket.socket(socket.${field(block, 'FAMILY', 'AF_INET')}, socket.${field(block, 'TYPE', 'SOCK_STREAM')})\n`;
  });
  define('cybercam_socket_address', (block, generator) => {
    generator.addImport('socket', 'import socket');
    return output(`socket.getaddrinfo(${value(generator, block, 'HOST', "'localhost'")}, ${value(generator, block, 'PORT', '80')})[0][-1]`, ORDER_MEMBER);
  });
  define('cybercam_socket_connect', (block, generator) => `${nameOf(block, 'sock')}.connect(${value(generator, block, 'ADDRESS', "('localhost', 80)")})\n`);
  define('cybercam_socket_bind', (block, generator) => `${nameOf(block, 'sock')}.bind(${value(generator, block, 'ADDRESS', "('0.0.0.0', 8080)")})\n`);
  define('cybercam_socket_listen', (block, generator) => `${nameOf(block, 'sock')}.listen(${value(generator, block, 'BACKLOG', '1')})\n`);
  define('cybercam_socket_accept', (block) => output(`${nameOf(block, 'sock')}.accept()`));
  define('cybercam_socket_send', (block, generator) => `${nameOf(block, 'sock')}.send(${value(generator, block, 'DATA', "b''")})\n`);
  define('cybercam_socket_receive', (block, generator) => output(`${nameOf(block, 'sock')}.recv(${value(generator, block, 'SIZE', '1024')})`));
  define('cybercam_socket_close', (block) => `${nameOf(block, 'sock')}.close()\n`);

  define('cybercam_mqtt_init', (block, generator) => {
    const name = nameOf(block, 'client'); generator.addImport('mqtt', 'import paho.mqtt.client as mqtt');
    declareResource(generator, `mqtt_${name}`, name, 'disconnect');
    return `${name} = mqtt.Client()\n`;
  });
  define('cybercam_mqtt_connect', (block, generator) => `${nameOf(block, 'client')}.connect(${value(generator, block, 'HOST', "'localhost'")}, ${value(generator, block, 'PORT', '1883')}, ${value(generator, block, 'KEEPALIVE', '60')})\n`);
  define('cybercam_mqtt_publish', (block, generator) => `${nameOf(block, 'client')}.publish(${value(generator, block, 'TOPIC', "''")}, ${value(generator, block, 'MESSAGE', "''")})\n`);
  define('cybercam_mqtt_subscribe', (block, generator) => `${nameOf(block, 'client')}.subscribe(${value(generator, block, 'TOPIC', "''")})\n`);
  define('cybercam_mqtt_on_message', (block, generator) => {
    const client = nameOf(block, 'client');
    const rawTopic = field(block, 'TOPIC_NAME', 'topic');
    const rawPayload = field(block, 'PAYLOAD_NAME', 'payload');
    const usedNames = new Set();
    const topic = uniqueName(safeName(rawTopic, 'topic'), usedNames);
    const payload = uniqueName(safeName(rawPayload, 'payload'), usedNames);
    const callbackClient = uniqueName('client', usedNames);
    const callbackUserdata = uniqueName('userdata', usedNames);
    const callbackMessage = uniqueName('message', usedNames);
    const functionBase = `mqtt_on_message_${client}`;
    const body = withNameScope(
      generator,
      [[rawTopic, topic], [rawPayload, payload]],
      () => statement(generator, block, 'DO'),
    );
    const functionKey = uniqueFunctionKey(generator, functionBase);
    const handler = `_cybercam_${functionKey}`;
    const lines = [
      `def ${handler}(${callbackClient}, ${callbackUserdata}, ${callbackMessage}):`,
      `    ${topic} = ${callbackMessage}.topic`,
      `    ${payload} = ${callbackMessage}.payload`,
      ...(body ? body.split('\n').map((line) => `    ${line}`) : []),
    ];
    generator.addFunction(functionKey, `${lines.join('\n')}\n`);
    return `${client}.on_message = ${handler}\n`;
  });
  define('cybercam_mqtt_loop', (block) => `${nameOf(block, 'client')}.loop_forever()\n`);
  define('cybercam_mqtt_disconnect', (block) => `${nameOf(block, 'client')}.disconnect()\n`);

  define('cybercam_http_request', (block, generator) => {
    generator.addImport('requests', 'import requests');
    const method = field(block, 'METHOD', 'GET').toLowerCase();
    const url = value(generator, block, 'URL', "''");
    const data = value(generator, block, 'DATA', 'None');
    const suffix = method === 'get' ? `, params=${data}` : method === 'post' ? `, json=${data}` : method === 'put' ? `, data=${data}` : '';
    return output(`requests.${method}(${url}${suffix})`);
  });
  define('cybercam_http_response', (block, generator) => output(`${value(generator, block, 'RESPONSE', 'None')}.${field(block, 'PROPERTY', 'text')}`, ORDER_MEMBER));
  define('cybercam_http_server', (block, generator) => {
    generator.addImport('http_server', 'from http.server import HTTPServer, SimpleHTTPRequestHandler');
    return `HTTPServer((${value(generator, block, 'HOST', "'0.0.0.0'")}, ${value(generator, block, 'PORT', '8080')}), SimpleHTTPRequestHandler).serve_forever()\n`;
  });

  const addFileHelpers = (generator) => {
    generator.addFunction('cybercam_file_helpers', "def _cybercam_read_text(path):\n    with open(path, 'r', encoding='utf-8') as file:\n        return file.read()\n\ndef _cybercam_write_text(path, content, mode='w'):\n    with open(path, mode, encoding='utf-8') as file:\n        return file.write(str(content))");
  };
  define('cybercam_file_read', (block, generator) => { addFileHelpers(generator); return output(`_cybercam_read_text(${value(generator, block, 'PATH', "'/data/file.txt'")})`); });
  define('cybercam_file_write', (block, generator) => { addFileHelpers(generator); return `_cybercam_write_text(${value(generator, block, 'PATH', "'/data/file.txt'")}, ${value(generator, block, 'CONTENT', "''")}, ${generator.quote_(field(block, 'MODE', 'w'))})\n`; });
  define('cybercam_file_exists', (block, generator) => { generator.addImport('os', 'import os'); return output(`os.path.exists(${value(generator, block, 'PATH', "'/data'")})`); });
  define('cybercam_file_list', (block, generator) => { generator.addImport('os', 'import os'); return output(`os.listdir(${value(generator, block, 'PATH', "'/data'")})`); });
  define('cybercam_command', (block, generator) => { generator.addImport('os', 'import os'); return output(`os.popen(str(${value(generator, block, 'COMMAND', "''")})).read()`); });

  const addAudioHelpers = (generator) => {
    generator.addImport('os', 'import os'); generator.addImport('shlex', 'import shlex');
    generator.addFunction('cybercam_audio_helpers', "def _cybercam_play_audio(path):\n    return os.popen('aplay -D plughw:K230I2SINNO ' + shlex.quote(str(path))).read()\n\ndef _cybercam_record_audio(path, seconds=5, rate=16000):\n    command = 'arecord -D plughw:0,0 -f S16_LE -r {} -d {} -t wav {}'.format(int(rate), int(seconds), shlex.quote(str(path)))\n    return os.popen(command).read()");
  };
  define('cybercam_audio_play', (block, generator) => { addAudioHelpers(generator); return `_cybercam_play_audio(${value(generator, block, 'PATH', "'/data/audio.wav'")})\n`; });
  define('cybercam_audio_record', (block, generator) => { addAudioHelpers(generator); return `_cybercam_record_audio(${value(generator, block, 'PATH', "'/data/record.wav'")}, ${value(generator, block, 'SECONDS', '5')}, ${value(generator, block, 'RATE', '16000')})\n`; });

  const addImuDriver = (generator) => {
    generator.addImport('fcntl', 'import fcntl'); generator.addImport('os', 'import os');
    generator.addImport('struct', 'import struct'); generator.addImport('time', 'import time');
    generator.addFunction('cybercam_qmi8658', [
      'class _CyberCamQMI8658:',
      '    I2C_SLAVE = 0x0703',
      '    def __init__(self, bus=1, address=0x6a):',
      '        self.address = address',
      '        self.fd = None',
      '        try:',
      "            self.fd = os.open('/dev/i2c-{}'.format(bus), os.O_RDWR)",
      '            fcntl.ioctl(self.fd, self.I2C_SLAVE, address)',
      "            if self._read(0x00, 1) != b'\\x05':",
      "                raise OSError('QMI8658A WHO_AM_I mismatch')",
      '            for register, data in ((0x02, 0x60), (0x03, 0x23), (0x04, 0x43), (0x08, 0x03)):',
      '                self._write(register, data)',
      '            self.bias = (0.0, 0.0, 0.0)',
      '            time.sleep(0.05)',
      '        except:',
      '            self.close()',
      '            raise',
      '    def _select(self):',
      '        if self.fd is None:',
      "            raise OSError('QMI8658A is closed')",
      '        fcntl.ioctl(self.fd, self.I2C_SLAVE, self.address)',
      '    def _write(self, register, data):',
      '        self._select()',
      '        os.write(self.fd, bytes((register & 255, data & 255)))',
      '    def _read(self, register, size):',
      '        self._select()',
      '        os.write(self.fd, bytes((register & 255,)))',
      '        data = os.read(self.fd, size)',
      '        if len(data) != size:',
      "            raise OSError('QMI8658A short read')",
      '        return data',
      '    def read(self):',
      '        raw = self._read(0x35, 12)',
      "        values = struct.unpack('<hhhhhh', raw)",
      '        accel = tuple(item / 4096.0 for item in values[:3])',
      '        gyro = tuple(values[index + 3] / 64.0 - self.bias[index] for index in range(3))',
      '        return accel + gyro',
      '    def calibrate(self, samples=100):',
      '        sums = [0.0, 0.0, 0.0]',
      '        for _ in range(int(samples)):',
      '            values = self.read()[3:]',
      '            sums = [sums[i] + values[i] for i in range(3)]',
      '            time.sleep(0.005)',
      '        self.bias = tuple(value / int(samples) for value in sums)',
      '    def close(self):',
      '        if self.fd is not None:',
      '            os.close(self.fd)',
      '            self.fd = None',
      '',
      'def _cybercam_open_imu(bus=1, address=0x6a):',
      '    return _CyberCamQMI8658(bus, address)',
    ].join('\n'));
  };
  define('cybercam_imu_init', (block, generator) => {
    const name = nameOf(block, 'imu'); addImuDriver(generator);
    declareResource(generator, `imu_${name}`, name, 'close');
    return `${name} = _cybercam_open_imu(${value(generator, block, 'BUS', '1')}, ${value(generator, block, 'ADDRESS', '0x6a')})\n`;
  });
  define('cybercam_imu_read', (block) => output(`${nameOf(block, 'imu')}.read()`));
  define('cybercam_imu_axis', (block) => output(`${nameOf(block, 'imu')}.read()[${field(block, 'AXIS', '0')}]`, ORDER_MEMBER));
  define('cybercam_imu_calibrate', (block, generator) => `${nameOf(block, 'imu')}.calibrate(${value(generator, block, 'SAMPLES', '100')})\n`);
  define('cybercam_imu_close', (block) => `${nameOf(block, 'imu')}.close()\n`);
  define('cybercam_cpu_temperature', (_block, generator) => { generator.addImport('os', 'import os'); return output("int(os.popen('cat /sys/class/thermal/thermal_zone0/temp').read()) / 1000", ORDER_NONE); });
  define('cybercam_chip_id', (_block, generator) => { generator.addImport('os', 'import os'); return output("os.popen('cat /sys/class/chip_id/chip_id').read().strip()", ORDER_CALL); });
})(typeof Python !== 'undefined' ? Python : (typeof MPY !== 'undefined' ? MPY : MicropPython));
