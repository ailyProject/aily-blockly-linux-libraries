# @aily-project/lib-core-text

Standard Blockly text blocks for Linux CPython projects.

Blocks (14): `text`, `text_join`, `text_append`, `text_length`, `text_isEmpty`, `text_indexOf`, `text_charAt`, `text_getSubstring`, `text_changeCase`, `text_trim`, `text_print`, `text_count`, `text_replace`, `text_reverse`.

The substring block preserves Blockly's current dynamic shape and the standard `STRING`, `WHERE1`, `WHERE2`, `AT1`, and `AT2` names expected by its CPython handler. `WHERE1=FIRST` and `WHERE2=LAST` hide their numeric inputs; selecting either indexed mode restores them. Dropdown fields carry JSON state, while `at1` / `at2` mutation hooks preserve legacy XML state. The package validates generator handlers without replacing them.
