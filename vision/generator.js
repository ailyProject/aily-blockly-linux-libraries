/* Portable OpenCV image processing, contour analysis, drawing, and code recognition. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ["addFunction","addImport","addVariable","valueToCode","quote_"];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Python Vision received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

  const ORDER_CALL = Python.ORDER_FUNCTION_CALL ?? 2.2;
  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const define = (type, generator) => { Python.forBlock[type] = generator; };
  const field = (block, name, fallback = '') => block.getFieldValue(name) ?? fallback;
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || fallback;
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
  const requireCv2 = (generator) => generator.addImport('cv2', 'import cv2');
  define('python_image_resize', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.resize(${value(generator, block, 'IMAGE')}, (${value(generator, block, 'WIDTH', '320')}, ${value(generator, block, 'HEIGHT', '240')}), interpolation=cv2.${field(block, 'INTERPOLATION', 'INTER_LINEAR')})`);
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
  define('python_components_property', (block, generator) => {
    const indexes = { COUNT: 0, LABELS: 1, STATS: 2, CENTROIDS: 3 };
    const property = field(block, 'PROPERTY', 'COUNT');
    return output(`(${value(generator, block, 'COMPONENTS', '(0, None, None, None)')})[${indexes[property] ?? 0}]`);
  });
  define('python_component_stat', (block, generator) => {
    requireCv2(generator);
    const components = value(generator, block, 'COMPONENTS', '(0, None, None, None)');
    const index = value(generator, block, 'INDEX', '0');
    const expressions = {
      LEFT: `(${components})[2][int(${index}), cv2.CC_STAT_LEFT]`,
      TOP: `(${components})[2][int(${index}), cv2.CC_STAT_TOP]`,
      WIDTH: `(${components})[2][int(${index}), cv2.CC_STAT_WIDTH]`,
      HEIGHT: `(${components})[2][int(${index}), cv2.CC_STAT_HEIGHT]`,
      AREA: `(${components})[2][int(${index}), cv2.CC_STAT_AREA]`,
      CENTROID_X: `(${components})[3][int(${index})][0]`,
      CENTROID_Y: `(${components})[3][int(${index})][1]`,
    };
    return output(expressions[field(block, 'PROPERTY', 'AREA')] ?? expressions.AREA);
  });
  define('python_image_canny', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.Canny(${value(generator, block, 'IMAGE')}, ${value(generator, block, 'THRESHOLD1', '50')}, ${value(generator, block, 'THRESHOLD2', '150')}, apertureSize=${field(block, 'APERTURE_SIZE', '3')}, L2gradient=bool(${value(generator, block, 'L2_GRADIENT', 'False')}))`);
  });
  define('python_image_hough_circles', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.HoughCircles(${value(generator, block, 'IMAGE')}, cv2.${field(block, 'METHOD', 'HOUGH_GRADIENT')}, dp=${value(generator, block, 'DP', '1')}, minDist=${value(generator, block, 'MIN_DIST', '20')}, param1=${value(generator, block, 'PARAM1', '100')}, param2=${value(generator, block, 'PARAM2', '40')}, minRadius=${value(generator, block, 'MIN_RADIUS', '8')}, maxRadius=${value(generator, block, 'MAX_RADIUS', '40')})`);
  });
  define('python_image_gaussian_blur', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.GaussianBlur(${value(generator, block, 'IMAGE')}, (int(${value(generator, block, 'KERNEL_WIDTH', '3')}), int(${value(generator, block, 'KERNEL_HEIGHT', '3')})), ${value(generator, block, 'SIGMA_X', '0')}, sigmaY=${value(generator, block, 'SIGMA_Y', '0')})`);
  });
  define('python_morphology_kernel', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.getStructuringElement(cv2.${field(block, 'SHAPE', 'MORPH_RECT')}, (int(${value(generator, block, 'WIDTH', '3')}), int(${value(generator, block, 'HEIGHT', '3')})))`);
  });
  define('python_image_morphology', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.morphologyEx(${value(generator, block, 'IMAGE')}, cv2.${field(block, 'OPERATION', 'MORPH_CLOSE')}, ${value(generator, block, 'KERNEL')}, iterations=int(${value(generator, block, 'ITERATIONS', '1')}))`);
  });
  define('python_image_find_contours', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.findContours(${value(generator, block, 'IMAGE')}, cv2.${field(block, 'MODE', 'RETR_EXTERNAL')}, cv2.${field(block, 'METHOD', 'CHAIN_APPROX_SIMPLE')})[0]`);
  });
  define('python_contour_area', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.contourArea(${value(generator, block, 'CONTOUR')})`);
  });
  define('python_contour_perimeter', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.arcLength(${value(generator, block, 'CONTOUR')}, bool(${value(generator, block, 'CLOSED', 'True')}))`);
  });
  define('python_contour_approx', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.approxPolyDP(${value(generator, block, 'CONTOUR')}, ${value(generator, block, 'EPSILON', '1')}, bool(${value(generator, block, 'CLOSED', 'True')}))`);
  });
  define('python_contour_is_convex', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.isContourConvex(${value(generator, block, 'CONTOUR')})`);
  });
  define('python_contour_min_area_rect', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.minAreaRect(${value(generator, block, 'CONTOUR')})`);
  });
  define('python_rotated_rect_points', (block, generator) => {
    requireCv2(generator);
    return output(`cv2.boxPoints(${value(generator, block, 'RECT')})`);
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
  define('python_draw_polyline', (block, generator) => {
    requireCv2(generator);
    return `cv2.polylines(${value(generator, block, 'IMAGE')}, ${value(generator, block, 'POINTS', '[]')}, bool(${value(generator, block, 'CLOSED', 'True')}), ${value(generator, block, 'COLOR', '(0, 255, 0)')}, ${value(generator, block, 'THICKNESS', '2')})\n`;
  });
  define('python_draw_text_freetype', (block, generator) => {
    requireCv2(generator);
    generator.addFunction('vision_draw_text_freetype', "def _vision_draw_text_freetype(image, text, x, y, font_height, color, thickness, font_path):\n    renderer = cv2.freetype.createFreeType2()\n    renderer.loadFontData(str(font_path), 0)\n    renderer.putText(img=image, text=str(text), org=(int(x), int(y)), fontHeight=int(font_height), color=color, thickness=int(thickness), line_type=cv2.LINE_AA, bottomLeftOrigin=True)\n    return image");
    return `_vision_draw_text_freetype(${value(generator, block, 'IMAGE')}, ${value(generator, block, 'TEXT', "''")}, ${value(generator, block, 'X', '0')}, ${value(generator, block, 'Y', '30')}, ${value(generator, block, 'FONT_HEIGHT', '30')}, ${value(generator, block, 'COLOR', '(0, 255, 0)')}, ${value(generator, block, 'THICKNESS', '-1')}, ${value(generator, block, 'FONT_PATH', "'/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc'")})\n`;
  });
  define('python_qr_decode', (block, generator) => {
    generator.addImport('pyzbar', 'from pyzbar.pyzbar import decode, ZBarSymbol');
    return output(`decode(${value(generator, block, 'IMAGE')}, symbols=[ZBarSymbol.QRCODE])`);
  });
  define('python_barcode_decode', (block, generator) => {
    generator.addImport('pyzbar', 'from pyzbar.pyzbar import decode, ZBarSymbol');
    const symbol = field(block, 'SYMBOL', 'ALL');
    const symbols = symbol === 'ALL' ? '' : `, symbols=[ZBarSymbol.${symbol}]`;
    return output(`decode(${value(generator, block, 'IMAGE')}${symbols})`);
  });
  define('python_code_result_property', (block, generator) => {
    const result = value(generator, block, 'RESULT');
    const expressions = {
      TYPE: `(${result}).type`,
      DATA: `(${result}).data`,
      TEXT: `(${result}).data.decode("utf-8", errors="replace")`,
      RECT: `(${result}).rect`,
      X: `(${result}).rect.left`,
      Y: `(${result}).rect.top`,
      WIDTH: `(${result}).rect.width`,
      HEIGHT: `(${result}).rect.height`,
      POLYGON: `(${result}).polygon`,
    };
    return output(expressions[field(block, 'PROPERTY', 'TEXT')] ?? expressions.TEXT);
  });
  define('python_apriltag_init', (block, generator) => {
    const name = nameOf(block, 'tags');
    generator.addImport('pupil_apriltags', 'from pupil_apriltags import Detector');
    generator.addVariable(`apriltag_${name}`, `${name} = None`);
    return `${name} = Detector(families=${generator.quote_(field(block, 'FAMILY', 'tag36h11'))}, nthreads=1, quad_decimate=2, quad_sigma=0.0, refine_edges=0, decode_sharpening=0, debug=0)\n`;
  });
  define('python_apriltag_detect', (block, generator) => output(`${nameOf(block, 'tags')}.detect(${value(generator, block, 'IMAGE')})`));
  define('python_apriltag_result_property', (block, generator) => {
    const result = value(generator, block, 'RESULT');
    const attributes = {
      TAG_ID: 'tag_id',
      TAG_FAMILY: 'tag_family',
      CORNERS: 'corners',
      CENTER: 'center',
      HAMMING: 'hamming',
      DECISION_MARGIN: 'decision_margin',
      HOMOGRAPHY: 'homography',
      POSE_R: 'pose_R',
      POSE_T: 'pose_t',
    };
    return output(`(${result}).${attributes[field(block, 'PROPERTY', 'TAG_ID')] ?? 'tag_id'}`);
  });
});
