const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');

function loadGenerator() {
  const codeDict = { imports: {}, variables: {}, functions: {}, setups: {}, loops: {}, cleanups: {} };
  const Python = {
    forBlock: {}, ORDER_ATOMIC: 0, ORDER_MEMBER: 2.1, ORDER_FUNCTION_CALL: 2.2, ORDER_NONE: 99,
    INDENT: '    ',
    codeDict,
    addImport(tag, code) { codeDict.imports[tag] ??= code; },
    addVariable(tag, code) { codeDict.variables[tag] ??= code; },
    addFunction(tag, code) { codeDict.functions[tag] ??= code; },
    addSetup(tag, code) { codeDict.setups[tag] ??= code; },
    addLoop(tag, code) { codeDict.loops[tag] ??= code; },
    addCleanup(tag, code) { codeDict.cleanups[tag] ??= code; },
    valueToCode(block, name) { return block.values?.[name] || ''; },
    statementToCode(block, name) { return block.statements?.[name] || ''; },
    quote_(value) { return JSON.stringify(String(value)); },
  };
  const context = vm.createContext({ Python, MPY: Python, MicropPython: Python, console });
  vm.runInContext(fs.readFileSync(path.resolve(__dirname, '..', 'generator.js'), 'utf8'), context);
  return Python;
}

function block(fields = {}, values = {}, statements = {}) {
  return { getFieldValue: (name) => fields[name], fields, values, statements };
}

test('startup, GPIO and camera generators use the official CyberCAM APIs', () => {
  const py = loadGenerator();
  py.forBlock.cybercam_start(block({}, {}, { DO: '    print("ready")\n    print("again")\n' }), py);
  const gpio = py.forBlock.cybercam_gpio_init(block({ NAME: 'led', PIN: '52', DIRECTION: 'OUTPUT', PULL: 'NONE' }), py);
  const camera = py.forBlock.cybercam_camera_init(block({ NAME: 'cam', SENSOR_ID: '2' }, { WIDTH: '640', HEIGHT: '480' }), py);

  assert.equal(py.codeDict.setups.cybercam_start, 'print("ready")\nprint("again")');
  assert.equal(py.codeDict.imports.digitalio, 'from digitalio import DigitalInOut, Direction, Pull');
  assert.equal(py.codeDict.variables.gpio_led, 'led = None');
  assert.equal(gpio, 'led = DigitalInOut(board.LED)\nled.direction = Direction.OUTPUT\n');
  assert.match(py.codeDict.cleanups.gpio_led, /deinit/);
  assert.equal(py.codeDict.imports.walnutpi_sensor, 'from walnutpi import Sensor');
  assert.equal(py.codeDict.variables.camera_cam, 'cam = None');
  assert.equal(camera, 'cam = Sensor.Sensor(640, 480, id=2)\n');
  assert.match(py.codeDict.cleanups.camera_cam, /release/);
});

test('self-contained Python primitives replace Arduino-only core dependencies', () => {
  const py = loadGenerator();
  assert.deepEqual(Array.from(py.forBlock.cybercam_number(block({ VALUE: '42' }), py)), ['42', py.ORDER_ATOMIC]);
  assert.deepEqual(Array.from(py.forBlock.cybercam_text(block({ VALUE: "Cyber'CAM" }), py)), ["\"Cyber'CAM\"", py.ORDER_ATOMIC]);
  assert.deepEqual(Array.from(py.forBlock.cybercam_tuple(block({}, { ITEMS: 'frame' }), py)), ['(frame,)', py.ORDER_ATOMIC]);
  assert.equal(py.forBlock.cybercam_set_variable(block({ NAME: 'frame' }, { VALUE: 'cam.read()[1]' }), py), 'frame = cam.read()[1]\n');
  assert.equal(
    py.forBlock.cybercam_if(block({}, { CONDITION: 'ready' }, { DO: '    print(frame)\n    print("done")\n' }), py),
    'if ready:\n    print(frame)\n    print("done")\n',
  );
  assert.equal(
    py.forBlock.cybercam_for_each(block({ NAME: 'result' }, { ITEMS: 'results' }, { DO: '    print(result)\n    print(result.label)\n' }), py),
    'for result in results:\n    print(result)\n    print(result.label)\n',
  );
});

