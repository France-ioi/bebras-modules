function GapsTable(params) {

    var defaults = {
        header: true,
        placeholder: '*',
        random: false,

        //TODO: add multiple tables support
        values: false,
        valid: [[]],

        cell_min_width: 100,
        table_min_size: {
            rows: 2,
            cols: 2
        }
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


    var wrapper = $('<div class="gaps-table"/>');
    params.parent.append(wrapper);


    // init values if empty
    var resizable = false;
    if(!params.values) {
        params.header = false;
        resizable = true;
        params.values = [];
        for(var i=0; i<params.valid.length; i++) {
            var row = [];
            for(var j=0; j<params.valid[i].length; j++) {
                row.push(params.valid[i][j] !== '' ? params.placeholder : '');
            }
            params.values.push(row);
        }
    }


    // toolbar
    var values = [];
    for(var i=0; i<params.valid.length; i++) {
        for(var j=0; j<params.valid[i].length; j++) {
            var v = params.valid[i][j];
            if(v !== '' && v !== params.placeholder) {
                values.push(v);
            }
        }
    }
    values = shuffleArray(values);

    var toolbar = $('<div class="gaps-toolbar"/>');
    for(var i=0; i<values.length; i++) {
        toolbar.append($('<span class="value">' + values[i] + '</span>'));
    }        
    wrapper.append(toolbar);

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





    // table
    var cells = [];
    var table = $('<table/>');
    var table_container = $('<div class="table-container"/>')
    table_container.append(table);


    function createCell(value, is_header) {
        var cell = $(is_header ? '<th/>' : '<td/>');
        cell.css({
            'min-width': params.cell_min_width + 'px',
        });
        if(value == params.placeholder) {
            cell.addClass('placeholder');
            cell.droppable({
                scope: uid,
                hoverClass: 'placeholder-hover',
                drop: function(event, ui) {
                    toolbar.append(cell.find('.value').first());
                    ui.draggable.detach().css({top: 0,left: 0}).appendTo(cell);
                }
            });
        } else if(value !== '') {
            cell.html(value);
        }
        return cell;
    }

    function renderRow(values, is_header) {
        var row = $('<tr/>');
        var cells_row = [];
        for(var j=0; j<values.length; j++) {
            var cell = createCell(values[j], is_header);
            cells_row.push(cell);
            row.append(cell);
        }
        cells.push(cells_row);
        table.append(row);
    }


    for(var i=0; i<params.values.length; i++) {
        renderRow(params.values[i], params.header && i == 0)
    }

    wrapper.append(table_container);

    /*
    table.find('.placeholder').each(function() {
        var placeholder = $(this)
        placeholder.droppable({
            scope: uid,
            hoverClass: 'placeholder-hover',
            drop: function(event, ui) {
                toolbar.append(placeholder.find('span').first());
                ui.draggable.detach().css({top: 0,left: 0}).appendTo(placeholder);
            }
        });
    });            
    */



    function resize(cols, rows) {
        cols = Math.max(cols, params.table_min_size.cols);
        rows = Math.max(rows, params.table_min_size.rows);

        // expand height
        while(cells.length < rows) {
            params.values.push(new Array(cols).fill(params.placeholder));
            var idx = params.values.length - 1;
            renderRow(params.values[idx], params.header && idx == 0)
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
            var is_header = i == 0 && params.header;
            var tr = cells[i][0].parent();
            if(cells[i].length < cols) {
                // expand width
                var l = cells[i].length;                            
                params.values[i] = params.values[i].concat(new Array(cols - l).fill(params.placeholder));
                for(var j=l; j<cols; j++) {
                    var cell = createCell(params.values[i][j], is_header);
                    cells[i][j] = cell;
                    tr.append(cell);
                }
            } else if (cells[i].length > cols) {
                // collapse width
                params.values[i] = params.values[i].slice(0, cols);
                for(var j=cols; j<cells[i].length; j++) {
                    toolbar.append(cells[i][j].find('.value'));
                    cells[i][j].remove();
                }
                cells[i] = cells[i].slice(0, cols);
            }
        }
    }



    if(resizable) {
        table_container.resizable({
            grid: [params.values[0].length, params.values.length],
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
                while(h < ui.size.height) {
                    if(rows < cells.length) {
                        h += cells[rows][0].outerHeight();
                    } else {
                        h += 30; // TODO: add to config somehow ?
                    }
                    rows++;
                }                
                resize(cols - 1, rows - 1);
                table_container.width('');
                table_container.height('');                
            }
        });
    }



    function validate(silent) {
        var res = true;
        var valid;
        for(var i=0; i<cells.length; i++) {
            for(var j=0; j<cells[i].length; j++) {
                if(i >= params.valid.length || j > params.valid[i].length) {
                    valid = false;
                } else if(params.values[i][j] !== params.placeholder) {
                    continue;
                } else {
                    var v1 = params.valid[i][j];
                    var v2 = cells[i][j].text();
                    valid = v1 !== '' && v1 === v2;
                }
                cells[i][j].toggleClass('mistake', !valid);
                res = res && valid;
            }
        }
        return res;
    }



    function getAnswer() {
        var res = [];
        for(var i=0; i<params.values.length; i++) {
            var row = [];
            for(var j=0; j<params.values[i].length; j++) {
                row.push(params.values[i][j] === params.placeholder ? cells[i][j].text() : '');
            }
            res[i] = row;
        }
        return res;
    }


    function setAnswer(answer) {
        reset();
        var values = toolbar.find('.value').toArray();
        for(var i=0; i<params.values.length; i++) {
            for(var j=0; j<params.values[i].length; j++) {
                if(params.values[i][j] !== params.placeholder) {
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
    }


    function reset() {
        table.find('td').removeClass('mistake');
        toolbar.append(table.find('.value'));
    }


    return {

        validate: validate,
        getAnswer: getAnswer,
        setAnswer: setAnswer
    }
}