const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const NAME_SCOPE_KEY = Symbol.for('@aily-project/python-name-scopes');
const BLOCK_TYPES = [
  'python_mqtt_init',
  'python_mqtt_set_auth',
  'python_mqtt_set_tls',
  'python_mqtt_set_will',
  'python_mqtt_set_websocket_options',
  'python_mqtt_set_reconnect_delay',
  'python_mqtt_connect',
  'python_mqtt_on_connect',
  'python_mqtt_on_message',
  'python_mqtt_on_disconnect',
  'python_mqtt_publish',
  'python_mqtt_publish_wait',
  'python_mqtt_subscribe',
  'python_mqtt_unsubscribe',
  'python_mqtt_decode_payload',
  'python_mqtt_is_connected',
  'python_mqtt_loop_start',
  'python_mqtt_loop_stop',
  'python_mqtt_loop_once',
  'python_mqtt_loop',
  'python_mqtt_disconnect',
];

function loadGenerator() {
  const codeDict = { imports: {}, variables: {}, functions: {}, cleanups: {} };
  const Python = {
    forBlock: {},
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
  };
  const context = vm.createContext({ Python, console });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'generator.js'), 'utf8'), context, {
    filename: path.join(ROOT, 'generator.js'),
  });
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

test('mock CPython generator receives all 21 Paho MQTT generators', () => {
  const Python = loadGenerator();
  assert.deepEqual(Object.keys(Python.forBlock), BLOCK_TYPES);
  for (const type of BLOCK_TYPES) assert.equal(typeof Python.forBlock[type], 'function', type);
});

test('client, authentication, TLS, will, WebSocket, reconnect and connect use Paho 2.x APIs', () => {
  const Python = loadGenerator();
  const init = Python.forBlock.python_mqtt_init(block(
    { NAME: 'sensor-client', PROTOCOL: 'MQTTv5', TRANSPORT: 'websockets' },
    { CLIENT_ID: "'cybercam-01'" },
  ), Python);
  const auth = Python.forBlock.python_mqtt_set_auth(block(
    { NAME: 'sensor-client' },
    { USERNAME: "'alice'", PASSWORD: "'secret'" },
  ), Python);
  const tls = Python.forBlock.python_mqtt_set_tls(block(
    { NAME: 'sensor-client' },
    { CA_FILE: "'/etc/ssl/ca.pem'", CERT_FILE: "'/cert.pem'", KEY_FILE: "'/key.pem'" },
  ), Python);
  const will = Python.forBlock.python_mqtt_set_will(block(
    { NAME: 'sensor-client', QOS: '2', RETAIN: 'TRUE' },
    { TOPIC: "'devices/one/status'", PAYLOAD: "b'offline'" },
  ), Python);
  const websocket = Python.forBlock.python_mqtt_set_websocket_options(block(
    { NAME: 'sensor-client' },
    { PATH: "'/mqtt'" },
  ), Python);
  const reconnect = Python.forBlock.python_mqtt_set_reconnect_delay(block(
    { NAME: 'sensor-client' },
    { MIN_DELAY: '2', MAX_DELAY: '90' },
  ), Python);
  const connect = Python.forBlock.python_mqtt_connect(block(
    { NAME: 'sensor-client' },
    { HOST: "'broker.example'", PORT: '8883', KEEPALIVE: '45' },
  ), Python);

  assert.equal(Python.codeDict.imports.paho_mqtt, 'import paho.mqtt.client as _python_paho_mqtt');
  assert.equal(Python.codeDict.variables.mqtt_sensor_client, 'sensor_client = None');
  assert.match(init, /callback_api_version=_python_paho_mqtt\.CallbackAPIVersion\.VERSION2/);
  assert.match(init, /client_id='cybercam-01'/);
  assert.match(init, /protocol=_python_paho_mqtt\.MQTTv5/);
  assert.match(init, /transport="websockets"/);
  assert.equal(auth, "sensor_client.username_pw_set('alice', password='secret')\n");
  assert.equal(tls, "sensor_client.tls_set(ca_certs='/etc/ssl/ca.pem', certfile='/cert.pem', keyfile='/key.pem')\n");
  assert.equal(will, "sensor_client.will_set('devices/one/status', payload=b'offline', qos=2, retain=True)\n");
  assert.equal(websocket, "sensor_client.ws_set_options(path='/mqtt')\n");
  assert.equal(reconnect, 'sensor_client.reconnect_delay_set(min_delay=2, max_delay=90)\n');
  assert.equal(connect, "sensor_client.connect('broker.example', port=8883, keepalive=45)\n");
  assert.match(Python.codeDict.cleanups.mqtt_sensor_client, /sensor_client\.disconnect\(\)/);
  assert.match(Python.codeDict.cleanups.mqtt_sensor_client, /sensor_client\.loop_stop\(\)/);
});

