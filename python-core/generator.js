/* Portable CPython generator — stdlib, OpenCV, pyzbar, pupil_apriltags, paho-mqtt, requests. */
(function (Python) {
  'use strict';

  if (!Python || !Python.forBlock) throw new Error('Python Core requires the Python generator');

  const ORDER_ATOMIC = Python.ORDER_ATOMIC ?? 0;
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
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result)) result += '_';
    return result || fallback;
  };
  const nameScopes = new WeakMap();
  const withNameScope = (generator, entries, generate) => {
    const scopes = nameScopes.get(generator) || [];
    const scope = new Map(entries.map(([name, alias]) => [String(name), alias]));
    scopes.push(scope);
    nameScopes.set(generator, scopes);
    try {
      return generate();
    } finally {
      scopes.pop();
      if (!scopes.length) nameScopes.delete(generator);
    }
  };
  const resolveName = (generator, name, fallback) => {
    const rawName = String(name || fallback);
    const scopes = nameScopes.get(generator) || [];
    for (let index = scopes.length - 1; index >= 0; index--) {
      if (scopes[index].has(rawName)) return scopes[index].get(rawName);
    }
    return safeName(rawName, fallback);
  };
  const uniqueName = (name, used) => {
    let result = name;
    let suffix = 2;
    while (used.has(result)) result = `${name}_${suffix++}`;
    used.add(result);
    return result;
  };
  const uniqueFunctionKey = (generator, base) => {
    const functions = generator.codeDict?.functions || {};
    let result = base;
    let suffix = 2;
    while (Object.prototype.hasOwnProperty.call(functions, result)) result = `${base}_${suffix++}`;
    return result;
  };
  const nameOf = (block, fallback) => safeName(field(block, 'NAME', fallback), fallback);
  const output = (code, order = ORDER_CALL) => [code, order];

  define('python_start', (block, generator) => {
    generator.addSetup('python_start', statement(generator, block, 'DO') || 'pass', true);
    return '';
  });
  define('python_forever', (block, generator) => {
    generator.addLoop('python_forever', statement(generator, block, 'DO') || 'pass', true);
    return '';
  });
  define('python_sleep', (block, generator) => {
    generator.addImport('time', 'import time');
    return `time.sleep(${value(generator, block, 'SECONDS', '1')})\n`;
  });
  define('python_print', (block, generator) => `print(${value(generator, block, 'VALUE', "''")})\n`);
  define('python_number', (block) => output(String(field(block, 'VALUE', '0')), ORDER_ATOMIC));
  define('python_text', (block, generator) => output(generator.quote_(field(block, 'VALUE', '')), ORDER_ATOMIC));
  define('python_boolean', (block) => output(field(block, 'VALUE', 'TRUE') === 'TRUE' ? 'True' : 'False', ORDER_ATOMIC));
  define('python_tuple', (block, generator) => {
    const items = value(generator, block, 'ITEMS', '');
    return output(items ? `(${items},)` : '()', ORDER_ATOMIC);
  });
  define('python_list', (block, generator) => output(`[${value(generator, block, 'ITEMS', '')}]`, ORDER_ATOMIC));
  define('python_set_variable', (block, generator) => `${resolveName(generator, field(block, 'NAME', 'value'), 'value')} = ${value(generator, block, 'VALUE')}\n`);
  define('python_get_variable', (block, generator) => output(resolveName(generator, field(block, 'NAME', 'value'), 'value'), ORDER_ATOMIC));
  define('python_if', (block, generator) => {
    const body = statement(generator, block, 'DO') || 'pass';
    return `if ${value(generator, block, 'CONDITION', 'False')}:\n${body.split('\n').map(line => line ? `    ${line}` : '').join('\n')}\n`;
  });
  define('python_for_each', (block, generator) => {
    const body = statement(generator, block, 'DO') || 'pass';
    return `for ${safeName(field(block, 'NAME', 'item'), 'item')} in ${value(generator, block, 'ITEMS', '[]')}:\n${body.split('\n').map(line => line ? `    ${line}` : '').join('\n')}\n`;
  });

  const requireCv2 = (generator) => generator.addImport('cv2', 'import cv2');
  define('python_image_resize', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.resize(${value(generator, block, 'IMAGE')}, (${value(generator, block, 'WIDTH', '320')}, ${value(generator, block, 'HEIGHT', '240')}))`);
  });
  define('python_image_convert', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.cvtColor(${value(generator, block, 'IMAGE')}, cv2.${field(block, 'CONVERSION', 'COLOR_BGR2GRAY')})`);
  });
  define('python_image_in_range', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.inRange(${value(generator, block, 'IMAGE')}, ${value(generator, block, 'LOWER', '(0, 0, 0)')}, ${value(generator, block, 'UPPER', '(255, 255, 255)')})`);
  });
  define('python_image_components', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.connectedComponentsWithStats(${value(generator, block, 'IMAGE')}, connectivity=${field(block, 'CONNECTIVITY', '8')}, ltype=cv2.CV_16U)`);
  });
  define('python_image_load', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.imread(${value(generator, block, 'PATH', "'/tmp/image.jpg'")})`);
  });
  define('python_image_save', (block, generator) => {
    requireCv2(generator);
    return `cv2.imwrite(${value(generator, block, 'PATH', "'/tmp/image.jpg'")}, ${value(generator, block, 'IMAGE')})\n`;
  });
  define('python_draw_rectangle', (block, generator) => {
    requireCv2(generator);
    return `cv2.rectangle(${value(generator, block, 'IMAGE')}, (${value(generator, block, 'X1', '0')}, ${value(generator, block, 'Y1', '0')}), (${value(generator, block, 'X2', '100')}, ${value(generator, block, 'Y2', '100')}), ${value(generator, block, 'COLOR', '(0, 255, 0)')}, ${value(generator, block, 'THICKNESS', '2')})\n`;
  });
  define('python_draw_circle', (block, generator) => {
    requireCv2(generator);
    return `cv2.circle(${value(generator, block, 'IMAGE')}, (${value(generator, block, 'X', '0')}, ${value(generator, block, 'Y', '0')}), ${value(generator, block, 'RADIUS', '5')}, ${value(generator, block, 'COLOR', '(0, 255, 0)')}, ${value(generator, block, 'THICKNESS', '2')})\n`;
  });
  define('python_draw_line', (block, generator) => {
    requireCv2(generator);
    return `cv2.line(${value(generator, block, 'IMAGE')}, (${value(generator, block, 'X1', '0')}, ${value(generator, block, 'Y1', '0')}), (${value(generator, block, 'X2', '100')}, ${value(generator, block, 'Y2', '100')}), ${value(generator, block, 'COLOR', '(0, 255, 0)')}, ${value(generator, block, 'THICKNESS', '2')})\n`;
  });
  define('python_draw_text', (block, generator) => {
    requireCv2(generator);
    return `cv2.putText(${value(generator, block, 'IMAGE')}, str(${value(generator, block, 'TEXT', "''")}), (${value(generator, block, 'X', '0')}, ${value(generator, block, 'Y', '30')}), cv2.FONT_HERSHEY_SIMPLEX, ${value(generator, block, 'SCALE', '1')}, ${value(generator, block, 'COLOR', '(0, 255, 0)')}, ${value(generator, block, 'THICKNESS', '2')})\n`;
  });
  define('python_qr_decode', (block, generator) => {
    generator.addImport('pyzbar', 'from pyzbar.pyzbar import decode, ZBarSymbol');
    return output(`decode(${value(generator, block, 'IMAGE')}, symbols=[ZBarSymbol.QRCODE])`);
  });
  define('python_barcode_decode', (block, generator) => {
    generator.addImport('pyzbar', 'from pyzbar.pyzbar import decode, ZBarSymbol');
    return output(`decode(${value(generator, block, 'IMAGE')})`);
  });
  define('python_apriltag_init', (block, generator) => {
    const name = nameOf(block, 'tags');
    generator.addImport('pupil_apriltags', 'from pupil_apriltags import Detector');
    generator.addVariable(`apriltag_${name}`, `${name} = None`);
    return `${name} = Detector(families=${generator.quote_(field(block, 'FAMILY', 'tag36h11'))}, nthreads=1, quad_decimate=2, quad_sigma=0.0, refine_edges=0, decode_sharpening=0, debug=0)\n`;
  });
  define('python_apriltag_detect', (block, generator) => output(`${nameOf(block, 'tags')}.detect(${value(generator, block, 'IMAGE')})`));

  define('python_socket_init', (block, generator) => {
    const name = nameOf(block, 'sock'); generator.addImport('socket', 'import socket');
    declareResource(generator, `socket_${name}`, name, 'close');
    return `${name} = socket.socket(socket.${field(block, 'FAMILY', 'AF_INET')}, socket.${field(block, 'TYPE', 'SOCK_STREAM')})\n`;
  });
  define('python_socket_address', (block, generator) => {
    generator.addImport('socket', 'import socket');
    return output(`socket.getaddrinfo(${value(generator, block, 'HOST', "'localhost'")}, ${value(generator, block, 'PORT', '80')})[0][-1]`, ORDER_MEMBER);
  });
  define('python_socket_connect', (block, generator) => `${nameOf(block, 'sock')}.connect(${value(generator, block, 'ADDRESS', "('localhost', 80)")})\n`);
  define('python_socket_bind', (block, generator) => `${nameOf(block, 'sock')}.bind(${value(generator, block, 'ADDRESS', "('0.0.0.0', 8080)")})\n`);
  define('python_socket_listen', (block, generator) => `${nameOf(block, 'sock')}.listen(${value(generator, block, 'BACKLOG', '1')})\n`);
  define('python_socket_accept', (block) => output(`${nameOf(block, 'sock')}.accept()`));
  define('python_socket_send', (block, generator) => `${nameOf(block, 'sock')}.send(${value(generator, block, 'DATA', "b''")})\n`);
  define('python_socket_receive', (block, generator) => output(`${nameOf(block, 'sock')}.recv(${value(generator, block, 'SIZE', '1024')})`));
  define('python_socket_close', (block) => `${nameOf(block, 'sock')}.close()\n`);

  define('python_mqtt_init', (block, generator) => {
    const name = nameOf(block, 'client'); generator.addImport('mqtt', 'import paho.mqtt.client as mqtt');
    declareResource(generator, `mqtt_${name}`, name, 'disconnect');
    return `${name} = mqtt.Client()\n`;
  });
  define('python_mqtt_connect', (block, generator) => `${nameOf(block, 'client')}.connect(${value(generator, block, 'HOST', "'localhost'")}, ${value(generator, block, 'PORT', '1883')}, ${value(generator, block, 'KEEPALIVE', '60')})\n`);
  define('python_mqtt_publish', (block, generator) => `${nameOf(block, 'client')}.publish(${value(generator, block, 'TOPIC', "''")}, ${value(generator, block, 'MESSAGE', "''")})\n`);
  define('python_mqtt_subscribe', (block, generator) => `${nameOf(block, 'client')}.subscribe(${value(generator, block, 'TOPIC', "''")})\n`);
  define('python_mqtt_on_message', (block, generator) => {
    const client = nameOf(block, 'client');
    const rawTopic = field(block, 'TOPIC_NAME', 'topic');
    const rawPayload = field(block, 'PAYLOAD_NAME', 'payload');
    const usedNames = new Set();
    const topic = uniqueName(safeName(rawTopic, 'topic'), usedNames);
    const payload = uniqueName(safeName(rawPayload, 'payload'), usedNames);
    const callbackClient = uniqueName('client', usedNames);
    const callbackUserdata = uniqueName('userdata', usedNames);
    const callbackMessage = uniqueName('message', usedNames);
    const functionBase = `mqtt_on_message_${client}`;
    const body = withNameScope(
      generator,
      [[rawTopic, topic], [rawPayload, payload]],
      () => statement(generator, block, 'DO'),
    );
    const functionKey = uniqueFunctionKey(generator, functionBase);
    const handler = `_python_${functionKey}`;
    const lines = [
      `def ${handler}(${callbackClient}, ${callbackUserdata}, ${callbackMessage}):`,
      `    ${topic} = ${callbackMessage}.topic`,
      `    ${payload} = ${callbackMessage}.payload`,
      ...(body ? body.split('\n').map((line) => `    ${line}`) : []),
    ];
    generator.addFunction(functionKey, `${lines.join('\n')}\n`);
    return `${client}.on_message = ${handler}\n`;
  });
  define('python_mqtt_loop', (block) => `${nameOf(block, 'client')}.loop_forever()\n`);
  define('python_mqtt_disconnect', (block) => `${nameOf(block, 'client')}.disconnect()\n`);

  define('python_http_request', (block, generator) => {
    generator.addImport('requests', 'import requests');
    const method = field(block, 'METHOD', 'GET').toLowerCase();
    const url = value(generator, block, 'URL', "''");
    const data = value(generator, block, 'DATA', 'None');
    const suffix = method === 'get' ? `, params=${data}` : method === 'post' ? `, json=${data}` : method === 'put' ? `, data=${data}` : '';
    return output(`requests.${method}(${url}${suffix})`);
  });
  define('python_http_response', (block, generator) => output(`${value(generator, block, 'RESPONSE', 'None')}.${field(block, 'PROPERTY', 'text')}`, ORDER_MEMBER));
  define('python_http_server', (block, generator) => {
    generator.addImport('http_server', 'from http.server import HTTPServer, SimpleHTTPRequestHandler');
    return `HTTPServer((${value(generator, block, 'HOST', "'0.0.0.0'")}, ${value(generator, block, 'PORT', '8080')}), SimpleHTTPRequestHandler).serve_forever()\n`;
  });

  const addFileHelpers = (generator) => {
    generator.addFunction('python_file_helpers', "def _python_read_text(path):\n    with open(path, 'r', encoding='utf-8') as file:\n        return file.read()\n\ndef _python_write_text(path, content, mode='w'):\n    with open(path, mode, encoding='utf-8') as file:\n        return file.write(str(content))");
  };
  define('python_file_read', (block, generator) => { addFileHelpers(generator); return output(`_python_read_text(${value(generator, block, 'PATH', "'/tmp/file.txt'")})`); });
  define('python_file_write', (block, generator) => { addFileHelpers(generator); return `_python_write_text(${value(generator, block, 'PATH', "'/tmp/file.txt'")}, ${value(generator, block, 'CONTENT', "''")}, ${generator.quote_(field(block, 'MODE', 'w'))})\n`; });
  define('python_file_exists', (block, generator) => { generator.addImport('os', 'import os'); return output(`os.path.exists(${value(generator, block, 'PATH', "'/tmp'")})`); });
  define('python_file_list', (block, generator) => { generator.addImport('os', 'import os'); return output(`os.listdir(${value(generator, block, 'PATH', "'/tmp'")})`); });
  define('python_command', (block, generator) => { generator.addImport('os', 'import os'); return output(`os.popen(str(${value(generator, block, 'COMMAND', "''")})).read()`); });
  define('python_cpu_temperature', (_block, generator) => { generator.addImport('os', 'import os'); return output("int(os.popen('cat /sys/class/thermal/thermal_zone0/temp').read()) / 1000", ORDER_NONE); });
})(typeof Python !== 'undefined' ? Python : (typeof MPY !== 'undefined' ? MPY : MicropPython));
