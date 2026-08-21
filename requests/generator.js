/* Requests HTTP client sessions, request options, responses, and streaming helpers. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = [
    'addImport', 'addVariable', 'addFunction', 'addCleanup',
    'valueToCode', 'statementToCode',
  ];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Requests received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

  const ORDER_ATOMIC = Python.ORDER_ATOMIC ?? 0;
  const ORDER_MEMBER = Python.ORDER_MEMBER ?? 2.1;
  const ORDER_CALL = Python.ORDER_FUNCTION_CALL ?? 2.2;
  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const define = (type, generator) => { Python.forBlock[type] = generator; };
  const field = (block, name, fallback = '') => block.getFieldValue(name) ?? fallback;
  const optionalValue = (generator, block, name, order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || '';
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    optionalValue(generator, block, name, order) || fallback;
  const output = (code, order = ORDER_CALL) => [code, order];

  const statement = (generator, block, name) => {
    const indent = generator.INDENT || '    ';
    const lines = (generator.statementToCode(block, name) || '')
      .replace(/\r\n/g, '\n')
      .split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    return lines
      .map((line) => line.startsWith(indent) ? line.slice(indent.length) : line)
      .join('\n');
  };
  const suite = (body, levels = 1) => {
    const indent = (Python.INDENT || '    ').repeat(levels);
    return (body || 'pass').split('\n').map((line) => `${indent}${line}`).join('\n');
  };

  const PYTHON_KEYWORDS = new Set([
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
    'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally',
    'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal',
    'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
  ]);
  const PYTHON_BUILTINS = new Set([
    'abs', 'aiter', 'all', 'anext', 'any', 'ascii', 'bin', 'bool',
    'breakpoint', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod',
    'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate',
    'eval', 'exec', 'filter', 'float', 'format', 'frozenset', 'getattr',
    'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int',
    'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals', 'map',
    'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord',
    'pow', 'print', 'property', 'range', 'repr', 'reversed', 'round', 'set',
    'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super',
    'tuple', 'type', 'vars', 'zip', '__import__', 'BaseException',
    'Exception', 'OSError', 'RuntimeError', 'TimeoutError', 'TypeError',
    'ValueError',
  ]);
  const GENERATED_IDENTIFIERS = new Set([
    'requests', '_python_requests', '_python_requests_builtins',
    '_python_requests_merge_options', '_python_requests_request_options',
  ]);
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result) || PYTHON_BUILTINS.has(result)
        || GENERATED_IDENTIFIERS.has(result) || result.startsWith('_python_')) result += '_';
    return result || fallback;
  };
  const uniqueName = (name, used) => {
    let result = name;
    let suffix = 2;
    while (used.has(result)) result = `${name}_${suffix++}`;
    used.add(result);
    return result;
  };
  const NAME_SCOPE_KEY = Symbol.for('@aily-project/python-name-scopes');
  const scopesOf = (generator) => generator[NAME_SCOPE_KEY] || [];
  const scopedName = (generator, rawName, fallback) => {
    const used = new Set();
    for (const scope of scopesOf(generator)) {
      for (const alias of scope.values()) used.add(alias);
    }
    return uniqueName(safeName(rawName, fallback), used);
  };
  const withNameScope = (generator, entries, generate) => {
    const scopes = scopesOf(generator);
    if (!generator[NAME_SCOPE_KEY]) generator[NAME_SCOPE_KEY] = scopes;
    scopes.push(new Map(entries.map(([name, alias]) => [String(name), alias])));
    try {
      return generate();
    } finally {
      scopes.pop();
      if (!scopes.length) delete generator[NAME_SCOPE_KEY];
    }
  };
  const TEMP_COUNTER_KEY = Symbol.for('@aily-project/requests-temp-counter');
  const privateName = (generator, stem) => {
    const next = (generator[TEMP_COUNTER_KEY] || 0) + 1;
    generator[TEMP_COUNTER_KEY] = next;
    return `_python_requests_${stem}${next === 1 ? '' : `_${next}`}`;
  };

  const sessionName = (block) => safeName(field(block, 'NAME', 'session'), 'session');
  const addRequestsImport = (generator) =>
    generator.addImport('requests', 'import requests as _python_requests');
  const addBuiltinsImport = (generator) =>
    generator.addImport('requests_builtins', 'import builtins as _python_requests_builtins');
  const addMergeOptionsHelper = (generator) => generator.addFunction('requests_merge_options', [
    'def _python_requests_merge_options(*parts):',
    '    merged = {}',
    '    for part in parts:',
    '        if part is not None:',
    '            merged.update(part)',
    '    return merged',
  ].join('\n'));
  const addRequestOptionsHelper = (generator) => {
    addMergeOptionsHelper(generator);
    generator.addFunction('requests_request_options', [
      'def _python_requests_request_options(*parts):',
      '    options = _python_requests_merge_options(*parts)',
      "    options.setdefault('timeout', (3.05, 30))",
      '    return options',
    ].join('\n'));
  };
  const dictCode = (entries) => entries.length
    ? `{${entries.map(([key, code]) => `${JSON.stringify(key)}: ${code}`).join(', ')}}`
    : '{}';
  const triState = (block, fieldName) => {
    const selected = field(block, fieldName, 'DEFAULT');
    if (selected === 'TRUE') return 'True';
    if (selected === 'FALSE') return 'False';
    return '';
  };
  const targetOf = (block, generator) => {
    const client = optionalValue(generator, block, 'CLIENT', ORDER_MEMBER);
    if (client) return client;
    addRequestsImport(generator);
    return '_python_requests';
  };
  const requestOptions = (generator, base, overrides = []) => {
    addRequestOptionsHelper(generator);
    const parts = [];
    if (base) parts.push(base);
    if (overrides.length) parts.push(dictCode(overrides));
    return `_python_requests_request_options(${parts.join(', ')})`;
  };
  const requestCall = (target, method, url, options) =>
    `${target}.request(${JSON.stringify(method)}, ${url}, **${options})`;
  const requestMethod = (block) => {
    const method = field(block, 'METHOD', 'GET');
    return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(method)
      ? method
      : 'GET';
  };
  const bodyMethod = (block) => {
    const method = field(block, 'METHOD', 'POST');
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) ? method : 'POST';
  };
  const uploadMethod = (block) => {
    const method = field(block, 'METHOD', 'POST');
    return ['POST', 'PUT', 'PATCH'].includes(method) ? method : 'POST';
  };
  const bodyKey = (block) => {
    const kind = field(block, 'BODY_KIND', 'NONE');
    return { JSON: 'json', DATA: 'data', FILES: 'files' }[kind] || '';
  };

  define('python_requests_session_init', (block, generator) => {
    const name = sessionName(block);
    addRequestsImport(generator);
    generator.addVariable(`requests_session_${name}`, `${name} = None`);
    generator.addCleanup(`requests_session_${name}`, [
      `if ${name} is not None:`,
      `    ${name}.close()`,
    ].join('\n'));
    return `${name} = _python_requests.Session()\n`;
  });

  define('python_requests_session_defaults', (block, generator) => {
    const name = sessionName(block);
    const lines = [];
    const updates = [
      ['HEADERS', 'headers'],
      ['PARAMS', 'params'],
      ['COOKIES', 'cookies'],
      ['PROXIES', 'proxies'],
    ];
    for (const [input, property] of updates) {
      const code = optionalValue(generator, block, input);
      if (code) lines.push(`${name}.${property}.update(${code})`);
    }
    for (const [input, property] of [['AUTH', 'auth'], ['VERIFY', 'verify'], ['CERT', 'cert']]) {
      const code = optionalValue(generator, block, input);
      if (code) lines.push(`${name}.${property} = ${code}`);
    }
    const trustEnv = triState(block, 'TRUST_ENV');
    if (trustEnv) lines.push(`${name}.trust_env = ${trustEnv}`);
    return lines.length ? `${lines.join('\n')}\n` : '';
  });

  define('python_requests_session_close', (block) => {
    const name = sessionName(block);
    return `if ${name} is not None:\n    ${name}.close()\n    ${name} = None\n`;
  });

  define('python_requests_request', (block, generator) => {
    const options = optionalValue(generator, block, 'OPTIONS');
    return output(requestCall(
      targetOf(block, generator),
      requestMethod(block),
      value(generator, block, 'URL', "''"),
      requestOptions(generator, options),
    ));
  });

  define('python_requests_get', (block, generator) => {
    const target = targetOf(block, generator);
    const params = optionalValue(generator, block, 'PARAMS');
    const options = optionalValue(generator, block, 'OPTIONS');
    const overrides = params ? [['params', params]] : [];
    return output(`${target}.get(${value(generator, block, 'URL', "''")}, **${requestOptions(generator, options, overrides)})`);
  });

  define('python_requests_send_body', (block, generator) => {
    const body = optionalValue(generator, block, 'BODY');
    const key = bodyKey(block);
    const options = optionalValue(generator, block, 'OPTIONS');
    const overrides = key && body ? [[key, body]] : [];
    return output(requestCall(
      targetOf(block, generator),
      bodyMethod(block),
      value(generator, block, 'URL', "''"),
      requestOptions(generator, options, overrides),
    ));
  });

  define('python_requests_content_options', (block, generator) => {
    const entries = [];
    for (const [input, key] of [
      ['PARAMS', 'params'], ['HEADERS', 'headers'], ['COOKIES', 'cookies'], ['AUTH', 'auth'],
    ]) {
      const code = optionalValue(generator, block, input);
      if (code) entries.push([key, code]);
    }
    const body = optionalValue(generator, block, 'BODY');
    const key = bodyKey(block);
    if (key && body) entries.push([key, body]);
    return output(dictCode(entries), ORDER_ATOMIC);
  });

  define('python_requests_network_options', (block, generator) => {
    const entries = [];
    for (const [input, key] of [['TIMEOUT', 'timeout'], ['PROXIES', 'proxies']]) {
      const code = optionalValue(generator, block, input);
      if (code) entries.push([key, code]);
    }
    const allowRedirects = triState(block, 'ALLOW_REDIRECTS');
    if (allowRedirects) entries.push(['allow_redirects', allowRedirects]);
    const stream = triState(block, 'STREAM');
    if (stream) entries.push(['stream', stream]);
    return output(dictCode(entries), ORDER_ATOMIC);
  });

  define('python_requests_tls_options', (block, generator) => {
    const mode = ['SYSTEM', 'CA_BUNDLE', 'INSECURE'].includes(field(block, 'VERIFY_MODE', 'SYSTEM'))
      ? field(block, 'VERIFY_MODE', 'SYSTEM')
      : 'SYSTEM';
    const caFile = optionalValue(generator, block, 'CA_FILE');
    const certFile = optionalValue(generator, block, 'CERT_FILE');
    const keyFile = optionalValue(generator, block, 'KEY_FILE');
    if (mode === 'CA_BUNDLE' && !caFile) {
      throw new Error('Requests TLS options in CA bundle mode require CA_FILE');
    }
    if (keyFile && !certFile) {
      throw new Error('Requests TLS options require CERT_FILE when KEY_FILE is connected');
    }
    const verify = mode === 'INSECURE' ? 'False' : mode === 'CA_BUNDLE' ? caFile : 'True';
    const entries = [['verify', verify]];
    if (certFile) entries.push(['cert', keyFile ? `(${certFile}, ${keyFile})` : certFile]);
    return output(dictCode(entries), ORDER_ATOMIC);
  });

  define('python_requests_merge_options', (block, generator) => {
    addMergeOptionsHelper(generator);
    return output(`_python_requests_merge_options(${value(generator, block, 'LEFT', '{}')}, ${value(generator, block, 'RIGHT', '{}')})`);
  });

  define('python_requests_auth', (block, generator) => {
    addRequestsImport(generator);
    const mode = field(block, 'MODE', 'BASIC') === 'DIGEST' ? 'HTTPDigestAuth' : 'HTTPBasicAuth';
    return output(`_python_requests.auth.${mode}(${value(generator, block, 'USERNAME', "''")}, ${value(generator, block, 'PASSWORD', "''")})`);
  });

  define('python_requests_timeout', (block, generator) => output(
    `(${value(generator, block, 'CONNECT', '3.05')}, ${value(generator, block, 'READ', '30')})`,
    ORDER_ATOMIC,
  ));

  define('python_requests_proxies', (block, generator) => {
    const entries = [];
    const http = optionalValue(generator, block, 'HTTP');
    const https = optionalValue(generator, block, 'HTTPS');
    if (http) entries.push(['http', http]);
    if (https) entries.push(['https', https]);
    return output(dictCode(entries), ORDER_ATOMIC);
  });

  define('python_requests_upload_file', (block, generator) => {
    const response = safeName(field(block, 'RESPONSE_NAME', 'response'), 'response');
    const target = targetOf(block, generator);
    const options = optionalValue(generator, block, 'OPTIONS');
    const filename = optionalValue(generator, block, 'FILENAME');
    const mime = optionalValue(generator, block, 'MIME');
    const fileHandle = privateName(generator, `upload_${response}`);
    let fileSpec = fileHandle;
    if (filename && mime) fileSpec = `(${filename}, ${fileHandle}, ${mime})`;
    else if (filename) fileSpec = `(${filename}, ${fileHandle})`;
    else if (mime) fileSpec = `(None, ${fileHandle}, ${mime})`;
    const files = `{'files': {${value(generator, block, 'FIELD', "'file'")}: ${fileSpec}}}`;
    addBuiltinsImport(generator);
    generator.addVariable(`requests_response_${response}`, `${response} = None`);
    addRequestOptionsHelper(generator);
    return [
      `with _python_requests_builtins.open(${value(generator, block, 'PATH', "''")}, 'rb') as ${fileHandle}:`,
      `    ${response} = ${requestCall(target, uploadMethod(block), value(generator, block, 'URL', "''"), `_python_requests_request_options(${[options, files].filter(Boolean).join(', ')})`)}`,
    ].join('\n') + '\n';
  });

  define('python_requests_response_property', (block, generator) => {
    const property = field(block, 'PROPERTY', 'status_code');
    const allowed = [
      'status_code', 'ok', 'text', 'content', 'headers', 'cookies', 'url', 'encoding', 'reason',
      'elapsed', 'history', 'request', 'raw', 'links',
    ];
    const safeProperty = allowed.includes(property) ? property : 'status_code';
    return output(`${value(generator, block, 'RESPONSE', 'None', ORDER_MEMBER)}.${safeProperty}`, ORDER_MEMBER);
  });

  define('python_requests_response_json', (block, generator) =>
    output(`${value(generator, block, 'RESPONSE', 'None', ORDER_MEMBER)}.json()`));

  define('python_requests_response_lookup', (block, generator) => {
    const property = field(block, 'SOURCE', 'HEADERS') === 'COOKIES' ? 'cookies' : 'headers';
    return output(`${value(generator, block, 'RESPONSE', 'None', ORDER_MEMBER)}.${property}.get(${value(generator, block, 'KEY', "''")}, ${value(generator, block, 'DEFAULT', 'None')})`);
  });

  define('python_requests_response_set_encoding', (block, generator) =>
    `${value(generator, block, 'RESPONSE', 'None', ORDER_MEMBER)}.encoding = ${value(generator, block, 'ENCODING', "'utf-8'")}\n`);

  define('python_requests_raise_for_status', (block, generator) =>
    `${value(generator, block, 'RESPONSE', 'None', ORDER_MEMBER)}.raise_for_status()\n`);

  define('python_requests_try', (block, generator) => {
    addRequestsImport(generator);
    const exception = {
      REQUEST: 'RequestException',
      CONNECTION: 'ConnectionError',
      TIMEOUT: 'Timeout',
      HTTP: 'HTTPError',
      REDIRECT: 'TooManyRedirects',
      JSON: 'JSONDecodeError',
      SSL: 'SSLError',
    }[field(block, 'EXCEPTION', 'REQUEST')] || 'RequestException';
    const rawError = field(block, 'ERROR_NAME', 'error');
    const error = scopedName(generator, rawError, 'error');
    const tryBody = statement(generator, block, 'TRY');
    const handleBody = withNameScope(
      generator,
      [[rawError, error]],
      () => statement(generator, block, 'HANDLE'),
    );
    const finallyBody = statement(generator, block, 'FINALLY');
    return [
      'try:',
      suite(tryBody),
      `except _python_requests.exceptions.${exception} as ${error}:`,
      suite(handleBody),
      'finally:',
      suite(finallyBody),
    ].join('\n') + '\n';
  });

  define('python_requests_for_chunks', (block, generator) => {
    const rawChunk = field(block, 'CHUNK_NAME', 'chunk');
    const chunk = scopedName(generator, rawChunk, 'chunk');
    const response = privateName(generator, 'chunk_response');
    const body = withNameScope(
      generator,
      [[rawChunk, chunk]],
      () => statement(generator, block, 'DO'),
    );
    const decodeUnicode = field(block, 'DECODE_UNICODE', 'FALSE') === 'TRUE' ? 'True' : 'False';
    const lines = [
      `${response} = ${value(generator, block, 'RESPONSE', 'None')}`,
      'try:',
      `    for ${chunk} in ${response}.iter_content(chunk_size=${value(generator, block, 'CHUNK_SIZE', '8192')}, decode_unicode=${decodeUnicode}):`,
      `        if not ${chunk}:`,
      '            continue',
    ];
    if (body) lines.push(...body.split('\n').map((line) => `        ${line}`));
    lines.push('finally:', `    ${response}.close()`);
    return `${lines.join('\n')}\n`;
  });

  define('python_requests_download', (block, generator) => {
    const target = targetOf(block, generator);
    const options = optionalValue(generator, block, 'OPTIONS');
    const response = privateName(generator, 'download_response');
    const file = privateName(generator, 'download_file');
    const chunk = privateName(generator, 'download_chunk');
    const prepared = requestOptions(generator, options, [['stream', 'True']]);
    addBuiltinsImport(generator);
    const lines = [
      `with ${target}.get(${value(generator, block, 'URL', "''")}, **${prepared}) as ${response}:`,
    ];
    if (field(block, 'RAISE', 'TRUE') !== 'FALSE') {
      lines.push(`    ${response}.raise_for_status()`);
    }
    lines.push(
      `    with _python_requests_builtins.open(${value(generator, block, 'PATH', "''")}, 'wb') as ${file}:`,
      `        for ${chunk} in ${response}.iter_content(chunk_size=${value(generator, block, 'CHUNK_SIZE', '8192')}):`,
      `            if ${chunk}:`,
      `                ${file}.write(${chunk})`,
    );
    return `${lines.join('\n')}\n`;
  });

  // Hidden compatibility blocks preserve the original CyberCAM Requests behavior.
  define('python_http_request', (block, generator) => {
    addRequestsImport(generator);
    const method = ['GET', 'POST', 'PUT', 'DELETE'].includes(field(block, 'METHOD', 'GET'))
      ? field(block, 'METHOD', 'GET')
      : 'GET';
    const url = value(generator, block, 'URL', "''");
    const data = value(generator, block, 'DATA', 'None');
    const argument = method === 'GET'
      ? `, params=${data}`
      : method === 'POST'
        ? `, json=${data}`
        : method === 'PUT'
          ? `, data=${data}`
          : '';
    return output(`_python_requests.${method.toLowerCase()}(${url}${argument})`);
  });

  define('python_http_response', (block, generator) => {
    const response = value(generator, block, 'RESPONSE', 'None', ORDER_MEMBER);
    const property = block.getFieldValue('PROPERTY');
    if (property == null) return output(`${response}.text`, ORDER_MEMBER);
    if (property === 'json()') return output(`${response}.json()`);
    return output(`${response}.${property === 'text' ? 'text' : 'status_code'}`, ORDER_MEMBER);
  });
});
