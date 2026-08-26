'use strict';

const fs = require('node:fs');
const path = require('node:path');

const BOARDS_ROOT = path.resolve(__dirname, '..', '..', 'aily-blockly-linux-boards');
const VERSION = '0.0.1';
const FOUNDATION = [
  '@aily-project-linux/lib-core',
  '@aily-project-linux/lib-core-logic',
  '@aily-project-linux/lib-core-loop',
  '@aily-project-linux/lib-core-math',
  '@aily-project-linux/lib-core-text',
  '@aily-project-linux/lib-core-variables',
  '@aily-project-linux/lib-datetime',
];
const PORTABLE = [
  '@aily-project-linux/lib-file',
  '@aily-project-linux/lib-json',
  '@aily-project-linux/lib-vision',
  '@aily-project-linux/lib-network',
  '@aily-project-linux/lib-filesystem',
  '@aily-project-linux/lib-camera',
  '@aily-project-linux/lib-serial',
  '@aily-project-linux/lib-audio',
];
const DEFAULT_LIBRARIES = Object.freeze({
  cybercam: [
    '@aily-project-linux/lib-cybercam',
    '@aily-project-linux/lib-cybercam-cv',
    '@aily-project-linux/lib-cybercam-gpio',
    '@aily-project-linux/lib-vision',
    '@aily-project-linux/lib-network',
    '@aily-project-linux/lib-file',
    '@aily-project-linux/lib-json',
    '@aily-project-linux/lib-filesystem',
    '@aily-project-linux/lib-serial',
  ],
  jetson_agx_orin: [
    ...PORTABLE,
    '@aily-project-linux/lib-jetson-gpio',
    '@aily-project-linux/lib-gstreamer',
  ],
  jetson_orin_nano: [
    ...PORTABLE,
    '@aily-project-linux/lib-jetson-gpio',
    '@aily-project-linux/lib-gstreamer',
  ],
  jetson_orin_nx: [
    ...PORTABLE,
    '@aily-project-linux/lib-jetson-gpio',
    '@aily-project-linux/lib-gstreamer',
  ],
  raspberrypi_0_2w: [
    ...PORTABLE,
    '@aily-project-linux/lib-gpio',
    '@aily-project-linux/lib-gpiozero-devices',
    '@aily-project-linux/lib-rpi-i2c',
    '@aily-project-linux/lib-rpi-spi',
    '@aily-project-linux/lib-rpi-picamera2',
  ],
  raspberrypi_4b: [
    ...PORTABLE,
    '@aily-project-linux/lib-gpio',
    '@aily-project-linux/lib-gpiozero-devices',
    '@aily-project-linux/lib-rpi-i2c',
    '@aily-project-linux/lib-rpi-spi',
    '@aily-project-linux/lib-rpi-picamera2',
  ],
  raspberrypi_5b: [
    ...PORTABLE,
    '@aily-project-linux/lib-gpio',
    '@aily-project-linux/lib-gpiozero-devices',
    '@aily-project-linux/lib-rpi-i2c',
    '@aily-project-linux/lib-rpi-spi',
    '@aily-project-linux/lib-rpi-picamera2',
  ],
  walnutpi_2: [
    ...PORTABLE,
    '@aily-project-linux/lib-adafruit-blinka',
    '@aily-project-linux/lib-gstreamer',
  ],
});

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function replaceSection(file, heading, nextHeading, contents) {
  const source = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const start = source.indexOf(`${heading}\n`);
  const end = source.indexOf(`${nextHeading}\n`, start + heading.length);
  if (start < 0 || end < 0) throw new Error(`${file}: section ${heading} .. ${nextHeading} not found`);
  const updated = `${source.slice(0, start)}${heading}\n\n${contents.trim()}\n\n${source.slice(end)}`;
  fs.writeFileSync(file, updated, 'utf8');
}

function replaceExact(file, before, after) {
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes(before)) {
    if (source.includes(after)) return;
    throw new Error(`${file}: expected text not found`);
  }
  fs.writeFileSync(file, source.replace(before, after), 'utf8');
}

function updateTemplates() {
  for (const [directory, libraries] of Object.entries(DEFAULT_LIBRARIES)) {
    const file = path.join(BOARDS_ROOT, directory, 'template', 'package.json');
    const project = JSON.parse(fs.readFileSync(file, 'utf8'));
    const boardPackage = Object.keys(project.dependencies).find((name) => name.startsWith('@aily-project-linux/board-'));
    if (!boardPackage) throw new Error(`${directory}: board dependency missing`);
    project.dependencies = Object.fromEntries(
      [boardPackage, ...FOUNDATION, ...libraries].map((name) => [name, VERSION]),
    );
    writeJson(file, project);
  }
}

