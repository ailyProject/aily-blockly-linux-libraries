'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  ROOT,
  compareStrings,
  getPublishablePackages,
  isCoreDirectory,
  readJson,
  writeJson,
} = require('./genjson');

const CATALOG_FILE = path.join('catalog', 'python-libraries.json');
const TAG_CATEGORIES = {
  audio: 'audio',
  camera: 'vision-ai',
  clock: 'system',
  communication: 'network',
  core: 'core',
  data: 'data-science',
  'data-processing': 'data-science',
  display: 'display',
  io: 'hardware-io',
  sensor: 'sensors',
  storage: 'system',
  system: 'system',
};

// 型号优先，避免包含温度等辅助属性的复合传感器被归成单一类型。
const EXACT_HARDWARE_TYPES = {
  ads1x15: ['adc'],
  ahtx0: ['temperature', 'humidity'],
  apds9960: ['gesture', 'color', 'proximity'],
  bme280: ['temperature', 'humidity', 'pressure'],
  bme680: ['temperature', 'humidity', 'pressure', 'gas'],
  bmp280: ['temperature', 'pressure'],
  bno055: ['imu', 'accelerometer', 'gyroscope', 'magnetometer'],
  ccs811: ['gas'],
  dht: ['temperature', 'humidity'],
  ds18b20: ['temperature'],
  ds3231: ['rtc'],
  ina219: ['power'],
  lis3dh: ['accelerometer'],
  mcp3xxx: ['adc'],
  mlx90614: ['temperature'],
  mpu6050: ['imu', 'accelerometer', 'gyroscope'],
  neopixel: ['led'],
  pca9685: ['servo'],
  pn532: ['rfid'],
  scd4x: ['temperature', 'humidity', 'gas'],
  sgp30: ['gas'],
  tsl2591: ['light'],
  vl53l0x: ['distance'],
  vl53l1x: ['distance'],
  w1thermsensor: ['temperature'],
};

const HARDWARE_TYPE_KEYWORDS = {
  imu: ['imu', '惯性', '6-axis', '9-axis', '六轴', '九轴'],
  accelerometer: ['accelerometer', 'accel', '加速度'],
  gyroscope: ['gyroscope', 'gyro', '陀螺仪'],
  magnetometer: ['magnetometer', 'compass', '磁力计', '指南针'],
  temperature: ['temperature sensor', 'thermometer', '温度传感器'],
  humidity: ['humidity sensor', '湿度传感器'],
  pressure: ['pressure sensor', 'barometer', '气压传感器', '压力传感器'],
  gas: ['gas sensor', 'air quality', 'co2 sensor', 'voc sensor', '气体传感器', '空气质量'],
  distance: ['distance sensor', 'ranging', '距离传感器', '测距', 'tof'],
  ultrasonic: ['ultrasonic', '超声波'],
  proximity: ['proximity sensor', '接近传感器'],
  light: ['light sensor', 'lux', 'ambient light', '光线传感器'],
  color: ['color sensor', 'rgb sensor', '颜色传感器'],
  gesture: ['gesture sensor', '手势传感器'],
  touch: ['touch sensor', 'capacitive touch', '触摸传感器'],
  oled: ['oled'],
  lcd: ['lcd', 'character display', '液晶'],
  tft: ['tft display', '彩屏'],
  led: ['led strip', 'neopixel', '灯带', '灯珠'],
  'led-matrix': ['led matrix', '点阵'],
  servo: ['servo', '舵机'],
  stepper: ['stepper', '步进'],
  'dc-motor': ['dc motor', 'motor driver', 'motorkit', '直流电机'],
  relay: ['relay', '继电器'],
  buzzer: ['buzzer', '蜂鸣器'],
  rfid: ['rfid reader', 'nfc reader'],
  gps: ['gps module', 'gnss module', '定位模块'],
  rtc: ['rtc module', 'real-time clock', 'real time clock', '实时时钟'],
  camera: ['camera', '摄像头'],
  microphone: ['microphone', '麦克风'],
  speaker: ['speaker', '扬声器'],
  'sd-card': ['sd card', 'microsd', 'tf card'],
  power: ['power monitor', '电源监测'],
  adc: ['analog-to-digital', 'analog to digital', 'adc'],
};

