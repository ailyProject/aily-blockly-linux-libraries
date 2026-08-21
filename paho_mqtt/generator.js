/* Paho MQTT 2.x client configuration, callbacks, publishing, subscribing, and network loops. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addFunction', 'addCleanup', 'valueToCode', 'statementToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Paho MQTT received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
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
  const statement = (generator, block, name) => {
    const indent = generator.INDENT || '    ';
    const lines = (generator.statementToCode(block, name) || '')
      .replace(/\r\n/g, '\n')
      .split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    return lines
      .map(line => line.startsWith(indent) ? line.slice(indent.length) : line)
      .join('\n');
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
    'mqtt', '_python_paho_mqtt', '_python_mqtt_publish_info',
  ]);
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result) || PYTHON_BUILTINS.has(result)
        || GENERATED_IDENTIFIERS.has(result) || result.startsWith('_python_')) result += '_';
    return result || fallback;
  };
  const NAME_SCOPE_KEY = Symbol.for('@aily-project/python-name-scopes');
  const scopesOf = (generator) => generator[NAME_SCOPE_KEY] || [];
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
  const uniqueName = (name, used) => {
    let result = name;
    let suffix = 2;
    while (used.has(result)) result = `${name}_${suffix++}`;
    used.add(result);
    return result;
  };
  const callbackKey = (generator, event, client) => {
    const base = `mqtt_${event}_${client}`;
    const functions = generator.codeDict?.functions || {};
    let key = base;
    let suffix = 2;
    while (Object.prototype.hasOwnProperty.call(functions, key)) key = `${base}_${suffix++}`;
    return key;
  };
  const nameOf = (block, fallback = 'client') => safeName(field(block, 'NAME', fallback), fallback);
  const output = (code, order = ORDER_CALL) => [code, order];
  const addMqttImport = (generator) => generator.addImport('paho_mqtt', 'import paho.mqtt.client as _python_paho_mqtt');
  const addBuiltinsImport = (generator) => generator.addImport('paho_mqtt_builtins', 'import builtins as _python_paho_builtins');
  const qosOf = (block) => ['0', '1', '2'].includes(field(block, 'QOS', '0')) ? field(block, 'QOS', '0') : '0';
  const retainOf = (block) => field(block, 'RETAIN', 'FALSE') === 'TRUE' ? 'True' : 'False';
  const protocolOf = (block) => field(block, 'PROTOCOL', 'MQTTv311') === 'MQTTv5' ? 'MQTTv5' : 'MQTTv311';
  const transportOf = (block) => field(block, 'TRANSPORT', 'tcp') === 'websockets' ? 'websockets' : 'tcp';
  const declareClient = (generator, name) => {
    generator.addVariable(`mqtt_${name}`, `${name} = None`);
    generator.addCleanup(`mqtt_${name}`, [
      `if ${name} is not None:`,
      `    if ${name}.is_connected():`,
      `        ${name}.disconnect()`,
      `    ${name}.loop_stop()`,
    ].join('\n'));
  };
  const callbackBody = (body) => body
    ? body.split('\n').map((line) => `    ${line}`)
    : ['    pass'];

  define('python_mqtt_init', (block, generator) => {
    const name = nameOf(block);
    addMqttImport(generator);
    declareClient(generator, name);
    return [
      `${name} = _python_paho_mqtt.Client(`,
      '    callback_api_version=_python_paho_mqtt.CallbackAPIVersion.VERSION2,',
      `    client_id=${value(generator, block, 'CLIENT_ID', "''")},`,
      `    protocol=_python_paho_mqtt.${protocolOf(block)},`,
      `    transport=${JSON.stringify(transportOf(block))},`,
      ')',
    ].join('\n') + '\n';
  });
  define('python_mqtt_set_auth', (block, generator) =>
    `${nameOf(block)}.username_pw_set(${value(generator, block, 'USERNAME', "''")}, password=${value(generator, block, 'PASSWORD', 'None')})\n`);
  define('python_mqtt_set_tls', (block, generator) =>
    `${nameOf(block)}.tls_set(ca_certs=${value(generator, block, 'CA_FILE', 'None')}, certfile=${value(generator, block, 'CERT_FILE', 'None')}, keyfile=${value(generator, block, 'KEY_FILE', 'None')})\n`);
  define('python_mqtt_set_will', (block, generator) =>
    `${nameOf(block)}.will_set(${value(generator, block, 'TOPIC', "''")}, payload=${value(generator, block, 'PAYLOAD', "b''")}, qos=${qosOf(block)}, retain=${retainOf(block)})\n`);
  define('python_mqtt_set_websocket_options', (block, generator) =>
    `${nameOf(block)}.ws_set_options(path=${value(generator, block, 'PATH', "'/mqtt'")})\n`);
  define('python_mqtt_set_reconnect_delay', (block, generator) =>
    `${nameOf(block)}.reconnect_delay_set(min_delay=${value(generator, block, 'MIN_DELAY', '1')}, max_delay=${value(generator, block, 'MAX_DELAY', '120')})\n`);
  define('python_mqtt_connect', (block, generator) =>
    `${nameOf(block)}.connect(${value(generator, block, 'HOST', "'localhost'")}, port=${value(generator, block, 'PORT', '1883')}, keepalive=${value(generator, block, 'KEEPALIVE', '60')})\n`);

  define('python_mqtt_on_connect', (block, generator) => {
    const client = nameOf(block);
    const rawSuccess = field(block, 'SUCCESS_NAME', 'connected');
    const rawReason = field(block, 'REASON_NAME', 'reason_code');
    const rawSession = field(block, 'SESSION_PRESENT_NAME', 'session_present');
    const used = new Set([client]);
    const success = uniqueName(safeName(rawSuccess, 'connected'), used);
    const reason = uniqueName(safeName(rawReason, 'reason_code'), used);
    const session = uniqueName(safeName(rawSession, 'session_present'), used);
    const callbackClient = client;
    const userdata = uniqueName('userdata', used);
    const flags = uniqueName('flags', used);
    const callbackReason = uniqueName('reason_code', used);
    const properties = uniqueName('properties', used);
    const body = withNameScope(
      generator,
      [[rawSuccess, success], [rawReason, reason], [rawSession, session]],
      () => statement(generator, block, 'DO'),
    );
    const functionKey = callbackKey(generator, 'on_connect', client);
    const handler = `_python_${functionKey}`;
    generator.addFunction(functionKey, [
      `def ${handler}(${callbackClient}, ${userdata}, ${flags}, ${callbackReason}, ${properties}):`,
      `    ${success} = not ${callbackReason}.is_failure`,
      `    ${reason} = ${callbackReason}`,
      `    ${session} = ${flags}.session_present`,
      ...callbackBody(body),
    ].join('\n') + '\n');
    return `${client}.on_connect = ${handler}\n`;
  });
  define('python_mqtt_on_message', (block, generator) => {
    const client = nameOf(block);
    const rawTopic = field(block, 'TOPIC_NAME', 'topic');
    const rawPayload = field(block, 'PAYLOAD_NAME', 'payload');
    const rawQos = field(block, 'QOS_NAME', 'qos');
    const rawRetained = field(block, 'RETAIN_NAME', 'retained');
    const used = new Set([client]);
    const topic = uniqueName(safeName(rawTopic, 'topic'), used);
    const payload = uniqueName(safeName(rawPayload, 'payload'), used);
    const qos = uniqueName(safeName(rawQos, 'qos'), used);
    const retained = uniqueName(safeName(rawRetained, 'retained'), used);
    const callbackClient = client;
    const userdata = uniqueName('userdata', used);
    const message = uniqueName('message', used);
    const body = withNameScope(
      generator,
      [[rawTopic, topic], [rawPayload, payload], [rawQos, qos], [rawRetained, retained]],
      () => statement(generator, block, 'DO'),
    );
    const functionKey = callbackKey(generator, 'on_message', client);
    const handler = `_python_${functionKey}`;
    generator.addFunction(functionKey, [
      `def ${handler}(${callbackClient}, ${userdata}, ${message}):`,
      `    ${topic} = ${message}.topic`,
      `    ${payload} = ${message}.payload`,
      `    ${qos} = ${message}.qos`,
      `    ${retained} = ${message}.retain`,
      ...callbackBody(body),
    ].join('\n') + '\n');
    return `${client}.on_message = ${handler}\n`;
  });
  define('python_mqtt_on_disconnect', (block, generator) => {
    const client = nameOf(block);
    const rawReason = field(block, 'REASON_NAME', 'disconnect_reason');
    const rawFromServer = field(block, 'FROM_SERVER_NAME', 'from_server');
    const used = new Set([client]);
    const reason = uniqueName(safeName(rawReason, 'disconnect_reason'), used);
    const fromServer = uniqueName(safeName(rawFromServer, 'from_server'), used);
    const callbackClient = client;
    const userdata = uniqueName('userdata', used);
    const flags = uniqueName('disconnect_flags', used);
    const callbackReason = uniqueName('reason_code', used);
    const properties = uniqueName('properties', used);
    const body = withNameScope(
      generator,
      [[rawReason, reason], [rawFromServer, fromServer]],
      () => statement(generator, block, 'DO'),
    );
    const functionKey = callbackKey(generator, 'on_disconnect', client);
    const handler = `_python_${functionKey}`;
    generator.addFunction(functionKey, [
      `def ${handler}(${callbackClient}, ${userdata}, ${flags}, ${callbackReason}, ${properties}):`,
      `    ${reason} = ${callbackReason}`,
      `    ${fromServer} = ${flags}.is_disconnect_packet_from_server`,
      ...callbackBody(body),
    ].join('\n') + '\n');
    return `${client}.on_disconnect = ${handler}\n`;
  });

  define('python_mqtt_publish', (block, generator) =>
    `${nameOf(block)}.publish(${value(generator, block, 'TOPIC', "''")}, payload=${value(generator, block, 'MESSAGE', "''")}, qos=${qosOf(block)}, retain=${retainOf(block)})\n`);
  define('python_mqtt_publish_wait', (block, generator) => {
    addBuiltinsImport(generator);
    return [
      `_python_mqtt_publish_info = ${nameOf(block)}.publish(${value(generator, block, 'TOPIC', "''")}, payload=${value(generator, block, 'MESSAGE', "''")}, qos=${qosOf(block)}, retain=${retainOf(block)})`,
      `_python_mqtt_publish_info.wait_for_publish(timeout=${value(generator, block, 'TIMEOUT', '10')})`,
      'if not _python_mqtt_publish_info.is_published():',
      "    raise _python_paho_builtins.TimeoutError('MQTT publish did not complete before timeout')",
    ].join('\n') + '\n';
  });
  define('python_mqtt_subscribe', (block, generator) =>
    `${nameOf(block)}.subscribe(${value(generator, block, 'TOPIC', "''")}, qos=${qosOf(block)})\n`);
  define('python_mqtt_unsubscribe', (block, generator) =>
    `${nameOf(block)}.unsubscribe(${value(generator, block, 'TOPIC', "''")})\n`);
  define('python_mqtt_decode_payload', (block, generator) =>
    output(`${value(generator, block, 'PAYLOAD', "b''", ORDER_MEMBER)}.decode(${JSON.stringify(field(block, 'ENCODING', 'utf-8'))}, errors=${JSON.stringify(field(block, 'ERRORS', 'replace'))})`));
  define('python_mqtt_is_connected', (block) => output(`${nameOf(block)}.is_connected()`));
  define('python_mqtt_loop_start', (block) => `${nameOf(block)}.loop_start()\n`);
  define('python_mqtt_loop_stop', (block) => `${nameOf(block)}.loop_stop()\n`);
  define('python_mqtt_loop_once', (block, generator) =>
    `${nameOf(block)}.loop(timeout=${value(generator, block, 'TIMEOUT', '1')})\n`);
  define('python_mqtt_loop', (block) => `${nameOf(block)}.loop_forever()\n`);
  define('python_mqtt_disconnect', (block) => `${nameOf(block)}.disconnect()\n`);
});
