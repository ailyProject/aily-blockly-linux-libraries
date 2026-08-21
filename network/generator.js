/* Socket communication and a standard-library HTTP file server. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ["addImport","addVariable","addFunction","addCleanup","valueToCode"];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Python Network received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

  const ORDER_MEMBER = Python.ORDER_MEMBER ?? 2.1;
  const ORDER_CALL = Python.ORDER_FUNCTION_CALL ?? 2.2;
  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const define = (type, generator) => { Python.forBlock[type] = generator; };
  const field = (block, name, fallback = '') => block.getFieldValue(name) ?? fallback;
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || fallback;
  const declareResource = (generator, tag, name, cleanup) => {
    generator.addVariable(tag, `${name} = None`);
    if (cleanup && typeof generator.addCleanup === 'function') {
      generator.addCleanup(tag, `if ${name} is not None:\n    ${name}.${cleanup}()`);
    }
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
    'socket', 'select', 'HTTPServer',
    'SimpleHTTPRequestHandler', '_python_socket', '_python_select',
    '_python_socket_builtins', '_python_socket_payload',
  ]);
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result) || PYTHON_BUILTINS.has(result)
        || GENERATED_IDENTIFIERS.has(result) || result.startsWith('_python_')) result += '_';
    return result || fallback;
  };
  const nameOf = (block, fallback) => safeName(field(block, 'NAME', fallback), fallback);
  const output = (code, order = ORDER_CALL) => [code, order];
  const addSocketImport = (generator) => generator.addImport('socket', 'import socket as _python_socket');
  const addSelectImport = (generator) => generator.addImport('select', 'import select as _python_select');
  const addSocketBuiltinsImport = (generator) => generator.addImport('socket_builtins', 'import builtins as _python_socket_builtins');
  const socketFamily = (block) => field(block, 'FAMILY', 'AF_INET') === 'AF_INET6' ? 'AF_INET6' : 'AF_INET';
  const socketType = (block) => field(block, 'TYPE', 'SOCK_STREAM') === 'SOCK_DGRAM' ? 'SOCK_DGRAM' : 'SOCK_STREAM';
  const shutdownHow = (block) => {
    const how = field(block, 'HOW', 'SHUT_RDWR');
    return ['SHUT_RD', 'SHUT_WR', 'SHUT_RDWR'].includes(how) ? how : 'SHUT_RDWR';
  };
  const assertDistinctNames = (operation, entries) => {
    const seen = new Map();
    for (const [role, name] of entries) {
      if (seen.has(name)) {
        throw new Error(`${operation} requires distinct identifiers; ${role} conflicts with ${seen.get(name)} (${name})`);
      }
      seen.set(name, role);
    }
  };
  const addSocketPayloadHelper = (generator) => {
    addSocketBuiltinsImport(generator);
    generator.addFunction('python_socket_payload', [
      'def _python_socket_payload(data):',
      '    if _python_socket_builtins.isinstance(data, _python_socket_builtins.str):',
      "        return data.encode('utf-8')",
      '    if _python_socket_builtins.isinstance(data, (_python_socket_builtins.bytes, _python_socket_builtins.bytearray, _python_socket_builtins.memoryview)):',
      '        return data',
      "    raise _python_socket_builtins.TypeError('socket payload must be str or bytes-like')",
    ].join('\n'));
  };
  define('python_socket_init', (block, generator) => {
    const name = nameOf(block, 'sock'); addSocketImport(generator);
    declareResource(generator, `socket_${name}`, name, 'close');
    return `${name} = _python_socket.socket(_python_socket.${socketFamily(block)}, _python_socket.${socketType(block)})\n`;
  });
  define('python_socket_address', (block, generator) => {
    addSocketImport(generator);
    return output(`_python_socket.getaddrinfo(${value(generator, block, 'HOST', "'127.0.0.1'")}, ${value(generator, block, 'PORT', '10000')}, family=_python_socket.${socketFamily(block)}, type=_python_socket.${socketType(block)})[0][4]`, ORDER_MEMBER);
  });
  define('python_socket_address_part', (block, generator) => {
    const index = field(block, 'PART', 'HOST') === 'PORT' ? 1 : 0;
    return output(`${value(generator, block, 'ADDRESS', "('127.0.0.1', 10000)", ORDER_MEMBER)}[${index}]`, ORDER_MEMBER);
  });
  define('python_socket_connect', (block, generator) => `${nameOf(block, 'sock')}.connect(${value(generator, block, 'ADDRESS', "('localhost', 80)")})\n`);
  define('python_socket_bind', (block, generator) => `${nameOf(block, 'sock')}.bind(${value(generator, block, 'ADDRESS', "('0.0.0.0', 8080)")})\n`);
  define('python_socket_listen', (block, generator) => `${nameOf(block, 'sock')}.listen(${value(generator, block, 'BACKLOG', '5')})\n`);
  define('python_socket_accept', (block) => output(`${nameOf(block, 'sock')}.accept()`));
  define('python_socket_accept_into', (block, generator) => {
    const server = nameOf(block, 'sock');
    const client = safeName(field(block, 'CLIENT_NAME', 'client'), 'client');
    const address = safeName(field(block, 'ADDRESS_NAME', 'client_address'), 'client_address');
    assertDistinctNames('socket accept', [['listening socket', server], ['client socket', client], ['peer address', address]]);
    declareResource(generator, `socket_${client}`, client, 'close');
    generator.addVariable(`socket_address_${address}`, `${address} = None`);
    return `${client}, ${address} = ${server}.accept()\n`;
  });
  define('python_socket_send', (block, generator) => {
    addSocketPayloadHelper(generator);
    return `${nameOf(block, 'sock')}.sendall(_python_socket_payload(${value(generator, block, 'DATA', "b''")}))\n`;
  });
  define('python_socket_receive', (block, generator) => output(`${nameOf(block, 'sock')}.recv(${value(generator, block, 'SIZE', '1024')})`));
  define('python_socket_send_to', (block, generator) => {
    addSocketPayloadHelper(generator);
    return `${nameOf(block, 'udp_sock')}.sendto(_python_socket_payload(${value(generator, block, 'DATA', "b''")}), ${value(generator, block, 'ADDRESS', "('127.0.0.1', 10000)")})\n`;
  });
  define('python_socket_receive_from', (block, generator) => output(`${nameOf(block, 'udp_sock')}.recvfrom(${value(generator, block, 'SIZE', '1024')})`));
  define('python_socket_receive_from_into', (block, generator) => {
    const socket = nameOf(block, 'udp_sock');
    const data = safeName(field(block, 'DATA_NAME', 'data'), 'data');
    const address = safeName(field(block, 'ADDRESS_NAME', 'sender_address'), 'sender_address');
    assertDistinctNames('socket recvfrom', [['UDP socket', socket], ['data', data], ['sender address', address]]);
    generator.addVariable(`socket_data_${data}`, `${data} = None`);
    generator.addVariable(`socket_address_${address}`, `${address} = None`);
    return `${data}, ${address} = ${socket}.recvfrom(${value(generator, block, 'SIZE', '1024')})\n`;
  });
  define('python_socket_set_timeout', (block, generator) => `${nameOf(block, 'sock')}.settimeout(${value(generator, block, 'SECONDS', '5')})\n`);
  define('python_socket_set_blocking', (block) => `${nameOf(block, 'sock')}.setblocking(${field(block, 'BLOCKING', 'TRUE') === 'FALSE' ? 'False' : 'True'})\n`);
  define('python_socket_set_option', (block, generator) => {
    addSocketImport(generator);
    const options = {
      SO_REUSEADDR: ['SOL_SOCKET', 'SO_REUSEADDR'],
      SO_BROADCAST: ['SOL_SOCKET', 'SO_BROADCAST'],
      SO_KEEPALIVE: ['SOL_SOCKET', 'SO_KEEPALIVE'],
      TCP_NODELAY: ['IPPROTO_TCP', 'TCP_NODELAY'],
    };
    const [level, option] = options[field(block, 'OPTION', 'SO_REUSEADDR')] || options.SO_REUSEADDR;
    const enabled = field(block, 'ENABLED', 'TRUE') === 'FALSE' ? 0 : 1;
    return `${nameOf(block, 'sock')}.setsockopt(_python_socket.${level}, _python_socket.${option}, ${enabled})\n`;
  });
  define('python_socket_ready', (block, generator) => {
    addSelectImport(generator);
    addSocketBuiltinsImport(generator);
    const name = nameOf(block, 'sock');
    const timeout = value(generator, block, 'TIMEOUT', '0');
    const write = field(block, 'MODE', 'READ') === 'WRITE';
    const readers = write ? '[]' : `[${name}]`;
    const writers = write ? `[${name}]` : '[]';
    return output(`_python_socket_builtins.bool(_python_select.select(${readers}, ${writers}, [], ${timeout})[${write ? 1 : 0}])`);
  });
  define('python_socket_endpoint', (block) => output(`${nameOf(block, 'sock')}.${field(block, 'ENDPOINT', 'LOCAL') === 'PEER' ? 'getpeername' : 'getsockname'}()`));
  define('python_socket_encode', (block, generator) => output(`${value(generator, block, 'TEXT', "''", ORDER_MEMBER)}.encode(${JSON.stringify(field(block, 'ENCODING', 'utf-8'))})`));
  define('python_socket_decode', (block, generator) => {
    addSocketBuiltinsImport(generator);
    return output(`_python_socket_builtins.bytes(${value(generator, block, 'DATA', "b''")}).decode(${JSON.stringify(field(block, 'ENCODING', 'utf-8'))}, errors=${JSON.stringify(field(block, 'ERRORS', 'replace'))})`);
  });
  define('python_socket_shutdown', (block, generator) => {
    addSocketImport(generator);
    return `${nameOf(block, 'sock')}.shutdown(_python_socket.${shutdownHow(block)})\n`;
  });
  define('python_socket_close', (block) => {
    const name = nameOf(block, 'sock');
    return `if ${name} is not None:\n    ${name}.close()\n    ${name} = None\n`;
  });

  define('python_http_server', (block, generator) => {
    generator.addImport('http_server', 'from http.server import HTTPServer, SimpleHTTPRequestHandler');
    return `HTTPServer((${value(generator, block, 'HOST', "'0.0.0.0'")}, ${value(generator, block, 'PORT', '8080')}), SimpleHTTPRequestHandler).serve_forever()\n`;
  });
});
