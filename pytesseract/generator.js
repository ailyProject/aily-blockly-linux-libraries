/* Curated pytesseract bridge for Raspberry Pi and Linux CPython projects. */
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
  const ORDER_MEMBER = Python.ORDER_MEMBER ?? 2.1;
  const ORDER_CALL = Python.ORDER_FUNCTION_CALL ?? 2.2;
  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const field = (block, name, fallback = '') => block.getFieldValue(name) ?? fallback;
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || fallback;
  const selected = (values, requested) => values.has(requested) ? requested : values.values().next().value;
  const dotted = (base, path) => `${base}.${path}`;
  const output = (code, order = ORDER_CALL) => [code, order];
  const addImport = (generator) => generator.addImport(spec.importKey, `import ${spec.module} as ${spec.alias}`);

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
    addImport(generator);
    addAsyncBridge(generator);
    if (spec.asyncBridge) {
      return `_python_sbc_async_call(${target}, (${args}), (${kwargs}))`;
    }
    return `${target}(*(${args}), **(${kwargs}))`;
  };

  Python.forBlock[`${spec.prefix}_call`] = (block, generator) => {
    const name = selected(callables, field(block, 'TARGET'));
    const code = callCode(
      generator,
      dotted(spec.alias, name),
      value(generator, block, 'ARGS', '[]'),
      value(generator, block, 'KWARGS', '{}'),
    );
    return output(code);
  };
  Python.forBlock[`${spec.prefix}_do`] = (block, generator) => {
    const name = selected(callables, field(block, 'TARGET'));
    const code = callCode(
      generator,
      dotted(spec.alias, name),
      value(generator, block, 'ARGS', '[]'),
      value(generator, block, 'KWARGS', '{}'),
    );
    return `${code}\n`;
  };

  if (methods.size) {
    Python.forBlock[`${spec.prefix}_method`] = (block, generator) => {
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
      const object = value(generator, block, 'OBJECT', spec.alias);
      const name = selected(attributes, field(block, 'ATTRIBUTE'));
      return output(`(${object}).${name}`, ORDER_MEMBER);
    };
  }
})(globalThis, {
    "title": "pytesseract",
    "prefix": "python_pytesseract",
    "module": "pytesseract",
    "alias": "_python_lib_pytesseract",
    "importKey": "python_lib_pytesseract",
    "callables": [
      "image_to_string",
      "image_to_data",
      "image_to_boxes",
      "image_to_osd",
      "get_languages"
    ],
    "methods": [],
    "attributes": [
      "Output.DICT",
      "Output.STRING",
      "Output.DATAFRAME"
    ],
    "asyncBridge": false
  });