function updateReadmes() {
  const raspberryPiLibraries = [
    '- 语言基础：`lib-core`、`lib-core-logic`、`lib-core-loop`、`lib-core-math`、`lib-core-text`、`lib-core-variables`、`lib-datetime`',
    '- 通用能力：`lib-file`、`lib-json`、`lib-vision`、`lib-network`、`lib-filesystem`、`lib-camera`、`lib-serial`、`lib-audio`',
    '- 树莓派硬件：`lib-gpio`、`lib-gpiozero-devices`、`lib-rpi-i2c`、`lib-rpi-spi`、`lib-rpi-picamera2`',
    '',
    'I²C、SPI、CSI 相机和 GPIO 仍需在 Raspberry Pi OS 中启用相应接口并配置设备权限。Build HAT、Sense HAT、IMX500、Hailo 和 AI 框架属于外设/版本敏感能力，不作为每个新项目的默认依赖，可按需添加。',
  ].join('\n');
  for (const directory of ['raspberrypi_0_2w', 'raspberrypi_4b', 'raspberrypi_5b']) {
    replaceSection(
      path.join(BOARDS_ROOT, directory, 'readme.md'),
      '## Libraries',
      '## Sources',
      `模板默认安装以下 0.0.1 功能包：\n\n${raspberryPiLibraries}`,
    );
  }

  const jetsonLibraries = [
    '模板默认加载语言基础、文件/JSON、视觉、网络、系统、USB 摄像头、串口与音频库，并使用 `@aily-project-linux/lib-jetson-gpio` 提供与 Orin 40-pin 匹配的 GPIO API，使用 `@aily-project-linux/lib-gstreamer` 构建 Jetson 常见视频管线。',
    '',
    '`Jetson.GPIO` 仍要求正确的用户组/udev 权限；Orin Nano/NX 的 GPIO 复用还可能需要 Jetson-IO 或设备树配置。npm 板包不会安装目标端 Python/系统包、修改 pinmux 或授予设备权限。',
    '',
    'CUDA、TensorRT、VPI、PyTorch、jetson-utils、jetson-inference 与 jetson-stats 均受 JetPack/镜像版本约束，因此不随空白项目默认加载，用户可按目标环境按需添加。',
  ].join('\n');
  for (const directory of ['jetson_orin_nano', 'jetson_orin_nx', 'jetson_agx_orin']) {
    replaceSection(
      path.join(BOARDS_ROOT, directory, 'readme.md'),
      '## Libraries and target requirements',
      '## Carrier-board scope',
      jetsonLibraries,
    );
  }

  replaceSection(
    path.join(BOARDS_ROOT, 'walnutpi_2', 'readme.md'),
    '## 模板依赖',
    '## 官方资料',
    [
      '新项目默认加载语言基础、文件/JSON、视觉、网络、系统、摄像头、串口、音频与 GStreamer 库，GPIO/总线入口改用 WalnutPi 官方 Python 教程采用的 `@aily-project-linux/lib-adafruit-blinka`，不再默认加载树莓派导向的 gpiozero 通用库。版本均为 `0.0.1`。',
      '',
      'Blinka 通过 `board`、`digitalio`、`pwmio` 和 `busio` 映射 WalnutPi 引脚；UART、I²C、SPI 和 PWM 的复用设置仍需按官方文档完成。模板只提供积木资产，不会修改 `set-device`、设备权限或系统包。',
    ].join('\n'),
  );

  replaceSection(
    path.join(BOARDS_ROOT, 'cybercam', 'readme.md'),
    '## Libraries',
    '## Autostart deployment',
    [
      "Like the Arduino UNO template's `lib-core-*` dependencies, the CyberCAM template explicitly installs its language foundation. Program structure comes from `@aily-project-linux/lib-core`; logic, loops, math, text, and variables come from the matching `lib-core-*` packages; and date/time blocks come from `@aily-project-linux/lib-datetime`.",
      '',
      'Portable vision, networking, file, JSON, and system operations come from `lib-vision`, `lib-network`, `lib-file`, `lib-json`, and `lib-filesystem`. Board-specific peripherals are split between `lib-cybercam`, `lib-cybercam-gpio`, `lib-cybercam-cv`, and `lib-serial`. All template packages currently use version `0.0.1`.',
      '',
      'The starter program uses `python_start` and `python_forever` from `lib-core`. VID/PID `1209:abd1` are retained for serial discovery only; SSH and serial remain the two connectors declared by `board.json`.',
    ].join('\n'),
  );

  replaceExact(
    path.join(BOARDS_ROOT, 'README.md'),
    '所有 Linux 板卡模板都显式依赖 Python 程序结构库 `@aily-project-linux/lib-core`，以及逻辑、循环、数学、文字、变量和日期时间基础库（`lib-core-*`、`lib-datetime`）。Jetson Orin、Raspberry Pi Zero 2 W/4B/5B 与 WalnutPi 2B 再按板卡能力加载通用 Linux 功能库；CyberCAM 使用 `lib-cybercam`、`lib-cybercam-gpio`、`lib-cybercam-cv` 和 `lib-serial` 等当前拆分包。',
    '所有模板都显式加载 Python 语言基础，以及文件、JSON、网络和系统能力；硬件入口按平台分流：Raspberry Pi 使用 gpiozero、I²C/SPI 与 Picamera2，Jetson Orin 使用 Jetson.GPIO 与 GStreamer，WalnutPi 2B 使用官方 Blinka 映射，CyberCAM 使用其板载外设拆分包。CUDA/TensorRT/PyTorch、Hailo、IMX500、Build HAT 等外设或版本敏感库不作为空白项目的默认依赖。',
  );
}