test('Python identifiers are sanitized away from reserved words', () => {
  const py = loadGenerator();
  assert.equal(py.forBlock.cybercam_set_variable(block({ NAME: 'class' }, { VALUE: '1' }), py), 'class_ = 1\n');
  assert.deepEqual(Array.from(py.forBlock.cybercam_get_variable(block({ NAME: 'for' }), py)), ['for_', py.ORDER_ATOMIC]);
});

test('explicit GPIO, UART and IMU lifecycle blocks close sanitized resources', () => {
  const py = loadGenerator();

  assert.equal(py.forBlock.cybercam_gpio_deinit(block({ NAME: 'status pin' }), py), 'status_pin.deinit()\n');
  assert.equal(py.forBlock.cybercam_uart_close(block({ NAME: 'class' }), py), 'class_.close()\n');
  assert.equal(py.forBlock.cybercam_imu_close(block({ NAME: '9-axis' }), py), '_9_axis.close()\n');
});

test('MQTT message handlers are top-level, indented, sanitized and unique per client', () => {
  const py = loadGenerator();
  const first = py.forBlock.cybercam_mqtt_on_message(block(
    { NAME: 'sensor-client', TOPIC_NAME: 'class', PAYLOAD_NAME: 'payload value' },
    {},
    { DO: '    if payload_value:\n        print(payload_value)\n    print(class_)\n' },
  ), py);
  const second = py.forBlock.cybercam_mqtt_on_message(block(
    { NAME: 'display.client', TOPIC_NAME: 'topic-name', PAYLOAD_NAME: '2payload' },
    {},
    { DO: '    print(topic_name)\n' },
  ), py);

  assert.equal(first, 'sensor_client.on_message = _cybercam_mqtt_on_message_sensor_client\n');
  assert.equal(second, 'display_client.on_message = _cybercam_mqtt_on_message_display_client\n');
  assert.equal(
    py.codeDict.functions.mqtt_on_message_sensor_client,
    'def _cybercam_mqtt_on_message_sensor_client(client, userdata, message):\n'
      + '    class_ = message.topic\n'
      + '    payload_value = message.payload\n'
      + '    if payload_value:\n'
      + '        print(payload_value)\n'
      + '    print(class_)\n',
  );
  assert.equal(
    py.codeDict.functions.mqtt_on_message_display_client,
    'def _cybercam_mqtt_on_message_display_client(client, userdata, message):\n'
      + '    topic_name = message.topic\n'
      + '    _2payload = message.payload\n'
      + '    print(topic_name)\n',
  );

  const source = `${Object.values(py.codeDict.functions).join('\n\n')}\n${first}${second}`;
  const parsed = spawnSync('python', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: source, encoding: 'utf8' });
  assert.equal(parsed.status, 0, parsed.stderr || source);
});

test('MQTT message handler locals do not collide with callback parameters or each other', () => {
  const cases = [
    {
      fields: { NAME: 'client', TOPIC_NAME: 'client', PAYLOAD_NAME: 'userdata' },
      expectedTopic: 'client',
      expectedPayload: 'userdata',
    },
    {
      fields: { NAME: 'client', TOPIC_NAME: 'message', PAYLOAD_NAME: 'message' },
      expectedTopic: 'message',
    },
  ];

  for (const { fields, expectedTopic, expectedPayload } of cases) {
    const py = loadGenerator();
    py.forBlock.cybercam_mqtt_on_message(block(fields), py);
    const source = Object.values(py.codeDict.functions)[0];
    const lines = source.trimEnd().split('\n');
    const signature = /^def \w+\((\w+), (\w+), (\w+)\):$/.exec(lines[0]);
    const topicAssignment = /^(\w+) = (\w+)\.topic$/.exec(lines[1].trim());
    const payloadAssignment = /^(\w+) = (\w+)\.payload$/.exec(lines[2].trim());

    assert.ok(signature, source);
    assert.ok(topicAssignment, source);
    assert.ok(payloadAssignment, source);
    const callbackNames = signature.slice(1);
    const topicName = topicAssignment[1];
    const payloadName = payloadAssignment[1];
    assert.equal(topicName, expectedTopic);
    if (expectedPayload) assert.equal(payloadName, expectedPayload);
    assert.equal(new Set([...callbackNames, topicName, payloadName]).size, 5, source);
    assert.equal(topicAssignment[2], callbackNames[2], source);
    assert.equal(payloadAssignment[2], callbackNames[2], source);

    const parsed = spawnSync('python', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: source, encoding: 'utf8' });
    assert.equal(parsed.status, 0, parsed.stderr || source);
  }
});

