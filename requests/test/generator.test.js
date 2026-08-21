const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const GENERATOR_SOURCE = fs.readFileSync(path.join(ROOT, 'generator.js'), 'utf8');
const NAME_SCOPE_KEY = Symbol.for('@aily-project/python-name-scopes');
const BLOCK_TYPES = [
  'python_requests_session_init',
  'python_requests_session_defaults',
  'python_requests_session_close',
  'python_requests_request',
  'python_requests_get',
  'python_requests_send_body',
  'python_requests_content_options',
  'python_requests_network_options',
  'python_requests_tls_options',
  'python_requests_merge_options',
  'python_requests_auth',
  'python_requests_timeout',
  'python_requests_proxies',
  'python_requests_upload_file',
  'python_requests_response_property',
  'python_requests_response_json',
  'python_requests_response_lookup',
  'python_requests_response_set_encoding',
  'python_requests_raise_for_status',
  'python_requests_try',
  'python_requests_for_chunks',
  'python_requests_download',
  'python_http_request',
  'python_http_response',
];

function loadGenerator(overrides = {}) {
  const codeDict = { imports: {}, variables: {}, functions: {}, cleanups: {} };
  const Python = {
    forBlock: {},
    ORDER_ATOMIC: 0,
    ORDER_MEMBER: 2.1,
    ORDER_FUNCTION_CALL: 2.2,
    ORDER_NONE: 99,
    INDENT: '    ',
    codeDict,
    addImport(key, code) { codeDict.imports[key] ??= code; },
    addVariable(key, code) { codeDict.variables[key] ??= code; },
    addFunction(key, code) { codeDict.functions[key] ??= code; },
    addCleanup(key, code) { codeDict.cleanups[key] ??= code; },
    valueToCode(target, name) { return target.values?.[name] || ''; },
    statementToCode(target, name) { return target.statements?.[name] || ''; },
    ...overrides,
  };
  const context = vm.createContext({ Python, console });
  vm.runInContext(GENERATOR_SOURCE, context, { filename: path.join(ROOT, 'generator.js') });
  return Python;
}

function block(fields = {}, values = {}, statements = {}) {
  return {
    fields,
    values,
    statements,
    getFieldValue(name) { return fields[name]; },
  };
}

function compilePython(source) {
  const commands = [
    ['wsl.exe', ['-e', 'python3', '-c', 'import ast,sys; ast.parse(sys.stdin.read())']],
    ['python', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())']],
    ['python3', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())']],
  ];
  const unavailable = [];
  for (const [command, args] of commands) {
    const result = spawnSync(command, args, { input: source, encoding: 'utf8', timeout: 15000 });
    if (result.error?.code === 'ENOENT') {
      unavailable.push(command);
      continue;
    }
    if (result.status === 0) return { command, result };
    if (command === 'wsl.exe' && (
      result.status === 4294967295
      || /(?:not installed|no installed distributions|WSL_E_|E_ACCESSDENIED)/i.test(`${result.stderr}\n${result.stdout}`)
    )) {
      unavailable.push(command);
      continue;
    }
    return { command, result };
  }
  return { unavailable };
}

const indent = (source, spaces = '    ') => source
  .trimEnd()
  .split('\n')
  .map((line) => `${spaces}${line}`)
  .join('\n');
const assertOutput = (actual, expected) => assert.deepEqual(Array.from(actual), expected);

test('registers exactly the 24 Requests generators in contract order', () => {
  const Python = loadGenerator();
  assert.deepEqual(Object.keys(Python.forBlock), BLOCK_TYPES);
  for (const type of BLOCK_TYPES) assert.equal(typeof Python.forBlock[type], 'function', type);
});

test('is inert without CPython and rejects an incomplete CPython generator', () => {
  assert.doesNotThrow(() => vm.runInNewContext(GENERATOR_SOURCE, {}));
  assert.throws(
    () => vm.runInNewContext(GENERATOR_SOURCE, { Python: { forBlock: {} } }),
    /incompatible CPython generator; missing addImport, addVariable, addFunction, addCleanup, valueToCode, statementToCode/,
  );
});

