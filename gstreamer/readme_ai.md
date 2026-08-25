# @aily-project/lib-gstreamer

Curated GStreamer integration for the standalone CPython generator at `globalThis.Python`.

- Import: `gi.require_version("Gst", "1.0")`, then `from gi.repository import Gst`
- Install on target: `sudo apt install python3-gi gir1.2-gstreamer-1.0 gstreamer1.0-tools`
- Blocks (5): `gstreamer_call`, `gstreamer_do`, `gstreamer_method`, `gstreamer_do_method`, `gstreamer_attribute`
- Allowlisted callables: `init`, `parse_launch`, `version`, `version_string`, `debug_set_active`, `debug_set_default_threshold`
- Allowlisted methods: `set_state`, `get_state`, `get_bus`, `get_by_name`, `send_event`, `set_property`, `get_property`, `timed_pop_filtered`, `pop`, `have_pending`, `is_playing`, `seek_simple`
- Allowlisted attributes: `State.PLAYING`, `State.PAUSED`, `State.READY`, `State.NULL`, `MessageType.ERROR`, `MessageType.EOS`, `MessageType.STATE_CHANGED`, `Format.TIME`, `SeekFlags.FLUSH`, `SeekFlags.KEY_UNIT`, `CLOCK_TIME_NONE`, `type`
- API source: https://gstreamer.freedesktop.org/documentation/tutorials/basic/hello-world.html

Build camera, codec, streaming, and display pipelines on Linux, Raspberry Pi, and Jetson.

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

This Blockly package does not install target dependencies, run sudo, change device permissions, or modify board configuration. Match NVIDIA packages to the installed JetPack/CUDA release, and release resource objects explicitly when the API requires it.
