function GapsTable(params) {

    var defaults = {
        placeholder: '*',
        random: false
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

    toolbar.find('span').each(function(i) {
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
    wrapper.append(table);

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



    return {

        validate: validate

    }
}