const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
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

test('GPIO, PWM and LED use gpiozero rather than board/digitalio', () => {
  const py = loadGenerator();
  const gpio = py.forBlock.linux_gpio_init(block({ NAME: 'led', PIN: '17', DIRECTION: 'OUTPUT', PULL: 'NONE' }), py);
  const inputPin = py.forBlock.linux_gpio_init(block({ NAME: 'key', PIN: 'GPIO27', DIRECTION: 'INPUT', PULL: 'UP' }), py);
  const pwm = py.forBlock.linux_pwm_init(block({ NAME: 'fan', PIN: '18' }, { FREQUENCY: '1000' }), py);
  const led = py.forBlock.linux_led_write(block({}, { VALUE: 'True' }), py);

  assert.equal(gpio, 'led = DigitalOutputDevice(17)\n');
  assert.equal(inputPin, 'key = DigitalInputDevice(27, pull_up=True)\n');
  assert.equal(pwm, 'fan = PWMOutputDevice(18, frequency=1000)\n');
  assert.equal(led, '_linux_led.value = int(bool(True))\n');
  assert.match(py.codeDict.imports.gpiozero, /gpiozero/);
  assert.doesNotMatch(JSON.stringify(py.codeDict), /digitalio|board\.IO|periphery|walnutpi/);
});

test('UART uses pyserial device paths, not /dev/ttyS2', () => {
  const py = loadGenerator();
  const uart = py.forBlock.linux_uart_init(block({ NAME: 'link', DEVICE: '/dev/serial0', BAUD: '115200' }), py);
  assert.equal(uart, 'link = serial.Serial("/dev/serial0", 115200)\n');
  assert.equal(py.codeDict.imports.serial, 'import serial');
  assert.equal(py.forBlock.linux_uart_close(block({ NAME: 'class' })), 'class_.close()\n');
});

test('camera uses OpenCV VideoCapture, not walnutpi.Sensor', () => {
  const py = loadGenerator();
  const camera = py.forBlock.linux_camera_init(block({ NAME: 'cam', DEVICE: '/dev/video0' }, { WIDTH: '640', HEIGHT: '480' }), py);
  assert.equal(
    camera,
    'cam = cv2.VideoCapture("/dev/video0")\ncam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)\ncam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)\n',
  );
  assert.equal(py.codeDict.imports.cv2, 'import cv2');
  assert.match(py.codeDict.cleanups.camera_cam, /release/);
  assert.doesNotMatch(camera, /Sensor|walnutpi|kpu/);
});

test('audio uses generic ALSA aplay/arecord, not K230I2SINNO', () => {
  const py = loadGenerator();
  py.forBlock.linux_audio_play(block({}, { PATH: "'/tmp/a.wav'" }), py);
  assert.match(py.codeDict.functions.linux_audio_helpers, /aplay /);
  assert.doesNotMatch(py.codeDict.functions.linux_audio_helpers, /K230I2SINNO/);
});
