'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  ROOT,
  compareStrings,
  getPublishablePackages,
  readJson,
  writeJson,
} = require('./genjson');

const OUTPUT_FILE = 'libraries-linux-index.json';

function parseLibraryInfo(infoPath, folderName) {
  const info = readJson(infoPath);
  if (!info || typeof info.name !== 'string' || info.name === '') {
    throw new Error(`${infoPath} 缺少有效的 name`);
  }
  if (!Array.isArray(info.supportedCores)) {
    throw new Error(`${infoPath} 的 supportedCores 必须是数组`);
  }

  return {
    name: info.name,
    displayName: info.displayName || info.name || folderName,
    category: info.category || 'utility',
    subcategory: info.subcategory || '',
    supportedCores: info.supportedCores,
    communication: info.communication || [],
    voltage: info.voltage || [],
    hardwareType: info.hardwareType || [],
    compatibleHardware: info.compatibleHardware || [],
    functions: info.functions || [],
    tags: info.tags || [],
  };
}

function buildIndex(rootDir = ROOT, generated = new Date().toISOString()) {
  const packages = getPublishablePackages(rootDir);
  const libraries = [];
  const names = new Set();

  for (const { folderName } of packages) {
    const infoPath = path.join(rootDir, folderName, 'info.json');
    if (!fs.existsSync(infoPath)) {
      throw new Error(`${folderName} 缺少 info.json`);
    }
    const info = parseLibraryInfo(infoPath, folderName);
    if (names.has(info.name)) {
      throw new Error(`info.json 中存在重复库名: ${info.name}`);
    }
    names.add(info.name);
    libraries.push(info);
  }

  libraries.sort((left, right) => compareStrings(left.name, right.name));
  if (libraries.length !== packages.length) {
    throw new Error(`索引数量 ${libraries.length} 与可发布包数量 ${packages.length} 不一致`);
  }

  return {
    $schema: 'libraries-index-schema',
    version: '1.0.0',
    generated,
    count: libraries.length,
    libraries,
  };
}

function main() {
  const index = buildIndex(ROOT);
  writeJson(path.join(ROOT, OUTPUT_FILE), index);
  console.log(`已生成 ${OUTPUT_FILE}，共 ${index.count} 个库`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { buildIndex, parseLibraryInfo };
