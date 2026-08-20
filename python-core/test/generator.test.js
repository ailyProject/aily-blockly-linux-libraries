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

test('startup and language primitives use portable CPython', () => {
  const py = loadGenerator();
  py.forBlock.python_start(block({}, {}, { DO: '    print("ready")\n    print("again")\n' }), py);
  assert.equal(py.codeDict.setups.python_start, 'print("ready")\nprint("again")');
  assert.deepEqual(Array.from(py.forBlock.python_number(block({ VALUE: '42' }), py)), ['42', py.ORDER_ATOMIC]);
  assert.deepEqual(Array.from(py.forBlock.python_text(block({ VALUE: "Cyber'CAM" }), py)), ["\"Cyber'CAM\"", py.ORDER_ATOMIC]);
  assert.equal(py.forBlock.python_set_variable(block({ NAME: 'frame' }, { VALUE: 'image' }), py), 'frame = image\n');
  assert.equal(
    py.forBlock.python_if(block({}, { CONDITION: 'ready' }, { DO: '    print(frame)\n    print("done")\n' }), py),
    'if ready:\n    print(frame)\n    print("done")\n',
  );
});

test('Python identifiers are sanitized away from reserved words', () => {
  const py = loadGenerator();
  assert.equal(py.forBlock.python_set_variable(block({ NAME: 'class' }, { VALUE: '1' }), py), 'class_ = 1\n');
  assert.deepEqual(Array.from(py.forBlock.python_get_variable(block({ NAME: 'for' }), py)), ['for_', py.ORDER_ATOMIC]);
});

test('OpenCV and code readers emit documented imports', () => {
  const py = loadGenerator();
  const resize = py.forBlock.python_image_resize(block({}, { IMAGE: 'img', WIDTH: '320', HEIGHT: '240' }), py);
  const qr = py.forBlock.python_qr_decode(block({}, { IMAGE: 'img' }), py);
  const april = py.forBlock.python_apriltag_init(block({ NAME: 'tags', FAMILY: 'tag36h11' }), py);

  assert.deepEqual(Array.from(resize), ['cv2.resize(img, (320, 240))', py.ORDER_FUNCTION_CALL]);
  assert.equal(py.codeDict.imports.cv2, 'import cv2');
  assert.deepEqual(Array.from(qr), ['decode(img, symbols=[ZBarSymbol.QRCODE])', py.ORDER_FUNCTION_CALL]);
  assert.equal(py.codeDict.imports.pyzbar, 'from pyzbar.pyzbar import decode, ZBarSymbol');
  assert.match(april, /Detector\(families="tag36h11"/);
  assert.equal(py.codeDict.imports.pupil_apriltags, 'from pupil_apriltags import Detector');
});

test('MQTT message handlers are top-level, indented, sanitized and unique per client', () => {
  const py = loadGenerator();
  const first = py.forBlock.python_mqtt_on_message(block(
    { NAME: 'sensor-client', TOPIC_NAME: 'class', PAYLOAD_NAME: 'payload value' },
    {},
    { DO: '    if payload_value:\n        print(payload_value)\n    print(class_)\n' },
  ), py);
  const second = py.forBlock.python_mqtt_on_message(block(
    { NAME: 'display.client', TOPIC_NAME: 'topic-name', PAYLOAD_NAME: '2payload' },
    {},
    { DO: '    print(topic_name)\n' },
  ), py);

  assert.equal(first, 'sensor_client.on_message = _python_mqtt_on_message_sensor_client\n');
  assert.equal(second, 'display_client.on_message = _python_mqtt_on_message_display_client\n');
  assert.equal(
    py.codeDict.functions.mqtt_on_message_sensor_client,
    'def _python_mqtt_on_message_sensor_client(client, userdata, message):\n'
      + '    class_ = message.topic\n'
      + '    payload_value = message.payload\n'
      + '    if payload_value:\n'
      + '        print(payload_value)\n'
      + '    print(class_)\n',
  );

  const source = `${Object.values(py.codeDict.functions).join('\n\n')}\n${first}${second}`;
  const parsed = spawnSync('python', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], { input: source, encoding: 'utf8' });
  assert.equal(parsed.status, 0, parsed.stderr || source);
});

test('network, files and CPU temperature stay on stdlib or common CPython packages', () => {
  const py = loadGenerator();
  const mqtt = py.forBlock.python_mqtt_init(block({ NAME: 'client' }), py);
  const request = py.forBlock.python_http_request(block({ METHOD: 'POST' }, { URL: "'https://example.test'", DATA: "{'ok': True}" }), py);
  const command = py.forBlock.python_command(block({}, { COMMAND: "'uname -a'" }), py);
  const temp = py.forBlock.python_cpu_temperature(block(), py);

  assert.equal(py.codeDict.imports.mqtt, 'import paho.mqtt.client as mqtt');
  assert.equal(mqtt, 'client = mqtt.Client()\n');
  assert.deepEqual(Array.from(request), ["requests.post('https://example.test', json={'ok': True})", py.ORDER_FUNCTION_CALL]);
  assert.deepEqual(Array.from(command), ["os.popen(str('uname -a')).read()", py.ORDER_FUNCTION_CALL]);
  assert.deepEqual(Array.from(temp), ["int(os.popen('cat /sys/class/thermal/thermal_zone0/temp').read()) / 1000", py.ORDER_NONE]);
  assert.doesNotMatch(JSON.stringify(py.codeDict), /walnutpi|digitalio|periphery|kpu|gpiozero/);
});
