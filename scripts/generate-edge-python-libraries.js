'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ko', 'pt', 'ru', 'zh_cn', 'zh_hk'];
const BOARDS = Object.freeze({
  cybercam: 'canaan:k230:cybercam',
  raspberryPiZero2W: 'broadcom:bcm2710a1:raspberrypi_0_2w',
  raspberryPi4B: 'broadcom:bcm2711:raspberrypi_4b',
  raspberryPi5: 'broadcom:bcm2712:raspberrypi_5',
  walnutPi2B: 'allwinner:t527:walnutpi_2b',
  jetsonOrinNano: 'nvidia:tegra234:jetson_orin_nano',
  jetsonOrinNx: 'nvidia:tegra234:jetson_orin_nx',
  jetsonAgxOrin: 'nvidia:tegra234:jetson_agx_orin',
});
const RASPBERRY_PI_BOARDS = [BOARDS.raspberryPiZero2W, BOARDS.raspberryPi4B, BOARDS.raspberryPi5];
const JETSON_BOARDS = [BOARDS.jetsonAgxOrin, BOARDS.jetsonOrinNano, BOARDS.jetsonOrinNx];
const LINUX_BOARDS = [
  BOARDS.walnutPi2B,
  ...RASPBERRY_PI_BOARDS,
  ...JETSON_BOARDS,
];
const CATEGORY_STYLE = Object.freeze({
  'raspberry-pi': { colour: '#C51A4A', tag: 'io', icon: 'fa-light fa-camera' },
  jetson: { colour: '#76B900', tag: 'display', icon: 'fa-light fa-microchip' },
  'vision-ai': { colour: '#1976D2', tag: 'display', icon: 'fa-light fa-brain' },
  multimedia: { colour: '#EF6C00', tag: 'audio', icon: 'fa-light fa-photo-film' },
});