test('publish, subscribe, loop modes, state and payload decoding preserve their parameters', () => {
  const Python = loadGenerator();
  const publish = Python.forBlock.python_mqtt_publish(block(
    { NAME: 'client', QOS: '1', RETAIN: 'TRUE' },
    { TOPIC: "'sensors/temperature'", MESSAGE: "b'23.5'" },
  ), Python);
  const publishWait = Python.forBlock.python_mqtt_publish_wait(block(
    { NAME: 'client', QOS: '2', RETAIN: 'FALSE' },
    { TOPIC: "'alerts'", MESSAGE: "'hot'", TIMEOUT: '8' },
  ), Python);
  const subscribe = Python.forBlock.python_mqtt_subscribe(block(
    { NAME: 'client', QOS: '2' },
    { TOPIC: "'devices/+/state'" },
  ), Python);
  const unsubscribe = Python.forBlock.python_mqtt_unsubscribe(block(
    { NAME: 'client' },
    { TOPIC: "'devices/+/state'" },
  ), Python);
  const decoded = Python.forBlock.python_mqtt_decode_payload(block(
    { ENCODING: 'utf-8', ERRORS: 'replace' },
    { PAYLOAD: 'payload_bytes' },
  ), Python);
  const connected = Python.forBlock.python_mqtt_is_connected(block({ NAME: 'client' }), Python);

  assert.equal(publish, "client.publish('sensors/temperature', payload=b'23.5', qos=1, retain=True)\n");
  assert.equal(publishWait, [
    "_python_mqtt_publish_info = client.publish('alerts', payload='hot', qos=2, retain=False)",
    '_python_mqtt_publish_info.wait_for_publish(timeout=8)',
    'if not _python_mqtt_publish_info.is_published():',
    "    raise _python_paho_builtins.TimeoutError('MQTT publish did not complete before timeout')",
    '',
  ].join('\n'));
  assert.equal(Python.codeDict.imports.paho_mqtt_builtins, 'import builtins as _python_paho_builtins');
  assert.equal(subscribe, "client.subscribe('devices/+/state', qos=2)\n");
  assert.equal(unsubscribe, "client.unsubscribe('devices/+/state')\n");
  assert.deepEqual(Array.from(decoded), ['payload_bytes.decode("utf-8", errors="replace")', Python.ORDER_FUNCTION_CALL]);
  assert.deepEqual(Array.from(connected), ['client.is_connected()', Python.ORDER_FUNCTION_CALL]);
  assert.equal(Python.forBlock.python_mqtt_loop_start(block({ NAME: 'client' }), Python), 'client.loop_start()\n');
  assert.equal(Python.forBlock.python_mqtt_loop_stop(block({ NAME: 'client' }), Python), 'client.loop_stop()\n');
  assert.equal(
    Python.forBlock.python_mqtt_loop_once(block({ NAME: 'client' }, { TIMEOUT: '0.25' }), Python),
    'client.loop(timeout=0.25)\n',
  );
  assert.equal(Python.forBlock.python_mqtt_loop(block({ NAME: 'client' }), Python), 'client.loop_forever()\n');
  assert.equal(Python.forBlock.python_mqtt_disconnect(block({ NAME: 'client' }), Python), 'client.disconnect()\n');
});

