'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');

function loadPackage(id) {
  const Python = {
    forBlock: Object.create(null),
    ORDER_MEMBER: 2.1,
    ORDER_FUNCTION_CALL: 2.2,
    ORDER_NONE: 99,
    addImport() {},
    valueToCode() {},
    addVariable() {},
    addFunction() {},
    addCleanup() {},
  };
  const file = path.join(ROOT, id, 'generator.js');
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { Python }, {
    filename: path.relative(ROOT, file),
    timeout: 1_000,
  });
  return Python.forBlock;
}

function invoke(handler, fields = {}, values = {}) {
  const calls = { imports: [], variables: [], functions: [], cleanups: [] };
  const generator = {
    valueToCode(_block, name) {
      return values[name] ?? '';
    },
    addImport(...args) {
      calls.imports.push(args);
    },
    addVariable(...args) {
      calls.variables.push(args);
    },
    addFunction(...args) {
      calls.functions.push(args);
    },
    addCleanup(...args) {
      calls.cleanups.push(args);
    },
  };
  const block = { getFieldValue: (name) => fields[name] };
  const result = handler(block, generator);
  return { calls, code: Array.isArray(result) ? result[0] : result };
}

function assertImport(calls, key, statement) {
  assert.ok(calls.imports.some((entry) => entry[0] === key && entry[1] === statement), [
    'missing import',
    key,
    statement,
    JSON.stringify(calls.imports),
  ].join(': '));
}

test('Blinka maps board, digitalio, pwmio, and busio callables under CPython', () => {
  const blocks = loadPackage('adafruit_blinka');
  const cases = [
    ['I2C', '_python_lib_adafruit_blinka.I2C', 'python_lib_adafruit_blinka', 'import board as _python_lib_adafruit_blinka'],
    ['DigitalInOut', '_python_lib_adafruit_blinka_digitalio.DigitalInOut', 'python_lib_adafruit_blinka_digitalio', 'import digitalio as _python_lib_adafruit_blinka_digitalio'],
    ['PWMOut', '_python_lib_adafruit_blinka_pwmio.PWMOut', 'python_lib_adafruit_blinka_pwmio', 'import pwmio as _python_lib_adafruit_blinka_pwmio'],
    ['UART', '_python_lib_adafruit_blinka_busio.UART', 'python_lib_adafruit_blinka_busio', 'import busio as _python_lib_adafruit_blinka_busio'],
  ];
  for (const [target, codeTarget, importKey, statement] of cases) {
    const generated = invoke(blocks.python_adafruit_blinka_call, { TARGET: target }, {
      ARGS: '[]',
      KWARGS: '{}',
    });
    assert.ok(generated.code.includes(codeTarget), target);
    assertImport(generated.calls, importKey, statement);
  }

  const pin = invoke(blocks.python_adafruit_blinka_attribute, { ATTRIBUTE: 'D0' }, { OBJECT: 'wrong_object' });
  assert.equal(pin.code, '_python_lib_adafruit_blinka.D0');
  const value = invoke(blocks.python_adafruit_blinka_attribute, { ATTRIBUTE: 'value' }, { OBJECT: 'digital_pin' });
  assert.equal(value.code, '(digital_pin).value');
});

test('ADS1x15 and MCP3xxx expose their official AnalogIn paths and constants', () => {
  const ads = loadPackage('adafruit_ads1x15');
  const analog = invoke(ads.python_adafruit_ads1x15_call, { TARGET: 'AnalogIn' }, {
    ARGS: '[ads, pin]',
    KWARGS: '{}',
  });
  assert.ok(analog.code.includes('_python_lib_adafruit_ads1x15_analog_in.AnalogIn'));
  assertImport(
    analog.calls,
    'python_lib_adafruit_ads1x15_analog_in',
    'import adafruit_ads1x15.analog_in as _python_lib_adafruit_ads1x15_analog_in',
  );
  assert.equal(
    invoke(ads.python_adafruit_ads1x15_attribute, { ATTRIBUTE: 'Pin.A0' }, { OBJECT: 'channel' }).code,
    '_python_lib_adafruit_ads1x15_ads1x15.Pin.A0',
  );
  assert.equal(
    invoke(ads.python_adafruit_ads1x15_attribute, { ATTRIBUTE: 'value' }, { OBJECT: 'channel' }).code,
    '(channel).value',
  );

  const mcp = loadPackage('adafruit_mcp3xxx');
  const mcpAnalog = invoke(mcp.python_adafruit_mcp3xxx_call, { TARGET: 'AnalogIn' }, {
    ARGS: '[mcp, pin]',
    KWARGS: '{}',
  });
  assert.ok(mcpAnalog.code.includes('_python_lib_adafruit_mcp3xxx_analog_in.AnalogIn'));
  assertImport(
    mcpAnalog.calls,
    'python_lib_adafruit_mcp3xxx_analog_in',
    'import adafruit_mcp3xxx.analog_in as _python_lib_adafruit_mcp3xxx_analog_in',
  );
  assert.equal(
    invoke(mcp.python_adafruit_mcp3xxx_attribute, { ATTRIBUTE: 'P0' }, { OBJECT: 'channel' }).code,
    '_python_lib_adafruit_mcp3xxx.P0',
  );
});