const LIBRARIES = [
  {
    id: 'rpi_imx500',
    title: 'Raspberry Pi IMX500',
    prefix: 'rpi_imx500',
    module: 'picamera2.devices.imx500',
    pip: 'imx500-all',
    category: 'raspberry-pi',
    compatibility: 'rpi',
    install: 'sudo apt install imx500-all python3-picamera2',
    homepage: 'https://www.raspberrypi.com/documentation/accessories/ai-camera.html',
    callables: ['IMX500', 'NetworkIntrinsics', 'postprocess_nanodet_detection', 'softmax'],
    methods: [
      'get_outputs', 'get_output_shapes', 'get_input_size', 'convert_inference_coords',
      'set_inference_roi_abs', 'set_inference_aspect_ratio', 'set_auto_aspect_ratio',
      'show_network_fw_progress_bar', 'get_kpi_info', 'update_with_defaults',
    ],
    attributes: [
      'camera_num', 'config', 'network_intrinsics', 'task', 'inference_rate',
      'labels', 'bbox_normalization', 'bbox_order', 'preserve_aspect_ratio',
      'postprocess', 'softmax',
    ],
    noteZh: '面向 Raspberry Pi AI Camera 的 IMX500 模型加载、推理输出、ROI 与网络元数据 API。',
    noteEn: 'Raspberry Pi AI Camera model loading, inference output, ROI, and network metadata APIs.',
  },
  {
    id: 'jetson_gpio',
    title: 'Jetson.GPIO',
    prefix: 'jetson_gpio',
    module: 'Jetson.GPIO',
    pip: 'Jetson.GPIO',
    category: 'jetson',
    compatibility: 'jetson',
    install: 'python3 -m pip install Jetson.GPIO',
    homepage: 'https://github.com/NVIDIA/jetson-gpio',
    callables: [
      'setwarnings', 'setmode', 'getmode', 'setup', 'input', 'output', 'cleanup',
      'gpio_function', 'add_event_detect', 'remove_event_detect', 'event_detected',
      'add_event_callback', 'wait_for_edge', 'PWM',
    ],
    methods: ['start', 'stop', 'ChangeDutyCycle', 'ChangeFrequency'],
    attributes: [
      'BOARD', 'BCM', 'CVM', 'TEGRA_SOC', 'IN', 'OUT', 'HIGH', 'LOW',
      'RISING', 'FALLING', 'BOTH', 'PUD_UP', 'PUD_DOWN', 'JETSON_INFO', 'VERSION',
    ],
    noteZh: 'Jetson 40 针扩展接口的数字输入输出、边沿检测和硬件 PWM。',
    noteEn: 'Digital I/O, edge detection, and hardware PWM for the Jetson 40-pin expansion header.',
  },
  {
    id: 'jetson_stats',
    title: 'jetson-stats / jtop',
    prefix: 'jetson_stats',
    module: 'jtop',
    pip: 'jetson-stats',
    category: 'jetson',
    compatibility: 'jetson',
    install: 'sudo python3 -m pip install -U jetson-stats',
    homepage: 'https://github.com/rbonghi/jetson_stats',
    callables: ['jtop'],
    methods: ['start', 'close', 'ok', 'loop'],
    attributes: [
      'board', 'stats', 'cpu', 'gpu', 'memory', 'engines', 'temperature',
      'power', 'fan', 'jetson_clocks', 'nvpmodel',
    ],
    noteZh: '读取 Jetson 的 CPU、GPU、内存、温度、功耗、风扇和功耗模式。',
    noteEn: 'Monitor Jetson CPU, GPU, memory, thermals, power, fans, and power modes.',
  },
  {
    id: 'jetson_utils',
    title: 'jetson-utils',
    prefix: 'jetson_utils',
    module: 'jetson_utils',
    pip: 'jetson-utils',
    category: 'jetson',
    compatibility: 'jetson',
    install: 'python3 -m pip install git+https://github.com/dusty-nv/jetson-utils',
    homepage: 'https://github.com/dusty-nv/jetson-utils',
    callables: [
      'videoSource', 'videoOutput', 'cudaAllocMapped', 'cudaFromNumpy', 'cudaToNumpy',
      'cudaConvertColor', 'cudaResize', 'cudaCrop', 'cudaOverlay', 'loadImage', 'saveImage',
    ],
    methods: [
      'Capture', 'Render', 'IsStreaming', 'Close', 'SetStatus', 'GetWidth',
      'GetHeight', 'GetFrameRate', 'GetFrameCount', 'GetLastTimestamp',
    ],
    attributes: ['width', 'height', 'channels', 'format', 'mapped', 'ptr', 'shape'],
    noteZh: 'Jetson 的摄像头/视频流、CUDA 图像缓冲区、图像转换和显示工具。',
    noteEn: 'Jetson camera/video streaming, CUDA image buffers, image conversion, and display utilities.',
  },
  {
    id: 'jetson_inference',
    title: 'jetson-inference',
    prefix: 'jetson_inference',
    module: 'jetson_inference',
    pip: 'jetson-inference',
    category: 'jetson',
    compatibility: 'jetson',
    install: 'build and install https://github.com/dusty-nv/jetson-inference',
    homepage: 'https://github.com/dusty-nv/jetson-inference',
    callables: ['detectNet', 'imageNet', 'segNet', 'poseNet', 'actionNet', 'backgroundNet'],
    methods: [
      'Detect', 'Classify', 'Segment', 'Process', 'GetNetworkFPS', 'PrintProfilerTimes',
      'GetClassDesc', 'GetClassLabel', 'GetNumClasses',
    ],
    attributes: [
      'ClassID', 'Confidence', 'Left', 'Top', 'Right', 'Bottom', 'Width',
      'Height', 'Center', 'Area',
    ],
    noteZh: 'Jetson 上的图像分类、目标检测、分割、姿态和动作识别推理。',
    noteEn: 'Jetson image classification, object detection, segmentation, pose, and action inference.',
  },
  {
    id: 'tensorrt',
    title: 'NVIDIA TensorRT',
    prefix: 'nvidia_tensorrt',
    module: 'tensorrt',
    pip: 'tensorrt',
    category: 'jetson',
    compatibility: 'jetson',
    install: 'install the TensorRT Python bindings supplied with NVIDIA JetPack',
    homepage: 'https://docs.nvidia.com/deeplearning/tensorrt/latest/api/python-api.html',
    callables: [
      'Logger', 'Runtime', 'Builder', 'OnnxParser', 'Refitter', 'volume', 'nptype',
      'init_libnvinfer_plugins', 'get_plugin_registry',
    ],
    methods: [
      'deserialize_cuda_engine', 'create_execution_context', 'create_network',
      'create_builder_config', 'build_serialized_network', 'parse', 'parse_from_file',
      'set_input_shape', 'set_tensor_address', 'execute_async_v3', 'get_tensor_shape',
      'get_tensor_name', 'get_tensor_mode',
    ],
    attributes: [
      '__version__', 'Logger.WARNING', 'Logger.ERROR', 'Logger.INFO',
      'NetworkDefinitionCreationFlag.EXPLICIT_BATCH', 'TensorIOMode.INPUT',
      'TensorIOMode.OUTPUT', 'float32', 'float16', 'int8', 'int32', 'bool', 'bfloat16',
    ],
    noteZh: '在 Jetson 上构建、加载并执行 TensorRT 推理引擎。',
    noteEn: 'Build, load, and execute TensorRT inference engines on Jetson.',
  },
  {
    id: 'nvidia_vpi',
    title: 'NVIDIA VPI',
    prefix: 'nvidia_vpi',
    module: 'vpi',
    pip: 'python3-vpi3',
    category: 'jetson',
    compatibility: 'jetson',
    install: 'sudo apt install python3-vpi3',
    homepage: 'https://docs.nvidia.com/vpi/python/index.html',
    callables: ['asimage', 'asarray', 'Image', 'Array', 'Pyramid', 'Stream', 'execute', 'mixchannels'],
    methods: [
      'convert', 'rescale', 'box_filter', 'gaussian_filter', 'median_filter',
      'bilateral_filter', 'erode', 'dilate', 'canny', 'eqhist', 'histogram',
      'minmaxloc', 'lock_cpu', 'lock_cuda', 'sync',
    ],
    attributes: [
      'Backend.CPU', 'Backend.CUDA', 'Backend.PVA', 'Format.RGB8', 'Format.RGBA8',
      'Format.BGR8', 'Format.GRAY8', 'Interp.NEAREST', 'Interp.LINEAR',
      'Border.CLAMP', 'width', 'height', 'size', 'format',
    ],
    noteZh: '使用 Jetson 的 CPU、CUDA 和 PVA 后端执行硬件加速视觉算法。',
    noteEn: 'Run hardware-accelerated vision algorithms on Jetson CPU, CUDA, and PVA backends.',
  },
  {
    id: 'cuda_python',
    title: 'NVIDIA CUDA Python',
    prefix: 'cuda_python',
    module: 'cuda.bindings.runtime',
    pip: 'cuda-python',
    category: 'jetson',
    compatibility: 'jetson',
    install: 'python3 -m pip install cuda-python',
    homepage: 'https://nvidia.github.io/cuda-python/cuda-bindings/latest/index.html',
    callables: [
      'cudaGetDeviceCount', 'cudaGetDevice', 'cudaSetDevice', 'cudaGetDeviceProperties',
      'cudaDeviceGetAttribute', 'cudaMalloc', 'cudaFree', 'cudaMemcpy', 'cudaMemcpyAsync',
      'cudaMemset', 'cudaStreamCreate', 'cudaStreamDestroy', 'cudaStreamSynchronize',
      'cudaDeviceSynchronize', 'cudaGetErrorName', 'cudaGetErrorString',
    ],
    methods: [],
    attributes: [
      'cudaError_t.cudaSuccess', 'cudaMemcpyKind.cudaMemcpyHostToDevice',
      'cudaMemcpyKind.cudaMemcpyDeviceToHost', 'cudaMemcpyKind.cudaMemcpyDeviceToDevice',
    ],
    noteZh: 'CUDA Runtime 的官方低层 Python 绑定，覆盖设备、内存、流和同步。',
    noteEn: 'Official low-level CUDA Runtime Python bindings for devices, memory, streams, and synchronization.',
  },
  {
    id: 'pycuda',
    title: 'PyCUDA',
    prefix: 'pycuda',
    module: 'pycuda.driver',
    pip: 'pycuda',
    category: 'jetson',
    compatibility: 'jetson',
    install: 'sudo apt install python3-pycuda',
    homepage: 'https://documen.tician.de/pycuda/',
    callables: [
      'init', 'Device', 'Device.count', 'mem_alloc', 'memcpy_htod', 'memcpy_dtoh',
      'memcpy_dtod', 'Stream', 'Event', 'module_from_file', 'get_version',
      'get_driver_version',
    ],
    methods: [
      'name', 'compute_capability', 'total_memory', 'make_context', 'pop', 'detach',
      'synchronize', 'record', 'time_till', 'time_since', 'free',
    ],
    attributes: ['handle', 'device', 'context'],
    noteZh: '使用 Python 管理 CUDA 设备、上下文、显存、流、事件和已编译模块。',
    noteEn: 'Manage CUDA devices, contexts, memory, streams, events, and compiled modules from Python.',
  },
  {
    id: 'cupy',
    title: 'CuPy',
    prefix: 'cupy',
    module: 'cupy',
    pip: 'cupy-cuda12x',
    category: 'jetson',
    compatibility: 'jetson',
    install: 'python3 -m pip install cupy-cuda12x',
    homepage: 'https://docs.cupy.dev/en/stable/',
    callables: [
      'array', 'asarray', 'asnumpy', 'zeros', 'ones', 'empty', 'arange', 'linspace',
      'concatenate', 'stack', 'matmul', 'dot', 'mean', 'sum', 'max', 'min', 'argmax',
      'get_array_module', 'cuda.Device', 'cuda.Stream', 'cuda.Event',
    ],
    methods: ['get', 'set', 'astype', 'reshape', 'transpose', 'copy', 'fill', 'sum', 'mean'],
    attributes: ['ndarray', 'float32', 'float16', 'int8', 'int32', 'int64', 'bool_'],
    noteZh: '在 Jetson CUDA GPU 上使用 NumPy 风格的数组、线性代数和流。',
    noteEn: 'NumPy-style arrays, linear algebra, and streams on Jetson CUDA GPUs.',
  },
  {
    id: 'pytorch',
    title: 'PyTorch',
    prefix: 'pytorch',
    module: 'torch',
    pip: 'torch',
    category: 'vision-ai',
    compatibility: 'jetson',
    install: 'python3 -m pip install --no-cache-dir "$TORCH_INSTALL"',
    homepage: 'https://docs.nvidia.com/deeplearning/frameworks/install-pytorch-jetson-platform/',
    callables: [
      'tensor', 'as_tensor', 'from_numpy', 'zeros', 'ones', 'empty', 'arange',
      'linspace', 'stack', 'cat', 'matmul', 'no_grad', 'inference_mode', 'load',
      'save', 'device', 'cuda.is_available', 'cuda.device_count', 'cuda.get_device_name',
    ],
    methods: [
      'to', 'cpu', 'cuda', 'numpy', 'detach', 'clone', 'reshape', 'permute',
      'unsqueeze', 'squeeze', 'eval', 'train', 'forward',
    ],
    attributes: ['__version__', 'float32', 'float16', 'bfloat16', 'int8', 'int32', 'int64', 'bool'],
    noteZh: '使用 NVIDIA 针对 JetPack 提供的 PyTorch 构建张量和运行 GPU 推理。',
    noteEn: 'Build tensors and run GPU inference with NVIDIA PyTorch builds for JetPack.',
  },
  {
    id: 'torchvision',
    title: 'TorchVision',
    prefix: 'torchvision',
    module: 'torchvision',
    pip: 'torchvision',
    category: 'vision-ai',
    compatibility: 'jetson',
    install: 'python3 -m pip install torchvision',
    homepage: 'https://pytorch.org/vision/stable/',
    callables: [
      'models.resnet18', 'models.resnet50', 'models.mobilenet_v3_small',
      'models.mobilenet_v3_large', 'models.detection.fasterrcnn_resnet50_fpn',
      'transforms.Compose', 'transforms.Resize', 'transforms.CenterCrop',
      'transforms.ToTensor', 'transforms.Normalize', 'io.read_image',
      'io.write_jpeg', 'ops.nms', 'ops.box_iou',
    ],
    methods: ['to', 'cpu', 'cuda', 'eval', 'train', 'forward'],
    attributes: ['__version__'],
    noteZh: 'PyTorch 的常用视觉模型、预处理变换、图像 I/O 和检测算子。',
    noteEn: 'Common PyTorch vision models, preprocessing transforms, image I/O, and detection operators.',
  },
  {
    id: 'gstreamer',
    title: 'GStreamer',
    prefix: 'gstreamer',
    module: 'gi.repository.Gst',
    pip: 'python3-gi',
    category: 'multimedia',
    compatibility: 'linux',
    install: 'sudo apt install python3-gi gir1.2-gstreamer-1.0 gstreamer1.0-tools',
    homepage: 'https://gstreamer.freedesktop.org/documentation/tutorials/basic/hello-world.html',
    importStatement: "import gi as _python_lib_gstreamer_gi\n_python_lib_gstreamer_gi.require_version('Gst', '1.0')\nfrom gi.repository import Gst as _python_lib_gstreamer",
    callables: ['init', 'parse_launch', 'version', 'version_string', 'debug_set_active', 'debug_set_default_threshold'],
    methods: [
      'set_state', 'get_state', 'get_bus', 'get_by_name', 'send_event', 'set_property',
      'get_property', 'timed_pop_filtered', 'pop', 'have_pending', 'is_playing', 'seek_simple',
    ],
    attributes: [
      'State.PLAYING', 'State.PAUSED', 'State.READY', 'State.NULL',
      'MessageType.ERROR', 'MessageType.EOS', 'MessageType.STATE_CHANGED',
      'Format.TIME', 'SeekFlags.FLUSH', 'SeekFlags.KEY_UNIT', 'CLOCK_TIME_NONE', 'type',
    ],
    noteZh: '在 Linux、树莓派和 Jetson 上创建摄像头、编解码、推流和显示管线。',
    noteEn: 'Build camera, codec, streaming, and display pipelines on Linux, Raspberry Pi, and Jetson.',
  },
];

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function dropdown(name, values) {
  return { type: 'field_dropdown', name, options: values.map((value) => [value, value]) };
}

