'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SPEC_MARKER = '})(globalThis, {';
const BOARD_TYPES = Object.freeze(JSON.parse(
  fs.readFileSync(path.join(ROOT, 'catalog', 'board-types.json'), 'utf8'),
).types);
const RASPBERRY_PI_BOARD_IDS = Object.freeze(BOARD_TYPES.filter((id) => id.startsWith('broadcom:')));
const JETSON_BOARD_IDS = Object.freeze(BOARD_TYPES.filter((id) => id.startsWith('nvidia:')));
const CYBERCAM_BOARD_ID = BOARD_TYPES.find((id) => id === 'canaan:k230:cybercam');
const WALNUT_PI_BOARD_ID = BOARD_TYPES.find((id) => id === 'allwinner:t527:walnutpi_2b');
const RASPBERRY_PI_5 = RASPBERRY_PI_BOARD_IDS.find((id) => id.endsWith(':raspberrypi_5'));
const BLINKA_BOARD_IDS = Object.freeze(BOARD_TYPES.filter((id) => (
  RASPBERRY_PI_BOARD_IDS.includes(id) || id === WALNUT_PI_BOARD_ID
)));

// Colour and the first package tag intentionally group several toolbox themes.
// Keep the semantic category explicit here instead of guessing from presentation.
const CATEGORY_GROUPS = Object.freeze({
  'raspberry-pi': [
    'rpi_buildhat', 'rpi_imx500', 'rpi_lgpio', 'rpi_sense_emu', 'rpi_sense_hat',
    'rtimulib',
  ],
  jetson: [
    'cuda_python', 'cupy', 'jetson_gpio', 'jetson_inference', 'jetson_stats',
    'jetson_utils', 'nvidia_vpi', 'pycuda', 'tensorrt',
  ],
  'hardware-io': [
    'adafruit_blinka', 'evdev', 'gpiod', 'hidapi', 'lgpio', 'pyftdi',
    'python_periphery', 'pyusb',
  ],
  industrial: ['cantools', 'minimalmodbus', 'pymodbus', 'python_can'],
  system: ['dbus_next', 'psutil', 'pyudev', 'pyyaml', 'schedule', 'watchdog'],
  network: [
    'aiohttp', 'bleak', 'fastapi', 'flask', 'httpx', 'paramiko', 'python_socketio',
    'redis', 'scapy', 'uvicorn', 'websockets', 'zeroconf',
  ],
  sensors: [
    'adafruit_ads1x15', 'adafruit_ahtx0', 'adafruit_apds9960', 'adafruit_bme280',
    'adafruit_bme680', 'adafruit_bmp280', 'adafruit_bno055', 'adafruit_ccs811',
    'adafruit_dht', 'adafruit_ina219', 'adafruit_lis3dh', 'adafruit_mcp3xxx',
    'adafruit_mlx90614', 'adafruit_mpu6050', 'adafruit_pn532', 'adafruit_scd4x',
    'adafruit_sgp30', 'adafruit_tsl2591', 'adafruit_vl53l0x', 'adafruit_vl53l1x',
    'gpsd_py3', 'pynmea2', 'w1thermsensor',
  ],
  actuators: [
    'adafruit_motor', 'adafruit_motorkit', 'adafruit_pca9685', 'adafruit_servokit',
    'neopixel', 'rpi_hardware_pwm',
  ],
  display: [
    'adafruit_rgb_display', 'luma_lcd', 'luma_led_matrix', 'luma_oled', 'pillow',
    'pyav', 'qrcode', 'rplcd',
  ],
  'vision-ai': [
    'depthai', 'hailo_platform', 'onnxruntime', 'pytesseract', 'scikit_image',
    'tflite_runtime', 'pytorch', 'torchvision', 'ultralytics',
  ],
  multimedia: ['gstreamer'],
  'data-science': ['matplotlib', 'munkres', 'numpy', 'pandas', 'scipy'],
  audio: [
    'librosa', 'pyaudio', 'pydub', 'pygame', 'pyttsx3', 'sounddevice', 'soundfile',
    'speech_recognition', 'vosk',
  ],
  'iot-cloud': [
    'adafruit_io', 'aiocoap', 'aws_iot_device_sdk', 'azure_iot_device',
    'influxdb_client',
  ],
  robotics: ['pymavlink', 'rclpy'],
});
const CATEGORY_BY_ID = new Map();
for (const [category, ids] of Object.entries(CATEGORY_GROUPS)) {
  for (const id of ids) {
    if (CATEGORY_BY_ID.has(id)) throw new Error(`duplicate catalog category assignment: ${id}`);
    CATEGORY_BY_ID.set(id, category);
  }
}
const MODULE_ATTRIBUTES = Object.freeze({
  adafruit_mcp3xxx: ['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'],
  depthai: [
    'node.Camera', 'node.ColorCamera', 'node.MonoCamera', 'node.ImageManip',
    'node.NeuralNetwork', 'node.StereoDepth',
  ],
});

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function sameMembers(actual, expected) {
  return actual.length === expected.length && actual.every((value) => expected.includes(value));
}

function packageDirectories() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .filter((name) => {
      const generator = path.join(ROOT, name, 'generator.js');
      return fs.existsSync(generator) && readText(generator).includes(SPEC_MARKER);
    })
    .sort();
}

function parseEmbeddedSpec(source, directory) {
  const marker = source.lastIndexOf('})(globalThis, ');
  if (marker < 0) throw new Error(`${directory}: embedded generator spec not found`);
  const start = marker + '})(globalThis, '.length;
  const suffix = source.slice(start).trim();
  const endMatch = suffix.match(/\}\s*\);\s*$/);
  if (!endMatch) throw new Error(`${directory}: embedded generator spec is not JSON`);
  return JSON.parse(suffix.slice(0, endMatch.index + 1));
}