test('VERSION2 callback signatures expose scoped connection, message and disconnect event variables', () => {
  const Python = loadGenerator();
  const capturedScopes = [];
  Python.statementToCode = (target) => {
    const scope = Python[NAME_SCOPE_KEY]?.at(-1);
    // The generator runs in a vm context, so its Map has a different realm/prototype.
    assert.equal(typeof scope?.get, 'function', `missing event-variable scope for ${target.eventNames?.join(', ')}`);
    const aliases = target.eventNames.map((name) => scope.get(name));
    capturedScopes.push(aliases);
    return `    print(${aliases.join(', ')})\n`;
  };

  const connectBlock = block({
    NAME: 'sensor-client', SUCCESS_NAME: 'class', REASON_NAME: 'reason-code', SESSION_PRESENT_NAME: 'session present',
  });
  connectBlock.eventNames = ['class', 'reason-code', 'session present'];
  const connectAssignment = Python.forBlock.python_mqtt_on_connect(connectBlock, Python);

  const messageBlock = block({
    NAME: 'sensor-client', TOPIC_NAME: 'topic-name', PAYLOAD_NAME: 'payload bytes',
    QOS_NAME: 'message qos', RETAIN_NAME: 'is retained',
  });
  messageBlock.eventNames = ['topic-name', 'payload bytes', 'message qos', 'is retained'];
  const messageAssignment = Python.forBlock.python_mqtt_on_message(messageBlock, Python);

  const disconnectBlock = block({
    NAME: 'sensor-client', REASON_NAME: 'disconnect-reason', FROM_SERVER_NAME: 'from server',
  });
  disconnectBlock.eventNames = ['disconnect-reason', 'from server'];
  const disconnectAssignment = Python.forBlock.python_mqtt_on_disconnect(disconnectBlock, Python);

  assert.deepEqual(capturedScopes, [
    ['class_', 'reason_code', 'session_present'],
    ['topic_name', 'payload_bytes', 'message_qos', 'is_retained'],
    ['disconnect_reason', 'from_server'],
  ]);
  assert.equal(connectAssignment, 'sensor_client.on_connect = _python_mqtt_on_connect_sensor_client\n');
  assert.equal(messageAssignment, 'sensor_client.on_message = _python_mqtt_on_message_sensor_client\n');
  assert.equal(disconnectAssignment, 'sensor_client.on_disconnect = _python_mqtt_on_disconnect_sensor_client\n');

  const onConnect = Python.codeDict.functions.mqtt_on_connect_sensor_client;
  assert.match(
    onConnect,
    /^def _python_mqtt_on_connect_sensor_client\(sensor_client, userdata, flags, reason_code_2, properties\):/,
  );
  assert.match(onConnect, /class_ = not reason_code_2\.is_failure/);
  assert.match(onConnect, /reason_code = reason_code_2/);
  assert.match(onConnect, /session_present = flags\.session_present/);
  assert.match(onConnect, /print\(class_, reason_code, session_present\)/);

  const onMessage = Python.codeDict.functions.mqtt_on_message_sensor_client;
  assert.match(onMessage, /^def _python_mqtt_on_message_sensor_client\(sensor_client, userdata, message\):/);
  assert.match(onMessage, /topic_name = message\.topic/);
  assert.match(onMessage, /payload_bytes = message\.payload/);
  assert.match(onMessage, /message_qos = message\.qos/);
  assert.match(onMessage, /is_retained = message\.retain/);
  assert.match(onMessage, /print\(topic_name, payload_bytes, message_qos, is_retained\)/);

  const onDisconnect = Python.codeDict.functions.mqtt_on_disconnect_sensor_client;
  assert.match(
    onDisconnect,
    /^def _python_mqtt_on_disconnect_sensor_client\(sensor_client, userdata, disconnect_flags, reason_code, properties\):/,
  );
  assert.match(onDisconnect, /disconnect_reason = reason_code/);
  assert.match(onDisconnect, /from_server = disconnect_flags\.is_disconnect_packet_from_server/);
  assert.match(onDisconnect, /print\(disconnect_reason, from_server\)/);
});

