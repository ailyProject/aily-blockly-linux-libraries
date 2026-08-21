/* CyberCAM machine vision generator - official 01Studio/walnutpi APIs only. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can outlive a project-mode change. Skip inactive realms
  // instead of registering CPython handlers on Arduino or MicroPython.
  if (Python == null) return;
  const requiredMethods = ['addImport', 'addVariable', 'addSetup', 'addCleanup', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`CyberCAM CV received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
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
  const safeName = (name, fallback) => {
    let result = String(name || fallback).replace(/[^A-Za-z0-9_]/g, '_');
    if (!/^[A-Za-z_]/.test(result)) result = `_${result}`;
    if (PYTHON_KEYWORDS.has(result)) result += '_';
    return result || fallback;
  };
  const nameOf = (block, fallback) => safeName(field(block, 'NAME', fallback), fallback);
  const output = (code, order = ORDER_CALL) => [code, order];
  define('cybercam_camera_init', (block, generator) => {
    const name = nameOf(block, 'camera');
    const width = value(generator, block, 'WIDTH', '640');
    const height = value(generator, block, 'HEIGHT', '480');
    const sensorId = field(block, 'SENSOR_ID', '2');
    generator.addImport('walnutpi_sensor', 'from walnutpi import Sensor');
    declareResource(generator, `camera_${name}`, name, 'release');
    return `${name} = Sensor.Sensor(${width}, ${height}, id=${sensorId})\n`;
  });
  define('cybercam_camera_opened', (block) => output(`${nameOf(block, 'camera')}.isOpened()`, ORDER_CALL));
  define('cybercam_camera_read', (block) => output(`${nameOf(block, 'camera')}.read()[1]`, ORDER_MEMBER));
  define('cybercam_camera_read_raw', (block) => output(`${nameOf(block, 'camera')}.read()`, ORDER_CALL));
  define('cybercam_camera_hmirror', (block, generator) => `${nameOf(block, 'camera')}.set_hmirror(int(bool(${value(generator, block, 'ENABLED', 'True')})))\n`);
  define('cybercam_camera_vflip', (block, generator) => `${nameOf(block, 'camera')}.set_vflip(int(bool(${value(generator, block, 'ENABLED', 'True')})))\n`);
  define('cybercam_camera_release', (block) => `${nameOf(block, 'camera')}.release()\n`);

  define('cybercam_display_init', (_block, generator) => {
    generator.addImport('walnutpi_display', 'from walnutpi import Display');
    generator.addSetup('cybercam_display', 'Display.init()');
    return '';
  });
  define('cybercam_display_rotation', (block, generator) => {
    generator.addImport('walnutpi_display', 'from walnutpi import Display');
    return `Display.set_rotation(${field(block, 'ROTATION', '0')})\n`;
  });
  define('cybercam_display_show', (block, generator) => {
    generator.addImport('walnutpi_display', 'from walnutpi import Display');
    return `Display.show(${value(generator, block, 'IMAGE', 'None')})\n`;
  });
  define('cybercam_ide_show', (block, generator) => {
    generator.addImport('walnutpi_ide', 'from walnutpi import IDE');
    return `IDE.show(${value(generator, block, 'IMAGE', 'None')})\n`;
  });
  define('cybercam_lcd_direction', (_block, generator) => {
    generator.addImport('walnutpi_direction', 'from walnutpi import direction');
    return output('direction.get_lcd()', ORDER_CALL);
  });

  // Confirmed walnutpi.kpu classes: FACE_DETECT, FACE_MASK, FALL_DETECT,
  // HAND_DETECT, HAND_KEYPOINT, HAND_KEYPOINT_CLS, LICENCE_DETECT, OCR,
  // PERSON_DETECT, PERSON_KEYPOINT, SMOKE_DETECT, TRAFFIC_LIGHT_DETECT,
  // YOLO11_CLS and YOLO11_DET.
  const addKpu = (generator) => generator.addImport('walnutpi_kpu', 'from walnutpi import kpu');
  define('cybercam_ai_init_simple', (block, generator) => {
    const name = nameOf(block, 'detector');
    const modelClass = field(block, 'MODEL', 'YOLO11_DET');
    addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.${modelClass}(${value(generator, block, 'MODEL_PATH', "'/data/model.kmodel'")}, ${value(generator, block, 'MODEL_SIZE', '640')})\n`;
  });
  define('cybercam_ai_init_face', (block, generator) => {
    const name = nameOf(block, 'detector'); addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.FACE_DETECT(${value(generator, block, 'MODEL_PATH')}, ${value(generator, block, 'ANCHORS_PATH')}, ${value(generator, block, 'MODEL_SIZE', '320')})\n`;
  });
  define('cybercam_ai_init_mask', (block, generator) => {
    const name = nameOf(block, 'detector'); addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.FACE_MASK(${value(generator, block, 'DETECT_MODEL')}, ${value(generator, block, 'ANCHORS_PATH')}, ${value(generator, block, 'MODEL_SIZE', '320')}, ${value(generator, block, 'MASK_MODEL')})\n`;
  });
  define('cybercam_ai_init_hand_keypoint', (block, generator) => {
    const name = nameOf(block, 'detector'); addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.${field(block, 'MODEL', 'HAND_KEYPOINT')}(hand_det_kmodel=${value(generator, block, 'DETECT_MODEL')}, hand_kp_kmodel=${value(generator, block, 'KEYPOINT_MODEL')})\n`;
  });
  define('cybercam_ai_init_ocr', (block, generator) => {
    const name = nameOf(block, 'ocr'); addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.OCR(${value(generator, block, 'DETECT_MODEL')}, ${value(generator, block, 'RECOGNITION_MODEL')}, ${value(generator, block, 'DICTIONARY')}, ${value(generator, block, 'DETECT_SIZE', '640')}, (${value(generator, block, 'RECOGNITION_WIDTH', '512')}, ${value(generator, block, 'RECOGNITION_HEIGHT', '32')}))\n`;
  });
  define('cybercam_ai_init_licence', (block, generator) => {
    const name = nameOf(block, 'licence'); addKpu(generator);
    generator.addVariable(`ai_${name}`, `${name} = None`);
    return `${name} = kpu.LICENCE_DETECT(${value(generator, block, 'DETECT_MODEL')}, ${value(generator, block, 'RECOGNITION_MODEL')}, ${value(generator, block, 'ANCHORS_PATH')}, ${value(generator, block, 'LABELS', '[]')}, ${value(generator, block, 'DETECT_SIZE', '640')}, (${value(generator, block, 'RECOGNITION_WIDTH', '220')}, ${value(generator, block, 'RECOGNITION_HEIGHT', '32')}))\n`;
  });
  define('cybercam_ai_run', (block, generator) => output(`${nameOf(block, 'detector')}.run(${value(generator, block, 'IMAGE')})`));
  define('cybercam_ai_run_confidence', (block, generator) => output(`${nameOf(block, 'detector')}.run(${value(generator, block, 'IMAGE')}, ${value(generator, block, 'CONFIDENCE', '0.6')})`));
  define('cybercam_ai_run_thresholds', (block, generator) => output(`${nameOf(block, 'detector')}.run(${value(generator, block, 'IMAGE')}, ${value(generator, block, 'CONFIDENCE', '0.5')}, ${value(generator, block, 'NMS', '0.45')})`));
  define('cybercam_result_length', (block, generator) => output(`len(${value(generator, block, 'RESULTS', '[]')})`));
  define('cybercam_result_item', (block, generator) => output(`${value(generator, block, 'RESULTS', '[]')}[${value(generator, block, 'INDEX', '0')}]`, ORDER_MEMBER));
  define('cybercam_result_property', (block, generator) => output(`${value(generator, block, 'RESULT')}.${field(block, 'PROPERTY', 'reliability')}`, ORDER_MEMBER));

});