function installCommand(readme, pip) {
  const match = readme.match(/Install on target:\s*`([^`]+)`/i);
  return match ? match[1] : `python3 -m pip install ${pip}`;
}

function libraryRecord(directory) {
  const packageDirectory = path.join(ROOT, directory);
  const source = readText(path.join(packageDirectory, 'generator.js'));
  const spec = parseEmbeddedSpec(source, directory);
  const metadata = readJson(path.join(packageDirectory, 'package.json'));
  const blocks = readJson(path.join(packageDirectory, 'block.json'));
  const readme = readText(path.join(packageDirectory, 'readme_ai.md'));
  const pip = metadata.keywords[5];
  const module = spec.module;
  const category = CATEGORY_BY_ID.get(directory);
  if (!category) throw new Error(`${directory}: explicit catalog category missing`);
  if (metadata.keywords[6] !== module) {
    throw new Error(`${directory}: package module ${metadata.keywords[6]} differs from generator ${module}`);
  }
  let compatibility = 'linux';
  if (sameMembers(metadata.compatibility.type, BLINKA_BOARD_IDS)) {
    compatibility = 'blinka';
  } else if (metadata.compatibility.type.every((id) => RASPBERRY_PI_BOARD_IDS.includes(id))) {
    compatibility = 'rpi';
  } else if (sameMembers(metadata.compatibility.type, JETSON_BOARD_IDS)) {
    compatibility = 'jetson';
  }

  const record = {
    id: directory,
    title: spec.title,
    blockPrefix: spec.prefix,
    pip,
    module,
    category,
    compatibility,
    boardTypes: metadata.compatibility.type,
    asyncBridge: Boolean(spec.asyncBridge),
    raspberryPiDocs: compatibility === 'rpi',
    install: installCommand(readme, pip),
    homepage: metadata.homepage,
    notesEn: `${spec.title} is exposed through an explicit CPython API allowlist.`,
    notesZh: `${spec.title} 通过显式 CPython API 白名单提供积木。`,
    callables: spec.callables,
    methods: spec.methods,
    attributes: spec.attributes,
  };
  const attributes = spec.moduleAttributes || MODULE_ATTRIBUTES[directory] || [];
  for (const attribute of attributes) {
    if (!spec.attributes.includes(attribute)) {
      throw new Error(`${directory}: module attribute ${attribute} is absent from the generator spec`);
    }
  }
  if (attributes.length) record.moduleAttributes = attributes;
  if (spec.importStatement) record.importStatement = spec.importStatement;
  return record;
}

function buildCatalog(libraries) {
  const blinkaLibraries = libraries
    .filter((library) => library.pip.toLowerCase().startsWith('adafruit-circuitpython-'))
    .map((library) => library.id)
    .sort();
  return {
    schemaVersion: 1,
    count: libraries.length,
    boardIds: {
      cybercam: CYBERCAM_BOARD_ID,
      raspberryPiZero2W: RASPBERRY_PI_BOARD_IDS.find((id) => id.endsWith(':raspberrypi_0_2w')),
      raspberryPi4B: RASPBERRY_PI_BOARD_IDS.find((id) => id.endsWith(':raspberrypi_4b')),
      raspberryPi5: RASPBERRY_PI_5,
      walnutPi2B: WALNUT_PI_BOARD_ID,
      jetsonOrinNano: JETSON_BOARD_IDS.find((id) => id.endsWith(':jetson_orin_nano')),
      jetsonOrinNx: JETSON_BOARD_IDS.find((id) => id.endsWith(':jetson_orin_nx')),
      jetsonAgxOrin: JETSON_BOARD_IDS.find((id) => id.endsWith(':jetson_agx_orin')),
    },
    runtimeProfiles: {
      default: 'Linux CPython packages and standard-library bindings.',
      blinka: 'Adafruit Blinka drivers running on Linux CPython; these are not MicroPython firmware packages.',
      jetson: 'NVIDIA Jetson Orin libraries that require a matching JetPack, CUDA, or board runtime.',
      compatibilityLayerLibraries: ['adafruit_blinka'],
      blinkaLibraries,
    },
    raspberryPi5Conditions: {
      baseline: 'Use 64-bit Raspberry Pi OS. 安装 PyPI 包前先创建并激活虚拟环境；需要复用 APT 模块时用 --system-site-packages 创建环境。',
      experimental: {
        adafruit_dht: 'Raspberry Pi 5 support depends on the selected GPIO backend and remains hardware-image dependent.',
      },
      conditional: {
        adafruit_bno055: 'I2C clock stretching can require a lower bus speed or a compatible backend.',
        adafruit_ccs811: 'The I2C interface and target address must be enabled and reachable.',
        adafruit_pn532: 'On Raspberry Pi prefer PN532 over SPI; UART is not a recommended default because serial-console configuration varies.',
        neopixel: 'Raspberry Pi 5 typically requires an available PIO backend and appropriate GPIO permissions.',
      },
    },
    libraries,
  };
}

function markdown(catalog) {
  const counts = new Map();
  for (const library of catalog.libraries) {
    counts.set(library.category, (counts.get(library.category) || 0) + 1);
  }
  const lines = [
    '# Python 白名单生态库清单',
    '',
    `本清单由 \`catalog/python-libraries.json\` 生成，收录 ${catalog.count} 个采用统一白名单桥接结构的 Linux/Raspberry Pi/Jetson CPython 生态库。仓库中不采用这一嵌入式 spec 结构的手工核心、板级与专用功能包另行维护，不计入此数字。`,
    '',
    '这些包生成 CPython 代码。Adafruit CircuitPython 驱动通过 Blinka 在 Linux CPython 上运行，并不要求也不代表 MicroPython 固件。',
    '',
    '## 分类统计',
    '',
    '| 分类 | 数量 |',
    '| --- | ---: |',
    ...[...counts.entries()].sort().map(([category, count]) => `| ${category} | ${count} |`),
    '',
    '## 目标环境注意事项',
    '',
    `- ${catalog.raspberryPi5Conditions.baseline}`,
    '- npm 安装只部署 Blockly 资产，不会安装目标机 Python 包、启用 I²C/SPI/1-Wire、修改设备权限或执行 sudo。',
    '- 运行硬件库前必须核对电压、引脚编号、内核接口与驱动后端。',
    '- Jetson 库必须与目标机的 JetPack、CUDA、TensorRT 和 VPI 版本匹配。',
    '',
    '## 库清单',
    '',
    '| 目录 | npm 包 | Python 导入 | 安装方式 | 运行范围 |',
    '| --- | --- | --- | --- | --- |',
  ];
  for (const library of catalog.libraries) {
    const runtime = library.compatibility === 'rpi'
      ? 'Raspberry Pi'
      : library.compatibility === 'blinka' ? 'Raspberry Pi / WalnutPi (Blinka)'
      : library.compatibility === 'jetson' ? 'NVIDIA Jetson' : 'Linux CPython';
    lines.push(`| \`${library.id}\` | \`@aily-project/lib-${library.id.replaceAll('_', '-')}\` | \`${library.module}\` | \`${library.install}\` | ${runtime} |`);
  }
  lines.push('');
  return lines.join('\n');
}

