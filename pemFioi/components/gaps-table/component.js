function GapsTable(params) {

    var defaults = {
        placeholder: '*',
        random: false,
        values: false,
        valid: [[]],
        cell_min_width: 50
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
        resizable = true;
        params.values = [];
        for(var i=0; i<params.valid.length; i++) {
            var row = [];
            for(var j=0; j<params.valid[i].length; j++) {
                row.push(params.valid[i][j] !== '' ? '*' : '');
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
    for(var i=0; i<params.values.length; i++) {
        var row = $('<tr/>');
        var cells_row = [];
        for(var j=0; j<params.values[i].length; j++) {
            var cell = $('<td/>');
            var v = params.values[i][j];
            if(v == params.placeholder) {
                cell.addClass('placeholder');
            } else if(v !== '') {
                cell.html(v);
            }
            cells_row.push(cell);
            row.append(cell);
        }
        cells.push(cells_row);
        table.append(row);
    }
    wrapper.append(table_container);

    table.find('.placeholder').each(function() {
        var placeholder = $(this)
        placeholder.html('');
        placeholder.droppable({
            scope: uid,
            hoverClass: 'placeholder-hover',
            drop: function(event, ui) {
                toolbar.append(placeholder.find('span').first());
                ui.draggable.detach().css({top: 0,left: 0}).appendTo(placeholder);
            }
        });
    });            


/*
    function resize(rows, cols) {
        if(cells.length == rows && cells[0].length == cols) {
            return;
        }
        // expand height
        while (this.value.tiles.length < h) {
            this.value.tiles.push(new Array(w).fill(0));
        }
        // reduce height
        if (this.value.tiles.length > h) {
            this.value.tiles = this.value.tiles.slice(0, h);
        }
        for (var i = 0; i < this.value.tiles.length; i++) {
            if (this.value.tiles[i].length < w) {
                // expand width
                this.value.tiles[i] = this.value.tiles[i].concat(new Array(w - this.value.tiles[i].length).fill(0));
            } else if (this.value.tiles[i].length > w) {
                // reduce width
                this.value.tiles[i] = this.value.tiles[i].slice(0, w);
            }
        }
        this.display.render(this.value);
        this.onChange(true);        
    }
*/


    if(resizable) {
        /*
        table_container.resizable({
            grid: [params.values[0].length, params.values.length],
            stop: function(event, ui) {
                table_container.width('');
                table_container.height('auto');
                console.log(ui.size.width, ui.size.height);
                //resize(rows, cols);
            }
        });
        */
    }



    function validate(silent) {
        var res = true;
        for(var i=0; i<params.valid.length; i++) {
            for(var j=0; j<params.valid[i].length; j++) {
                if(params.values[i][j] !== params.placeholder) {
                    continue;
                }
                var v1 = params.valid[i][j];
                var v2 = cells[i][j].text();
                var valid = v1 !== '' && v1 === v2;
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
            res.push(row);
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