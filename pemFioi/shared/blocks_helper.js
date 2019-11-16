BlocksHelper = {

    convertBlocks: function(context, name, types) {
        for (var category in context.customBlocks[name]) {
            for (var iBlock = 0; iBlock < context.customBlocks[name][category].length; iBlock++) {
                (function() {
                    var block = context.customBlocks[name][category][iBlock];
                    if (block.params) {
                        block.blocklyJson = { inputsInline: true, args0: {} }
                        var blockArgs = block.blocklyJson.args0;
                        block.blocklyXml = '<block type="' + block.name + '">';
                        for (var iParam = 0; iParam < block.params.length; iParam++) {
                            var paramData = types[block.params[iParam]] || { bType: 'input_value' };

                            blockArgs[iParam] = { type: paramData.bType, name: "PARAM_" + iParam }
                            if(paramData.bType == 'field_dropdown') {
                                blockArgs[iParam].options = paramData.options;
                            }

                            block.blocklyXml +=
                                '<value name="PARAM_' + iParam + '">' +
                                (paramData.vType ? '<shadow type="' + paramData.vType + '">' : '') +
                                '<field name="' + paramData.fName + '">' + paramData.defVal + '</field>' +
                                (paramData.vType ? '</shadow>' : '') +
                                '</value>';
                        }
                        block.blocklyXml += '</block>';
                    }
               })();
            }
        }
    },




    mutateBlockStrings: function(strings, blocksLanguage) {
        var src = window.stringsLanguage;
        if(typeof blocksLanguage == 'string') {
            src = blocksLanguage;
        } else if(typeof blocksLanguage == 'object' && window.modulesLanguage in blocksLanguage) {
            src = blocksLanguage[window.modulesLanguage];
        }
        var dst = window.stringsLanguage;

        for(var k in strings[dst].description) {
            strings[dst].description[k] = strings[dst].description[k].replace(
                new RegExp('%' + k, 'g'),
                strings[src].code[k]
            );
        }
        if(src == dst) return strings;

        strings[dst].label = strings[src].label;
        strings[dst].code = strings[src].code;
        return strings;
    }


}