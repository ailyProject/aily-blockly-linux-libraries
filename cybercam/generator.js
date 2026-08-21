/* CyberCAM Python generator — official 01Studio/walnutpi APIs only. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can outlive a project-mode change. Skip inactive realms
  // instead of registering CPython handlers on Arduino or MicroPython.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addFunction', 'addCleanup', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`CyberCAM received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

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

  const addAdcHelper = (generator) => {
    generator.addImport('glob', 'import glob');
    generator.addFunction('cybercam_adc_helper', [
      'def _cybercam_adc_read_raw(channel):',
      '    channel = int(channel)',
      '    if channel not in (0, 1):',
      "        raise ValueError('CyberCAM exposes only ADC0 and ADC1')",
      '    patterns = (',
      "        '/sys/devices/platform/soc/9140d000.adc/iio:device*/in_voltage{}_raw',",
      "        '/sys/bus/iio/devices/iio:device*/in_voltage{}_raw',",
      '    )',
      '    paths = []',
      '    for pattern in patterns:',
      '        for path in sorted(glob.glob(pattern.format(channel))):',
      '            if path not in paths:',
      '                paths.append(path)',
      '    for path in paths:',
      '        try:',
      "            with open(path, 'r', encoding='ascii') as adc_file:",
      '                value = int(adc_file.read().strip())',
      '            if 0 <= value <= 4095:',
      '                return value',
      '        except (OSError, ValueError):',
      '            continue',
      "    raise RuntimeError('CyberCAM ADC is not registered by this system image or is not readable')",
    ].join('\n'));
  };
  const adcChannel = (block) => field(block, 'CHANNEL', '0') === '1' ? '1' : '0';
  define('cybercam_adc_read_raw', (block, generator) => {
    addAdcHelper(generator);
    return output(`_cybercam_adc_read_raw(${adcChannel(block)})`, ORDER_CALL);
  });
  define('cybercam_adc_read_voltage', (block, generator) => {
    addAdcHelper(generator);
    const channel = adcChannel(block);
    const fullScale = value(generator, block, 'FULL_SCALE', '3.6');
    return output(`(_cybercam_adc_read_raw(${channel}) * float(${fullScale}) / 4095.0)`, ORDER_NONE);
  });

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
  define('cybercam_chip_id', (_block, generator) => { generator.addImport('os', 'import os'); return output("os.popen('cat /sys/class/chip_id/chip_id').read().strip()", ORDER_CALL); });
});
