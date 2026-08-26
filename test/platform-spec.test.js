'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {
  isPlatformExclusive,
  platformFamiliesForTypes,
} = require('../scripts/sync-board-compatibility');

const ROOT = path.resolve(__dirname, '..');

function libraryRecords() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const file = path.join(ROOT, entry.name, 'package.json');
      if (!fs.existsSync(file)) return [];
      const metadata = JSON.parse(fs.readFileSync(file, 'utf8'));
      return String(metadata.name || '').startsWith('@aily-project-linux/lib-')
        ? [{ directory: entry.name, metadata }]
        : [];
    });
}

test('every single-platform library declares spec true', () => {
  const records = libraryRecords();
  const exclusive = records.filter(({ metadata }) => isPlatformExclusive(metadata.compatibility.type));
  assert.equal(records.length, 142);
  assert.equal(exclusive.length, 29);
  assert.deepEqual(
    exclusive.reduce((counts, { metadata }) => {
      const platform = platformFamiliesForTypes(metadata.compatibility.type)[0];
      counts[platform] = (counts[platform] || 0) + 1;
      return counts;
    }, {}),
    {
      CyberCAM: 3,
      'NVIDIA Jetson': 11,
      'Raspberry Pi': 15,
    },
  );
  for (const { directory, metadata } of exclusive) {
    assert.equal(metadata.spec, true, `${directory}: single-platform package must declare spec true`);
  }
});

test('platform spec audit lists every package and is current', () => {
  const audit = fs.readFileSync(path.join(ROOT, 'PLATFORM-SPEC-AUDIT.md'), 'utf8');
  assert.equal((audit.match(/^\| `[^`]+` \| `@aily-project\/lib-/gm) || []).length, 142);
  assert.match(audit, /专用库缺少 `spec: true`：0/);
});
