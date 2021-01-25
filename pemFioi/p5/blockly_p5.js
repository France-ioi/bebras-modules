var getContext = function(display, infos, curLevel) {


    var p5_strings = {
        en: {
            categories: {
                sound: 'Sound',
                control: 'Controls'
            },
            label: {
                playSignal: 'playSignal(%1, %2, %3, %4)',
                playRecord: 'playRecord(%1, %2)',
                playStop: 'playStop()',
                sleep: 'sleep(%1)',
                echo: 'echo(%1)'
            },
            code: {
                playSignal: 'playSignal',
                playRecord: 'playRecord',
                sleep: 'sleep',
                playStop: 'playStop',
                echo: 'echo'
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
                sleep: 'sleep(time) Time: time in ms during which the program should wait, but still play the sounds',
                echo: 'echo(value) : print value'
            },
            startingBlockName: "Program",
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
                'btn_files_repository': 'Add audio files...',
                'files_repository': {
                    'caption': 'Audio files list',
                    'hint': 'Use file number as param for playRecord function',
                    'add': 'Add',
                    'incompatible_browser': 'Incompatible browser',
                    'confirm_overwrite': 'Overwrite files?',
                    'file_not_found': 'File not found: ',
                    'copy_to_clipboard': 'Copy name to clipboard'
                }
            }
        },
        fr: {
            categories: {
                sound: 'Son',
                control: 'Contrôle'
            },
            label: {
                playSignal: 'playSignal(%1, %2, %3, %4)',
                playRecord: 'playRecord(%1, %2)',
                playStop: 'playStop()',
                sleep: 'sleep(%1)',
                echo: 'echo(%1)'
            },
            code: {
                playSignal: 'playSignal',
                playRecord: 'playRecord',
                sleep: 'sleep',
                playStop: 'playStop',
                echo: 'echo'
            },
            description: {
                playSignal : 'playSignal(canal, type, frequence, amplitude)\n' +
                    'Canal : 1, 2 ou 3 (jusqu\'à 3 signaux peuvent être joués simultanément)\n' +
                    'Type : "sinus" - onde sinusoïdale, "carré" - onde carrée, "scie"- onde en dents de scie, "bruit": bruit blanc\n' +
                    'Frequence: en Hertz, de 100 à 8000\n' +
                    'Amplitude : de 0 (silence) à 1 (volume maximal)',
                playRecord: 'playRecord(url, frequence) Url : une chaîne, l\'url du son à jouer\n' +
                    'Frequency : fréquence à utiliser pour un filtre passe bas (les fréquences plus élevées seront retirées)',
                playStop: 'playStop()',
                sleep: 'sleep( duree ) : Duree : durée en ms pendant laquelle le programme doit attendre, tout en continuant à jouer les sons',
                echo: 'echo(value) : affiche la valeur'
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
                'loading': 'Chargement du fichier',
                'load_error': 'Une erreur s\'est produite lors du chargement du fichier.'
            },
            ui: {
                'mic': 'Activer le micro',
                'btn_files_repository': 'Ajouter des fichiers audio...',
                'files_repository': {
                    'caption': 'Liste des fichiers audio',
                    'hint': 'Utilisez le numéro de fichier comme paramètre de la fonction playRecord',
                    'add': 'Ajouter',
                    'incompatible_browser': 'Navigateur incompatible',
                    'confirm_overwrite': 'Overwrite files?',
                    'file_not_found': 'File not found: ',
                    'copy_to_clipboard': 'Copy name to clipboard'
                }
            }
        }
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
    var logger;

    var conceptBaseUrl = window.location.protocol + '//'
        + 'static4.castor-informatique.fr/help/p5.html';

    context.conceptList = [
        {id: 'p5_introduction', name: 'La proglet exploSonore', url: conceptBaseUrl+'#p5_introduction'},
        {id: 'p5_playSignal', name: 'Lancer un signal prédéfini', url: conceptBaseUrl+'#p5_playSignal'},
        {id: 'p5_playRecord', name: 'Lancer un signal enregistré', url: conceptBaseUrl+'#p5_playRecord'},
        {id: 'p5_playStop', name: 'Arrêter une émission sonore', url: conceptBaseUrl+'#p5_playStop'}
    ];


    context.reset = function(taskInfos) {
        if(!context.display) return

        if(player) {
            player.resetChannels();
            return;
        }

        task_files.initLevel({
            strings: strings.ui.files_repository,
            level: curLevel
        });

        player = new PlayerP5({
            parent: $('#grid')[0],
            filesRepository: task_files
        });

        logger = new Logger({
            parent: $('#gridContainer')
        });

        if(!$('#p5_message')[0]) {
            $('<div id="p5_message"></div>').insertAfter($('#grid'));
        }
        if(!$('#p5_controls')[0]) {
            var html =
                '<div id="p5_controls" style="text-align: left;">' +
                    '<label><input type="checkbox" id="p5_microphone"/>' + strings.ui.mic + '</label>' +
                    '<button class="btn btn-xs" style="float: right" id="p5_files">' + strings.ui.btn_files_repository + '</button>' +
                '</div>';
            $('#testSelector').prepend($(html))
            $('#p5_microphone').click(function() {
                player.toggleMicrophone($(this).prop('checked'));
            })
            $('#p5_files').click(function() {
                task_files.open();
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


    context.p5 = {

        playSignal: function(channel, type, frequency, amplitude, callback) {
            context.waitDelay(
                callback,
                player.initSignal(channel, type, frequency, amplitude)
            );
        },

        playRecord: function(url, frequency, callback) {
            var onLoadProgress = function(progress) {
                $('#p5_message').text(strings.messages.loading);
            }

            var cb = context.runner.waitCallback(callback);
            var onLoadEnd = function() {
                $('#p5_message').text('');
                cb();
            }
            var onLoadError = function() {
                $('#p5_message').text('');
                if(window.quickAlgoInterface) {
                    window.quickAlgoInterface.displayError(strings.messages.load_error);
                } else {
                    $("#errors").html(strings.messages.load_error);
                }
            }
            player.initRecord(url, frequency, onLoadEnd, onLoadError, onLoadProgress);
        },


        sleep: function(ms, callback) {
            if(!rate) {
                player.pause();
                context.waitDelay(callback);
                return;
                //return callback();
            }
            var ms = Math.min(10000, parseInt(ms, 10) || 0) * (delay / 200);
            if(!ms) {
                context.waitDelay(callback);
                return;
                //return callback();
            }
            player.setRate(rate);
            player.play();
            context.runner.waitDelay(function() {
                if(context.runner && context.runner.stepMode) {
                    player.pause();
                }
                context.callCallback(callback);
            }, undefined, ms)
        },

        playStop: function(callback) {
            context.waitDelay(
                callback,
                player.resetChannels()
            );
        },

        echo: function(msg, callback) {
            context.waitDelay(
                callback,
                logger.put(msg)
            );
        }
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
                { name: 'playStop' },
                { name: 'echo',
                    params: ['String'],
                    params_names: ['msg']
                },
            ]
        }
    }


    var typeData = {
        'Number': { bType: 'input_value', vType: 'math_number', fName: 'NUM', defVal: 0 },
        'String': { bType: 'input_value', vType: 'text', fName: 'TEXT', defVal: '' },
        'WaveType': { bType: 'field_dropdown', defVal: 'sine', options: [
            [ strings.constantLabel.sine, 'sine'],
            [ strings.constantLabel.triangle, 'triangle'],
            [ strings.constantLabel.sawtooth, 'sawtooth'],
            [ strings.constantLabel.square, 'square'],
            [ strings.constantLabel.noise, 'noise']
        ]}
    }

    BlocksHelper.convertBlocks(context, 'p5', typeData);

    return context;
}

if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('p5', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['p5', getContext]);
}


window.task_files = new FilesRepository({
    reader: 'text',
    extensions: '.mp3'
});
