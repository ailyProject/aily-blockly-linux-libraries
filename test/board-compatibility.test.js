'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const BOARD_LIST = path.resolve(ROOT, '..', 'aily-blockly-linux-boards', 'LIST.md');
const SNAPSHOT = JSON.parse(fs.readFileSync(path.join(ROOT, 'catalog', 'board-types.json'), 'utf8'));
const {
  boardGroups,
  compatibilityFor,
  parseBoardTypes,
} = require('../scripts/sync-board-compatibility');

function libraryDirectories() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((directory) => {
      const file = path.join(ROOT, directory, 'package.json');
      if (!fs.existsSync(file)) return false;
      const metadata = JSON.parse(fs.readFileSync(file, 'utf8'));
      return String(metadata.name || '').startsWith('@aily-project-linux/lib-');
    })
    .sort();
}

test('local board type snapshot matches the boards repository LIST.md', { skip: !fs.existsSync(BOARD_LIST) }, () => {
  assert.deepEqual(parseBoardTypes(fs.readFileSync(BOARD_LIST, 'utf8')), SNAPSHOT.types);
});

test('all library compatibility entries use the canonical board types and platform profile', () => {
  const groups = boardGroups(SNAPSHOT.types);
  const knownTypes = new Set(SNAPSHOT.types);
  const directories = libraryDirectories();
  assert.equal(directories.length, 142);

  for (const directory of directories) {
    const metadata = JSON.parse(fs.readFileSync(path.join(ROOT, directory, 'package.json'), 'utf8'));
    assert.deepEqual(metadata.compatibility, {
      type: compatibilityFor(directory, groups),
      voltage: [3.3],
    }, `${directory}: compatibility profile`);
    assert.equal(new Set(metadata.compatibility.type).size, metadata.compatibility.type.length, `${directory}: duplicate type`);
    assert.ok(metadata.compatibility.type.every((type) => knownTypes.has(type)), `${directory}: unknown type`);
  }
});

test('board templates only depend on libraries compatible with their exact board type', { skip: !fs.existsSync(BOARD_LIST) }, () => {
  const boardRoot = path.dirname(BOARD_LIST);
  const packages = new Map();
  for (const directory of libraryDirectories()) {
    const metadata = JSON.parse(fs.readFileSync(path.join(ROOT, directory, 'package.json'), 'utf8'));
    packages.set(metadata.name, metadata);
  }

  for (const directory of fs.readdirSync(boardRoot)) {
    const boardFile = path.join(boardRoot, directory, 'board.json');
    const templateFile = path.join(boardRoot, directory, 'template', 'package.json');
    if (!fs.existsSync(boardFile) || !fs.existsSync(templateFile)) continue;
    const board = JSON.parse(fs.readFileSync(boardFile, 'utf8'));
    const template = JSON.parse(fs.readFileSync(templateFile, 'utf8'));
    for (const packageName of Object.keys(template.dependencies).filter((name) => name.startsWith('@aily-project-linux/lib-'))) {
      const metadata = packages.get(packageName);
      assert.ok(metadata, `${directory}: missing library package ${packageName}`);
      assert.ok(metadata.compatibility.type.includes(board.type), `${directory}: ${packageName} excludes ${board.type}`);
    }
  }
});
