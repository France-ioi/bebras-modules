var getContext = function (display, infos, curLevel) {


    var config = {
        mistake_background_color: 'lightpink',
        placeholder: '?',
        latency: {
            min: 0.1,
            max: 1
        },
        input_prefix: '>'
    }

    var localLanguageStrings = {
        en: {
            categories: {
                scanip: 'Scan IP'
            },            
            label: {
                // Labels for the blocks
                sendPacket: "send packet to IP",
                print: "print string",
                getArgument: "get argument",
                getArgumentsLength: "get amount of arguments"
            },
            code: {
                // Names of the functions in Python, or Blockly translated in JavaScript
                sendPacket: "sendPacket",
                print: "print",
                getArgument: "getArgument",
                getArgumentsLength: "getArgumentsLength"                
            },
            description: {
                // Descriptions of the functions in Python (optional)
                sendPacket: "sendPacket() Send packet to IP",
                print: "print() Print string",
                getArgument: "getArgument() Get argument",
                getArgumentsLength: "getArgumentsLength() Get total amount of arguments"                
            },
            constant: {},
            startingBlockName: "Program", // Name for the starting block
            messages: {
                success: 'Success!',
                online: ': The device is online',
                offline: ': The device is not connected',
                no_device: ': No device at this IP',
                lines_count_mistake: 'Output contain extra lines or some lines missed',
                line_mistake: 'Lines with mistake marked with red color'
            }
        }
    }

    var context = quickAlgoContext(display, infos);
    var strings = context.setLocalLanguageStrings(localLanguageStrings);
    if (window.quickAlgoInterface) {
        window.quickAlgoInterface.stepDelayMax = 500;
    }


    var random = {

        counter: 0,
        step: 10,

        reset: function() {
            this.counter = Math.random() * 100;
        },


        get: function() {
            var range = config.latency.max - config.latency.min;
            var res = config.latency.min + range * Math.abs(Math.sin(this.counter));
            res = res.toFixed(2);
            res = parseFloat(res);
            this.counter += this.step;
            return res;
        }
    }



    var input = {

        cmd: '',
        data: [],

        set: function(cmd) {
            this.cmd = cmd;
            this.data = cmd.split(' ');
        },

        get: function() {
            return this.cmd;
        },

        getArgumentsLength: function() {
            return this.data.length;
        },

        getArgument: function(n) {
            return this.data[n];
        },

        getArguments: function() {
            return this.data;
        }

    }


    var network = {
        data: {},


        getRandomLatency: function() {
            var range = config.latency.max - config.latency.min;
            var res = config.latency.min + range * Math.random();
            res = res.toFixed(2);
            res = parseFloat(res);
            return res;
        },

        setData: function(data) {
            for(var i=0; i<data.length; i++) {
                var list = this.parseIP(data[i].ip);
                for(var j=0; j<list.length; j++) {
                    this.data[list[j]] = {
                        status: data[i].status,
                        latency: this.getRandomLatency()
                    }
                }
            }
        },


        parseIP: function(ip) {
            var numbers = ip.split('.');
            var placeholders = [];
            function findPlaceholders(number, ofs) {
                var pos = -1;
                while((pos = number.indexOf(config.placeholder, pos + 1)) !== -1) {
                    var min, max;
                    if(number.length == 1) {
                        min = 0;
                        max = 9;
                    } else {
                        min = pos == 0 ? 1 : 0;
                        max = (pos == 0 && number.length == 3) ? 2 : 9;
                    }
                    placeholders.push({
                        pos: pos + ofs,
                        min: min,
                        max: max
                    });
                }
            }

            var ofs = 0;
            for(var i=0; i<numbers.length; i++) {
                findPlaceholders(numbers[i], ofs);
                ofs += i + numbers[i].length;
            }

            function replaceChar(str, ofs, char) {
                return str.substring(0, ofs) + char + str.substring(ofs + 1);
            }


            var res = [];
            function enumeratePlaceholders(ip, idx) {
                var p = placeholders[idx];
                if(!p) {
                    res.push(ip);
                    return;
                }
                for(var n=p.min; n<=p.max; n++) {
                    enumeratePlaceholders(
                        replaceChar(ip, p.pos, n),
                        idx + 1
                    );
                }
            }
            enumeratePlaceholders(ip, 0);
            return res;            
        },        

        int2ip: function(n) {
            return (n>>>24) + '.' + (n>>16 & 255) + '.' + (n>>8 & 255) + '.' + (n & 255);
        },

        ip2int: function(ip) {
            var parts = ip.split('.');
            var n = 0;
            for(var i=0; i<parts.length; i++) {
                n = n * 256 + parseInt(parts[i], 10);
            }
            return n;
        },


        sendPacket: function(ip, silent) {
            var res = {
                status: 'no_device',
                latency: 0
            }
            if(ip in this.data) {
                res = this.data[ip];
            }
            if(context.display && !silent) {
                var el = $('<div/>');
                el.html(ip + strings.messages[res.status]);
                $('#log').append(el);                            
            }
            return res;
        }

    };



    var output = {

        lines: [],

        clear: function() {
            this.lines = [];
        },

        print: function(str) {
            this.lines.push(str);
            if(context.display) {
                var el = $('<div/>');
                el.html(str);
                $('#print').append(el);
            }
        },

        get: function() {
            return this.lines;
        },

        markMistakeLine: function(line_idx) {
            if(context.display) {
                $('#print > div:nth-child(' + (1 + line_idx) + ')').css('background', config.mistake_background_color);
            }
        }
    }



    infos.checkEndEveryTurn = false;
    infos.checkEndCondition = function (context, lastTurn) {
        if(!lastTurn) {
            return;
        }

        // generate valid output
        var expected_output = [
            config.input_prefix + input.get()
        ];
        function addLine(ip) {
            var res = network.sendPacket(ip, true);
            var line = ip + ' ' + res.status + ' ' + res.latency + 'ms';
            expected_output.push(line);
        }

        var cmd = input.getArgument(0);
        if(cmd == 'scanip') {
            addLine(input.getArgument(1));
        } else if(cmd == 'scanips') {
            var l = input.getArgumentsLength();
            for(var i=1; i<l; i++) {
                var ip = input.getArgument(i);
                var ips = network.parseIP(ip);
                for(var j=0; j<ips.length; j++) {
                    addLine(ips[j]);
                }
            }
        } else if(cmd == 'scaniprange') {
            var n1 = network.ip2int(input.getArgument(1));
            var n2 = network.ip2int(input.getArgument(2));
            for(var i=0; i<=n2; i++) {
                addLine(network.int2ip(i));
            }
        }


        // compare valid output with user output
        var user_output = output.get();
        

        if(user_output.length != expected_output.length) {
            context.success = false;
            throw(strings.messages.lines_count_mistake);
        }

        context.success = true;
        for(var i=0; i<user_output.length; i++) {
            var mistake = expected_output[i] != user_output[i];
            if(mistake) {
                output.markMistakeLine(i);
            }
            context.success = context.success && !mistake;
        };

        if(context.success) {
            throw strings.messages.success;
        } else {
            throw strings.messages.line_mistake;
        }
    }




    context.reset = function (taskInfos) {
        output.clear();
        random.reset();        
        if (taskInfos != undefined) {
            network.setData(taskInfos.network);
            input.set(taskInfos.cmd);

            // Constants available in Python
            context.customConstants = {
                scanip: [
                    {
                        name: 'argv',
                        value: input.getArguments()
                    }
                ]
            };            
        }
        context.resetDisplay();
        output.print(config.input_prefix + input.get());        
    };


    // Reset the context's display
    context.resetDisplay = function () {
        if (!context.display || !this.raphaelFactory) {
            return;
        }
        $('#grid').html(`
            <div style='height: 50%; width: 96%; text-align: left; margin: 0 2%' id='log'></div>
            <hr>
            <div style='height: 50%; width: 96%; text-align: left; margin: 0 2%' id='print'></div>
        `);
        // Ask the parent to update sizes
        context.blocklyHelper.updateSize();
        context.updateScale();
    };




    context.updateScale = function () {};


    // When the context is unloaded, this function is called to clean up
    // anything the context may have created
    context.unload = function () {
        // Do something here
        if (context.display) {
            // Do something here
        }
    };



    



    context.scanip = {

        getArgument: function(n, callback) {
            var res = input.getArgument(n);
            context.runner.noDelay(callback, res);
        },

        getArgumentsLength: function(callback) {
            var res = input.getArgumentsLength();
            context.runner.noDelay(callback, res);
        },        

        sendPacket: function(ip, callback) {
            var res = network.sendPacket(ip);
            context.runner.noDelay(callback, res);
        },

        print: function(str, callback) {
            output.print(str);
            context.runner.noDelay(callback);
        }
    }
   


    context.customBlocks = {
        scanip: {
            scanip: [
                {
                    name: 'sendPacket',
                    params: ['String'],
                    yieldsValue: true
                },
                {
                    name: 'print',
                    params: ['String']
                },
                {
                    name: 'getArgumentsLength',
                    params: [],
                    yieldsValue: true
                },
                {
                    name: 'getArgument',
                    params: ['Number'],
                    yieldsValue: true
                }
            ]
        }
    };


    // Color indexes of block categories (as a hue in the range 0–420)
    context.provideBlocklyColours = function () {
        return {
            categories: {
                network: 0,
                sys: 40
            }
        };
    };


    return context;
}



// Register the library; change "template" by the name of your library in lowercase
if (window.quickAlgoLibraries) {
    quickAlgoLibraries.register('scanip', getContext);
} else {
    if (!window.quickAlgoLibrariesList) {
        window.quickAlgoLibrariesList = [];
    }
    window.quickAlgoLibrariesList.push(['scanip', getContext]);
}