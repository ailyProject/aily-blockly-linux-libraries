'use strict';

const path = require('node:path');
const {
  ROOT,
  compareStrings,
  getPublishablePackages,
  writeJson,
} = require('./genjson');

const OUTPUT_FILE = 'package-folder-map-linux.json';

function buildPackageFolderMap(rootDir = ROOT) {
  const packages = getPublishablePackages(rootDir)
    .sort((left, right) => compareStrings(left.packageJson.name, right.packageJson.name));
  const result = {};
  const folderNames = new Set();

  for (const { folderName, packageJson } of packages) {
    if (Object.hasOwn(result, packageJson.name)) {
      throw new Error(`重复包名: ${packageJson.name}`);
    }
    if (folderNames.has(folderName)) {
      throw new Error(`重复目录映射: ${folderName}`);
    }
    result[packageJson.name] = folderName;
    folderNames.add(folderName);
  }

  if (Object.keys(result).length !== packages.length || folderNames.size !== packages.length) {
    throw new Error('包名目录映射数量与可发布包数量不一致');
  }
  return result;
}

function main() {
  const packageFolderMap = buildPackageFolderMap(ROOT);
  writeJson(path.join(ROOT, OUTPUT_FILE), packageFolderMap, 2);
  console.log(`已生成 ${OUTPUT_FILE}，共 ${Object.keys(packageFolderMap).length} 个映射`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { buildPackageFolderMap };