function input(name) {
  return { type: 'input_value', name };
}

function blocksFor(library) {
  const { colour, icon } = CATEGORY_STYLE[library.category];
  const common = { colour, icon };
  const blocks = [
    {
      type: `${library.prefix}_call`,
      message0: `${library.title} call or create %1 arguments %2 keyword arguments %3`,
      args0: [dropdown('TARGET', library.callables), input('ARGS'), input('KWARGS')],
      ...common,
      tooltip: `Call an allowlisted ${library.title} function or constructor and return its result.`,
      output: 'Any',
    },
    {
      type: `${library.prefix}_do`,
      message0: `run ${library.title} %1 arguments %2 keyword arguments %3`,
      args0: [dropdown('TARGET', library.callables), input('ARGS'), input('KWARGS')],
      ...common,
      tooltip: `Run an allowlisted ${library.title} function or constructor as a statement.`,
      previousStatement: null,
      nextStatement: null,
    },
  ];
  if (library.methods.length) {
    blocks.push(
      {
        type: `${library.prefix}_method`,
        message0: `${library.title} object %1 call method %2 arguments %3 keyword arguments %4`,
        args0: [input('OBJECT'), dropdown('METHOD', library.methods), input('ARGS'), input('KWARGS')],
        ...common,
        tooltip: `Call an allowlisted ${library.title} object method and return its result.`,
        output: 'Any',
      },
      {
        type: `${library.prefix}_do_method`,
        message0: `run ${library.title} object %1 method %2 arguments %3 keyword arguments %4`,
        args0: [input('OBJECT'), dropdown('METHOD', library.methods), input('ARGS'), input('KWARGS')],
        ...common,
        tooltip: `Run an allowlisted ${library.title} object method as a statement.`,
        previousStatement: null,
        nextStatement: null,
      },
    );
  }
  if (library.attributes.length) {
    blocks.push({
      type: `${library.prefix}_attribute`,
      message0: `${library.title} object %1 attribute %2`,
      args0: [input('OBJECT'), dropdown('ATTRIBUTE', library.attributes)],
      ...common,
      tooltip: `Read an allowlisted ${library.title} object or module attribute.`,
      output: 'Any',
    });
  }
  return blocks;
}

