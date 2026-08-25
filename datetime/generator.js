/* CPython standard-library date, time, timestamp, and monotonic-clock helpers. */
(function (root, register) {
  'use strict';

  const Python = root.Python;
  if (Python == null) return;
  const requiredMethods = ['addImport', 'valueToCode'];
  const missingMethods = requiredMethods.filter((name) => typeof Python[name] !== 'function');
  if (!Python.forBlock || missingMethods.length) {
    throw new Error(
      'Date & Time received an incompatible CPython generator'
      + (missingMethods.length ? '; missing ' + missingMethods.join(', ') : '')
    );
  }
  register(Python);
})(globalThis, function (Python) {
  'use strict';

  const ORDER_MEMBER = Python.ORDER_MEMBER ?? 2.1;
  const ORDER_CALL = Python.ORDER_FUNCTION_CALL ?? 2.2;
  const ORDER_MULTIPLICATIVE = Python.ORDER_MULTIPLICATIVE ?? 5.1;
  const ORDER_NONE = Python.ORDER_NONE ?? 99;
  const define = (type, generator) => { Python.forBlock[type] = generator; };
  const field = (block, name, fallback = '') => block.getFieldValue(name) ?? fallback;
  const value = (generator, block, name, fallback = 'None', order = ORDER_NONE) =>
    generator.valueToCode(block, name, order) || fallback;
  const output = (code, order = ORDER_CALL) => [code, order];
  const choice = (table, requested, fallback) =>
    Object.prototype.hasOwnProperty.call(table, requested) ? table[requested] : table[fallback];

  const CONSTRUCTOR_TIMEZONES = Object.freeze({
    NAIVE: '',
    UTC: ', tzinfo=_aily_datetime.timezone.utc',
  });
  const TIMESTAMP_TIMEZONES = Object.freeze({
    LOCAL: '',
    UTC: ', tz=_aily_datetime.timezone.utc',
  });
  const COMPONENTS = Object.freeze({
    YEAR: '.year',
    MONTH: '.month',
    DAY: '.day',
    HOUR: '.hour',
    MINUTE: '.minute',
    SECOND: '.second',
    MICROSECOND: '.microsecond',
    WEEKDAY: '.weekday()',
    ISO_WEEKDAY: '.isoweekday()',
    DAY_OF_YEAR: '.timetuple().tm_yday',
  });
  const TIMESPECS = Object.freeze({
    AUTO: "'auto'",
    HOURS: "'hours'",
    MINUTES: "'minutes'",
    SECONDS: "'seconds'",
    MILLISECONDS: "'milliseconds'",
    MICROSECONDS: "'microseconds'",
  });

  const addDatetime = (generator) =>
    generator.addImport('python_datetime_module', 'import datetime as _aily_datetime');
  const addTime = (generator) =>
    generator.addImport('python_datetime_time_module', 'import time as _aily_time');

  define('python_datetime_now', (_block, generator) => {
    addDatetime(generator);
    return output('_aily_datetime.datetime.now()');
  });

  define('python_datetime_utc_now', (_block, generator) => {
    addDatetime(generator);
    return output('_aily_datetime.datetime.now(_aily_datetime.timezone.utc)');
  });

  define('python_datetime_timestamp_now', (_block, generator) => {
    addTime(generator);
    return output('_aily_time.time()');
  });

  define('python_datetime_monotonic_ms', (_block, generator) => {
    addTime(generator);
    return output('_aily_time.monotonic_ns() // 1000000', ORDER_MULTIPLICATIVE);
  });

  define('python_datetime_monotonic_us', (_block, generator) => {
    addTime(generator);
    return output('_aily_time.monotonic_ns() // 1000', ORDER_MULTIPLICATIVE);
  });

  define('python_datetime_create', (block, generator) => {
    addDatetime(generator);
    const timezone = choice(
      CONSTRUCTOR_TIMEZONES,
      field(block, 'TIMEZONE', 'NAIVE'),
      'NAIVE'
    );
    const args = [
      value(generator, block, 'YEAR', '1970'),
      value(generator, block, 'MONTH', '1'),
      value(generator, block, 'DAY', '1'),
      value(generator, block, 'HOUR', '0'),
      value(generator, block, 'MINUTE', '0'),
      value(generator, block, 'SECOND', '0'),
      value(generator, block, 'MICROSECOND', '0'),
    ].map((item) => 'int(' + item + ')').join(', ');
    return output('_aily_datetime.datetime(' + args + timezone + ')');
  });

  define('python_datetime_format', (block, generator) => {
    const dateTime = value(generator, block, 'DATETIME');
    const format = value(generator, block, 'FORMAT', "'%Y-%m-%d %H:%M:%S'");
    return output('(' + dateTime + ').strftime(str(' + format + '))');
  });

  define('python_datetime_parse', (block, generator) => {
    addDatetime(generator);
    const text = value(generator, block, 'TEXT', "''");
    const format = value(generator, block, 'FORMAT', "'%Y-%m-%d %H:%M:%S'");
    return output('_aily_datetime.datetime.strptime(str(' + text + '), str(' + format + '))');
  });

  define('python_datetime_from_timestamp', (block, generator) => {
    addDatetime(generator);
    const timestamp = value(generator, block, 'TIMESTAMP', '0');
    const timezone = choice(
      TIMESTAMP_TIMEZONES,
      field(block, 'TIMEZONE', 'LOCAL'),
      'LOCAL'
    );
    return output(
      '_aily_datetime.datetime.fromtimestamp(float(' + timestamp + ')' + timezone + ')'
    );
  });

  define('python_datetime_to_timestamp', (block, generator) => {
    const dateTime = value(generator, block, 'DATETIME');
    return output('(' + dateTime + ').timestamp()');
  });

  define('python_datetime_component', (block, generator) => {
    const dateTime = value(generator, block, 'DATETIME');
    const suffix = choice(COMPONENTS, field(block, 'COMPONENT', 'YEAR'), 'YEAR');
    return output('(' + dateTime + ')' + suffix, ORDER_MEMBER);
  });

  define('python_datetime_isoformat', (block, generator) => {
    const dateTime = value(generator, block, 'DATETIME');
    const timespec = choice(TIMESPECS, field(block, 'TIMESPEC', 'AUTO'), 'AUTO');
    return output('(' + dateTime + ').isoformat(timespec=' + timespec + ')');
  });

  define('python_datetime_from_isoformat', (block, generator) => {
    addDatetime(generator);
    const text = value(generator, block, 'TEXT', "''");
    return output('_aily_datetime.datetime.fromisoformat(str(' + text + '))');
  });

  define('python_datetime_sleep_ms', (block, generator) => {
    addTime(generator);
    const milliseconds = value(generator, block, 'MILLISECONDS', '0');
    return '_aily_time.sleep(float(' + milliseconds + ') / 1000.0)\n';
  });
});
