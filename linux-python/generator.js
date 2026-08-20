/* Linux CPython hardware generator — gpiozero, pyserial, OpenCV VideoCapture, ALSA. */
(function (Python) {
  'use strict';

  if (!Python || !Python.forBlock) throw new Error('Linux Python requires the Python generator');

  const ORDER_MEMBER = Python.ORDER_MEMBER ?? 2.1;
  const ORDER_CALL = Python.ORDER_FUNCTION_CALL ?? 2.2;
  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const define = (type, generator) => { Python.forBlock[type] = generator; };
  const field = (block, name, fallback = '') => block.getFieldValue(name) ?? fallback;
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || fallback;
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
  const nameOf = (block, fallback) => safeName(field(block, 'NAME', fallback), fallback);
  const output = (code, order = ORDER_CALL) => [code, order];
  const pinNumber = (pin) => {
    const raw = String(pin || '17');
    const match = raw.match(/(\d+)\s*$/);
    return match ? match[1] : raw;
  };

  define('linux_gpio_init', (block, generator) => {
    const name = nameOf(block, 'pin');
    const pin = pinNumber(field(block, 'PIN', '17'));
    const direction = field(block, 'DIRECTION', 'OUTPUT');
    const pull = field(block, 'PULL', 'NONE');
    generator.addImport('gpiozero', 'from gpiozero import DigitalInputDevice, DigitalOutputDevice, PWMOutputDevice, LED, Button');
    declareResource(generator, `gpio_${name}`, name, 'close');
    if (direction === 'INPUT') {
      const pullUp = pull === 'UP' ? 'True' : pull === 'DOWN' ? 'False' : 'None';
      return `${name} = DigitalInputDevice(${pin}, pull_up=${pullUp})\n`;
    }
    return `${name} = DigitalOutputDevice(${pin})\n`;
  });
  define('linux_gpio_write', (block, generator) => {
    const name = nameOf(block, 'pin');
    return `${name}.value = int(bool(${value(generator, block, 'VALUE', 'False')}))\n`;
  });
  define('linux_gpio_read', (block) => output(`${nameOf(block, 'pin')}.value`, ORDER_MEMBER));
  define('linux_gpio_close', (block) => `${nameOf(block, 'pin')}.close()\n`);
  define('linux_led_write', (block, generator) => {
    generator.addImport('gpiozero', 'from gpiozero import DigitalInputDevice, DigitalOutputDevice, PWMOutputDevice, LED, Button');
    generator.addVariable('gpio_linux_led', '_linux_led = LED(17)');
    if (typeof generator.addCleanup === 'function') {
      generator.addCleanup('gpio_linux_led', 'if _linux_led is not None:\n    _linux_led.close()');
    }
    return `_linux_led.value = int(bool(${value(generator, block, 'VALUE', 'True')}))\n`;
  });
  define('linux_key_pressed', (_block, generator) => {
    generator.addImport('gpiozero', 'from gpiozero import DigitalInputDevice, DigitalOutputDevice, PWMOutputDevice, LED, Button');
    generator.addVariable('gpio_linux_key', '_linux_key = Button(27, pull_up=True)');
    if (typeof generator.addCleanup === 'function') {
      generator.addCleanup('gpio_linux_key', 'if _linux_key is not None:\n    _linux_key.close()');
    }
    return output('_linux_key.is_pressed', ORDER_MEMBER);
  });
  define('linux_pwm_init', (block, generator) => {
    const name = nameOf(block, 'pwm');
    const pin = pinNumber(field(block, 'PIN', '18'));
    generator.addImport('gpiozero', 'from gpiozero import DigitalInputDevice, DigitalOutputDevice, PWMOutputDevice, LED, Button');
    declareResource(generator, `pwm_${name}`, name, 'close');
    return `${name} = PWMOutputDevice(${pin}, frequency=${value(generator, block, 'FREQUENCY', '1000')})\n`;
  });
  define('linux_pwm_duty', (block, generator) => `${nameOf(block, 'pwm')}.value = ${value(generator, block, 'DUTY', '0.5')}\n`);
  define('linux_pwm_close', (block) => `${nameOf(block, 'pwm')}.close()\n`);

  define('linux_uart_init', (block, generator) => {
    const name = nameOf(block, 'uart');
    generator.addImport('serial', 'import serial');
    declareResource(generator, `uart_${name}`, name, 'close');
    return `${name} = serial.Serial(${generator.quote_(field(block, 'DEVICE', '/dev/serial0'))}, ${field(block, 'BAUD', '115200')})\n`;
  });
  define('linux_uart_available', (block) => output(`${nameOf(block, 'uart')}.in_waiting`, ORDER_MEMBER));
  define('linux_uart_read', (block, generator) => output(`${nameOf(block, 'uart')}.read(${value(generator, block, 'SIZE', '1')})`));
  define('linux_uart_write', (block, generator) => `${nameOf(block, 'uart')}.write(${value(generator, block, 'DATA', "b''")})\n`);
  define('linux_uart_flush', (block) => `${nameOf(block, 'uart')}.reset_input_buffer()\n`);
  define('linux_uart_close', (block) => `${nameOf(block, 'uart')}.close()\n`);

  define('linux_camera_init', (block, generator) => {
    const name = nameOf(block, 'camera');
    generator.addImport('cv2', 'import cv2');
    declareResource(generator, `camera_${name}`, name, 'release');
    return `${name} = cv2.VideoCapture(${generator.quote_(field(block, 'DEVICE', '/dev/video0'))})\n${name}.set(cv2.CAP_PROP_FRAME_WIDTH, ${value(generator, block, 'WIDTH', '640')})\n${name}.set(cv2.CAP_PROP_FRAME_HEIGHT, ${value(generator, block, 'HEIGHT', '480')})\n`;
  });
  define('linux_camera_opened', (block) => output(`${nameOf(block, 'camera')}.isOpened()`));
  define('linux_camera_read', (block) => output(`${nameOf(block, 'camera')}.read()[1]`, ORDER_MEMBER));
  define('linux_camera_release', (block) => `${nameOf(block, 'camera')}.release()\n`);

  const addAudioHelpers = (generator) => {
    generator.addImport('os', 'import os');
    generator.addImport('shlex', 'import shlex');
    generator.addFunction('linux_audio_helpers', "def _linux_play_audio(path):\n    return os.popen('aplay ' + shlex.quote(str(path))).read()\n\ndef _linux_record_audio(path, seconds=5, rate=16000):\n    command = 'arecord -f S16_LE -r {} -d {} -t wav {}'.format(int(rate), int(seconds), shlex.quote(str(path)))\n    return os.popen(command).read()");
  };
  define('linux_audio_play', (block, generator) => { addAudioHelpers(generator); return `_linux_play_audio(${value(generator, block, 'PATH', "'/tmp/audio.wav'")})\n`; });
  define('linux_audio_record', (block, generator) => { addAudioHelpers(generator); return `_linux_record_audio(${value(generator, block, 'PATH', "'/tmp/record.wav'")}, ${value(generator, block, 'SECONDS', '5')}, ${value(generator, block, 'RATE', '16000')})\n`; });
})(typeof Python !== 'undefined' ? Python : (typeof MPY !== 'undefined' ? MPY : MicropPython));