test('sessions use safe names, private imports, defaults, cleanup, and idempotent explicit close', () => {
  const Python = loadGenerator();
  const init = Python.forBlock.python_requests_session_init(block({ NAME: 'class' }), Python);
  const defaults = Python.forBlock.python_requests_session_defaults(block(
    { NAME: 'class', TRUST_ENV: 'FALSE' },
    {
      HEADERS: "{'User-Agent': 'CyberCAM'}",
      PARAMS: "{'lang': 'zh'}",
      AUTH: 'auth_value',
      VERIFY: "'/etc/ssl/custom.pem'",
      CERT: "('/cert.pem', '/key.pem')",
    },
  ), Python);
  const close = Python.forBlock.python_requests_session_close(block({ NAME: 'class' }), Python);

  assert.equal(Python.codeDict.imports.requests, 'import requests as _python_requests');
  assert.equal(Python.codeDict.variables.requests_session_class_, 'class_ = None');
  assert.equal(init, 'class_ = _python_requests.Session()\n');
  assert.equal(defaults, [
    "class_.headers.update({'User-Agent': 'CyberCAM'})",
    "class_.params.update({'lang': 'zh'})",
    'class_.auth = auth_value',
    "class_.verify = '/etc/ssl/custom.pem'",
    "class_.cert = ('/cert.pem', '/key.pem')",
    'class_.trust_env = False',
    '',
  ].join('\n'));
  assert.doesNotMatch(defaults, /cookies|proxies/);
  assert.equal(Python.codeDict.cleanups.requests_session_class_, 'if class_ is not None:\n    class_.close()');
  assert.equal(close, 'if class_ is not None:\n    class_.close()\n    class_ = None\n');
  assert.equal(
    Python.forBlock.python_requests_session_defaults(block({ NAME: 'session', TRUST_ENV: 'DEFAULT' }), Python),
    '',
  );
});

test('modern request blocks merge explicit inputs last and always add a finite default timeout', () => {
  const Python = loadGenerator();
  const generic = Python.forBlock.python_requests_request(block(
    { METHOD: 'PATCH' }, { URL: "'https://example.test/items'", OPTIONS: 'base_options' },
  ), Python);
  const invalid = Python.forBlock.python_requests_request(block(
    { METHOD: '__import__' }, { URL: "'https://example.test/'" },
  ), Python);
  const get = Python.forBlock.python_requests_get(block(
    {},
    { CLIENT: 'session', URL: "'https://example.test/search'", PARAMS: "{'q': 'camera'}", OPTIONS: 'base_options' },
  ), Python);
  const send = Python.forBlock.python_requests_send_body(block(
    { METHOD: 'DELETE', BODY_KIND: 'JSON' },
    { CLIENT: 'session', URL: "'https://example.test/items/1'", BODY: "{'confirm': True}", OPTIONS: 'base_options' },
  ), Python);
  const noBody = Python.forBlock.python_requests_send_body(block(
    { METHOD: 'TRACE', BODY_KIND: 'FILES' },
    { URL: "'https://example.test/'", OPTIONS: 'base_options' },
  ), Python);

  assert.equal(generic[0], '_python_requests.request("PATCH", \'https://example.test/items\', **_python_requests_request_options(base_options))');
  assert.equal(invalid[0], '_python_requests.request("GET", \'https://example.test/\', **_python_requests_request_options())');
  assert.equal(get[0], 'session.get(\'https://example.test/search\', **_python_requests_request_options(base_options, {"params": {\'q\': \'camera\'}}))');
  assert.equal(send[0], 'session.request("DELETE", \'https://example.test/items/1\', **_python_requests_request_options(base_options, {"json": {\'confirm\': True}}))');
  assert.equal(noBody[0], '_python_requests.request("POST", \'https://example.test/\', **_python_requests_request_options(base_options))');
  assert.equal(Python.codeDict.imports.requests, 'import requests as _python_requests');
  assert.match(Python.codeDict.functions.requests_merge_options, /for part in parts:[\s\S]*merged\.update\(part\)/);
  assert.match(Python.codeDict.functions.requests_request_options, /options = _python_requests_merge_options\(\*parts\)/);
  assert.match(Python.codeDict.functions.requests_request_options, /options\.setdefault\('timeout', \(3\.05, 30\)\)/);
  assert.ok(get[0].indexOf('base_options') < get[0].indexOf('{"params"'), 'explicit params must be merged last');
});

