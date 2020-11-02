/*

step1: validate csv
step2: diff with valid data

*/
function CSVTextEditor(params) {

    var defaults = {
        width: '100%',
        height: '200px',
        tab_size: 4,
        font_size: 16,
        validation_interval: 200,        
        csv_separator: ',',
        content: null,
        labels: {},
        onChange: null
    }
    params = Object.assign({}, defaults, params);


    // parse valid_data
    var d = Papa.parse(params.valid_data, {
        delimiter: params.csv_separator
    });
    if(d.errors.length) {
        console.error('CSV Editor Error: Invalid valid_data parameter', d.errors)
        params.valid_data = [[]];
    } else {
        params.valid_data = d.data;
    }


    var wrapper = $('<div class="csv-text-editor"/>')
    params.parent.append(wrapper);

    function addLabel(section) {
        if(section in params.labels) {
            var label = $('<div class="label"/>');
            label.html(params.labels[section]);
            wrapper.append(label);
        }
    }

    // onChange handler
    function handleOnChange() {
        if(!params.onChange) {
            return;
        }
        params.onChange(getContent());
    }    


    // ace editor 
    addLabel('editor');
    var editor_wrapper = $('<div class="editor"/>').css('width', params.width).css('height', params.height);
    wrapper.append(editor_wrapper);

    var editor = ace.edit(editor_wrapper[0]);
    editor.$blockScrolling = Infinity;
    editor.setFontSize(params.font_size);
    editor.getSession().setOptions({
        mode: 'ace/mode/plain_text',
        tabSize: params.tab_size,
        useSoftTabs: true
    })
    var Range = ace.require('ace/range').Range;
    var mistake_marker;

    var on_change_timeout;
    editor.getSession().on('change', function(e) {
        clearTimeout(on_change_timeout);
        on_change_timeout = setTimeout(
            handleOnChange, 
            params.validation_interval
        );
    });


    function handleOnChange() {
        params.onChange && params.onChange(
            getContent()
        );
    }    

    


    // content

    function getContent() {
        return editor.getValue();
    }

    function setContent(content) {
        editor.setValue(content);
    }



    // validation

    var mistake;
    var table;

    function diff(data, valid_data, silent) {

        function getValidValue(row, col) {
            if(row < valid_data.length && col < valid_data[row].length) {
                return valid_data[row][col];
            } 
            return false;
        }        

        function getDataValue(row, col) {
            if(row < data.length && col < data[row].length) {
                return data[row][col];
            } 
            return false;
        }                

        function formatCell(value, valid) {
            return '<td' + (valid ? '' : ' class="mistake"') + '>' + 
                (v1 === false ? '&nbsp;' : '<pre>' + value + '</pre>') + 
                '</td>';
        }

       
        mistake = false;
        var res = true;
        if(data.length != params.valid_data.length) {
            mistake = {
                tag: data.length < params.valid_data.length ? 'rows_lack' : 'rows_excess'
            }
            res = false;
        }

        var html = '';
        var rows = Math.max(data.length, params.valid_data.length);
        var v1, v2, valid, cols;        
        for(var i=0; i<rows; i++) {
            html += '<tr>';
            if(i < params.valid_data.length && i < data.length && data[i].length != params.valid_data[i].length) {
                mistake = {
                    tag: data[i].length < params.valid_data[i].length ? 'cols_lack' : 'cols_excess'
                }                
                res = false;
            }
            var cols = Math.max(i < data.length ? data[i].length : 0, i < params.valid_data.length ? params.valid_data[i].length : 0);
            for(var j=0; j<cols; j++) {
                v1 = getDataValue(i, j);
                v2 = getValidValue(i, j);
                valid = v1 === v2 && v1 !== false && v2 !== false;
                res = res && valid;
                html += formatCell(v1, valid);
            }
            html += '</tr>';
        }
        if(!silent) {
            if(!table) {
                table = $('<table>');
                addLabel('preview');
                wrapper.append(table);
            }
            table.html(html);      
        }
        if(!res && !mistake) {
            mistake = {
                tag: 'incorrect_data'
            }
        }
        return res;
    }


    function parseEditorContent(silent) {
        if(!silent && mistake_marker) {
            editor.getSession().removeMarker(mistake_marker);
            mistake_marker = false;
        }

        var content = getContent(); // .trim(); //TODO
        var d = Papa.parse(content, {
            delimiter: params.csv_separator
        });
        if(d.errors.length) {
            var err = d.errors[0];
            mistake = {
                tag: err.code
            }
            if(!silent) {
                editor.getSelection().setRange(new Range(0, 0, 0, 0)); // important string :)
                var range = new Range(err.row, err.index, err.row, err.index + 1);                
                mistake_marker = editor.getSession().addMarker(range, 'mistake', 'text');
            }
            return null;
        }
        return d.data;
    }    


    function validate(valid_csv, silent) {
        table && table.html('');
        mistake = null;
        var data = parseEditorContent(silent);
        if(data) {
            return diff(data, params.valid_data, silent);
        }
        return false;
    }


    if('content' in params && typeof params.content == 'string') {
        setContent(params.content);
    }
    
    return {
        setContent: setContent,
        getContent: getContent,
        validate: validate,
        getMistake: function() {
            return mistake;
        },
        destroy: function() {
            clearTimeout(on_change_timeout);
            editor.destroy();
            wrapper.remove();
        }
    }

}