function localeFor(library, blocks) {
  const locale = {
    toolbox_name: library.title,
    toolbox_categories: [],
    toolbox_labels: {},
  };
  for (const block of blocks) {
    locale[block.type] = {
      message0: block.message0,
      tooltip: block.tooltip,
      args0: block.args0.map((argument) => (
        argument.type === 'field_dropdown' ? { options: argument.options } : null
      )),
    };
  }
  return locale;
}

function compatibilityFor(profile) {
  if (profile === 'rpi') return RASPBERRY_PI_BOARDS;
  if (profile === 'jetson') return JETSON_BOARDS;
  return LINUX_BOARDS;
}

function packageMetadata(library) {
  const metadata = {
    name: `@aily-project/lib-${library.id.replaceAll('_', '-')}`,
    nickname: library.title,
  };
  for (const locale of LOCALES) metadata[`nickname_${locale}`] = library.title;
  Object.assign(metadata, {
    version: '0.0.1',
    description: `${library.title} 通过显式 CPython API 白名单为受支持的 Linux 单板机提供积木。`,
    description_zh_cn: `${library.title} 通过显式 CPython API 白名单为受支持的 Linux 单板机提供积木。`,
    description_en: `Allowlisted ${library.title} Python API blocks for Raspberry Pi and Linux single-board computers.`,
    spec: true,
    compatibility: { type: compatibilityFor(library.compatibility), voltage: [3.3] },
    keywords: ['aily', 'blockly', 'python', 'linux', 'raspberry-pi', library.pip, library.module],
    tags: [CATEGORY_STYLE[library.category].tag],
    author: 'ailyProject',
    license: 'MIT',
    homepage: library.homepage,
    dependencies: {},
    devDependencies: {},
  });
  return metadata;
}