test('content, network, merge, timeout, and proxy option builders emit only selected values', () => {
  const Python = loadGenerator();
  const content = Python.forBlock.python_requests_content_options(block(
    { BODY_KIND: 'DATA' },
    {
      PARAMS: "{'page': 2}", HEADERS: "{'Accept': 'application/json'}",
      COOKIES: "{'sid': 'abc'}", AUTH: 'auth_value', BODY: "{'name': 'camera'}",
    },
  ), Python);
  const network = Python.forBlock.python_requests_network_options(block(
    { ALLOW_REDIRECTS: 'FALSE', STREAM: 'TRUE' },
    { TIMEOUT: '(2, 15)', PROXIES: 'proxy_options' },
  ), Python);
  const merged = Python.forBlock.python_requests_merge_options(block(
    {}, { LEFT: "{'timeout': 1, 'stream': False}", RIGHT: "{'timeout': 9}" },
  ), Python);
  const timeout = Python.forBlock.python_requests_timeout(block({}, { CONNECT: '1.5', READ: '20' }), Python);
  const proxies = Python.forBlock.python_requests_proxies(block({}, { HTTPS: "'http://proxy.local:8080'" }), Python);

  assertOutput(content, [
    '{"params": {\'page\': 2}, "headers": {\'Accept\': \'application/json\'}, "cookies": {\'sid\': \'abc\'}, "auth": auth_value, "data": {\'name\': \'camera\'}}',
    0,
  ]);
  assertOutput(network, ['{"timeout": (2, 15), "proxies": proxy_options, "allow_redirects": False, "stream": True}', 0]);
  assert.equal(merged[0], "_python_requests_merge_options({'timeout': 1, 'stream': False}, {'timeout': 9})");
  assertOutput(timeout, ['(1.5, 20)', 0]);
  assertOutput(proxies, ['{"https": \'http://proxy.local:8080\'}', 0]);
  assertOutput(Python.forBlock.python_requests_content_options(block(), Python), ['{}', 0]);
  assertOutput(Python.forBlock.python_requests_network_options(block(), Python), ['{}', 0]);
});

test('TLS options validate certificate combinations and auth dropdowns are allowlisted', () => {
  const Python = loadGenerator();
  const system = Python.forBlock.python_requests_tls_options(block({ VERIFY_MODE: 'SYSTEM' }), Python);
  const insecure = Python.forBlock.python_requests_tls_options(block(
    { VERIFY_MODE: 'INSECURE' }, {},
  ), Python);
  const custom = Python.forBlock.python_requests_tls_options(block(
    { VERIFY_MODE: 'CA_BUNDLE' },
    { CA_FILE: "'/ca.pem'", CERT_FILE: "'/client.pem'", KEY_FILE: "'/client.key'" },
  ), Python);
  const basic = Python.forBlock.python_requests_auth(block(
    { MODE: 'unexpected' }, { USERNAME: "'alice'", PASSWORD: "'secret'" },
  ), Python);
  const digest = Python.forBlock.python_requests_auth(block(
    { MODE: 'DIGEST' }, { USERNAME: "'bob'", PASSWORD: "'secret'" },
  ), Python);

  assertOutput(system, ['{"verify": True}', 0]);
  assertOutput(insecure, ['{"verify": False}', 0]);
  assertOutput(custom, ['{"verify": \'/ca.pem\', "cert": (\'/client.pem\', \'/client.key\')}', 0]);
  assert.equal(basic[0], "_python_requests.auth.HTTPBasicAuth('alice', 'secret')");
  assert.equal(digest[0], "_python_requests.auth.HTTPDigestAuth('bob', 'secret')");
  assert.throws(
    () => Python.forBlock.python_requests_tls_options(block({ VERIFY_MODE: 'CA_BUNDLE' }), Python),
    /require CA_FILE/,
  );
  assert.throws(
    () => Python.forBlock.python_requests_tls_options(block(
      { VERIFY_MODE: 'SYSTEM' }, { KEY_FILE: "'/client.key'" },
    ), Python),
    /require CERT_FILE/,
  );
});

