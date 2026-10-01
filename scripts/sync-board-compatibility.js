'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_BOARD_LIST = path.resolve(ROOT, '..', 'aily-blockly-linux-boards', 'LIST.md');
const SNAPSHOT_FILE = path.join(ROOT, 'catalog', 'board-types.json');

const ALL_BOARD_LIBRARIES = new Set([
  'core', 'core_logic', 'core_loop', 'core_math', 'core_text', 'core_variables',
  'datetime', 'file', 'filesystem', 'json', 'network', 'paho_mqtt', 'requests',
  'serial', 'threading', 'vision',
]);
// RK3566 packages currently expose only these audited template libraries.
// Keep other software and hardware profiles unchanged until reviewed.
const ROCKCHIP_LIBRARIES = new Set([
  'core', 'core_logic', 'core_loop', 'core_math', 'core_text', 'core_variables',
  'datetime', 'file', 'filesystem', 'json', 'network', 'serial',
]);
const CYBERCAM_LIBRARIES = new Set(['cybercam', 'cybercam_cv', 'cybercam_gpio']);
const JETSON_LIBRARIES = new Set([
  'cuda_python', 'cupy', 'jetson_gpio', 'jetson_inference', 'jetson_stats',
  'jetson_utils', 'nvidia_vpi', 'pycuda', 'pytorch', 'tensorrt', 'torchvision',
]);
const RASPBERRY_PI_5_LIBRARIES = new Set(['hailo_platform']);
const RASPBERRY_PI_LIBRARIES = new Set([
  'gpio', 'gpiozero_devices', 'rpi_buildhat', 'rpi_hardware_pwm', 'rpi_i2c',
  'rpi_imx500', 'rpi_lgpio', 'rpi_picamera2', 'rpi_sense_emu', 'rpi_sense_hat',
  'rpi_spi', 'rtimulib', 'stepper', 'w1thermsensor',
]);

