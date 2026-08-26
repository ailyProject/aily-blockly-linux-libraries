'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PACKAGE_PREFIX = '@aily-project-linux/lib-';
const OUTPUT_FILE = 'libraries-linux.json';
const I18N_SUFFIXES = ['zh_cn', 'en', 'zh_hk', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'ar'];
const I18N_PREFIXES = ['nickname', 'description'];
const FIELDS = [
  'name',
  'nickname',
  'version',
  'description',
  'author',
  'spec',
  'compatibility',
  'keywords',
  'tested',
  'icon',
  'example',
  'url',
  'tags',
];

function compareStrings(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function readJson(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error(`无法读取 ${filePath}: ${error.message}`);
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`无法解析 ${filePath}: ${error.message}`);
  }
}

function isCoreDirectory(folderName) {
  return folderName === 'core' || folderName.startsWith('core_');
}

function getPublishablePackages(rootDir = ROOT) {
  const packages = [];
  const packageNames = new Map();
  const entries = fs.readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => compareStrings(left.name, right.name));

  for (const entry of entries) {
    const packagePath = path.join(rootDir, entry.name, 'package.json');
    if (!fs.existsSync(packagePath)) {
      continue;
    }

    const packageJson = readJson(packagePath);
    if (packageJson.hide === true) {
      continue;
    }
    if (typeof packageJson.name !== 'string') {
      throw new Error(`${packagePath} 的 name 必须是字符串`);
    }
    if (!packageJson.name.startsWith(PACKAGE_PREFIX)) {
      continue;
    }

    if (packageNames.has(packageJson.name)) {
      throw new Error(
        `重复包名 ${packageJson.name}: ${packageNames.get(packageJson.name)} 与 ${entry.name}`,
      );
    }
    packageNames.set(packageJson.name, entry.name);
    packages.push({ folderName: entry.name, packageJson });
  }

  if (packages.length === 0) {
    throw new Error(`在 ${rootDir} 中没有找到可发布的 ${PACKAGE_PREFIX}* 包`);
  }

  return packages.sort((left, right) => {
    const groupOrder = (library) => {
      if (isCoreDirectory(library.folderName)) {
        return 2;
      }
      return library.packageJson.tested === true ? 0 : 1;
    };
    return groupOrder(left) - groupOrder(right)
      || compareStrings(left.packageJson.name, right.packageJson.name);
  });
}

function filterPackageJson(packageJson, fields = FIELDS) {
  const result = {};

  for (const field of fields) {
    if (field === 'spec') {
      if (packageJson.spec === true) {
        result.spec = true;
      }
      continue;
    }
    if (field === 'tested') {
      result.tested = packageJson.tested === true;
      continue;
    }
    if (field === 'example' && !Object.hasOwn(packageJson, field)) {
      continue;
    }
    if (field === 'url') {
      result.url = packageJson.url || packageJson.homepage || '';
      continue;
    }
    result[field] = Object.hasOwn(packageJson, field) ? packageJson[field] : '';
  }

  for (const prefix of I18N_PREFIXES) {
    for (const suffix of I18N_SUFFIXES) {
      const field = `${prefix}_${suffix}`;
      if (Object.hasOwn(packageJson, field)) {
        result[field] = packageJson[field];
      }
    }
  }

  return result;
}

function addToolboxIcon(rootDir, folderName, packageData) {
  if (packageData.icon) {
    return packageData;
  }

  const toolboxPath = path.join(rootDir, folderName, 'toolbox.json');
  if (!fs.existsSync(toolboxPath)) {
    throw new Error(`${folderName} 缺少 icon，且不存在 toolbox.json`);
  }

  const toolbox = readJson(toolboxPath);
  if (typeof toolbox.icon === 'string' && toolbox.icon) {
    packageData.icon = toolbox.icon;
  }
  if (!packageData.icon) {
    throw new Error(`${toolboxPath} 中没有有效的 icon`);
  }
  return packageData;
}

function buildLibraries(rootDir = ROOT, fields = FIELDS) {
  const packages = getPublishablePackages(rootDir);
  const libraries = packages.map(({ folderName, packageJson }) =>
    addToolboxIcon(rootDir, folderName, filterPackageJson(packageJson, fields)),
  );

  if (libraries.length !== packages.length) {
    throw new Error(`清单数量 ${libraries.length} 与可发布包数量 ${packages.length} 不一致`);
  }
  return libraries;
}

function writeJson(filePath, value, spacing) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, spacing)}\n`, 'utf8');
}

function main() {
  const libraries = buildLibraries(ROOT);
  const outputPath = path.join(ROOT, OUTPUT_FILE);
  writeJson(outputPath, libraries, 2);
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

module.exports = {
  PACKAGE_PREFIX,
  ROOT,
  addToolboxIcon,
  buildLibraries,
  compareStrings,
  getPublishablePackages,
  isCoreDirectory,
  readJson,
  writeJson,
};
