/* Preserve Blockly's dynamic substring shape and validate CPython handlers. */
(function (root, requiredTypes) {
  'use strict';

  const Python = root.Python;
  // Libraries can remain installed while a non-Python project is open.
  if (Python == null) return;
  if (Python.forBlock == null || typeof Python.forBlock !== 'object') {
    throw new Error('Core Text received an incompatible CPython generator; missing forBlock');
  }
  const missing = requiredTypes.filter((type) => typeof Python.forBlock[type] !== 'function');
  if (missing.length) {
    throw new Error(`Core Text received an incompatible CPython generator; missing handlers: ${missing.join(', ')}`);
  }

  const Blockly = root.Blockly;
  const substringExtension = 'aily_core_text_get_substring_shape';
  if (
    Blockly?.Extensions
    && typeof Blockly.Extensions.isRegistered === 'function'
    && typeof Blockly.Extensions.registerMutator === 'function'
    && !Blockly.Extensions.isRegistered(substringExtension)
  ) {
    const substringMixin = {
      mutationToDom() {
        const container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('at1', String(Boolean(this.getInput('AT1')?.connection)));
        container.setAttribute('at2', String(Boolean(this.getInput('AT2')?.connection)));
        return container;
      },

      domToMutation(xmlElement) {
        this.updateAt_(1, xmlElement.getAttribute('at1') === 'true');
        this.updateAt_(2, xmlElement.getAttribute('at2') === 'true');
      },

      updateAt_(index, isAt) {
        const inputName = `AT${index}`;
        const ordinalName = `ORDINAL${index}`;
        this.removeInput(inputName, true);
        this.removeInput(ordinalName, true);

        if (isAt) {
          this.appendValueInput(inputName).setCheck('Number');
          if (Blockly.Msg['ORDINAL_NUMBER_SUFFIX']) {
            this.appendDummyInput(ordinalName).appendField(Blockly.Msg['ORDINAL_NUMBER_SUFFIX']);
          }
        } else {
          this.appendDummyInput(inputName);
        }

        if (index === 2 && Blockly.Msg['TEXT_GET_SUBSTRING_TAIL']) {
          this.removeInput('TAIL', true);
          this.appendDummyInput('TAIL').appendField(Blockly.Msg['TEXT_GET_SUBSTRING_TAIL']);
        }
        if (index === 1) {
          this.moveInputBefore('AT1', 'WHERE2_INPUT');
          if (this.getInput('ORDINAL1')) {
            this.moveInputBefore('ORDINAL1', 'WHERE2_INPUT');
          }
        }
      },
    };

    Blockly.Extensions.registerMutator(substringExtension, substringMixin, function () {
      const installValidator = (index) => {
        const menu = this.getField(`WHERE${index}`);
        menu.setValidator(function (value) {
          const oldValue = this.getValue();
          const oldAt = oldValue === 'FROM_START' || oldValue === 'FROM_END';
          const newAt = value === 'FROM_START' || value === 'FROM_END';
          if (newAt !== oldAt) {
            this.getSourceBlock().updateAt_(index, newAt);
          }
          return undefined;
        });
      };
      installValidator(1);
      installValidator(2);
    });
  }

})(globalThis, [
  'text',
  'text_join',
  'text_append',
  'text_length',
  'text_isEmpty',
  'text_indexOf',
  'text_charAt',
  'text_getSubstring',
  'text_changeCase',
  'text_trim',
  'text_print',
  'text_count',
  'text_replace',
  'text_reverse',
]);