function parseBoardTypes(markdown) {
  const types = [...markdown.matchAll(/^\s*-\s+`([^`]+)`\s*$/gm)].map((match) => match[1]);
  if (!types.length) throw new Error('board LIST.md contains no `vendor:soc:board` entries');
  if (new Set(types).size !== types.length) throw new Error('board LIST.md contains duplicate types');
  for (const type of types) {
    if (!/^[a-z0-9_]+:[a-z0-9_]+:[a-z0-9_]+$/.test(type)) {
      throw new Error(`invalid board type in LIST.md: ${type}`);
    }
  }
  return types;
}

function boardGroups(types) {
  const raspberryPi = types.filter((type) => type.startsWith('broadcom:'));
  const raspberryPi5 = raspberryPi.filter((type) => type.endsWith(':raspberrypi_5'));
  const jetson = types.filter((type) => type.startsWith('nvidia:') && type.includes(':jetson_'));
  const cybercam = types.filter((type) => type === 'canaan:k230:cybercam');
  const walnutPi = types.filter((type) => type === 'allwinner:t527:walnutpi_2b');
  const rockchip = types.filter((type) => type.startsWith('rockchip:'));
  const linuxSbc = types.filter((type) => !cybercam.includes(type));
  const blinka = types.filter((type) => raspberryPi.includes(type) || walnutPi.includes(type));
  const expectedSizes = { raspberryPi: 3, raspberryPi5: 1, jetson: 3, cybercam: 1, walnutPi: 1, rockchip: 2, linuxSbc: 9, blinka: 4 };
  const groups = { all: types, raspberryPi, raspberryPi5, jetson, cybercam, walnutPi, rockchip, linuxSbc, blinka };
  for (const [name, size] of Object.entries(expectedSizes)) {
    if (groups[name].length !== size) {
      throw new Error(`unexpected ${name} board count in LIST.md: expected ${size}, found ${groups[name].length}`);
    }
  }
  return groups;
}

function isBlinkaHardwareLibrary(directory) {
  return (directory.startsWith('adafruit_') && directory !== 'adafruit_io') || directory === 'neopixel';
}

function platformFamilyForType(type) {
  const vendor = String(type).split(':', 1)[0];
  const families = {
    allwinner: 'WalnutPi',
    broadcom: 'Raspberry Pi',
    canaan: 'CyberCAM',
    nvidia: 'NVIDIA Jetson',
    rockchip: 'Rockchip',
  };
  const family = families[vendor];
  if (!family) throw new Error(`unknown platform family for board type: ${type}`);
  return family;
}

function platformFamiliesForTypes(types) {
  return [...new Set(types.map(platformFamilyForType))];
}

function isPlatformExclusive(types) {
  return platformFamiliesForTypes(types).length === 1;
}

function compatibilityFor(directory, groups) {
  if (ALL_BOARD_LIBRARIES.has(directory)) {
    return ROCKCHIP_LIBRARIES.has(directory)
      ? groups.all
      : groups.all.filter((type) => !groups.rockchip.includes(type));
  }
  if (CYBERCAM_LIBRARIES.has(directory)) return groups.cybercam;
  if (JETSON_LIBRARIES.has(directory)) return groups.jetson;
  if (RASPBERRY_PI_5_LIBRARIES.has(directory)) return groups.raspberryPi5;
  if (RASPBERRY_PI_LIBRARIES.has(directory)) return groups.raspberryPi;
  if (isBlinkaHardwareLibrary(directory)) return groups.blinka;
  return groups.linuxSbc.filter((type) => !groups.rockchip.includes(type));
}

function libraryDirectories() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .filter((directory) => {
      const file = path.join(ROOT, directory, 'package.json');
      if (!fs.existsSync(file)) return false;
      const metadata = JSON.parse(fs.readFileSync(file, 'utf8'));
      return String(metadata.name || '').startsWith('@aily-project-linux/lib-');
    })
    .sort();
}

function normalizedJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sync({ check = false, listFile = DEFAULT_BOARD_LIST } = {}) {
  const types = parseBoardTypes(fs.readFileSync(listFile, 'utf8'));
  const groups = boardGroups(types);
  const changes = [];
  for (const directory of libraryDirectories()) {
    const file = path.join(ROOT, directory, 'package.json');
    const metadata = JSON.parse(fs.readFileSync(file, 'utf8'));
    metadata.compatibility = {
      type: compatibilityFor(directory, groups),
      voltage: [3.3],
    };
    // `spec` makes the library manager enforce compatibility.type. A package
    // that only belongs to one platform family must never lose this flag.
    // Existing multi-platform packages keep the flag as well because removing
    // it would bypass compatibility filtering entirely in the current client.
    if (isPlatformExclusive(metadata.compatibility.type)) metadata.spec = true;
    const expected = normalizedJson(metadata);
    if (fs.readFileSync(file, 'utf8') !== expected) {
      changes.push(path.relative(ROOT, file));
      if (!check) fs.writeFileSync(file, expected, 'utf8');
    }
  }

  const snapshot = normalizedJson({
    source: 'aily-blockly-linux-boards/LIST.md',
    types,
  });
  if (!fs.existsSync(SNAPSHOT_FILE) || fs.readFileSync(SNAPSHOT_FILE, 'utf8') !== snapshot) {
    changes.push(path.relative(ROOT, SNAPSHOT_FILE));
    if (!check) fs.writeFileSync(SNAPSHOT_FILE, snapshot, 'utf8');
  }

  if (check && changes.length) {
    throw new Error(`board compatibility is not synchronized:\n${changes.join('\n')}`);
  }
  return { changes, groups, libraryCount: libraryDirectories().length, types };
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  const listArgument = process.argv.find((argument, index) => index > 1 && argument !== '--check');
  const result = sync({ check, listFile: listArgument ? path.resolve(listArgument) : DEFAULT_BOARD_LIST });
  const action = check ? 'Verified' : 'Synchronized';
  console.log(`${action} ${result.libraryCount} libraries against ${result.types.length} board types (${result.changes.length} changed).`);
}

module.exports = {
  ALL_BOARD_LIBRARIES,
  CYBERCAM_LIBRARIES,
  JETSON_LIBRARIES,
  RASPBERRY_PI_5_LIBRARIES,
  RASPBERRY_PI_LIBRARIES,
  boardGroups,
  compatibilityFor,
  isBlinkaHardwareLibrary,
  isPlatformExclusive,
  parseBoardTypes,
  platformFamiliesForTypes,
  platformFamilyForType,
  sync,
};