test('multiple callback blocks get unique handlers and preserve Paho last-assignment semantics', () => {
  const cases = [
    ['python_mqtt_on_connect', 'on_connect', { NAME: 'client', SUCCESS_NAME: 'connected', REASON_NAME: 'reason', SESSION_PRESENT_NAME: 'present' }],
    ['python_mqtt_on_message', 'on_message', { NAME: 'client', TOPIC_NAME: 'topic', PAYLOAD_NAME: 'payload', QOS_NAME: 'qos', RETAIN_NAME: 'retained' }],
    ['python_mqtt_on_disconnect', 'on_disconnect', { NAME: 'client', REASON_NAME: 'reason', FROM_SERVER_NAME: 'from_server' }],
  ];

  for (const [type, property, fields] of cases) {
    const Python = loadGenerator();
    const first = Python.forBlock[type](block(fields), Python);
    const second = Python.forBlock[type](block(fields), Python);
    assert.equal(first, `client.${property} = _python_mqtt_${property}_client\n`, type);
    assert.equal(second, `client.${property} = _python_mqtt_${property}_client_2\n`, type);
    assert.ok(Python.codeDict.functions[`mqtt_${property}_client`], type);
    assert.ok(Python.codeDict.functions[`mqtt_${property}_client_2`], type);
  }
});

