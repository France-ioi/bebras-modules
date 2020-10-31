function DatabaseHelper(options) {

    var defaults = {
        date_format: 'YYYY-MM-DD',
        types: ['number', 'image', 'string', 'date'],

        parent: document.body,

        // common
        disable_csv_import: false,
        csv_delimiter: ';',
        calculate_hash: false,
        strict_types: false,

        // html renderer
        render_row_height: '20px',
        render_max_rows: 14,

        // map renderer
//        width: 400,
//        height: 400,
        background_color: {r: 255, g: 255, b: 255},
        text_color: {r: 48, g: 81, b: 171},
        mistake_color: {r: 170, g: 49, b: 51},
        font_size: 10,
        pin_file: null,
        pin_file_mistake: null,
        pin_scale: 0.385,
        map_file: null,
        map_lng_left: 0,
        map_lng_right: 0,
        map_lat_top: 0,
        map_lat_bottom: 0,

        //graph renderer
        margin_x:40,
        margin_y:40,
        graph_width:360,
        graph_height:360,

        // histogram renderer
        histogram_height: '300px'
    }

    var options = Object.assign(defaults, options || {})

    if(!window.db_renderers) {
        window.db_renderers = {
            html: new TableRendererHtml(options),
            map: new TableRendererMap(options),
            graph: new TableRendererGraph(options),
            graphDouble: new TableRendererGraphDouble(options),
            console: new ConsoleRenderer(options),
            histogram: new HistogramRenderer(options),
        }
    }

    var last_renderer = null;
    var last_table = null;
    var last_type = 'line';

    this.hide = function(display) {
        if(!display) return;
        db_renderers.html.hide();
        db_renderers.map.hide();
        db_renderers.graph.hide();
        db_renderers.graphDouble.hide();
        db_renderers.console.hide();
        db_renderers.histogram.hide();
    };

    this.listToTable = function(list) {
        params = {columnNames: ['index','value'],columnTypes: ['int','int'],records: [],public:true};
        list.forEach(function(val, i){params.records[i] = [i, val];});
        return(Table(params));
    }

    this.displayTable = function(table, display) {
        last_table = table;
        this.hide(display);
        if(options.calculate_hash) {
            console.log('Hash: ' + this.calculateTableHash(table));
        }
        db_renderers.html.displayTable(table, null, display);
        last_renderer = 'html';
    };

    this.displayTableOnMap = function(table, display) {
        last_table = table;
        this.hide(display);
        if(options.calculate_hash) {
            console.log('Hash: ' + this.calculateTableHash(table));
        }
        db_renderers.map.displayTable(table, null, display);
        last_renderer = 'map';
    };

    this.displayTableOnGraph = function(table,minY,maxY,type, display) {
        var params = table.params();
        params.minY = minY;
        params.maxY = maxY;
        console.log(params);

        last_table = table;
        last_type = type;
        this.hide(display);
        if(options.calculate_hash) {
            console.log('Hash: ' + this.calculateTableHash(table));
        }
        db_renderers.graph.displayTable(table,type, null, display);
        last_renderer = 'graph';
    };

    this.displayTablesOnGraph = function(table,minX,maxX,minY,maxY, display) {
        var params = table.params();
        params.minX = minX;
        params.maxX = maxX;
        params.minY = minY;
        params.maxY = maxY;
        last_table = table;
        this.hide(display);
        db_renderers.graphDouble.displayTable(table);
        last_renderer = 'graphDouble';
    };

    this.displayConsole = function(variable, display) {
        this.hide(display);
        db_renderers.console.print(variable, display);
    };


    this.initHistogram = function(records_amount, max_value, display) {
        this.hide(display);
        db_renderers.histogram.init(records_amount, max_value, display);
    }

    this.setHistogramBar = function(record_idx, label, value, display) {
        this.hide(display);
        db_renderers.histogram.setBar(record_idx, label, value, display);
    }    

    this.validateResultByTable = function(reference_table) {
        //this.hide();
        //FIXME la last table stockée est celle qui ne contient que namecolumn dans graph, ou nam lat et lng dans Map, ca n'a pas de sens de refuser une table trop complete ??
        //if(!last_table || last_table.params().columnNames.length != reference_table.params().columnNames.length) {
        //    return 'incorrect_results';
        //}
        this.hide(true);
        if (last_renderer === 'graph') {
            var valid_all = db_renderers[last_renderer].displayTable(last_table, last_type, reference_table, true);
        } else if(last_renderer) {
            var valid_all = db_renderers[last_renderer].displayTable(last_table, reference_table, true);
        } else {
            var valid_all = false;
        }
        if(!valid_all) {
            return 'incorrect_results';
        }
        if(last_table && reference_table && last_table.params().records.length < reference_table.params().records.length) {
            return 'some_results_missing';
        }
        return true;
    };

    this.validateResultByHash = function(hash) {
        if(hash !== this.calculateTableHash(last_table)) {
            return 'incorrect_results';
        }
        return true;
    }


    function hashString(str) {
        var hash = 0, i = 0, len = str.length;
        while(i < len) {
            hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
        }
        return hash;
    }


    this.calculateTableHash = function(table) {
        if(!table) { return null; }
        return hashString(table.toString());
    }


    this.destroy = function() {
        db_renderers.html.destroy();
        db_renderers.map.destroy();
        db_renderers.graph.destroy();
        db_renderers.console.destroy();
        window.db_renderers = null;
    }


    function validateColumnTypes(types) {
        var invalid_types = [];
        for(var i=0; i<types.length; i++) {
            if(options.types.indexOf(types[i]) === -1) {
                invalid_types.push(types[i]);
            }
        }
        if(invalid_types.length == 0) {
            return true;
        }

        throw new Error('Invalid column types: ' + invalid_types.join(', '));
    }


    function parseCsvValue(v, type) {
        v = v.replace(/['"]+/g, '');
        if(type == 'number') {
            v = parseFloat(v);
        }
        return v;
    }


    function parseCsvLine(line, types) {
        var res = line.split(options.csv_delimiter);
        for(var i=0; i<res.length; i++) {
            res[i] = parseCsvValue(res[i], types[i]);
        }
        return res;
    }


    function detectColumnTypes(row) {
        var columns = row.split(options.csv_delimiter);
        var types = [];
        for(var i=0; i<columns.length; i++) {
            var v = columns[i].replace(/['"]+/g, '');
            types.push(!isNaN(parseFloat(v)) && isFinite(v) ? 'number' : 'string');
        }
        return types;
    }


    this.loadCsv = function(file, types, callback) {
        if(!validateColumnTypes(types)) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var lines = reader.result.split(/\r\n|\n/);
            if(lines.length > 1 && !types.length) {
                types = detectColumnTypes(lines[1]);
            }

            var res = {
                columnTypes: types,
                records: []
            };
            var columns_cnt = 0;
            for(var i=0, line; line=lines[i]; i++) {
                if(i === 0) {
                    var row = parseCsvLine(line, []);
                    res.columnNames = row;
                } else {

                    var row = parseCsvLine(line, res.columnTypes);
                    res.records.push(row);
                }
                columns_cnt = Math.max(columns_cnt, row.length);
            }

            // add missed types
            while(res.columnTypes.length < columns_cnt) {
                res.columnTypes.push('string');
            }
            callback(Table(res));
        };
        reader.readAsText(file);
    };
}


function TableRendererHtml(options) {
    var container = $('<div class="renderer_html">');
    container.hide();
    options.parent.append(container);
    this.clear = function() {
        container.html("");
    }
    this.hide = function() {
        container.hide();
    }

    this.formatValue = function(value, type) {
        if(value === null) {
            return 'NULL';
        }
        switch(type) {
            case 'image':
                return '<img style="height: ' + options.render_row_height + '" src="' + value + '"/>'
            case 'number':
            case 'string':
            case 'date':
            default :
                return value;
        }
        return '';
    }



    function isEqual(a, type_a, b, type_b) {
        return options.strict_types ? (a == b && type_a == type_b) : (a == b);
    }


    this.displayTable = function(table, reference_table, display) {
        var html = '';

        var rows = table.params().records;
        if(options.render_max_rows > 0 && rows.length > options.render_max_rows) {
            rows = rows.slice(0, options.render_max_rows);
            var str = options.strings.renderer_html_rows_limit.split('%1');
            html += str[0] + options.render_max_rows + str[1];
        }

        html +=
            '<table><tr><th>' +
            table.params().columnNames.join('</th><th>') +
            '</th></tr>';

        var reference_rows = reference_table ? reference_table.params().records : null;
        var reference_types = reference_table ? reference_table.params().columnTypes : [];
        var valid_value = true;
        var valid_all = true;
        var types = table.params().columnTypes;
        for(var i=0, row; row = rows[i]; i++) {
            html += '<tr>';
            for(var j=0; j<row.length; j++) {
                var value = row[j];
                if(reference_rows) {
                    valid_value = reference_rows[i] && isEqual(value, types[j], reference_rows[i][j], reference_types[j]);
                }
                valid_all = valid_all && valid_value;
                html +=
                    '<td style="height: ' + options.render_row_height +
                    '" class="' + (valid_value ? 'valid' : 'invalid') + '">' +
                    this.formatValue(value, types[j]) +
                    '</td>';

            }
            html += '</tr>';
        }

        html += '</table>';
        if(display) {
            container.html(html);
            container.show();
        }
        return valid_all;
    }

    this.destroy = function() {
        container.remove();
    }
}




function TableRendererMap(options) {

    var container = $('<div class="renderer_map"></div>');
    container.hide();
    options.parent.append(container);

    this.clear = function() {
        renderer.clear();
    }
    this.hide = function() {
        container.hide();
    }

    function Renderer2D() {

        var size = {
            width: options.width || 400,
            height: options.height || 400
        }

        function ImageLoader(src, onLoad) {
            var loaded = false;
            var img;
            this.get = function() {
                return loaded ? img : null;
            }            
            if(src) {
                var img = new Image();
                img.src = src;
                img.onload = function() {
                    loaded = true;
                    onLoad && onLoad();
                }
                img.onerror = function() {
                    console.error('Error loading image: ' + src);
                }
            } else {
                onLoad && onLoad();   
            }
        }


        function CoordinatesConverter() {
            var map_lat_bottomRad = options.map_lat_bottom.toRad()
            var mapLngDelta = (options.map_lng_right - options.map_lng_left)
            var worldMapWidth = ((size.width / mapLngDelta) * 360) / (2 * Math.PI)
            var mapOffsetY = (worldMapWidth / 2 * Math.log((1 + Math.sin(map_lat_bottomRad)) / (1 - Math.sin(map_lat_bottomRad))))

            this.x = function(lng) {
                return (parseFloat(lng) - options.map_lng_left) * (size.width / mapLngDelta);
            }

            this.y = function(lat) {
                var latitudeRad = parseFloat(lat).toRad()
                return size.height - ((worldMapWidth / 2 * Math.log((1 + Math.sin(latitudeRad)) / (1 - Math.sin(latitudeRad)))) - mapOffsetY)
            }
        }


        function rgba(colors, opacity) {
            return 'rgba(' + colors.r + ',' + colors.g + ',' + colors.b + ',' + opacity + ')';
        }


        this.clear = function() {
            if(images) {
                var img = images.map.get();
                img && context2d.drawImage(img, 0, 0, size.width, size.height)
            } else if(context2d) {
                context2d.fillStyle = rgba(options.background_color, 1);
                context2d.fillRect(0, 0, size.width, size.height)
            }
        }


        this.pin = function(lng, lat, label, valid) {
            var x = coordinates.x(lng);
            var y = coordinates.y(lat);

            var img = valid ? images.pin.get() : images.pin_mistake.get();
            var w = options.pin_scale * img.width;
            var h = options.pin_scale * img.height;
            if(img) {
                context2d.drawImage(img, x - w * 0.5, y - h, w, h);
            }

            var tw = context2d.measureText(label).width + 2;
            context2d.fillStyle = rgba(options.background_color, 1);
            context2d.fillRect(
                x - 0.5 * tw,
                y,
                tw,
                options.font_size + 2
            );
            context2d.fillStyle = rgba(valid ? options.text_color : options.mistake_color, 1);
            context2d.fillText(label, x, y + 10)
        }

        this.destroy = function() {
            $(canvas).remove();
        }        

        this.resize = function() {}        

        // init
        var images = {
            map: new ImageLoader(options.map_file, this.clear.bind(this)),
            pin: new ImageLoader(options.pin_file),
            pin_mistake: new ImageLoader(options.pin_file_mistake)
        }
        var coordinates = new CoordinatesConverter();

        var canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;

        container.append($(canvas));
        var context2d = canvas.getContext('2d');

        context2d.textAlign = 'center';
        context2d.font = options.font_size + 'px sans-serif';
    }



    function Renderer3D() {
        var earth_options = Object.assign({}, options, {
            parent: container[0]
        });
        var earth = new Earth3D(earth_options);


        this.clear = function() {
            earth.clearPaths();	
            earth.clearLabels();	
        }

        this.line = function(lng1, lat1, lng2, lat2, opacity) {
            var p1 = {
                lat: lat1,
                lng: lng1
            }
            var p2 = {
                lat: lat2,
                lng: lng2
            }            
            earth.addPath(p1, p2);
        }

        this.pin = function(lng, lat, label) {
            var p = {
                lat: lat,
                lng: lng,
                text: label
            }
            earth.addLabel(p);
        }

        this.destroy = function() {
            earth.destroy();
        }

        this.resize = function() {
            earth.resize();
        }
    }


    function validateLng(lng) {
        if(isNaN(lng)) {
            throw new Error('Longitude is not a number')
        }
        if(lng < options.map_lng_left || lng > options.map_lng_right) {
            throw new Error('Longitude is outside of the map')
        }
    }

    function validateLat(lat) {
        if(isNaN(lat)) {
            throw new Error('Latitude is not a number')
        }
        if(lat > options.map_lat_top || lat < options.map_lat_bottom) {
            throw new Error('Latitude is outside of the map')
        }
    }

    // interface
    this.displayTable = function(table, reference_table, display) {
        if(reference_table) {
            // reorder reference_table columns
            reference_table = reference_table.selectColumns(['name', 'lng', 'lat']);
        }
        if(display) {
            renderer.clear();
        }
        var rows = table.params().records;

        var valid_value = true;
        var valid_all = true;

        var reference_rows = reference_table ? reference_table.params().records : null;
        for(var i=0, row; row=rows[i]; i++) {
            if(reference_rows) {
                valid_value = reference_rows[i] && reference_rows[i].join('-') == row.join('-');
            }
            valid_all = valid_all && valid_value;
            validateLng(row[1]);
            validateLat(row[2]);
            if(display) {
                renderer.pin(row[1], row[2], row[0], valid_value);
            }
        }
        if(display) {
            container.show();
            renderer.resize();
        }
        return valid_all;
    }

    this.destroy = function() {
        container.remove();
        renderer.destroy();
    }

    // init
    if(options.map3d) {
        var renderer = new Renderer3D();
    } else {
        var renderer = new Renderer2D();
    }
}

function TableRendererGraph(options) {

    var container = $('<div class="renderer_graph">');
    container.hide();
    options.parent.append(container);
    this.clear = function() {
        renderer.clear("");
    }
    this.hide = function() {
        container.hide();
    }

    function Renderer() {

        function rgba(colors, opacity) {
            return 'rgba(' + colors.r + ',' + colors.g + ',' + colors.b + ',' + opacity + ')';
        }
        this.clear = function() {
            context2d.fillStyle = rgba(options.background_color, 1);
            context2d.fillRect(0, 0, options.width, options.height)
        };
        this.init = function(yName,yMin,yMax) {
            context2d.beginPath();
            context2d.moveTo(options.margin_x,0);
            context2d.lineTo(options.margin_x,options.graph_height);
            context2d.lineTo(options.margin_x+options.graph_width,options.graph_height);

            context2d.save();
            context2d.translate(0, 0);
            context2d.rotate(-Math.PI/2);
            context2d.strokeText(yName, -options.graph_height/2, options.margin_x-15);
            context2d.restore();
            context2d.strokeText("index", options.margin_x+options.graph_width/2, options.graph_height+15);

            context2d.strokeText(yMax, 15, options.graph_height*0.06 + options.font_size/2);
            context2d.moveTo(options.margin_x-5,options.graph_height*0.06);
            context2d.lineTo(options.margin_x+5,options.graph_height*0.06);
            context2d.strokeText(yMin, 15, options.graph_height*0.94 + options.font_size/2);
            context2d.moveTo(options.margin_x-5,options.graph_height*0.94);
            context2d.lineTo(options.margin_x+5,options.graph_height*0.94);

            context2d.stroke();
            context2d.beginPath();
            context2d.moveTo(options.margin_x,options.graph_height);
        };
        this.line_to = function(x,xMax,y,yMin,yMax) {
            context2d.lineTo(options.margin_x+(options.graph_width * x / xMax),options.graph_height-((y-yMin)*(options.graph_height)/(yMax-yMin)));
        };
        this.plot = function(x,xMax,y,yMin,yMax,valid) {
            context2d.strokeStyle = valid?"#000000":"#900000";
            context2d.moveTo(options.margin_x+(options.graph_width * x / xMax - 3),options.graph_height-((y-yMin)*(options.graph_height)/(yMax-yMin)));
            context2d.lineTo(options.margin_x+(options.graph_width * x / xMax + 3),options.graph_height-((y-yMin)*(options.graph_height)/(yMax-yMin)));
            context2d.moveTo(options.margin_x+(options.graph_width * x / xMax),options.graph_height-((y-yMin)*(options.graph_height)/(yMax-yMin)) - 3);
            context2d.lineTo(options.margin_x+(options.graph_width * x / xMax),options.graph_height-((y-yMin)*(options.graph_height)/(yMax-yMin)) + 3);
            context2d.stroke();
            context2d.beginPath();
            context2d.strokeStyle = "#000000";
        };
        this.bar = function(x,xMax,y,yMin,yMax,valid) {
            context2d.fillStyle = valid?"#D0D0D0":"#d0b0b0";
            context2d.strokeRect(options.margin_x+(options.graph_width * (x+0.1) / xMax),options.graph_height-((y-yMin)*(options.graph_height)/(yMax-yMin)),options.graph_width * 0.8 / xMax,((y-yMin)*(options.graph_height)/(yMax-yMin)));
            context2d.fillRect(options.margin_x+(options.graph_width * (x+0.1) / xMax),options.graph_height-((y-yMin)*(options.graph_height)/(yMax-yMin)),options.graph_width * 0.8 / xMax,((y-yMin)*(options.graph_height)/(yMax-yMin)));
            context2d.stroke();
            context2d.beginPath();
        };
        this.show = function() {context2d.stroke();};

        var canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;

        container.append($(canvas));
        var context2d = canvas.getContext('2d');

        context2d.textAlign = 'center';
        context2d.font = options.font_size + 'px sans-serif';
    }

    // interface
    this.displayTable = function(table, type, reference_table, display) {
        if(display) {
            renderer.clear();
        }
        var rows = table.params().records;

        var valid_value = true;
        var valid_all = true;

        var reference_rows = reference_table ? reference_table.params().records : null;

        params=table.params();
        var yMin = rows[0][0];
        var yMax = rows[0][0];
        for(var i=0, row; row=rows[i]; i++) {
            if (yMax < row[0]) {yMax = row[0];}
            if (yMin > row[0]) {yMin = row[0];}
        }
        if (yMax === yMin){yMax++;yMin--;}
        if (params.minY && params.maxY) {yMin = params.minY;yMax = params.maxY;}
        var marginY = Math.ceil((yMax-yMin)*0.05);

        columnNames = table.params().columnNames;
        renderer.init(columnNames[0],yMin,yMax);
        yMin = Number(yMin) - marginY;
        yMax = Number(yMax) + marginY;
        switch (type) {
            case 'bar':
                for(i=0; row=rows[i]; i++) {
                    if(reference_rows) {
                        valid_value = reference_rows[i] && reference_rows[i].join('-') == row.join('-');
                    }
                    valid_all = valid_all && valid_value;
                    if(display) {
                        renderer.bar(i,rows.length,row[0],yMin,yMax,valid_value);
                    }
                }
                break;
            case 'plot':
                for(i=0; row=rows[i]; i++) {
                    if(reference_rows) {
                        valid_value = reference_rows[i] && reference_rows[i].join('-') == row.join('-');
                    }
                    valid_all = valid_all && valid_value;
                    if(display) {
                        renderer.plot(i+0.5,rows.length,row[0],yMin,yMax,valid_value);
                    }
                }
                break;
            default: //case 'line'
                for(i=0; row=rows[i]; i++) {
                    if(reference_rows) {
                        valid_value = reference_rows[i] && reference_rows[i].join('-') == row.join('-');
                    }
                    valid_all = valid_all && valid_value;
                    if(display) {
                        renderer.line_to(i,rows.length-1,row[0],yMin,yMax);
                    }
                }
        }
        if(display) {
            renderer.show();
            container.show();
        }

        return valid_all;
    }

    this.destroy = function() {
        container.remove();
    }

    // init
    var renderer = new Renderer();
}

function TableRendererGraphDouble(options) {

    var container = $('<div class="renderer_graphdouble">');
    container.hide();
    options.parent.append(container);
    this.clear = function() {
        renderer.clear("");
    }
    this.hide = function() {
        container.hide();
    }

    function Renderer() {

        function rgba(colors, opacity) {
            return 'rgba(' + colors.r + ',' + colors.g + ',' + colors.b + ',' + opacity + ')';
        }
        this.clear = function() {
            context2d.fillStyle = rgba(options.background_color,1);
            context2d.fillRect(0, 0, options.width, options.height);
            context2d.stroke();
            context2d.beginPath();
        };
        this.init = function(xName,xMin,xMax,yName,yMin,yMax) {
            context2d.beginPath();
            context2d.moveTo(options.margin_x,0);
            context2d.lineTo(options.margin_x,options.graph_height);
            context2d.lineTo(options.margin_x+options.graph_width,options.graph_height);

            context2d.save();
            context2d.translate(0, 0);
            context2d.rotate(-Math.PI/2);
            context2d.strokeText(yName, -options.graph_height/2, options.margin_x-15);
            context2d.restore();
            context2d.strokeText(xName, options.margin_x+options.graph_width/2, options.graph_height+15);

            context2d.strokeText(yMax, 15, options.graph_height*0.09 + options.font_size/2);
            context2d.moveTo(options.margin_x-5,options.graph_height*0.09);
            context2d.lineTo(options.margin_x+5,options.graph_height*0.09);
            context2d.strokeText(yMin, 15, options.graph_height*0.91 + options.font_size/2);
            context2d.moveTo(options.margin_x-5,options.graph_height*0.91);
            context2d.lineTo(options.margin_x+5,options.graph_height*0.91);

            context2d.strokeText(xMin, options.margin_x+options.graph_width*0.09, options.graph_height + 10 + options.font_size/2);
            context2d.moveTo(options.margin_x+options.graph_width*0.09,options.graph_height-5);
            context2d.lineTo(options.margin_x+options.graph_width*0.09,options.graph_height+5);
            context2d.strokeText(xMax, options.margin_x+options.graph_width*0.91, options.graph_height + 10 + options.font_size/2);
            context2d.moveTo(options.margin_x+options.graph_width*0.91,options.graph_height-5);
            context2d.lineTo(options.margin_x+options.graph_width*0.91,options.graph_height+5);

            context2d.stroke();
            context2d.beginPath();
            context2d.moveTo(options.margin_x,options.graph_height);
        };

        this.plot = function(x,xMin,xMax,y,yMin,yMax,valid) {
            context2d.strokeStyle = valid?"#000000":"#900000";
            context2d.moveTo(options.margin_x+((x-xMin)*(options.graph_width)/(xMax-xMin)) - 3,options.graph_height-((y-yMin)*(options.graph_height)/(yMax-yMin)));
            context2d.lineTo(options.margin_x+((x-xMin)*(options.graph_width)/(xMax-xMin)) + 3,options.graph_height-((y-yMin)*(options.graph_height)/(yMax-yMin)));
            context2d.moveTo(options.margin_x+((x-xMin)*(options.graph_width)/(xMax-xMin)),options.graph_height-((y-yMin)*(options.graph_height)/(yMax-yMin)) - 3);
            context2d.lineTo(options.margin_x+((x-xMin)*(options.graph_width)/(xMax-xMin)),options.graph_height-((y-yMin)*(options.graph_height)/(yMax-yMin)) + 3);
            context2d.stroke();
            context2d.beginPath();
            context2d.strokeStyle = "#000000";
        };
        this.show = function() {context2d.stroke();};

        var canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;

        container.append($(canvas));
        var context2d = canvas.getContext('2d');

        context2d.textAlign = 'center';
        context2d.font = options.font_size + 'px sans-serif';
    }

    // interface
    this.displayTable = function(table, reference_table) {
        renderer.clear();
        var rows = table.params().records;

        var valid_value = true;
        var valid_all = true;

        var reference_rows = reference_table ? reference_table.params().records : null;

        params=table.params();
        var xMin = rows[0][0];
        var xMax = rows[0][0];
        var yMin = rows[0][1];
        var yMax = rows[0][1];
        for(var i=0, row; row=rows[i]; i++) {
            if (xMax < row[0]) {xMax = row[0];}
            if (xMin > row[0]) {xMin = row[0];}
            if (yMax < row[1]) {yMax = row[1];}
            if (yMin > row[1]) {yMin = row[1];}
        }
        if (xMax === xMin){xMax++;xMin--;}
        if (yMax === yMin){yMax++;yMin--;}
        if (params.minX && params.maxX) {xMin = params.minX;xMax = params.maxX;}
        if (params.minY && params.maxY) {yMin = params.minY;yMax = params.maxY;}
        var marginX = (xMax-xMin)*0.11;
        var marginY = (yMax-yMin)*0.11;

        columnNames = table.params().columnNames;
        renderer.init(columnNames[0],xMin,xMax,columnNames[1],yMin,yMax);
        yMin = Number(yMin) - marginY;
        yMax = Number(yMax) + marginY;
        xMin = Number(xMin) - marginX;
        xMax = Number(xMax) + marginX;
        for(i=0; row=rows[i]; i++) {
            if(reference_rows) {
                valid_value = reference_rows[i] && reference_rows[i].join('-') == row.join('-');
            }
            valid_all = valid_all && valid_value;
            renderer.plot(row[0],xMin,xMax,row[1],yMin,yMax,valid_value);
        }
        renderer.show();
        container.show();

        return valid_all;
    }

    this.destroy = function() {
        container.remove();
    }

    // init
    var renderer = new Renderer();
}

function ConsoleRenderer(options) {

    var container = $('<div class="console">');
    container.hide();
    options.parent.append(container);
    this.clear = function() {
        container.html("");
    };
    this.hide = function() {
        container.hide();
    };

    this.print = function(variable, display) {
        if(!display) return;
        nd = new Date();
        var html = "<div class='console_time'>["+("0"+nd.getHours()).slice(-2)+":"+("0"+nd.getMinutes()).slice(-2)+"]</div><div class='console_row'>"+variable+"</div>";
        container.append(html);
        container.show();
    }

    this.destroy = function() {
        container.remove();
    }

}


function HistogramRenderer(options) {

    var max = 0;

    var container = $('<div class="histogram"/>');
    container.hide();
    options.parent.append(container);

    var chart;

    function initChart() {
        var canvas = $('<canvas/>');
        canvas.width('100%');
        canvas.height(options.histogram_height);
        container.append(canvas);    

        var chart_initial_data = {
            labels: [],
            datasets: [
                {
                    fillColor: "#79D1CF",
                    strokeColor: "#79D1CF",
                    data: []
                }
            ]
        };


        var animationEndHandler = function() {
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(
                Chart.defaults.global.defaultFontFamily, 
                'normal', 
                Chart.defaults.global.defaultFontFamily
            );
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';


            this.data.datasets.forEach(function (dataset) {
                var key = Object.keys(dataset._meta)[0];
                var meta_data = dataset._meta[key].data;                            
                for (var i = 0; i<dataset.data.length; i++) {
                    var model = meta_data[i]._model,
                        scale_max = meta_data[i]._yScale.maxHeight;
                        left = meta_data[i]._xScale.left;
                        offset = meta_data[i]._xScale.longestLabelWidth;
                    ctx.fillStyle = '#444';
                    var y_pos = model.y - 5;
                    var label = model.label;
                    // Make sure data value does not get overflown and hidden
                    // when the bar's value is too close to max value of scale
                    // Note: The y value is reverse, it counts from top down
                    if ((scale_max - model.y) / scale_max >= 0.93) {
                        y_pos = model.y + 20; 
                    }
                    // ctx.fillText(dataset.data[i], model.x, y_pos);
                    ctx.fillText(label, left + 10, model.y + 8);
                }
            });               
        }                        

        var chart_options = {
            responsive: true,
            events: false,
            showTooltips: false,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        display: false
                    }
                }],
                xAxes: [{
                    ticks: {
                        min: 0,
                        max: 1
                    }                        
                }]
            },                    
            animation: {
                duration: 500,
                easing: "easeOutQuart",
                onComplete: animationEndHandler
            }
        }

        chart = new Chart(
            canvas[0].getContext('2d'), 
            {
                type: 'horizontalBar',
                data: chart_initial_data,
                options: chart_options
            }
        );
    }

    if('Chart' in window) {
        initChart();
    }        

    function render() {
        container.show();
        chart.update();        
    }
    
    this.clear = function() {
        container.html("");
    };
    this.hide = function() {
        container.hide();
    };

    this.init = function(records_amount, max_value, display) {
        if(!chart) {
            return console.error('Chart.js lib not loaded.')
        }        
        max = max_value;
        chart.options.scales.xAxes[0].ticks.max = max;
        var values = [];
        var labels = [];
        for(var i=0; i<records_amount; i++) {
            values[i] = 0;
            labels[i] = '';
        }
        chart.data.datasets[0].data = values;
        chart.data.labels = labels;
        display && render();
    }

    this.setBar = function(record_idx, label, value, display) {
        if(!chart) {
            return console.error('Chart.js lib not loaded.')
        }
        value = Math.min(value, max);
        chart.data.datasets[0].data[record_idx] = value;
        chart.data.labels[record_idx] = label;
        display && render();
    }


    this.destroy = function() {
        chart && chart.destroy();
        container.remove();
    }

}
    


