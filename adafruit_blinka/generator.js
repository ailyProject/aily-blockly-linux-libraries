/* Curated Adafruit Blinka bridge for Raspberry Pi and Linux CPython projects. */
(function (root, spec) {
  'use strict';

  const Python = root.Python;
  if (Python == null) return;
  const requiredMethods = ['addImport', 'valueToCode'];
  if (spec.asyncBridge) requiredMethods.push('addVariable', 'addFunction', 'addCleanup');
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`${spec.title} received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }

  const PATH = /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/;
  const allowlist = (values, label) => {
    if (!Array.isArray(values) || values.some((value) => !PATH.test(value))) {
      throw new Error(`${spec.title} has an invalid ${label} allowlist`);
    }
    return new Set(values);
  };
  const callables = allowlist(spec.callables, 'callable');
  const methods = allowlist(spec.methods, 'method');
  const attributes = allowlist(spec.attributes, 'attribute');
  const boardAttributes = new Set([
    'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D17', 'D18',
    'SCL', 'SDA', 'SCLK', 'MOSI', 'MISO', 'CE0', 'CE1',
  ]);
  const ORDER_MEMBER = Python.ORDER_MEMBER ?? 2.1;
  const ORDER_CALL = Python.ORDER_FUNCTION_CALL ?? 2.2;
  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const field = (block, name, fallback = '') => block.getFieldValue(name) ?? fallback;
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || fallback;
  const selected = (values, requested) => values.has(requested) ? requested : values.values().next().value;
  const dotted = (base, path) => `${base}.${path}`;
  const output = (code, order = ORDER_CALL) => [code, order];
  const callableTargets = {
    I2C: { key: spec.importKey, statement: `import board as ${spec.alias}`, target: `${spec.alias}.I2C` },
    SPI: { key: spec.importKey, statement: `import board as ${spec.alias}`, target: `${spec.alias}.SPI` },
    DigitalInOut: {
      key: `${spec.importKey}_digitalio`,
      statement: `import digitalio as ${spec.alias}_digitalio`,
      target: `${spec.alias}_digitalio.DigitalInOut`,
    },
    PWMOut: {
      key: `${spec.importKey}_pwmio`,
      statement: `import pwmio as ${spec.alias}_pwmio`,
      target: `${spec.alias}_pwmio.PWMOut`,
    },
    UART: {
      key: `${spec.importKey}_busio`,
      statement: `import busio as ${spec.alias}_busio`,
      target: `${spec.alias}_busio.UART`,
    },
  };
  const addImport = (generator) => generator.addImport(spec.importKey, `import board as ${spec.alias}`);
  const callableTarget = (generator, requested) => {
    const name = selected(callables, requested);
    const entry = callableTargets[name] || callableTargets.I2C;
    generator.addImport(entry.key, entry.statement);
    return entry.target;
  };

  const addAsyncBridge = (generator) => {
    if (!spec.asyncBridge) return;
    generator.addImport('python_sbc_asyncio', 'import asyncio as _python_sbc_asyncio');
    generator.addImport('python_sbc_inspect', 'import inspect as _python_sbc_inspect');
    generator.addImport('python_sbc_threading', 'import threading as _python_sbc_threading');
    generator.addVariable(
      'python_sbc_async_runtime_state',
      '_python_sbc_async_loop = None\n_python_sbc_async_thread = None',
    );
    generator.addFunction('python_sbc_async_runtime', [
      'def _python_sbc_async_call(callable_, args=None, kwargs=None):',
      '    global _python_sbc_async_loop, _python_sbc_async_thread',
      '    if _python_sbc_async_loop is None:',
      '        _python_sbc_async_loop = _python_sbc_asyncio.new_event_loop()',
      '        def _python_sbc_run_loop():',
      '            _python_sbc_asyncio.set_event_loop(_python_sbc_async_loop)',
      '            _python_sbc_async_loop.run_forever()',
      '        _python_sbc_async_thread = _python_sbc_threading.Thread(target=_python_sbc_run_loop, daemon=True)',
      '        _python_sbc_async_thread.start()',
      '    async def _python_sbc_invoke():',
      '        result = callable_(*([] if args is None else args), **({} if kwargs is None else kwargs))',
      '        if _python_sbc_inspect.isawaitable(result):',
      '            return await result',
      '        return result',
      '    future = _python_sbc_asyncio.run_coroutine_threadsafe(_python_sbc_invoke(), _python_sbc_async_loop)',
      '    return future.result()',
    ].join('\n'));
    generator.addCleanup('python_sbc_async_runtime', [
      'if _python_sbc_async_loop is not None:',
      '    _python_sbc_async_loop.call_soon_threadsafe(_python_sbc_async_loop.stop)',
      'if _python_sbc_async_thread is not None:',
      '    _python_sbc_async_thread.join(timeout=2)',
    ].join('\n'));
  };
  const callCode = (generator, target, args, kwargs) => {
    addAsyncBridge(generator);
    if (spec.asyncBridge) {
      return `_python_sbc_async_call(${target}, (${args}), (${kwargs}))`;
    }
    return `${target}(*(${args}), **(${kwargs}))`;
  };

  Python.forBlock[`${spec.prefix}_call`] = (block, generator) => {
    const code = callCode(
      generator,
      callableTarget(generator, field(block, 'TARGET')),
      value(generator, block, 'ARGS', '[]'),
      value(generator, block, 'KWARGS', '{}'),
    );
    return output(code);
  };
  Python.forBlock[`${spec.prefix}_do`] = (block, generator) => {
    const code = callCode(
      generator,
      callableTarget(generator, field(block, 'TARGET')),
      value(generator, block, 'ARGS', '[]'),
      value(generator, block, 'KWARGS', '{}'),
    );
    return `${code}\n`;
  };

  if (methods.size) {
    Python.forBlock[`${spec.prefix}_method`] = (block, generator) => {
      addImport(generator);
      const object = value(generator, block, 'OBJECT', spec.alias);
      const name = selected(methods, field(block, 'METHOD'));
      const code = callCode(
        generator,
        `(${object}).${name}`,
        value(generator, block, 'ARGS', '[]'),
        value(generator, block, 'KWARGS', '{}'),
      );
      return output(code);
    };
    Python.forBlock[`${spec.prefix}_do_method`] = (block, generator) => {
      addImport(generator);
      const object = value(generator, block, 'OBJECT', spec.alias);
      const name = selected(methods, field(block, 'METHOD'));
      const code = callCode(
        generator,
        `(${object}).${name}`,
        value(generator, block, 'ARGS', '[]'),
        value(generator, block, 'KWARGS', '{}'),
      );
      return `${code}\n`;
    };
  }

  if (attributes.size) {
    Python.forBlock[`${spec.prefix}_attribute`] = (block, generator) => {
      addImport(generator);
      const name = selected(attributes, field(block, 'ATTRIBUTE'));
      if (boardAttributes.has(name)) return output(`${spec.alias}.${name}`, ORDER_MEMBER);
      const object = value(generator, block, 'OBJECT', spec.alias);
      return output(`(${object}).${name}`, ORDER_MEMBER);
    };
  }
})(globalThis, {
    "title": "Adafruit Blinka",
    "prefix": "python_adafruit_blinka",
    "module": "board",
    "alias": "_python_lib_adafruit_blinka",
    "importKey": "python_lib_adafruit_blinka",
    "callables": [
      "I2C",
      "SPI",
      "DigitalInOut",
      "PWMOut",
      "UART"
    ],
    "methods": [
      "try_lock",
      "unlock",
      "scan",
      "readfrom_into",
      "writeto",
      "writeto_then_readfrom",
      "configure",
      "switch_to_input",
      "switch_to_output",
      "read",
      "readinto",
      "write",
      "deinit"
    ],
    "attributes": [
      "D0",
      "D1",
      "D2",
      "D3",
      "D4",
      "D5",
      "D6",
      "D17",
      "D18",
      "SCL",
      "SDA",
      "SCLK",
      "MOSI",
      "MISO",
      "CE0",
      "CE1",
      "value",
      "direction",
      "pull",
      "duty_cycle",
      "frequency",
      "in_waiting"
    ],
    "asyncBridge": false
  });
