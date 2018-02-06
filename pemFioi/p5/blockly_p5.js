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
                sleep: 'sleep',
                playStop: 'playStop'
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
            messages: {
                'loading': 'Loading file...',
                'load_error': 'Error occurred during loading file.'
            },
            ui: {
                'mic': 'Enable microphone',
                'files': 'Add audio files...',
                'caption': 'Audio files list',
                'hint': 'Use file number as param for playRecord function',
                'add': 'Add',
                'incompatible_browser': 'Incompatible browser'
            }
        }
    }


    function FilesRepository(parent) {

        var browser_compatible = window.File && window.FileReader && window.FileList && window.Blob;


        function initModal() {
            if($('#p5_files_modal')[0]) return;
            var inner_html;
            if(browser_compatible) {
                inner_html =
                    '<p>' + strings.ui.hint + '</p>' +
                    '<table id="p5_files"></table>' +
                    '<div id="p5_inputs"></div>'

            } else {
                inner_html =
                    '<p>' + strings.ui.incompatible_browser + '</p>';
            }
            var html =
                '<div id="p5_files_modal" class="modalWrapper">' +
                    '<div class="modal">' +
                        '<button type="button" class="btn close" onclick="$(`#p5_files_modal`).hide()">x</button>' +
                        '<p><b>' + strings.ui.caption + '</b></p>' +
                        inner_html
                    '</div>' +
                '</div>';
            $(parent).append($(html));
        }


        function enumerateFiles() {
            $('#p5_files > tbody > tr').each(function(idx, tr) {
                $(tr).find('td:nth-child(1)').text(idx + 1 + '. ');
            })
        }


        function addFilesGroup(files, group_idx) {
            var html = '';
            for(var i = 0, f; f = files[i]; i++) {
                html += '<tr group_idx="' + group_idx + '"><td></td><td>' + f.name + '</td>';
                if(i==0) {
                    html +=
                        '<td rowspan="' + files.length + '">' +
                            '<button type="button" class="btn close">x</button>' +
                        '</td>';
                }
                html += '</tr>';
            }
            var tr = $(html);
            tr.find('button.close').click(function() {
                $('#p5_files > tbody > tr[group_idx=' +  group_idx + ']').remove();
                $('#p5_inputs > input[group_idx=' +  group_idx + ']').remove();
                enumerateFiles();
            })
            $('#p5_files').append(tr);
            enumerateFiles();
        }


        var group_idx = 0;

        function addInput() {
            group_idx ++;
            var input = $('<input group_idx="' + group_idx + '" type="file" class="btn" multiple accept=".mp3" title="' + strings.ui.add + '"/>');
            $('#p5_inputs').append(input);
            input.change(function() {
                if(!this.files.length) return;
                addFilesGroup(this.files, group_idx);
                $(this).hide();
                addInput();
            })
        }



        // interface
        this.getFile = function(n) {
            var p = 0;
            var inputs = $('#p5_inputs > input[type=file]');
            for(var i=0, input; input = inputs[i]; i++) {
                if(n >= p && n < p + input.files.length) {
                    return input.files[n - p];
                }
                p += input.files.length;
            }
            return null;
        }


        // init
        initModal();
        if(!browser_compatible) return;
        addInput();
    }


    function delayToRate(delay) {
        if(delay >= 200) {
            return 1;
        } else if(delay >= 50) {
            return 2;
        } else if(delay >= 5) {
            return 4;
        }
        return 0;
    }


    var context = quickAlgoContext(display, infos)
    var strings = context.setLocalLanguageStrings(p5_strings)
    var player;
    var delay = infos.actionDelay;
    var rate = delayToRate(delay);
    var files;


    context.reset = function(taskInfos) {
        if(!context.display) return

        if(player) {
            player.resetChannels();
            return;
        }

        files = new FilesRepository($('#taskContent'));
        player = new PlayerP5({
            parent: $('#grid')[0],
            filesRepository: files.getFile
        })

        if(!$('#p5_message')[0]) {
            $('<div id="p5_message"></div>').insertAfter($('#grid'));
        }
        if(!$('#p5_controls')[0]) {
            var html =
                '<div id="p5_controls" style="text-align: left;">' +
                    '<label><input type="checkbox" id="p5_microphone"/>' + strings.ui.mic + '</label>' +
                    '<button class="btn btn-xs" style="float: right" onclick="$(`#p5_files_modal`).show()">' + strings.ui.files + '</button>' +
                '</div>';
            $('#testSelector').prepend($(html))
            $('#p5_microphone').click(function() {
                player.toggleMicrophone($(this).prop('checked'));
            })
        }
        player.toggleMicrophone($('#p5_microphone').prop('checked'));
    }




    context.setScale = function(scale) {}
    context.updateScale = function() {}
    context.resetDisplay = function() {}
    context.unload = function() {}
    context.changeDelay = function(actionDelay) {
        delay = actionDelay;
        rate = delayToRate(delay);
        player && player.setRate(rate)
    }
    context.onExecutionEnd = function() {
        player.resetChannels();
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



    context.p5 = {

        playSignal: function(channel, type, frequency, amplitude, callback) {
            player.initSignal(channel, type, frequency, amplitude);
            callback();
        },

        playRecord: function(url, frequency, callback) {
            var onLoadProgress = function(progress) {
                $('#p5_message').text(strings.messages.loading);
            }
            var onLoadEnd = function() {
                $('#p5_message').text('');
                context.waitDelay(callback);
            }
            var onLoadError = function() {
                $('#p5_message').text('');
                $('#errors').text(strings.messages.load_error);
            }
            player.initRecord(url, frequency, onLoadEnd, onLoadError, onLoadProgress);
        },


        sleep: function(ms, callback) {
            if(!rate) {
                player.pause();
                return callback();
            }
            var ms = Math.min(10000, parseInt(ms, 10) || 0) * (delay / 200);
            if(!ms) {
                return callback();
            }
            player.setRate(rate);
            player.play();
            setTimeout(function() {
                if(context.runner && context.runner.stepMode) {
                    player.pause();
                }
                context.callCallback(callback);
            }, ms)
        },

        playStop: function(callback) {
            player.resetChannels();
            callback();
        }
    }


    for (var category in context.customBlocks.p5) {
        for (var iBlock = 0; iBlock < context.customBlocks.p5[category].length; iBlock++) {
            (function() {
                var block = context.customBlocks.p5[category][iBlock];
                if (block.params) {
                    block.blocklyJson = { inputsInline: true, args0: {} }
                    var blockArgs = block.blocklyJson.args0;
                    block.blocklyXml = '<block type="' + block.name + '">';
                    for (var iParam = 0; iParam < block.params.length; iParam++) {
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
           })();
        }
    }

    return context;
}