const COMMUNICATION_KEYWORDS = {
  i2c: ['i2c', 'iic', 'twi'],
  spi: ['spi'],
  uart: ['uart', 'serial port', 'serial-port', 'pyserial', 'lib-serial', 'minimalmodbus', 'python-periphery', '串口'],
  onewire: ['onewire', 'one-wire', 'one wire', '1-wire', '单总线'],
  gpio: ['gpio', 'digital pin'],
  pwm: ['pwm'],
  analog: ['analog', 'adc', 'iio'],
  wifi: ['wifi', 'http', 'httpx', 'aiohttp', 'mqtt', 'websocket', 'websockets', 'tcp', 'udp', 'coap', 'aiocoap'],
  ble: ['ble', 'bluetooth'],
  can: ['canbus', 'can bus', 'socketcan', 'python-can', 'cantools'],
  usb: ['usb', 'hidapi', 'pyftdi', 'pyusb'],
};

function uniqueStrings(values, fieldName) {
  if (!Array.isArray(values)) {
    throw new Error(`${fieldName} 必须是数组`);
  }
  if (values.some((value) => typeof value !== 'string' || value === '')) {
    throw new Error(`${fieldName} 必须只包含非空字符串`);
  }
  return [...new Set(values)];
}

function loadCatalog(rootDir = ROOT) {
  const catalogPath = path.join(rootDir, CATALOG_FILE);
  const catalog = readJson(catalogPath);
  if (!Array.isArray(catalog.libraries)) {
    throw new Error(`${catalogPath} 缺少 libraries 数组`);
  }

  const entries = new Map();
  for (const entry of catalog.libraries) {
    if (!entry || typeof entry.id !== 'string' || entry.id === '') {
      throw new Error(`${catalogPath} 包含无效的 library.id`);
    }
    if (entries.has(entry.id)) {
      throw new Error(`${catalogPath} 包含重复 library.id: ${entry.id}`);
    }
    entries.set(entry.id, entry);
  }
  return entries;
}

function fallbackCategory(folderName, packageJson) {
  if (isCoreDirectory(folderName)) {
    return 'core';
  }
  for (const tag of packageJson.tags || []) {
    if (TAG_CATEGORIES[tag]) {
      return TAG_CATEGORIES[tag];
    }
  }
  return 'utility';
}

function matchKeyword(text, keyword) {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  if (lowerKeyword.length > 3) {
    return lowerText.includes(lowerKeyword);
  }

  const escapedKeyword = lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|[^a-z0-9])${escapedKeyword}(?:[^a-z0-9]|$)`, 'i').test(lowerText);
}

function matchCommunicationKeyword(text, keyword) {
  const escapedKeyword = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|[^a-z0-9])${escapedKeyword}(?:[^a-z0-9]|$)`, 'i').test(text);
}

function detectHardwareType(text, folderName) {
  const lowerText = text.toLowerCase();
  const lowerName = folderName.toLowerCase();
  const hardwareTypes = new Set();

  for (const [model, types] of Object.entries(EXACT_HARDWARE_TYPES)) {
    if (lowerName.includes(model) || lowerText.includes(model)) {
      types.forEach((type) => hardwareTypes.add(type));
    }
  }
  if (hardwareTypes.size > 0) {
    return [...hardwareTypes];
  }

  for (const [type, keywords] of Object.entries(HARDWARE_TYPE_KEYWORDS)) {
    if (keywords.some((keyword) => matchKeyword(lowerText, keyword))) {
      hardwareTypes.add(type);
    }
  }
  return [...hardwareTypes];
}

function detectCommunication(text) {
  const communications = [];
  for (const [communication, keywords] of Object.entries(COMMUNICATION_KEYWORDS)) {
    if (keywords.some((keyword) => matchCommunicationKeyword(text, keyword))) {
      communications.push(communication);
    }
  }
  return communications;
}

