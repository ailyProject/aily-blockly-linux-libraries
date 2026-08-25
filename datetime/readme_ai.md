# Date & Time Blockly Library

This library targets standard CPython on Linux single-board computers. It uses the datetime and time standard libraries and requires no extra pip dependency.

## Surface

- Read the current local datetime or a timezone-aware UTC datetime.
- Read POSIX wall-clock seconds.
- Read monotonic whole milliseconds or microseconds for elapsed-time measurement.
- Construct, format with strftime, and parse with strptime.
- Convert between POSIX timestamps and local or UTC datetimes.
- Read numeric date and time components.
- Produce and parse supported ISO 8601 text.
- Sleep the current thread for a number of milliseconds.

## Time and exception semantics

- Local-now and local timestamp conversion return naive datetimes. UTC operations return aware datetimes using datetime.timezone.utc.
- POSIX time follows the adjustable system wall clock. Monotonic values are only meaningful as differences during a running system and are not epoch timestamps.
- Construction, parsing, formatting, timestamp conversion, and sleeping preserve standard CPython exceptions such as ValueError, TypeError, OverflowError, and OSError.
- Negative sleep durations are not clamped; time.sleep raises ValueError.
- Every dropdown is mapped through a fixed allowlist. User fields are never emitted as executable Python identifiers or source fragments.

API reference: https://docs.python.org/3/library/datetime.html