test('multiple MQTT message handlers for one client keep every function body', () => {
  const py = loadGenerator();
  const first = py.forBlock.cybercam_mqtt_on_message(block(
    { NAME: 'client', TOPIC_NAME: 'first_topic', PAYLOAD_NAME: 'first_payload' },
    {},
    { DO: '    print("first")\n' },
  ), py);
  const second = py.forBlock.cybercam_mqtt_on_message(block(
    { NAME: 'client', TOPIC_NAME: 'second_topic', PAYLOAD_NAME: 'second_payload' },
    {},
    { DO: '    print("second")\n' },
  ), py);
  const functions = Object.values(py.codeDict.functions);
  const firstHandler = /= (\w+)\n$/.exec(first)?.[1];
  const secondHandler = /= (\w+)\n$/.exec(second)?.[1];

  assert.equal(functions.length, 2, JSON.stringify(py.codeDict.functions, null, 2));
  assert.ok(firstHandler, first);
  assert.ok(secondHandler, second);
  assert.notEqual(firstHandler, secondHandler);
  assert.ok(functions.some((source) => source.startsWith(`def ${firstHandler}(`) && source.includes('print("first")')), functions.join('\n'));
  assert.ok(functions.some((source) => source.startsWith(`def ${secondHandler}(`) && source.includes('print("second")')), functions.join('\n'));

  const source = `${functions.join('\n\n')}\n${first}${second}`;
  const parsed = spawnSync('python', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: source, encoding: 'utf8' });
  assert.equal(parsed.status, 0, parsed.stderr || source);
});

test('MQTT handler chooses its function key after generating a body that adds functions', () => {
  const py = loadGenerator();
  py.statementToCode = () => {
    py.addFunction(
      'mqtt_on_message_client',
      'def _cybercam_mqtt_on_message_client():\n    return "occupied"\n',
    );
    return '    print("outer")\n';
  };

  const assignment = py.forBlock.cybercam_mqtt_on_message(block(
    { NAME: 'client', TOPIC_NAME: 'topic', PAYLOAD_NAME: 'payload' },
  ), py);

  assert.equal(assignment, 'client.on_message = _cybercam_mqtt_on_message_client_2\n');
  assert.match(py.codeDict.functions.mqtt_on_message_client, /return "occupied"/);
  assert.match(py.codeDict.functions.mqtt_on_message_client_2, /print\("outer"\)/);
});

test('nested MQTT handlers for one client retain both deterministic function bodies', () => {
  const py = loadGenerator();
  let nested = false;
  py.statementToCode = () => {
    if (nested) return '    print("inner")\n';
    nested = true;
    const innerAssignment = py.forBlock.cybercam_mqtt_on_message(block(
      { NAME: 'client', TOPIC_NAME: 'inner_topic', PAYLOAD_NAME: 'inner_payload' },
    ), py);
    return `    ${innerAssignment}    print("outer")\n`;
  };

  const outerAssignment = py.forBlock.cybercam_mqtt_on_message(block(
    { NAME: 'client', TOPIC_NAME: 'outer_topic', PAYLOAD_NAME: 'outer_payload' },
  ), py);

  assert.equal(outerAssignment, 'client.on_message = _cybercam_mqtt_on_message_client_2\n');
  assert.match(py.codeDict.functions.mqtt_on_message_client, /print\("inner"\)/);
  assert.match(py.codeDict.functions.mqtt_on_message_client_2, /print\("outer"\)/);
});