test('callback event variables are made distinct after sanitization and client-name collisions', () => {
  const Python = loadGenerator();
  Python.forBlock.python_mqtt_on_connect(block({
    NAME: 'event-state', SUCCESS_NAME: 'event-state', REASON_NAME: 'event state', SESSION_PRESENT_NAME: 'event_state',
  }), Python);
  Python.forBlock.python_mqtt_on_message(block({
    NAME: 'message-data', TOPIC_NAME: 'message-data', PAYLOAD_NAME: 'message data',
    QOS_NAME: 'message_data', RETAIN_NAME: 'message-data',
  }), Python);
  Python.forBlock.python_mqtt_on_disconnect(block({
    NAME: 'disconnect-state', REASON_NAME: 'disconnect-state', FROM_SERVER_NAME: 'disconnect state',
  }), Python);

  const onConnect = Python.codeDict.functions.mqtt_on_connect_event_state;
  assert.match(onConnect, /^def _python_mqtt_on_connect_event_state\(event_state,/);
  assert.match(onConnect, /event_state_2 = not reason_code\.is_failure/);
  assert.match(onConnect, /event_state_3 = reason_code/);
  assert.match(onConnect, /event_state_4 = flags\.session_present/);

  const onMessage = Python.codeDict.functions.mqtt_on_message_message_data;
  assert.match(onMessage, /^def _python_mqtt_on_message_message_data\(message_data,/);
  assert.match(onMessage, /message_data_2 = message\.topic/);
  assert.match(onMessage, /message_data_3 = message\.payload/);
  assert.match(onMessage, /message_data_4 = message\.qos/);
  assert.match(onMessage, /message_data_5 = message\.retain/);

  const onDisconnect = Python.codeDict.functions.mqtt_on_disconnect_disconnect_state;
  assert.match(onDisconnect, /^def _python_mqtt_on_disconnect_disconnect_state\(disconnect_state,/);
  assert.match(onDisconnect, /disconnect_state_2 = reason_code/);
  assert.match(onDisconnect, /disconnect_state_3 = disconnect_flags\.is_disconnect_packet_from_server/);
});

test('representative generated source compiles without importing Paho or connecting to a broker', (t) => {
  const Python = loadGenerator();
  const body = [];
  body.push(Python.forBlock.python_mqtt_init(block(
    { NAME: 'client', PROTOCOL: 'MQTTv311', TRANSPORT: 'tcp' },
    { CLIENT_ID: "'compile-only-client'" },
  ), Python));
  body.push(Python.forBlock.python_mqtt_set_auth(block(
    { NAME: 'client' }, { USERNAME: "'user'", PASSWORD: "'password'" },
  ), Python));
  body.push(Python.forBlock.python_mqtt_set_tls(block(
    { NAME: 'client' }, { CA_FILE: 'None', CERT_FILE: 'None', KEY_FILE: 'None' },
  ), Python));
  body.push(Python.forBlock.python_mqtt_set_will(block(
    { NAME: 'client', QOS: '1', RETAIN: 'TRUE' },
    { TOPIC: "'device/status'", PAYLOAD: "'offline'" },
  ), Python));
  body.push(Python.forBlock.python_mqtt_on_connect(block(
    { NAME: 'client', SUCCESS_NAME: 'connected', REASON_NAME: 'reason', SESSION_PRESENT_NAME: 'session_present' },
    {}, { DO: "    client.subscribe('device/command', qos=1)\n" },
  ), Python));
  body.push(Python.forBlock.python_mqtt_on_message(block(
    { NAME: 'client', TOPIC_NAME: 'topic', PAYLOAD_NAME: 'payload', QOS_NAME: 'qos', RETAIN_NAME: 'retained' },
    {}, { DO: '    text = payload.decode("utf-8", errors="replace")\n    print(topic, text, qos, retained)\n' },
  ), Python));
  body.push(Python.forBlock.python_mqtt_on_disconnect(block(
    { NAME: 'client', REASON_NAME: 'disconnect_reason', FROM_SERVER_NAME: 'from_server' },
    {}, { DO: '    print(disconnect_reason, from_server)\n' },
  ), Python));
  body.push(Python.forBlock.python_mqtt_connect(block(
    { NAME: 'client' }, { HOST: "'localhost'", PORT: '8883', KEEPALIVE: '60' },
  ), Python));
  body.push(Python.forBlock.python_mqtt_loop_start(block({ NAME: 'client' }), Python));
  body.push(Python.forBlock.python_mqtt_publish_wait(block(
    { NAME: 'client', QOS: '1', RETAIN: 'FALSE' },
    { TOPIC: "'device/data'", MESSAGE: "'hello'", TIMEOUT: '10' },
  ), Python));
  body.push(Python.forBlock.python_mqtt_disconnect(block({ NAME: 'client' }), Python));
  body.push(Python.forBlock.python_mqtt_loop_stop(block({ NAME: 'client' }), Python));

  const source = [
    Object.values(Python.codeDict.imports).join('\n'),
    Object.values(Python.codeDict.variables).join('\n'),
    Object.values(Python.codeDict.functions).join('\n'),
    `def _representative_program():\n${indent(body.join(''))}`,
    `def _representative_cleanup():\n${indent(Object.values(Python.codeDict.cleanups).join('\n'))}`,
  ].filter(Boolean).join('\n\n') + '\n';

  assert.match(source, /CallbackAPIVersion\.VERSION2/);
  assert.match(source, /def _python_mqtt_on_connect_client\(/);
  assert.match(source, /def _python_mqtt_on_message_client\(/);
  assert.match(source, /def _python_mqtt_on_disconnect_client\(/);
  const compiled = compilePython(source);
  if (compiled.unavailable) {
    t.skip(`no CPython interpreter available (${compiled.unavailable.join(', ')})`);
    return;
  }
  assert.equal(compiled.result.status, 0, `${compiled.command}: ${compiled.result.stderr || source}`);
});
