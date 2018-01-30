var getContext = function(display, infos) {

    var p5_strings = {
        fr: {
            categories: {
                sound: 'Sound',
                control: 'Control'
            },
            label: {
                playSignal: 'playSignal(%1, %2, %3, %4)',
                playRecord: 'playRecord(%1, %2)',
                playStop: 'playStop()',
                sleep: 'sleep(%1)'
            },
            code: {
                playSignal: 'playSignal',
                playRecord: 'playRecord',
                playStop: 'playStop',
                sleep: 'sleep'
            },
            description: {
                playSignal: 'playSignal(canal, type, frequency, amplitude) \n' +
                    'Canal: 1, 2, or 3 (up to 3 signals can be played simultaneously)\n' +
                    'Type: “sinus” - sine wave, “carré” - square wave, “scie” - sawtooth wave, “bruit”: white noise\n' +
                    'Frequency: in Hz, from 100 to 8000\n' +
                    'Amplitude: from 0 (silent) to 1 (100% volume)',
                playRecord: 'playRecord(url, frequency) Url : a string: the url of the sound to play\n' +
                    'Frequency : frequency to be used for a low pass filter (frequencies above should be removed)',
                playStop: 'playStop()',
                sleep: 'sleep(time) Time: time in ms during which the program should wait, but still play the sounds'
            },
            startingBlockName: "Programme",
            constantLabel: {
                'sine': 'sinus',
                'triangle': 'triangle',
                'sawtooth': 'scie',
                'square': 'carré',
                'noise': 'bruit'
            },
            messages: {}
        }
    }

    var context = quickAlgoContext(display, infos)
    var strings = context.setLocalLanguageStrings(p5_strings)
    var player;

    context.reset = function(taskInfos) {
        if(!context.display) return
        player && player.destroy()
        player = new PlayerP5({
            parent: $('#grid')[0]
        })
    }


    context.setScale = function(scale) {}
    context.updateScale = function() {}
    context.resetDisplay = function() {}
    context.unload = function() {}
    context.changeDelay = function() {
        console.log(arguments)
    }


    context.customBlocks = {
        p5: {
            sound: [
                { name: 'playSignal',
                    params: ['Number', 'WaveType', 'Number', 'Number'],
                    params_names: ['canal', 'type', 'frequency', 'amplitude']
                },
                { name: 'playRecord',
                    params: ['String', 'Number'],
                    params_names: ['url', 'frequency']
                }
            ],
            control: [
                { name: 'sleep',
                    params: ['Number'],
                    params_names: ['time']
                },
                { name: 'playStop' }
            ]
        }
    }

    var typeData = {
        'Number': { bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
        'String': { bType: 'input_value', vType: 'text', fName: 'TEXT', defVal: '' },
        'WaveType': { bType: 'field_dropdown', options: [ 'sine', 'triangle', 'sawtooth', 'square', 'noise' ]}
    }


    context.p5 = {}

    for (var category in context.customBlocks.p5) {
        for (var iBlock = 0; iBlock < context.customBlocks.p5[category].length; iBlock++) {
            (function() {
                var block = context.customBlocks.p5[category][iBlock];
                //var params = [];
                if (block.params) {
                    block.blocklyJson = { inputsInline: true, args0: {} }
                    var blockArgs = block.blocklyJson.args0;
                    block.blocklyXml = '<block type="' + block.name + '">';
                    for (var iParam = 0; iParam < block.params.length; iParam++) {
                        //params[iParam] = block.params[iParam];
                        var paramData = typeData[block.params[iParam]] || { bType: 'input_value' };

                        blockArgs[iParam] = { type: paramData.bType, name: "PARAM_" + iParam }
                        if(paramData.bType == 'field_dropdown') {
                            var options = [];
                            for(var iValue=0; iValue<paramData.options.length; iValue++) {
                                var v = paramData.options[iValue];
                                options.push([strings.constantLabel[v] || v, v]);
                            }
                            blockArgs[iParam].options = options;
                        }

                        block.blocklyXml +=
                            '<value name="PARAM_' + iParam + '"><shadow type="' + paramData.vType + '">' +
                            '<field name="' + paramData.fName + '">' + paramData.defVal + '</field>' +
                            '</shadow></value>';
                    }
                    block.blocklyXml += '</block>';
                }

                context.p5[block.name] = function() {
                    var callback = arguments[arguments.length - 1]
                    if(block.name == 'sleep') {
                        // TODO: check how this work
                        setTimeout(function() {
                            context.waitDelay(callback);
                        }, Math.min(10000, arguments[0]))
                    } else {
                        player && player[block.name].apply(player, arguments);
                        callback()
                    }
                }
           })();
        }
    }

    return context;
}