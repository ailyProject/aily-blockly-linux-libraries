'use strict';

const fs = require('node:fs');
const path = require('node:path');
const {
  isPlatformExclusive,
  platformFamiliesForTypes,
} = require('./sync-board-compatibility');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'PLATFORM-SPEC-AUDIT.md');

function libraryRecords() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .flatMap((directory) => {
      const file = path.join(ROOT, directory, 'package.json');
      if (!fs.existsSync(file)) return [];
      const metadata = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!String(metadata.name || '').startsWith('@aily-project-linux/lib-')) return [];
      const types = metadata.compatibility?.type;
      if (!Array.isArray(types) || !types.length) throw new Error(`${directory}: compatibility.type is empty`);
      const platforms = platformFamiliesForTypes(types);
      return [{
        directory,
        name: metadata.name,
        platforms,
        typeCount: types.length,
        exclusive: isPlatformExclusive(types),
        spec: metadata.spec === true,
      }];
    })
    .sort((left, right) => left.directory.localeCompare(right.directory));
}

function markdown(records) {
  const exclusive = records.filter((record) => record.exclusive);
  const missing = exclusive.filter((record) => !record.spec);
  const platformCounts = new Map();
  for (const record of exclusive) {
    const platform = record.platforms[0];
    platformCounts.set(platform, (platformCounts.get(platform) || 0) + 1);
  }
  const lines = [
    '# 平台专用库 spec 审计',
    '',
    '本清单依据 `catalog/board-types.json` 和每个库的 `package.json.compatibility.type` 逐包生成。平台家族按 SoC/厂商归并为 Raspberry Pi、NVIDIA Jetson、CyberCAM 和 WalnutPi；同一平台的多个板型仍视为单一平台。',
    '',
    '`spec: true` 会让库管理器执行精确的 `compatibility.type` 过滤。平台专用库必须设置该字段；跨平台库若仍需要排除部分板卡，也保留现有字段，避免客户端绕过兼容性过滤。',
    '',
    '## 审计结论',
    '',
    `- 库总数：${records.length}`,
    `- 单一平台专用库：${exclusive.length}`,
    `- 专用库缺少 \`spec: true\`：${missing.length}`,
    `- 专用库分布：${[...platformCounts].map(([platform, count]) => `${platform} ${count}`).join('；')}`,
    '',
    '## 逐库结果',
    '',
    '| 目录 | npm 包 | 平台家族 | type 数 | 平台专用 | spec | 结论 |',
    '| --- | --- | --- | ---: | --- | --- | --- |',
  ];
  for (const record of records) {
    const verdict = record.exclusive
      ? record.spec ? '专用库，标记正确' : '错误：缺少 spec'
      : record.spec ? '跨平台，保留精确 type 过滤' : '跨平台通用';
    lines.push(`| \`${record.directory}\` | \`${record.name}\` | ${record.platforms.join(' / ')} | ${record.typeCount} | ${record.exclusive ? '是' : '否'} | ${record.spec ? 'true' : '—'} | ${verdict} |`);
  }
  lines.push('');
  return lines.join('\n');
}

const records = libraryRecords();
const output = markdown(records);
if (process.argv.includes('--check')) {
  if (!fs.existsSync(OUTPUT) || fs.readFileSync(OUTPUT, 'utf8') !== output) {
    console.error('PLATFORM-SPEC-AUDIT.md is not up to date');
    process.exitCode = 1;
  } else {
    console.log(`Platform spec audit is current (${records.length} libraries).`);
  }
} else {
  fs.writeFileSync(OUTPUT, output, 'utf8');
  console.log(`Wrote platform spec audit for ${records.length} libraries.`);
}

module.exports = { libraryRecords, markdown };
