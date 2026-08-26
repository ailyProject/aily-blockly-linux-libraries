'use strict';

const path = require('node:path');
const {
  ROOT,
  addToolboxIcon,
  getPublishablePackages,
  writeJson,
} = require('./genjson');

const OUTPUT_FILE = 'libraries-linux-ai.json';
const FIELDS = ['name', 'nickname', 'description', 'compatibility', 'example', 'url'];

function filterPackageJson(packageJson) {
  const result = {};
  for (const field of FIELDS) {
    if (field === 'example' && !Object.hasOwn(packageJson, field)) {
      continue;
    }
    if (field === 'url') {
      result.url = packageJson.url || packageJson.homepage || '';
      continue;
    }
    result[field] = Object.hasOwn(packageJson, field) ? packageJson[field] : '';
  }
  return result;
}

function buildAiLibraries(rootDir = ROOT) {
  const packages = getPublishablePackages(rootDir);
  const libraries = packages.map(({ folderName, packageJson }) =>
    addToolboxIcon(rootDir, folderName, filterPackageJson(packageJson)),
  );

  if (libraries.length !== packages.length) {
    throw new Error(`AI 清单数量 ${libraries.length} 与可发布包数量 ${packages.length} 不一致`);
  }
  return libraries;
}

function main() {
  const libraries = buildAiLibraries(ROOT);
  writeJson(path.join(ROOT, OUTPUT_FILE), libraries);
  console.log(`已生成 ${OUTPUT_FILE}，共 ${libraries.length} 个库`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { buildAiLibraries };
