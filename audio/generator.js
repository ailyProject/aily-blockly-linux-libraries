/* Play and record WAV audio through ALSA. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  // A library dependency can remain installed while a non-Python project is open.
  if (Python == null) return;
  const requiredMethods = ["addImport","addFunction","valueToCode"];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(`Linux Audio received an incompatible CPython generator${missingMethods.length ? `; missing ${missingMethods.join(', ')}` : ''}`);
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const define = (type, generator) => { Python.forBlock[type] = generator; };
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || fallback;
  const addAudioHelpers = (generator) => {
    generator.addImport('os', 'import os');
    generator.addImport('shlex', 'import shlex');
    generator.addFunction('linux_audio_helpers', "def _linux_play_audio(path):\n    return os.popen('aplay ' + shlex.quote(str(path))).read()\n\ndef _linux_record_audio(path, seconds=5, rate=16000):\n    command = 'arecord -f S16_LE -r {} -d {} -t wav {}'.format(int(rate), int(seconds), shlex.quote(str(path)))\n    return os.popen(command).read()");
  };
  define('linux_audio_play', (block, generator) => { addAudioHelpers(generator); return `_linux_play_audio(${value(generator, block, 'PATH', "'/tmp/audio.wav'")})\n`; });
  define('linux_audio_record', (block, generator) => { addAudioHelpers(generator); return `_linux_record_audio(${value(generator, block, 'PATH', "'/tmp/record.wav'")}, ${value(generator, block, 'SECONDS', '5')}, ${value(generator, block, 'RATE', '16000')})\n`; });
});