test('watchdog exposes a usable event handler without weakening dropdown safety', () => {
  const blocks = loadPackage('watchdog');
  const loggingHandler = invoke(blocks.linux_watchdog_call, { TARGET: 'LoggingEventHandler' }, {
    ARGS: '[]',
    KWARGS: '{}',
  });
  assert.ok(loggingHandler.code.includes('_python_lib_watchdog_events.LoggingEventHandler'));
  assertImport(
    loggingHandler.calls,
    'python_lib_watchdog_events',
    'import watchdog.events as _python_lib_watchdog_events',
  );

  const injected = invoke(blocks.linux_watchdog_call, {
    TARGET: '__import__("os").system("bad")',
  }, { ARGS: '[]', KWARGS: '{}' });
  assert.ok(injected.code.includes('_python_lib_watchdog.Observer'));
  assert.ok(!injected.code.includes('__import__'));
});

test('PN532 exposes the Raspberry Pi preferred SPI constructor', () => {
  const blocks = loadPackage('adafruit_pn532');
  const spi = invoke(blocks.python_adafruit_pn532_call, { TARGET: 'PN532_SPI' }, {
    ARGS: '[spi, cs]',
    KWARGS: '{}',
  });
  assert.ok(spi.code.includes('_python_lib_adafruit_pn532_spi.PN532_SPI'));
  assertImport(
    spi.calls,
    'python_lib_adafruit_pn532_spi',
    'import adafruit_pn532.spi as _python_lib_adafruit_pn532_spi',
  );

  const injected = invoke(blocks.python_adafruit_pn532_call, {
    TARGET: '__import__("os").system("bad")',
  }, { ARGS: '[]', KWARGS: '{}' });
  assert.ok(injected.code.includes('_python_lib_adafruit_pn532.PN532_I2C'));
  assert.ok(!injected.code.includes('__import__'));
});

test('DepthAI node constants and MPU6050 cycle generate as attributes', () => {
  const depthai = loadPackage('depthai');
  const camera = invoke(depthai.python_depthai_attribute, { ATTRIBUTE: 'node.Camera' }, {
    OBJECT: 'wrong_object',
  });
  assert.equal(camera.code, '_python_lib_depthai.node.Camera');

  const mpu = loadPackage('adafruit_mpu6050');
  assert.equal(typeof mpu.python_adafruit_mpu6050_method, 'function');
  const cycle = invoke(mpu.python_adafruit_mpu6050_attribute, { ATTRIBUTE: 'cycle' }, {
    OBJECT: 'sensor',
  });
  assert.equal(cycle.code, '(sensor).cycle');
});

test('server runners avoid nested event loops and PyYAML exposes only safe loaders', () => {
  const uvicorn = loadPackage('uvicorn');
  const run = invoke(uvicorn.python_uvicorn_call, { TARGET: 'run' }, {
    ARGS: "['app:app']",
    KWARGS: '{}',
  });
  assert.ok(run.code.includes('_python_lib_uvicorn.run'));
  assert.ok(!run.code.includes('_python_sbc_async_call'));
  assert.equal(run.calls.variables.length, 0);

  const aiohttpBlocks = JSON.parse(fs.readFileSync(path.join(ROOT, 'aiohttp', 'block.json'), 'utf8'));
  const aioTargets = aiohttpBlocks[0].args0[0].options.map((option) => option[1]);
  assert.ok(!aioTargets.includes('web.run_app'));

  const yamlBlocks = JSON.parse(fs.readFileSync(path.join(ROOT, 'pyyaml', 'block.json'), 'utf8'));
  const yamlTargets = yamlBlocks[0].args0[0].options.map((option) => option[1]);
  assert.deepEqual(yamlTargets, ['safe_load', 'safe_load_all', 'safe_dump', 'safe_dump_all']);
  assert.ok(!yamlTargets.includes('load'));
});
