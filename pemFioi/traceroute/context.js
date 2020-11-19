var getContext = function (display, infos, curLevel) {

    var config = {
        vertex_radius: 50,
        vertex_distance: 200,
        circle_radius: 10,
        circle_color: 'lightblue',
        mistake_background_color: 'lightpink'
    }

    var localLanguageStrings = {
        en: {
            label: {
                // Labels for the blocks
                parseArgument: "get domain argument",
                getAddrInfo: "get domain IP",
                sendPacket: "send packet to IP",
                print: "print string"
            },
            code: {
                // Names of the functions in Python, or Blockly translated in JavaScript
                parseArgument: "parseArgument",
                getAddrInfo: "getAddrInfo",
                sendPacket: "sendPacket",
                print: "print"
            },
            description: {
                // Descriptions of the functions in Python (optional)
                parseArgument: "parseArgument() get domain argument",
                getAddrInfo: "getAddrInfo() Get domain IP",
                sendPacket: "sendPacket() Send packet to IP",
                print: "print() Print string"
            },
            constant: {},
            startingBlockName: "Program", // Name for the starting block
            messages: {
                success: 'Success!',
                domain_not_found: ': unknown domain',
                ip_unreachable: ': IP unreachable',
                ttl_incorrect: 'Incorrect TTL parameter value',
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
    infos.checkEndEveryTurn = false;
    infos.checkEndCondition = function (context, lastTurn) {
        // TODO
    };


    var paper;
    var network = {
        data: [],


        setData: function(data) {
            this.data = JSON.parse(JSON.stringify(data));
            for(var i=0; i<this.data.length; i++) {
                this.data[i].rtt = this.getRTT(this.data[i]);
            }
        },


        formatRTT: function(rtt) {
            return parseFloat(rtt.toFixed(3));
        },

        getRTT: function(item) {
            var rtt = 'rtt' in item ? item.rtt : 10;
            if(typeof rtt === 'object') {
                var min = rtt.min || 1;
                var max = rtt.max || 10;
                var res = min + Math.random() * (max - min);
            } else {
                var res = rtt * Math.random();
            }
            return this.formatRTT(res);
        },        

        getAddrInfo: function(domain) {
            for(var i=0; i<this.data.length; i++) {
                if(this.data[i].domain == domain) {
                    return this.data[i].ip;
                }
            }
            return false;
        },

        pingIP: function(ip) {
            for(var i=0; i<this.data.length; i++) {
                if(this.data[i].ip == ip) {
                    return true;
                }
            }
            return false;
        },

        sendPacket: function(ip, ttl) {
            var ttl = ttl || 1;
            var rtt = 0;
            var item;
            for(var i=1; i<=this.data.length; i++) {
                item = this.data[i];
                rtt += item.rtt;
                ttl -= 1;
                if(ttl == 0) {
                    break;
                }
            }
            return {
                ip: item.ip,
                domain: item.domain,
                rtt: this.formatRTT(rtt)
            }
        },

        getGraphData: function() {
            var res = {
                vertexVisualInfo: {},
                edgeVisualInfo: {},
                minGraph: {
                    vertexInfo: {},
                    edgeInfo: {},
                    edgeVertices: {},
                    directed: false
                }
            }
            for(var i=0; i<this.data.length; i++) {
                var item = this.data[i];
                // vertex
                var vkey = 'v_' + i;
                res.vertexVisualInfo[vkey] = {
                    x: config.vertex_radius + i * config.vertex_distance,
                    y: config.vertex_radius + 1
                }
                res.minGraph.vertexInfo[vkey] = {
                    label: item.domain
                }

                // edge
                if(i < this.data.length - 1) {
                    var ekey = 'e_' + i;
                    res.edgeVisualInfo[ekey] = {}
                    res.minGraph.edgeInfo[ekey] = {}
                    res.minGraph.edgeVertices[ekey] = [
                        vkey,
                        'v_' + (i + 1)
                    ]
                }
            }
            return res;
        },

        parseArgument: function() {
            var tmp = context.cmd.split(' ');
            return tmp[1].trim();
        },

        maxTTL: function() {
            return this.data.length - 1;
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
        var domain = network.parseArgument();
        var ip = network.getAddrInfo(domain);
        var max_ttl = network.maxTTL();
        var expected_output = [];
        for(var ttl=1; ttl<=max_ttl; ttl++) {
            var res = network.sendPacket(ip, ttl);
            expected_output.push(ttl + ' ' + res.domain + ' ' + res.ip + ' ' + res.rtt + 'ms');
            if(res.ip == ip) {
                break;
            }
        }

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
        //user_output.clear(context.display);
        if (taskInfos != undefined) {
            network.setData(taskInfos.network);
            context.cmd = taskInfos.cmd;
        }
        context.resetDisplay();
    };


    // Reset the context's display
    context.resetDisplay = function () {
        if (!context.display || !this.raphaelFactory) {
            return;
        }
        $('#grid').html(`
            <div style='height: 50%; width: 96%; margin: 0 2%' id='graph'></div>
            <div style='height: 50%; width: 96%; text-align: left; margin: 0 2%' id='print'></div>
        `);


        // init graph
        var graph_data = network.getGraphData();
        context.Graph = Graph.fromJSON(JSON.stringify(graph_data.minGraph));

        var graphW = $('#graph').width();
        var graphH = $('#graph').height();
  
        this.raphaelFactory.destroyAll();
        paper = this.raphaelFactory.create(
            "paperMain",
            "graph",
            graphW,
            graphH
        );
  

        var vertexAttr = {
            r: config.vertex_radius,
            stroke: "none",
            fill: "lightgray"
        };
        var edgeAttr = {
            stroke: 'yellowgreen',
            "stroke-width": 5
        };
        var graphDrawer = new SimpleGraphDrawer(vertexAttr, edgeAttr);
        context.vGraph = new VisualGraph(
            "vGraph", 
            paper, 
            context.Graph, 
            graphDrawer, 
            true, 
            graph_data.vertexVisualInfo, 
            graph_data.edgeVisualInfo
        );
  
        //this.graphMouse = new GraphMouse("GraphMouse", context.Graph, context.vGraph);
  
        // graph scale
        var vertices = context.Graph.getAllVertices();
        context.graphOriginalW = 0;
        context.graphOriginalH = 0;
        $.each(vertices, function (index) {
            var id = vertices[index];
            var vertexObject = context.vGraph.getRaphaelsFromID(id)[0];
            var r = vertexObject.attrs['r'];
            var x = vertexObject.attrs['cx'] + r;
            var y = vertexObject.attrs['cy'] + r;

            if (x > context.graphOriginalW)
                context.graphOriginalW = x;

            if (y > context.graphOriginalH)
                context.graphOriginalH = y;
        });
        var scaleFactorW = graphW / context.graphOriginalW;
        var scaleFactorH = graphH / context.graphOriginalH;
        paper.setViewBox(0, 0, graphW / scaleFactorW, graphH / scaleFactorH);
        context.vGraph.redraw();


        // Ask the parent to update sizes
        context.blocklyHelper.updateSize();
        context.updateScale();
    };



    // Update the context's display to the new scale (after a window resize for instance)
    context.oldwidth = null;
    context.oldheight = null;

    context.updateScale = function () {
        if(!context.display || !paper) {
            return;
        }

        var width = $('#graph').width();
        var height = $('#graph').height();

        if(!context.oldwidth ||
            !context.oldheight ||
            context.oldwidth !== width ||
            context.oldheight !== height) {

            context.oldwidth = width;
            context.oldheight = height;
            var scaleFactorW = width / context.graphOriginalW;
            var scaleFactorH = height / context.graphOriginalH;
            paper.setViewBox(0, 0, width / scaleFactorW, height / scaleFactorH);
            paper.setSize(width, height);
        }
    };


    // When the context is unloaded, this function is called to clean up
    // anything the context may have created
    context.unload = function () {
        // Do something here
        if (context.display) {
            // Do something here
        }
    };



    function animateHop(from, to, callback) {
        var fromVertice = 'v_' + from;
        var toVertice = 'v_' + to;

        var fromPos = context.vGraph.graphDrawer.getVertexPosition(fromVertice);
        var edges = context.Graph.getEdgesBetween(fromVertice, toVertice);

        if(!edges.length) {
            return callback();
        }
        var verticesOrder = context.Graph.getEdgeVertices(edges[0]);
        var edgePath = context.vGraph.getRaphaelsFromID(edges[0])[0];

        var circle = paper.circle(fromPos.x, fromPos.y, config.circle_radius);
        circle.attr("fill", config.circle_color);

        var path = edgePath.attrs["path"];
        var s = path.toString();

        var pathLen = edgePath.getTotalLength();
        var startAt = 1 - ((pathLen - config.vertex_radius) / (pathLen));


        var fromPercentage = 1;
        var toPercentage = startAt;
        if (verticesOrder[0] == fromVertice) {
        fromPercentage = startAt;
        toPercentage = 1;
        }
        var anim_params = {
            path: s,
            rotate: false,
            duration: context.infos.actionDelay,
            easing: 'linear',
            debug: false,
            fromPercentage: fromPercentage,
            toPercentage: toPercentage,
        }
        circle.animateAlong(anim_params, {}, function() {
            circle.remove();
            callback();
        });
    }


    function animateCircle(ttl, callback) {
        var pos = 0;
        var direction = 1;
        function requestHopAnimation() {
            if(pos == ttl) {
                direction = -1;
            }
            if(pos == 0 && direction == -1) {
                return callback();
            }
            pos += direction;
            animateHop(pos - direction, pos, requestHopAnimation);
        }
        requestHopAnimation();
    }



    context.traceroute = {
        parseArgument: function(callback) {
            context.runner.noDelay(callback, network.parseArgument());
        },

        getAddrInfo: function(domain, callback) {
            var ip = network.getAddrInfo(domain);
            if(ip === false) {
                throw(strings.messages.domain_not_found + domain);
            }
            context.runner.noDelay(callback, ip);
        },


        sendPacket: function(ip, ttl, callback) {
            var ttl = parseInt(ttl, 10);
            if(!ttl) {
                throw(strings.messages.ttl_incorrect);
            }
            if(!network.pingIP(ip)) {
                throw(ip + strings.messages.ip_unreachable);
            }
            var res = network.sendPacket(ip, ttl);            
            if(context.display) {
                var ready = context.runner.allowSwitch(callback);
                function animate(cb) {
                    animateCircle(ttl, function() {
                        context.runner.waitDelay(cb, res);
                    })
                }
                ready(animate);
            } else {
                context.runner.noDelay(callback, res);
            }
        },


        print: function(str, callback) {
            output.print(str);
            context.runner.noDelay(callback);
        }
    }
   


    context.customBlocks = {
        traceroute: {
            actuator: [
                {
                    name: 'parseArgument',
                    yieldsValue: true
                },
                {
                    name: 'getAddrInfo',
                    params: ['String'],
                    yieldsValue: true
                },
                {
                    name: 'sendPacket',
                    params: ['String', 'Number'],
                    yieldsValue: true
                },
                {
                    name: 'print',
                    params: ['String']
                }
            ],
            sensors: []
        }
    };


    // Color indexes of block categories (as a hue in the range 0–420)
    context.provideBlocklyColours = function () {
        return {
            categories: {
                actuator: 0,
                sensors: 100
            }
        };
    };

    // Constants available in Python
    context.customConstants = {
        traceroute: []
    };

    return context;
}


Raphael.el.animateAlong = function (params, props, callback) {
    var element = this,
        paper = element.paper,
        path = params.path,
        rotate = params.rotate,
        duration = params.duration,
        easing = params.easing,
        debug = params.debug,
        fromPercentage = params.fromPercentage,
        toPercentage = params.toPercentage,
        isElem = typeof path !== 'string';

    element.path =
        isElem ?
            path :
            paper.path(path);
    element.pathLen = element.path.getTotalLength();
    element.rotateWith = rotate;

    element.path.attr({
        stroke: debug ? 'red' : isElem ? path.attr('stroke') : 'rgba(0,0,0,0)',
        'stroke-width': debug ? 2 : isElem ? path.attr('stroke-width') : 0
    });

    paper.customAttributes.along = function (v) {
        var point = this.path.getPointAtLength(v * this.pathLen),
            attrs = {
                cx: point.x,
                cy: point.y
            };
        this.rotateWith && (attrs.transform = 'r' + point.alpha);
        // TODO: rotate along a path while also not messing
        //       up existing transformations

        return attrs;
    };

    if (props instanceof Function) {
        callback = props;
        props = null;
    }
    if (!props) {
        props = {
            along: toPercentage
        };
    } else {
        props.along = toPercentage;
    }

    var startAlong = element.attr('along') || fromPercentage;

    element.attr({
        along: startAlong
    }).animate(props, duration, easing, function () {
        !isElem && element.path.remove();

        callback && callback.call(element);
    });
};

// Register the library; change "template" by the name of your library in lowercase
if (window.quickAlgoLibraries) {
    quickAlgoLibraries.register('traceroute', getContext);
} else {
    if (!window.quickAlgoLibrariesList) {
        window.quickAlgoLibrariesList = [];
    }
    window.quickAlgoLibrariesList.push(['traceroute', getContext]);
}