test('MQTT body variable reads use the allocated callback-local aliases', () => {
  const py = loadGenerator();
  py.statementToCode = () => {
    const topic = py.forBlock.cybercam_get_variable(block({ NAME: 'topic-name' }), py)[0];
    const payload = py.forBlock.cybercam_get_variable(block({ NAME: 'topic name' }), py)[0];
    return `    print(${topic})\n    print(${payload})\n`;
  };

  py.forBlock.cybercam_mqtt_on_message(block(
    { NAME: 'client', TOPIC_NAME: 'topic-name', PAYLOAD_NAME: 'topic name' },
  ), py);

  assert.equal(
    py.codeDict.functions.mqtt_on_message_client,
    'def _cybercam_mqtt_on_message_client(client, userdata, message):\n'
      + '    topic_name = message.topic\n'
      + '    topic_name_2 = message.payload\n'
      + '    print(topic_name)\n'
      + '    print(topic_name_2)\n',
  );
});

test('vision and every KPU constructor emit documented imports and calls', () => {
  const py = loadGenerator();
  const simple = py.forBlock.cybercam_ai_init_simple(block(
    { NAME: 'det', MODEL: 'YOLO11_DET' },
    { MODEL_PATH: "'/data/model.kmodel'", MODEL_SIZE: '640' },
  ), py);
  const qr = py.forBlock.cybercam_qr_decode(block({}, { IMAGE: 'img' }), py);
  const april = py.forBlock.cybercam_apriltag_init(block({ NAME: 'tags', FAMILY: 'tag36h11' }), py);

  assert.equal(simple, "det = kpu.YOLO11_DET('/data/model.kmodel', 640)\n");
  assert.equal(py.codeDict.variables.ai_det, 'det = None');
  assert.equal(py.codeDict.imports.walnutpi_kpu, 'from walnutpi import kpu');
  assert.deepEqual(Array.from(qr), ['decode(img, symbols=[ZBarSymbol.QRCODE])', py.ORDER_FUNCTION_CALL]);
  assert.equal(py.codeDict.imports.pyzbar, 'from pyzbar.pyzbar import decode, ZBarSymbol');
  assert.equal(
    april,
    'tags = Detector(families="tag36h11", nthreads=1, quad_decimate=2, quad_sigma=0.0, refine_edges=0, decode_sharpening=0, debug=0)\n',
  );
  assert.equal(py.codeDict.variables.apriltag_tags, 'tags = None');
  assert.deepEqual(Array.from(py.forBlock.cybercam_result_property(block({ PROPERTY: 'reliability' }, { RESULT: 'results[0]' }), py)), ['results[0].reliability', py.ORDER_MEMBER]);
});

test('network, audio, IMU and device utility generators remain parameterized', () => {
  const py = loadGenerator();
  const mqtt = py.forBlock.cybercam_mqtt_init(block({ NAME: 'client' }), py);
  const request = py.forBlock.cybercam_http_request(block({ METHOD: 'POST' }, { URL: "'https://example.test'", DATA: "{'ok': True}" }), py);
  const command = py.forBlock.cybercam_command(block({}, { COMMAND: "'uname -a'" }), py);
  const imu = py.forBlock.cybercam_imu_init(block({ NAME: 'imu' }, { BUS: '1', ADDRESS: '0x6a' }), py);
  const temp = py.forBlock.cybercam_cpu_temperature(block(), py);

  assert.equal(py.codeDict.imports.mqtt, 'import paho.mqtt.client as mqtt');
  assert.equal(py.codeDict.variables.mqtt_client, 'client = None');
  assert.equal(mqtt, 'client = mqtt.Client()\n');
  assert.deepEqual(Array.from(request), ["requests.post('https://example.test', json={'ok': True})", py.ORDER_FUNCTION_CALL]);
  assert.deepEqual(Array.from(command), ["os.popen(str('uname -a')).read()", py.ORDER_FUNCTION_CALL]);
  assert.match(py.codeDict.functions.cybercam_qmi8658, /class _CyberCamQMI8658/);
  assert.equal(py.codeDict.variables.imu_imu, 'imu = None');
  assert.equal(imu, 'imu = _cybercam_open_imu(1, 0x6a)\n');
  assert.match(py.codeDict.functions.cybercam_qmi8658, /def close\(self\):/);
  assert.match(py.codeDict.functions.cybercam_qmi8658, /short read/);
  assert.match(py.codeDict.functions.cybercam_qmi8658, /except:/);
  assert.match(py.codeDict.functions.cybercam_qmi8658, /self\.close\(\)/);
  assert.match(py.codeDict.cleanups.imu_imu, /close/);
  assert.deepEqual(Array.from(temp), ["int(os.popen('cat /sys/class/thermal/thermal_zone0/temp').read()) / 1000", py.ORDER_NONE]);
});