function updateTests() {
  const file = path.join(BOARDS_ROOT, 'test', 'board-metadata.test.js');
  replaceExact(file, `const linuxFeatureLibraries = [
  '@aily-project-linux/lib-vision',
  '@aily-project-linux/lib-network',
  '@aily-project-linux/lib-filesystem',
  '@aily-project-linux/lib-camera',
  '@aily-project-linux/lib-gpio',
  '@aily-project-linux/lib-serial',
  '@aily-project-linux/lib-audio',
];`, `const portableFeatureLibraries = [
  '@aily-project-linux/lib-file',
  '@aily-project-linux/lib-json',
  '@aily-project-linux/lib-vision',
  '@aily-project-linux/lib-network',
  '@aily-project-linux/lib-filesystem',
  '@aily-project-linux/lib-camera',
  '@aily-project-linux/lib-serial',
  '@aily-project-linux/lib-audio',
];

const templateLibraries = {
  cybercam: [
    '@aily-project-linux/lib-cybercam',
    '@aily-project-linux/lib-cybercam-cv',
    '@aily-project-linux/lib-cybercam-gpio',
    '@aily-project-linux/lib-vision',
    '@aily-project-linux/lib-network',
    '@aily-project-linux/lib-file',
    '@aily-project-linux/lib-json',
    '@aily-project-linux/lib-filesystem',
    '@aily-project-linux/lib-serial',
  ],
  jetson_agx_orin: [...portableFeatureLibraries, '@aily-project-linux/lib-jetson-gpio', '@aily-project-linux/lib-gstreamer'],
  jetson_orin_nano: [...portableFeatureLibraries, '@aily-project-linux/lib-jetson-gpio', '@aily-project-linux/lib-gstreamer'],
  jetson_orin_nx: [...portableFeatureLibraries, '@aily-project-linux/lib-jetson-gpio', '@aily-project-linux/lib-gstreamer'],
  raspberrypi_0_2w: [
    ...portableFeatureLibraries,
    '@aily-project-linux/lib-gpio',
    '@aily-project-linux/lib-gpiozero-devices',
    '@aily-project-linux/lib-rpi-i2c',
    '@aily-project-linux/lib-rpi-spi',
    '@aily-project-linux/lib-rpi-picamera2',
  ],
  raspberrypi_4b: [
    ...portableFeatureLibraries,
    '@aily-project-linux/lib-gpio',
    '@aily-project-linux/lib-gpiozero-devices',
    '@aily-project-linux/lib-rpi-i2c',
    '@aily-project-linux/lib-rpi-spi',
    '@aily-project-linux/lib-rpi-picamera2',
  ],
  raspberrypi_5b: [
    ...portableFeatureLibraries,
    '@aily-project-linux/lib-gpio',
    '@aily-project-linux/lib-gpiozero-devices',
    '@aily-project-linux/lib-rpi-i2c',
    '@aily-project-linux/lib-rpi-spi',
    '@aily-project-linux/lib-rpi-picamera2',
  ],
  walnutpi_2: [...portableFeatureLibraries, '@aily-project-linux/lib-adafruit-blinka', '@aily-project-linux/lib-gstreamer'],
};`);

  replaceExact(file, `    for (const packageName of pythonFoundationLibraries) {
      assert.equal(project.dependencies[packageName], '0.0.1');
    }
    assert.deepEqual(`, `    for (const packageName of pythonFoundationLibraries) {
      assert.equal(project.dependencies[packageName], '0.0.1');
    }
    assert.deepEqual(
      Object.keys(project.dependencies).filter(packageName => packageName.startsWith('@aily-project-linux/lib-')),
      [...pythonFoundationLibraries, ...templateLibraries[boardDirectory]],
    );
    assert.deepEqual(`);

  replaceExact(file, `  '@aily-project-linux/lib-file',
  '@aily-project-linux/lib-filesystem',`, `  '@aily-project-linux/lib-file',
  '@aily-project-linux/lib-json',
  '@aily-project-linux/lib-filesystem',`);

  replaceExact(file, `    for (const packageName of linuxFeatureLibraries) {
      assert.equal(project.dependencies[packageName], '0.0.1');
    }

`, '');
}

updateTemplates();
updateReadmes();
updateTests();
console.log(`Updated ${Object.keys(DEFAULT_LIBRARIES).length} board templates and their documentation/tests.`);