function generatorFor(library, template) {
  const marker = template.lastIndexOf('})(globalThis, ');
  if (marker < 0) throw new Error('generic generator template marker missing');
  const spec = {
    title: library.title,
    prefix: library.prefix,
    module: library.module,
    alias: `_python_lib_${library.id}`,
    importKey: `python_lib_${library.id}`,
    callables: library.callables,
    methods: library.methods,
    attributes: library.attributes,
    asyncBridge: false,
  };
  if (library.importStatement) spec.importStatement = library.importStatement;
  const runtime = template.slice(0, marker);
  return `/* Curated ${library.title} bridge for Linux CPython projects. */\n${runtime.slice(runtime.indexOf('(function'))}})(globalThis, ${JSON.stringify(spec, null, 2)});\n`;
}

function readmeEnglish(library, blocks) {
  const importLine = library.importStatement
    ? '- Import: `gi.require_version("Gst", "1.0")`, then `from gi.repository import Gst`'
    : `- Import: \`import ${library.module} as _python_lib_${library.id}\``;
  return [
    `# @aily-project/lib-${library.id.replaceAll('_', '-')}`,
    '',
    `Curated ${library.title} integration for the standalone CPython generator at \`globalThis.Python\`.`,
    '',
    importLine,
    `- Install on target: \`${library.install}\``,
    `- Blocks (${blocks.length}): ${blocks.map((block) => `\`${block.type}\``).join(', ')}`,
    `- Allowlisted callables: ${library.callables.map((name) => `\`${name}\``).join(', ')}`,
    `- Allowlisted methods: ${library.methods.length ? library.methods.map((name) => `\`${name}\``).join(', ') : 'none'}`,
    `- Allowlisted attributes: ${library.attributes.length ? library.attributes.map((name) => `\`${name}\``).join(', ') : 'none'}`,
    `- API source: ${library.homepage}`,
    '',
    library.noteEn,
    '',
    'Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.',
    '',
    'This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.',
    '',
  ].join('\n');
}

function readmeChinese(library, blocks) {
  return [
    `# ${library.title} Blockly 库`,
    '',
    library.noteZh,
    '',
    `- 目标端安装：\`${library.install}\``,
    `- 积木（${blocks.length} 个）：${blocks.map((block) => `\`${block.type}\``).join('、')}`,
    `- 可调用入口：${library.callables.map((name) => `\`${name}\``).join('、')}`,
    `- 对象方法：${library.methods.length ? library.methods.map((name) => `\`${name}\``).join('、') : '无'}`,
    `- 对象/模块属性：${library.attributes.length ? library.attributes.map((name) => `\`${name}\``).join('、') : '无'}`,
    `- API 文档：${library.homepage}`,
    '',
    '参数输入应连接 Python 列表或元组，关键字参数应连接 Python 字典；留空时分别生成 `[]` 和 `{}`。下拉项使用固定白名单，不会把用户字段直接拼接成可执行标识符。',
    '',
    '本 Blockly 包不会自动安装目标端依赖、执行 sudo、更改设备权限或修改板卡配置。NVIDIA 软件包必须与已安装的 JetPack/CUDA 版本匹配；API 要求释放资源时，请显式调用相应方法。',
    '',
  ].join('\n');
}

function generatePackages() {
  const template = fs.readFileSync(path.join(ROOT, 'rpi_lgpio', 'generator.js'), 'utf8');
  for (const library of LIBRARIES) {
    const directory = path.join(ROOT, library.id);
    const blocks = blocksFor(library);
    const locale = localeFor(library, blocks);
    write(path.join(directory, 'block.json'), json(blocks));
    write(path.join(directory, 'generator.js'), generatorFor(library, template));
    for (const localeName of LOCALES) {
      write(path.join(directory, 'i18n', `${localeName}.json`), json(locale));
    }
    write(path.join(directory, 'package.json'), json(packageMetadata(library)));
    write(path.join(directory, 'readme.md'), readmeChinese(library, blocks));
    write(path.join(directory, 'readme_ai.md'), readmeEnglish(library, blocks));
    write(path.join(directory, 'toolbox.json'), json({
      kind: 'category',
      name: library.title,
      icon: CATEGORY_STYLE[library.category].icon,
      colour: CATEGORY_STYLE[library.category].colour,
      contents: blocks.map((block) => ({ kind: 'block', type: block.type })),
    }));
  }
}

function expandExistingLinuxCompatibility() {
  const catalogFile = path.join(ROOT, 'catalog', 'python-libraries.json');
  if (!fs.existsSync(catalogFile)) return;
  const catalog = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
  for (const library of catalog.libraries) {
    if (library.compatibility !== 'linux') continue;
    const metadataFile = path.join(ROOT, library.id, 'package.json');
    const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
    metadata.compatibility.type = LINUX_BOARDS;
    write(metadataFile, json(metadata));
  }
}

generatePackages();
expandExistingLinuxCompatibility();
console.log(`Generated ${LIBRARIES.length} edge Python Blockly libraries.`);