test('image, AI result, socket, MQTT and HTTP lifecycle generators emit executable Python', () => {
  const py = loadGenerator();
  const loaded = py.forBlock.cybercam_image_load(block({}, { PATH: "'/data/input.jpg'" }), py);
  const saved = py.forBlock.cybercam_image_save(block({}, { IMAGE: 'frame', PATH: "'/data/output.jpg'" }), py);
  const item = py.forBlock.cybercam_result_item(block({}, { RESULTS: 'detections', INDEX: '2' }), py);
  const property = py.forBlock.cybercam_result_property(block({ PROPERTY: 'json()' }, { RESULT: 'response' }), py);
  const socketInit = py.forBlock.cybercam_socket_init(block({ NAME: 'server', FAMILY: 'AF_INET', TYPE: 'SOCK_STREAM' }), py);
  const bind = py.forBlock.cybercam_socket_bind(block({ NAME: 'server' }, { ADDRESS: "('0.0.0.0', 8080)" }), py);
  const listen = py.forBlock.cybercam_socket_listen(block({ NAME: 'server' }, { BACKLOG: '5' }), py);
  const accept = py.forBlock.cybercam_socket_accept(block({ NAME: 'server' }), py);
  const close = py.forBlock.cybercam_socket_close(block({ NAME: 'server' }), py);
  const disconnect = py.forBlock.cybercam_mqtt_disconnect(block({ NAME: 'client' }), py);
  const http = py.forBlock.cybercam_http_server(block({}, { HOST: "'0.0.0.0'", PORT: '8000' }), py);

  assert.deepEqual(Array.from(loaded), ["cv2.imread('/data/input.jpg')", py.ORDER_FUNCTION_CALL]);
  assert.equal(saved, "cv2.imwrite('/data/output.jpg', frame)\n");
  assert.deepEqual(Array.from(item), ['detections[2]', py.ORDER_MEMBER]);
  assert.deepEqual(Array.from(property), ['response.json()', py.ORDER_MEMBER]);
  assert.equal(py.codeDict.variables.socket_server, 'server = None');
  assert.equal(socketInit, 'server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n');
  assert.equal(bind, "server.bind(('0.0.0.0', 8080))\n");
  assert.equal(listen, 'server.listen(5)\n');
  assert.deepEqual(Array.from(accept), ['server.accept()', py.ORDER_FUNCTION_CALL]);
  assert.equal(close, 'server.close()\n');
  assert.equal(disconnect, 'client.disconnect()\n');
  assert.equal(http, "HTTPServer(('0.0.0.0', 8000), SimpleHTTPRequestHandler).serve_forever()\n");
});

test('every declared block has a generator and the combined Python is syntactically valid', () => {
  const py = loadGenerator();
  const definitions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'block.json'), 'utf8'));
  const body = [];
  for (const definition of definitions) {
    assert.equal(typeof py.forBlock[definition.type], 'function', `missing generator ${definition.type}`);
    const generated = py.forBlock[definition.type](block(), py);
    if (Array.isArray(generated)) body.push(generated[0]);
    else if (typeof generated === 'string' && generated.trim()) body.push(generated.trimEnd());
  }
  const sections = [
    Object.values(py.codeDict.imports).join('\n'),
    Object.values(py.codeDict.variables).join('\n'),
    Object.values(py.codeDict.functions).join('\n\n'),
    Object.values(py.codeDict.setups).join('\n'),
    'while True:\n' + (body.length ? body.join('\n').split('\n').map((line) => `    ${line}`).join('\n') : '    pass'),
  ];
  const source = sections.filter(Boolean).join('\n\n') + '\n';
  const parsed = spawnSync('python', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: source, encoding: 'utf8' });
  assert.equal(parsed.status, 0, parsed.stderr || source);
});