test('file upload saves to a safe response variable and closes the binary file handle', () => {
  const Python = loadGenerator();
  const code = Python.forBlock.python_requests_upload_file(block(
    { RESPONSE_NAME: 'class', METHOD: 'PATCH' },
    {
      CLIENT: 'session', URL: "'https://example.test/upload'", FIELD: "'photo'",
      PATH: "'/tmp/photo.jpg'", FILENAME: "'photo.jpg'", MIME: "'image/jpeg'",
      OPTIONS: 'base_options',
    },
  ), Python);

  assert.equal(Python.codeDict.variables.requests_response_class_, 'class_ = None');
  assert.equal(Python.codeDict.imports.requests_builtins, 'import builtins as _python_requests_builtins');
  assert.match(code, /^with _python_requests_builtins\.open\('\/tmp\/photo\.jpg', 'rb'\) as _python_requests_upload_class_:/);
  assert.match(code, /class_ = session\.request\("PATCH", 'https:\/\/example\.test\/upload', \*\*_python_requests_request_options\(base_options, \{'files': \{'photo': \('photo\.jpg', _python_requests_upload_class_, 'image\/jpeg'\)\}\}\)\)/);
  assert.match(Python.codeDict.functions.requests_request_options, /setdefault\('timeout'/);
});

test('response accessors allowlist properties and preserve response operations', () => {
  const Python = loadGenerator();
  const property = Python.forBlock.python_requests_response_property(block(
    { PROPERTY: 'headers' }, { RESPONSE: 'response' },
  ), Python);
  const invalid = Python.forBlock.python_requests_response_property(block(
    { PROPERTY: '__class__.__mro__' }, { RESPONSE: 'response' },
  ), Python);
  const additionalProperties = ['elapsed', 'history', 'request', 'raw', 'links'].map((name) =>
    Python.forBlock.python_requests_response_property(block(
      { PROPERTY: name }, { RESPONSE: 'response' },
    ), Python));
  const json = Python.forBlock.python_requests_response_json(block({}, { RESPONSE: 'response' }), Python);
  const header = Python.forBlock.python_requests_response_lookup(block(
    { SOURCE: 'HEADERS' }, { RESPONSE: 'response', KEY: "'Content-Type'", DEFAULT: "''" },
  ), Python);
  const cookie = Python.forBlock.python_requests_response_lookup(block(
    { SOURCE: 'COOKIES' }, { RESPONSE: 'response', KEY: "'sid'" },
  ), Python);
  const encoding = Python.forBlock.python_requests_response_set_encoding(block(
    {}, { RESPONSE: 'response', ENCODING: "'utf-8'" },
  ), Python);
  const raiseStatus = Python.forBlock.python_requests_raise_for_status(block({}, { RESPONSE: 'response' }), Python);

  assertOutput(property, ['response.headers', 2.1]);
  assertOutput(invalid, ['response.status_code', 2.1]);
  additionalProperties.forEach((actual, index) => {
    const name = ['elapsed', 'history', 'request', 'raw', 'links'][index];
    assertOutput(actual, [`response.${name}`, 2.1]);
  });
  assertOutput(json, ['response.json()', 2.2]);
  assert.equal(header[0], "response.headers.get('Content-Type', '')");
  assert.equal(cookie[0], "response.cookies.get('sid', None)");
  assert.equal(encoding, "response.encoding = 'utf-8'\n");
  assert.equal(raiseStatus, 'response.raise_for_status()\n');
});

test('request try block scopes a safe exception name only inside the handler', () => {
  const Python = loadGenerator();
  Python[NAME_SCOPE_KEY] = [new Map([['outer error', 'error']])];
  const seenScopes = [];
  Python.statementToCode = (target, name) => {
    seenScopes.push([name, ...(Python[NAME_SCOPE_KEY] || []).flatMap((scope) => [...scope.values()])]);
    return target.statements?.[name] || '';
  };
  const code = Python.forBlock.python_requests_try(block(
    { ERROR_NAME: 'error', EXCEPTION: 'TIMEOUT' },
    {},
    {
      TRY: '    response = make_request()\n',
      HANDLE: '    print(error_2)\n',
      FINALLY: '    cleanup()\n',
    },
  ), Python);

  assert.equal(code, [
    'try:',
    '    response = make_request()',
    'except _python_requests.exceptions.Timeout as error_2:',
    '    print(error_2)',
    'finally:',
    '    cleanup()',
    '',
  ].join('\n'));
  assert.deepEqual(seenScopes, [
    ['TRY', 'error'],
    ['HANDLE', 'error', 'error_2'],
    ['FINALLY', 'error'],
  ]);
  assert.deepEqual([...Python[NAME_SCOPE_KEY][0]], [['outer error', 'error']]);

  const blank = Python.forBlock.python_requests_try(block(
    { ERROR_NAME: '1 bad-name', EXCEPTION: 'arbitrary' }, {}, {},
  ), Python);
  assert.match(blank, /^try:\n    pass\nexcept _python_requests\.exceptions\.RequestException as _1_bad_name:\n    pass\nfinally:\n    pass\n$/);
});

test('chunk iteration scopes its item, skips keep-alive chunks, and always closes the response', () => {
  const Python = loadGenerator();
  const captured = [];
  Python.statementToCode = (target, name) => {
    captured.push([...(Python[NAME_SCOPE_KEY] || []).flatMap((scope) => [...scope.entries()])]);
    return target.statements?.[name] || '';
  };
  const code = Python.forBlock.python_requests_for_chunks(block(
    { CHUNK_NAME: 'class', DECODE_UNICODE: 'TRUE' },
    { RESPONSE: 'response', CHUNK_SIZE: '4096' },
    { DO: '    consume(class_)\n' },
  ), Python);

  assert.equal(code, [
    '_python_requests_chunk_response = response',
    'try:',
    '    for class_ in _python_requests_chunk_response.iter_content(chunk_size=4096, decode_unicode=True):',
    '        if not class_:',
    '            continue',
    '        consume(class_)',
    'finally:',
    '    _python_requests_chunk_response.close()',
    '',
  ].join('\n'));
  assert.deepEqual(JSON.parse(JSON.stringify(captured)), [[['class', 'class_']]]);
  assert.equal(Python[NAME_SCOPE_KEY], undefined);
});

test('download forces streaming after caller options and closes both response and output file', () => {
  const Python = loadGenerator();
  const code = Python.forBlock.python_requests_download(block(
    { RAISE: 'TRUE' },
    {
      CLIENT: 'session', URL: "'https://example.test/image.jpg'", PATH: "'/tmp/image.jpg'",
      OPTIONS: "{'stream': False, 'timeout': 60}", CHUNK_SIZE: '65536',
    },
  ), Python);

  assert.match(code, /^with session\.get\('https:\/\/example\.test\/image\.jpg', \*\*_python_requests_request_options\(\{'stream': False, 'timeout': 60\}, \{"stream": True\}\)\) as _python_requests_download_response:/);
  assert.match(code, /_python_requests_download_response\.raise_for_status\(\)/);
  assert.match(code, /with _python_requests_builtins\.open\('\/tmp\/image\.jpg', 'wb'\) as _python_requests_download_file_2:/);
  assert.match(code, /iter_content\(chunk_size=65536\)/);
  assert.match(code, /if _python_requests_download_chunk_3:[\s\S]*\.write\(_python_requests_download_chunk_3\)/);
  assert.ok(code.indexOf("{'stream': False") < code.indexOf('{"stream": True}'), 'forced stream=True must win');

  const withoutRaise = Python.forBlock.python_requests_download(block(
    { RAISE: 'FALSE' }, { URL: "'https://example.test/'", PATH: "'/tmp/body'" },
  ), Python);
  assert.doesNotMatch(withoutRaise, /raise_for_status/);
});

test('hidden legacy blocks preserve the original method/body and response semantics without timeout injection', () => {
  const Python = loadGenerator();
  const get = Python.forBlock.python_http_request(block(
    { METHOD: 'GET' }, { URL: "'http://httpbin.org/get'", DATA: 'payload' },
  ), Python);
  const post = Python.forBlock.python_http_request(block(
    { METHOD: 'POST' }, { URL: "'http://httpbin.org/post'", DATA: 'payload' },
  ), Python);
  const put = Python.forBlock.python_http_request(block(
    { METHOD: 'PUT' }, { URL: "'http://httpbin.org/put'", DATA: 'payload' },
  ), Python);
  const remove = Python.forBlock.python_http_request(block(
    { METHOD: 'DELETE' }, { URL: "'http://httpbin.org/delete'", DATA: 'must_be_ignored' },
  ), Python);

  assertOutput(get, ["_python_requests.get('http://httpbin.org/get', params=payload)", 2.2]);
  assertOutput(post, ["_python_requests.post('http://httpbin.org/post', json=payload)", 2.2]);
  assertOutput(put, ["_python_requests.put('http://httpbin.org/put', data=payload)", 2.2]);
  assertOutput(remove, ["_python_requests.delete('http://httpbin.org/delete')", 2.2]);
  assert.equal(Python.codeDict.functions.requests_request_options, undefined);
  for (const code of [get[0], post[0], put[0], remove[0]]) assert.doesNotMatch(code, /timeout/);

  assertOutput(Python.forBlock.python_http_response(block(
    { PROPERTY: 'status_code' }, { RESPONSE: 'response' },
  ), Python), ['response.status_code', 2.1]);
  assertOutput(Python.forBlock.python_http_response(block(
    { PROPERTY: 'text' }, { RESPONSE: 'response' },
  ), Python), ['response.text', 2.1]);
  assertOutput(Python.forBlock.python_http_response(block(
    { PROPERTY: 'json()' }, { RESPONSE: 'response' },
  ), Python), ['response.json()', 2.2]);
  assertOutput(Python.forBlock.python_http_response(block(
    {}, { RESPONSE: 'response' },
  ), Python), ['response.text', 2.1]);
  assertOutput(Python.forBlock.python_http_response(block(
    { PROPERTY: '__dict__' }, { RESPONSE: 'response' },
  ), Python), ['response.status_code', 2.1]);
});

test('representative generated Requests source parses as Python', (t) => {
  const Python = loadGenerator();
  const body = [];
  body.push(Python.forBlock.python_requests_session_init(block({ NAME: 'session' }), Python));
  body.push(Python.forBlock.python_requests_session_defaults(block(
    { NAME: 'session', TRUST_ENV: 'TRUE' },
    { HEADERS: "{'User-Agent': 'Blockly'}", VERIFY: 'True' },
  ), Python));
  const get = Python.forBlock.python_requests_get(block(
    {}, { CLIENT: 'session', URL: "'https://example.test/api'", PARAMS: "{'page': 1}" },
  ), Python);
  body.push(`response = ${get[0]}\n`);
  body.push(Python.forBlock.python_requests_raise_for_status(block({}, { RESPONSE: 'response' }), Python));
  body.push(Python.forBlock.python_requests_upload_file(block(
    { RESPONSE_NAME: 'upload_response', METHOD: 'POST' },
    {
      CLIENT: 'session', URL: "'https://example.test/upload'", FIELD: "'file'",
      PATH: "'/tmp/input.bin'", FILENAME: "'input.bin'", MIME: "'application/octet-stream'",
    },
  ), Python));
  body.push(Python.forBlock.python_requests_download(block(
    { RAISE: 'TRUE' },
    { CLIENT: 'session', URL: "'https://example.test/download'", PATH: "'/tmp/output.bin'" },
  ), Python));
  body.push(Python.forBlock.python_requests_try(block(
    { ERROR_NAME: 'request_error', EXCEPTION: 'REQUEST' },
    {},
    { TRY: '    response.raise_for_status()\n', HANDLE: '    print(request_error)\n' },
  ), Python));
  body.push(Python.forBlock.python_requests_for_chunks(block(
    { CHUNK_NAME: 'chunk', DECODE_UNICODE: 'FALSE' },
    { RESPONSE: 'response', CHUNK_SIZE: '8192' },
    { DO: '    print(len(chunk))\n' },
  ), Python));
  body.push(Python.forBlock.python_requests_session_close(block({ NAME: 'session' }), Python));

  const source = [
    Object.values(Python.codeDict.imports).join('\n'),
    Object.values(Python.codeDict.variables).join('\n'),
    Object.values(Python.codeDict.functions).join('\n\n'),
    `def _representative_program():\n${indent(body.join(''))}`,
    `def _representative_cleanup():\n${indent(Object.values(Python.codeDict.cleanups).join('\n'))}`,
  ].filter(Boolean).join('\n\n') + '\n';

  assert.match(source, /import requests as _python_requests/);
  assert.match(source, /setdefault\('timeout', \(3\.05, 30\)\)/);
  assert.match(source, /with _python_requests_builtins\.open\('\/tmp\/input\.bin', 'rb'\)/);
  assert.match(source, /with _python_requests_builtins\.open\('\/tmp\/output\.bin', 'wb'\)/);
  const compiled = compilePython(source);
  if (compiled.unavailable) {
    t.skip(`no CPython interpreter available (${compiled.unavailable.join(', ')})`);
    return;
  }
  assert.equal(compiled.result.status, 0, `${compiled.command}: ${compiled.result.stderr || source}`);
});