if(typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

function Table(params) {

    function nullRow(length) {
        return Array.apply(null, Array(length)).map(function() {
            return null;
        })
    }


    function rowToObject(row) {
        var res = {};
        for(var i=0, name; name=params.columnNames[i]; i++) {
            res[name] = row[i];
        }
        return res;
    }

    function objectToRow(obj) {
        var res = [];
        params.columnNames.map(function(column, idx) {
            res[idx] = column in obj ? obj[column] : null;
        })
        return res;
    }


    function cloneParams(clone_records) {
        return {
            columnNames: params.columnNames.slice(),
            columnTypes: params.columnTypes.slice(),
            records: clone_records ? params.records.slice() : []
        }
    }



    // TODO: check this
    function stableSort(arr, compare) {
        var index = {}, idx = 0;
        arr.map(function(row) {
            index[row.join('\r')] = idx++;
        });
        return arr.slice().sort(function(a, b){
            var result = compare(a, b);
            return result === 0 ? index[b.join('\r')] - index[a.join('\r')] : result;
        });
    }

    // Async quickSort, which can handle the compare function being a Promise
    function quickSortAsync(arr, compare, cb) {
        if(arr.length < 2) { cb(arr); return; }
        var pivot = arr[0];

        var leftArr = [], rightArr = [], curIdx = 1;
        function divideArr() {
            if(curIdx >= arr.length) {
                quickSortAsync(leftArr, compare, function(lar) {
                    quickSortAsync(rightArr, compare, function(rar) {
                        cb(lar.concat([pivot], rar));
                    });
                });
                return;
            }

            compare(pivot, arr[curIdx], function(c) {
                if(c > 0) {
                    leftArr.push(arr[curIdx]);
                } else {
                    rightArr.push(arr[curIdx]);
                }
                curIdx += 1;
                divideArr();
            });
        }
        divideArr();
    }


    function formatColumn(value, idx) {
        if(value === null) {
            return 'NULL';
        }
        switch(params.columnTypes[idx]) {
            case 'number':
            case 'string':
            case 'date':
                return value;
            case 'image':
                return '<img style="height: 20px" src="' + value + '"/>'
        }
        return '';
    }


    var joinRecords = {

        left: function(params1, idx1, params2, idx2, skip_matches) {
            var res = [];
            params1.records.map(function(row1) {
                var right = nullRow(params2.columnNames.length);
                for(var i=0, row2; row2 = params2.records[i]; i++) {
                    if(row1[idx1] === row2[idx2]) {
                        right = skip_matches ? false : row2;
                        break;
                    }
                }
                if(right !== false) {
                    res.push(row1.concat(right));
                }
            })
            return res;
        },

        right: function(params1, idx1, params2, idx2) {
            return params2.records.map(function(row2) {
                var left = nullRow(params1.columnNames.length);
                for(var i=0, row1; row1 = params1.records[i]; i++) {
                    if(row1[idx1] === row2[idx2]) {
                        left = row1;
                        break;
                    }
                }
                return left.concat(row2);
            })
        },

        inner: function(params1, idx1, params2, idx2) {
            var res = [];
            params1.records.map(function(row1) {
                params2.records.map(function(row2) {
                    if(row1[idx1] === row2[idx2]) {
                        res.push(row1.concat(row2));
                    }
                })
            })
            return res;
        },

        outer: function(params1, idx1, params2, idx2) {
            var left_join = this.left(params1, idx1, params2, idx2, true);
            var right_join = this.right(params1, idx1, params2, idx2);
            return left_join.concat(right_join);
        }
    }



    return {

        params: function() {
            return params;
        },

        columnIndex: function(name) {
            var idx = params.columnNames.indexOf(name);
            if(idx === -1) throw new Error('Column ' + name + ' not found');
            return idx;
        },


        dump: function() {
            var res = params.records.map(function(row) {
                return row.map(formatColumn);
            });
            res.unshift(params.columnNames.slice());
            return res;
        },


        // task interface

        getRecords: function() {
            var res = [];
            params.records.map(function(row) {
                res.push(rowToObject(row));
            });
            return res;
        },


        selectByColumn: function(columnName, value) {
            var idx = this.columnIndex(columnName);
            var res = cloneParams();
            res.records = params.records.filter(function(row) {
                return row[idx] == value;
            })
            return Table(res);
        },


        selectByFunction: function(filterFunction, callback) {
            var res = cloneParams();
            res.records = [];
            function filterHandler(a, cb) {
                var x = filterFunction(rowToObject(a));
                if(x instanceof Promise) {
                    x.then(cb);
                } else {
                    cb(x);
                }
            }

            var curIdx = 0;
            function filterRow() {
                if(curIdx >= params.records.length) {
                    callback(Table(res));
                    return;
                }
                var row = params.records[curIdx];
                filterHandler(row, function(val) {
                    if(val) {
                        res.records.push(row);
                    }
                    curIdx += 1;
                    filterRow();
                });
            }
            filterRow();
        },


        sortByColumn: function(columnName, direction) {
            var res = cloneParams();
            var idx = this.columnIndex(columnName);
            var cb = direction == 'asc' ? [1, -1] : [-1, 1];

            res.records = stableSort(params.records, function(a, b) {
                if(a[idx] === b[idx]) return 0;
                return a[idx] > b[idx] ? cb[0] : cb[1];
            });
            return Table(res);
        },


        sortByFunction: function(compareFunction, callback) {
            var res = cloneParams();

            function compareHandler(a, b, cb) {
                var x = compareFunction(rowToObject(a), rowToObject(b));
                if(x instanceof Promise) {
                    x.then(cb);
                } else {
                    cb(x);
                }
            }

            quickSortAsync(params.records, compareHandler, function(rec) {
                res.records = rec;
                callback(Table(res));
            });
        },


        selectColumns: function(columns) {
            var res = {
                columnNames: [],
                columnTypes: [],
                records: []
            }

            var idxs = [], idx, self = this;
            columns.map(function(col) {
                if(!(col instanceof Array)) {
                    col = [col, col]
                }
                idx = self.columnIndex(col[0]);
                idxs.push(idx);
                res.columnNames.push(col[1]);
                res.columnTypes.push(params.columnTypes[idx]);
            })
            params.records.map(function(row) {
                var new_row = [];
                idxs.map(function(idx) {
                    new_row.push(row[idx]);
                })
                res.records.push(new_row);
            })
            return Table(res);
        },


        selectTopRows: function(amount) {
            var res = cloneParams();
            res.records = params.records.slice(0, amount);
            return Table(res);
        },


        updateWhere: function(filterFunction, updateFunction) {
            var res = cloneParams();
            res.records = params.records.map(function(row) {
                var obj = rowToObject(row);
                if(filterFunction(obj)) {
                    return objectToRow(
                        updateFunction(obj)
                    );
                }
                return row.slice();
            })
            return Table(res);
        },


        insertRecord: function(record) {
            var res = cloneParams(true);
            if(Array.isArray(record)) {
                if(record.length != res.columnTypes.length) {
                    throw new Error('Wrong record fields length');
                }
                res.records.push(record);
            } else {
                res.records.push(objectToRow(record));
            }
            return Table(res);
        },


        union: function(table) {
            var columns_diff = JSON.stringify(params.columnNames) !== JSON.stringify(table.params().columnNames);
            var types_diff = JSON.stringify(params.columnTypes) !== JSON.stringify(table.params().columnTypes);

            if(columns_diff || types_diff) {
                throw new Error('Attemp to create union tables with different columns');
            }
            var res = cloneParams();
            res.records = params.records.concat(table.params().records);
            return Table(res);
        },


        join: function(column1, table2, column2, type) {
            var params2 = table2.params();
            var idx1 = this.columnIndex(column1);
            var idx2 = table2.columnIndex(column2);

            var res = {
                columnTypes: params.columnTypes.concat(params2.columnTypes),
                records: []
            }
            res.columnNames =
                params.columnNames.map(function(column) {
                    return 'table1_' + column;
                }).concat(params2.columnNames.map(function(column) {
                    return 'table2_' + column;
                }));

            res.records = joinRecords[type](params, idx1, params2, idx2);
            return Table(res);
        },


        toString: function() {
            var str = params.columnNames.join('');
            for(var i=0; i<params.records.length; i++) {
                str += params.records[i].join('');
            }
            return str;
        }

    }
}