test('side-effecting initializers remain in statement order and inside conditions', () => {
  const py = loadGenerator();
  const camera = py.forBlock.cybercam_camera_init(block({ NAME: 'cam', SENSOR_ID: '2' }, { WIDTH: '640', HEIGHT: '480' }), py);
  const detector = py.forBlock.cybercam_ai_init_simple(block(
    { NAME: 'detector', MODEL: 'YOLO11_DET' },
    { MODEL_PATH: "'/data/model.kmodel'", MODEL_SIZE: '640' },
  ), py);
  const conditional = py.forBlock.cybercam_if(block(
    {},
    { CONDITION: 'enabled' },
    { DO: `    ${camera}    ${detector}` },
  ), py);

  assert.equal(
    conditional,
    "if enabled:\n    cam = Sensor.Sensor(640, 480, id=2)\n    detector = kpu.YOLO11_DET('/data/model.kmodel', 640)\n",
  );
  assert.equal(py.codeDict.variables.camera_cam, 'cam = None');
  assert.equal(py.codeDict.variables.ai_detector, 'detector = None');
});

test('all 14 KPU classes produce their documented constructor form', () => {
  const simpleClasses = [
    'FALL_DETECT', 'HAND_DETECT', 'PERSON_DETECT', 'PERSON_KEYPOINT',
    'SMOKE_DETECT', 'TRAFFIC_LIGHT_DETECT', 'YOLO11_CLS', 'YOLO11_DET',
  ];
  for (const model of simpleClasses) {
    const py = loadGenerator();
    assert.equal(
      py.forBlock.cybercam_ai_init_simple(block(
        { NAME: 'detector', MODEL: model },
        { MODEL_PATH: "'/data/model.kmodel'", MODEL_SIZE: '640' },
      ), py),
      `detector = kpu.${model}('/data/model.kmodel', 640)\n`,
    );
  }

  const cases = [
    ['cybercam_ai_init_face', { NAME: 'detector' }, { MODEL_PATH: "'face.kmodel'", ANCHORS_PATH: "'anchors.bin'", MODEL_SIZE: '320' }, "detector = kpu.FACE_DETECT('face.kmodel', 'anchors.bin', 320)\n"],
    ['cybercam_ai_init_mask', { NAME: 'detector' }, { DETECT_MODEL: "'face.kmodel'", ANCHORS_PATH: "'anchors.bin'", MODEL_SIZE: '320', MASK_MODEL: "'mask.kmodel'" }, "detector = kpu.FACE_MASK('face.kmodel', 'anchors.bin', 320, 'mask.kmodel')\n"],
    ['cybercam_ai_init_hand_keypoint', { NAME: 'detector', MODEL: 'HAND_KEYPOINT' }, { DETECT_MODEL: "'hand.kmodel'", KEYPOINT_MODEL: "'kp.kmodel'" }, "detector = kpu.HAND_KEYPOINT(hand_det_kmodel='hand.kmodel', hand_kp_kmodel='kp.kmodel')\n"],
    ['cybercam_ai_init_hand_keypoint', { NAME: 'detector', MODEL: 'HAND_KEYPOINT_CLS' }, { DETECT_MODEL: "'hand.kmodel'", KEYPOINT_MODEL: "'cls.kmodel'" }, "detector = kpu.HAND_KEYPOINT_CLS(hand_det_kmodel='hand.kmodel', hand_kp_kmodel='cls.kmodel')\n"],
    ['cybercam_ai_init_ocr', { NAME: 'detector' }, { DETECT_MODEL: "'det.kmodel'", RECOGNITION_MODEL: "'rec.kmodel'", DICTIONARY: "'dict.txt'", DETECT_SIZE: '640', RECOGNITION_WIDTH: '512', RECOGNITION_HEIGHT: '32' }, "detector = kpu.OCR('det.kmodel', 'rec.kmodel', 'dict.txt', 640, (512, 32))\n"],
    ['cybercam_ai_init_licence', { NAME: 'detector' }, { DETECT_MODEL: "'det.kmodel'", RECOGNITION_MODEL: "'rec.kmodel'", ANCHORS_PATH: "'anchors.bin'", LABELS: "['A']", DETECT_SIZE: '640', RECOGNITION_WIDTH: '220', RECOGNITION_HEIGHT: '32' }, "detector = kpu.LICENCE_DETECT('det.kmodel', 'rec.kmodel', 'anchors.bin', ['A'], 640, (220, 32))\n"],
  ];
  for (const [type, fields, values, expected] of cases) {
    const py = loadGenerator();
    assert.equal(py.forBlock[type](block(fields, values), py), expected);
  }
});
