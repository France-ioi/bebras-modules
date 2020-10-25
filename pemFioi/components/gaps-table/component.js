function GapsTable(params) {

    var defaults = {
        display_output_csv: false,
        display_input_csv: false,
        random: false,
        header: true,
        tables: [],
        placeholder: '*',
        cell_min_width: 100,
        cell_min_width: 100,
        table_min_size: {
            rows: 2,
            cols: 2
        },
        table_max_size: {
            rows: 10,
            cols: 10
        },
        csv_separator: ',',
        labels: {}
    }
    params = Object.assign({}, defaults, params);


    var uid = Math.random().toString(36).substr(2, 12);
    function shuffleArray(a) {
        if(params.random === false) {
            return a;
        }
        var j, x, i, r;
        for(i = a.length - 1; i > 0; i--) {
            r = 0.5 * (1 + Math.sin(i + params.random));
            j = Math.floor(r * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    function iterateTableArray(arr, callback) {
        for(var i=0; i<arr.length; i++) {
            for(var j=0; j<arr[i].length; j++) {
                callback(i, j, arr[i][j]);
            }
        }
    }

    function makeArray(length, value) {
        var arr = new Array(length);
        for(var i=0; i<length; i++){
            arr[i] = value;
        }
        return arr;
    }

    function getTableArraySize(arr) {
        var res = {
            rows: arr.length,
            cols: 0
        }
        for(var i=0; i<arr.length; i++) {
            res.cols = Math.max(res.cols, arr[i].length);
        }        
        return res;
    }    

    function alignTableArray(arr, default_value) {
        var size = getTableArraySize(arr);
        for(var i=0; i<arr.length; i++) {
            arr[i] = arr[i].concat(makeArray(size.cols - arr[i].length, default_value));    
        }
        return arr;
    }






    var wrapper = $('<div class="gaps-table"/>');
    params.parent.append(wrapper);

    function addLabel(section) {
        if(section in params.labels) {
            var label = $('<div class="label"/>');
            label.html(params.labels[section]);
            wrapper.append(label);
        }
    }





    function Schema(data) {

        if(Array.isArray(data)) {
            data = alignTableArray(data, '')
        }

        return {
            isStatic: function() {
                return !!data;
            },

            isPlaceholder: function(row, col) {
                return data ? data[row][col] === params.placeholder : true;
            },

            getContent: function(row, col) {
                return data ? data[row][col] : '';
            }
        }
    }



    function formatCSV(data, mistakes) {
        var lines = [];
        for(var i=0; i<data.length; i++) {
            var cells = [], v;
            for(var j=0; j<data[i].length; j++) {
                v = data[i][j];
                if(v.indexOf(params.csv_separator) !== -1) {
                    v = '"' + v.replace(/"/g, '""') + '"';
                }
                if(mistakes && mistakes[i][j]) {
                    if(v === '') {
                        v = '&nbsp;';
                    }
                    v = '<span class="mistake">' + v + '</span>';
                }
                cells.push(v);
            }
            lines[i] = cells.join(params.csv_separator);
        }
        return lines.join('<br>');
    }





    function Table(data) {

        var answer;
        var mistakes;
        var cells = [];

        if(params.display_output_csv) {
            var input_display = $('<div class="csv"/>');
            addLabel('input');
            wrapper.append(input_display);
            input_display.html(formatCSV(data.values));
        }        
        var table = $('<table/>');
        var table_outline = $('<div class="table-outline"/>').append(table);
        var table_container = $('<div class="table-container"/>').append(table_outline);
        addLabel('table');
        wrapper.append(table_container);
        var schema = Schema(data.schema);
       

        var display;
        if(params.display_output_csv) {
            addLabel('output');
            display = $('<div class="csv"/>');
            wrapper.append(display);
        }
        function updateCSV() {
            if(!params.display_output_csv) {
                return;
            }
            display.html(formatCSV(answer, mistakes));
        }


        function createCell(row, col) {
            var is_header = row == 0 && params.header;
            var cell = $(is_header ? '<th/>' : '<td/>');
            cell.css({
                'min-width': params.cell_min_width + 'px',
            });
            if(schema.isPlaceholder(row, col)) {
                cell.addClass('placeholder');
                cell.droppable({
                    scope: uid,
                    hoverClass: 'placeholder-hover',
                    drop: function(event, ui) {
                        resetMistakes();                        
                        toolbar.append(cell.find('.value').first());
                        ui.draggable.detach().css({top: 0,left: 0}).appendTo(cell);
                        refreshAnswer();
                    }
                });
            } else {
                cell.html(schema.getContent(row, col));
            }
            return cell;
        }

        function createRow(row, length) {
            cells[row] = [];
            var tr = $('<tr/>');
            for(var i=0; i<length; i++) {
                var cell = createCell(row, i);
                tr.append(cell);
                cells[row][i] = cell;
            }
            table.append(tr);
        }



        function resize(rows, cols) {
            cols = Math.max(cols, params.table_min_size.cols);
            cols = Math.min(cols, params.table_max_size.cols);
            rows = Math.max(rows, params.table_min_size.rows);
            rows = Math.min(rows, params.table_max_size.rows);

            

            // expand height
            while(cells.length < rows) {
                createRow(cells.length, cols)
            }

            // collapse height
            if(cells.length > rows) {
                for(var i=rows; i<cells.length; i++) {
                    var tr = cells[i][0].parent();
                    for(var j=0; j<cells[i].length; j++) {
                        toolbar.append(cells[i][j].find('.value'));
                        cells[i][j].remove();
                    }
                    tr.remove();
                }
                cells = cells.slice(0, rows);
            }

            if(!cells.length || cells[0].length == cols) {
                return;
            }        

            
            for(var i=0; i<cells.length; i++) {
                var tr = cells[i][0].parent();
                if(cells[i].length < cols) {
                    // expand width
                    var l = cells[i].length;                            
                    for(var j=l; j<cols; j++) {
                        cells[i][j] = createCell(i, j);
                        tr.append(cells[i][j]);
                    }
                } else if (cells[i].length > cols) {
                    // collapse width
                    for(var j=cols; j<cells[i].length; j++) {
                        toolbar.append(cells[i][j].find('.value'));
                        cells[i][j].remove();
                    }
                    cells[i] = cells[i].slice(0, cols);
                }
            }
        }



        if(schema.isStatic()) {
            for(var i=0; i<data.values.length; i++) {
                createRow(i, data.values[i].length);
            }
        } else {
            for(var i=0; i<params.table_min_size.rows; i++) {
                createRow(i, params.table_min_size.cols);
            }
            table_outline.resizable({
                stop: function(event, ui) {
                    var cols = 0;
                    var w = 0;
                    while(w < ui.size.width) {
                        if(cells.length && cols < cells[0].length) {
                            w += cells[0][cols].outerWidth();
                        } else {
                            w += params.cell_min_width;
                        }
                        cols++;
                    }
                    var rows = 0;
                    var h = 0;
                    var avg_h = 1;
                    while(h < ui.size.height) {
                        if(rows < cells.length) {
                            var ch = cells[rows][0].outerHeight();
                            avg_h += ch / cells.length;
                            h += ch;
                        } else {
                            h += avg_h;
                        }
                        rows++;
                    }                
                    resize(rows - 1, cols - 1);
                    refreshAnswer();
                    table_outline.width('');
                    table_outline.height('');                
                }
            });
        }
    

        function refreshAnswer() {
            answer = [];
            for(var i=0; i<cells.length; i++) {
                answer[i] = [];
                for(var j=0; j<cells[i].length; j++) {
                    answer[i][j] = schema.isPlaceholder(i, j) ? cells[i][j].text() : '';
                }
            }
            updateCSV();
        }


        function getAnswer() {
            return answer;
        }
    
    
        function setAnswer(answer) {
            if(!schema.isStatic()) {
                var size = getTableArraySize(answer);
                resize(size.rows, size.cols);
            }
            var values = toolbar.find('.value').toArray();
            for(var i=0; i<answer.length; i++) {
                for(var j=0; j<answer[i].length; j++) {
                    if(!schema.isPlaceholder(i, j)) {
                        continue;
                    }
                    for(var k=0; k<values.length; k++) {
                        if(values[k].innerText === answer[i][j]) {
                            cells[i][j].append(values[k]);
                            values.splice(k, 1);
                            break;
                        }
                    }
                }
            }
            refreshAnswer();
        }


        function resetMistakes() {
            mistakes = false;
            table.find('td').removeClass('mistake');
            table.find('th').removeClass('mistake');
            updateCSV();
        }
    
    
        function resetValues() {
            toolbar.append(table.find('.value'));
            refreshAnswer();
        }
    

        function validate(silent) {
            var res = true;
            var valid;
            mistakes = [];
            for(var i=0; i<cells.length; i++) {
                mistakes[i] = [];
                for(var j=0; j<cells[i].length; j++) {
                    if(i >= data.values.length || j > data.values[i].length) {
                        valid = false;
                    } else if(!schema.isPlaceholder(i, j)) {
                        continue;
                    } else {
                        var v1 = data.values[i][j];
                        var v2 = cells[i][j].text();
                        valid = v1 !== '' && v1 === v2;
                    }
                    if(!silent) {
                        cells[i][j].toggleClass('mistake', !valid);
                    }
                    mistakes[i][j] = !valid;
                    res = res && valid;
                }
            }
            updateCSV();
            return res;
        }        


        function getValues() {
            var res = [];
            iterateTableArray(data.values, function(row, col, v) {
                if(schema.isPlaceholder(row, col)) {
                    res.push(v);
                }
            })
            return res;
        }


        refreshAnswer();

        return {
            getAnswer: getAnswer,
            setAnswer: setAnswer,
            getValues: getValues,
            validate: validate,
            resetValues: resetValues
        }

    }



    // tables
    var tables = [];
    var values = [];
    for(var i=0; i<params.tables.length; i++) {
        var data = params.tables[i];
        if(typeof data.values == 'string') {
            data.values = $.csv.toArrays(data.values, {
                separator: params.csv_separator
            });
        }
        if('schema' in data && typeof data.schema == 'string') {
            data.schema = $.csv.toArrays(data.schema, {
                separator: params.csv_separator
            });
        }        
        var table = Table(params.tables[i]);
        tables.push(table);
        values = values.concat(table.getValues());
    }



    // toolbar
    values = shuffleArray(values);

    var toolbar = $('<div class="gaps-toolbar"/>');
    for(var i=0; i<values.length; i++) {
        toolbar.append($('<span class="value">' + values[i] + '</span>'));
    }        
    wrapper.prepend(toolbar);

    toolbar.find('.value').each(function(i) {
        var el = $(this), text = el.text();
        el.draggable({
            scope: uid,
            revert: 'invalid',
            revertDuration: 200,
            zIndex: 100
        });
    });

    toolbar.droppable({
        scope: uid,
        drop: function(event, ui) {
            ui.draggable.detach().css({top: 0,left: 0}).appendTo(toolbar);
        }
    });        





    function getAnswer() {
        var res = [];
        for(var i=0; i<tables.length; i++) {
            res.push(tables[i].getAnswer());
        }
        return res;
    }


    function setAnswer(answer) {
        for(var i=0; i<answer.length; i++) {
            tables[i].resetValues();
        }        
        for(var i=0; i<answer.length; i++) {
            tables[i].setAnswer(answer[i]);
        }
    }


    function validate(silent) {
        var res = true;
        for(var i=0; i<tables.length; i++) {
            if(!tables[i].validate(silent)) {
                res = false;
            }
        }
        return res;
    }





    return {

        validate: validate,
        getAnswer: getAnswer,
        setAnswer: setAnswer
    }
}