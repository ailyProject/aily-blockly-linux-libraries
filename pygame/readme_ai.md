# @aily-project/lib-pygame

Curated pygame integration for the standalone CPython generator at `globalThis.Python`.

- Import: `import pygame as _python_lib_pygame`
- Install on target: `sudo apt install python3-pygame`
- Blocks (5): `python_pygame_call`, `python_pygame_do`, `python_pygame_method`, `python_pygame_do_method`, `python_pygame_attribute`
- Allowlisted callables: `init`, `quit`, `display.set_mode`, `display.flip`, `event.get`, `time.Clock`, `image.load`, `mixer.Sound`, `font.Font`, `draw.line`, `draw.rect`, `draw.circle`, `transform.scale`
- Allowlisted methods: `fill`, `blit`, `get_rect`, `play`, `stop`, `tick`
- Allowlisted attributes: `type`, `key`, `pos`, `button`, `size`
- API source: https://www.pygame.org/docs/

Arguments must be supplied as a Python list or tuple. Keyword arguments must be supplied as a Python dictionary. Empty sockets generate `[]` and `{}`. Dropdown machine values are fixed allowlists and field contents are never emitted as executable identifiers.

Call blocks return regular Python values. Resource objects must be closed or deinitialized explicitly with an allowlisted method when the API requires it.

On Raspberry Pi OS Bookworm and Trixie, install pip packages inside a virtual environment. This Blockly package never installs Python packages, runs sudo, enables interfaces, changes boot configuration, or changes device permissions.