function buildInfo(folderName, packageJson, catalogEntry) {
  const supportedCores = uniqueStrings(
    packageJson.compatibility && packageJson.compatibility.type,
    `${folderName}.compatibility.type`,
  );
  if (supportedCores.length === 0) {
    throw new Error(`${folderName}.compatibility.type 不能为空`);
  }

  const voltage = packageJson.compatibility.voltage === undefined
    ? []
    : packageJson.compatibility.voltage;
  if (!Array.isArray(voltage)) {
    throw new Error(`${folderName}.compatibility.voltage 必须是数组`);
  }

  const tags = uniqueStrings(packageJson.tags || [], `${folderName}.tags`)
    .sort(compareStrings);
  const metadataText = [
    folderName,
    packageJson.name,
    packageJson.nickname || '',
    packageJson.description || '',
    packageJson.description_en || '',
    ...(packageJson.keywords || []),
    ...tags,
    catalogEntry && catalogEntry.module ? catalogEntry.module : '',
    ...(catalogEntry && Array.isArray(catalogEntry.callables) ? catalogEntry.callables : []),
    ...(catalogEntry && Array.isArray(catalogEntry.methods) ? catalogEntry.methods : []),
    ...(catalogEntry && Array.isArray(catalogEntry.attributes) ? catalogEntry.attributes : []),
  ].join(' ');

  return {
    $schema: 'library-info-schema',
    name: packageJson.name.replace('@aily-project-linux/', ''),
    displayName: packageJson.nickname || packageJson.name.replace('@aily-project-linux/', ''),
    category: catalogEntry && catalogEntry.category
      ? catalogEntry.category
      : fallbackCategory(folderName, packageJson),
    subcategory: '',
    supportedCores,
    communication: detectCommunication(metadataText),
    voltage: [...new Set(voltage)],
    functions: [],
    hardwareType: detectHardwareType(metadataText, folderName),
    tags,
  };
}

function parseArguments(args) {
  const regenerateAll = args.includes('--all');
  const dryRun = args.includes('--dry-run');
  const unknownOption = args.find((argument) => argument.startsWith('--')
    && argument !== '--all'
    && argument !== '--dry-run');
  if (unknownOption) {
    throw new Error(`未知参数: ${unknownOption}`);
  }

  const libraries = args.filter((argument) => !argument.startsWith('--'));
  if (libraries.length > 1) {
    throw new Error('一次只能指定一个库目录');
  }
  return { regenerateAll, dryRun, specificLibrary: libraries[0] };
}

function generateInfoFiles(rootDir = ROOT, options = {}) {
  const catalog = loadCatalog(rootDir);
  const allPackages = getPublishablePackages(rootDir);
  const packages = options.specificLibrary
    ? allPackages.filter(({ folderName }) => folderName === options.specificLibrary)
    : allPackages;

  if (options.specificLibrary && packages.length === 0) {
    throw new Error(`没有找到可发布库目录: ${options.specificLibrary}`);
  }

  let written = 0;
  let skipped = 0;
  for (const { folderName, packageJson } of packages) {
    const infoPath = path.join(rootDir, folderName, 'info.json');
    const info = buildInfo(folderName, packageJson, catalog.get(folderName));
    if (options.dryRun) {
      continue;
    }
    if (!options.regenerateAll && fs.existsSync(infoPath)) {
      skipped += 1;
      continue;
    }
    writeJson(infoPath, info, 2);
    written += 1;
  }

  if (packages.length !== (options.dryRun ? packages.length : written + skipped)) {
    throw new Error(`info.json 处理数量与可发布包数量不一致`);
  }
  return { count: packages.length, skipped, written };
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const result = generateInfoFiles(ROOT, options);
  console.log(`info.json 处理完成：库 ${result.count}，写入 ${result.written}，跳过 ${result.skipped}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  buildInfo,
  detectCommunication,
  detectHardwareType,
  generateInfoFiles,
  loadCatalog,
  parseArguments,
};