const directories = packageDirectories();
if (directories.length !== CATEGORY_BY_ID.size) {
  throw new Error(`expected ${CATEGORY_BY_ID.size} curated bridge packages, found ${directories.length}`);
}
for (const directory of CATEGORY_BY_ID.keys()) {
  if (!directories.includes(directory)) throw new Error(`catalog package directory missing: ${directory}`);
}
const catalog = buildCatalog(directories.map(libraryRecord));
const catalogDirectory = path.join(ROOT, 'catalog');
const outputs = new Map([
  [path.join(catalogDirectory, 'python-libraries.json'), `${JSON.stringify(catalog, null, 2)}\n`],
  [path.join(ROOT, 'PYTHON-LIBRARIES.md'), markdown(catalog)],
]);
if (process.argv.includes('--check')) {
  let current = true;
  for (const [file, expected] of outputs) {
    if (!fs.existsSync(file) || readText(file) !== expected) {
      console.error(`${path.relative(ROOT, file)} is not up to date`);
      current = false;
    }
  }
  if (!current) process.exitCode = 1;
  else console.log(`Catalog is current (${catalog.count} libraries in ${Object.keys(CATEGORY_GROUPS).length} categories)`);
} else {
  fs.mkdirSync(catalogDirectory, { recursive: true });
  for (const [file, contents] of outputs) fs.writeFileSync(file, contents, 'utf8');
  console.log(`Wrote ${catalog.count} library records in ${Object.keys(CATEGORY_GROUPS).length} categories`);
}
