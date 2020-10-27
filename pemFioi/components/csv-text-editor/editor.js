/*

step1: validate csv
step2: diff with valid data

*/
function CSVTextEditor(params) {

    var defaults = {
        width: '100%',
        min_height: '100px',
        csv_separator: ',',
        content: null,
        labels: {},
        onChange: null
    }
    params = Object.assign({}, defaults, params);
    try {
        params.valid_data = $.csv.toArrays(params.valid_data, {
            separator: params.csv_separator
        });
    } catch(e) {
        console.error('Invalid valid_data parameter');
        console.error(e.message);
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


    // editor element    
    addLabel('editor');
    var editor = $('<pre class="editor"/>')
        .attr('contentEditable', true)
        .attr('spellcheck', false);
    params.width && editor.css('width', params.width)
    params.min_height && editor.css('min-height', params.min_height)
    wrapper.append(editor);
    


    // sys 
    function stripTags(text) {
        text = text.replace(/<br>/gi, '\n');
        text = text.replace(/(<([^>]+)>)/gi, '');        
        return text;
    }


    // events
    function enterKeyPressHandler(event) {
        var sel, range, br, added = false;
        event = event ? event.originalEvent : window.event;
        var charCode = event.which || event.keyCode;
        if(charCode != 13) {
            return;
        }
        if(typeof window.getSelection != 'undefined') {
            sel = window.getSelection();
            if(sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                br = document.createTextNode('\n');
                range.insertNode(br);
                range.setEndAfter(br);
                range.setStartAfter(br);                   
                sel.removeAllRanges();
                sel.addRange(range);
                added = true;
            }
        } else if(typeof document.selection != 'undefined') {
            sel = document.selection;
            if (sel.createRange) {
                range = sel.createRange();
                range.pasteHTML('\n');
                range.select();
                added = true;
            }
        }

        if(added) {
            handleOnChange();
            if(typeof event.preventDefault != 'undefined') {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
    }
    editor.on('keypress', enterKeyPressHandler)

    function focusHandler(event) {
        editor.text(stripTags(editor.text()));
    }
    editor.on('focus', focusHandler)


    function pasteHandler(event) {
        event = event ? event.originalEvent : window.event;
        var paste = (event.clipboardData || window.clipboardData).getData('text');
        paste = stripTags(paste);
        if(typeof window.getSelection != 'undefined') {
            var sel = window.getSelection();
            if(!sel.rangeCount) {
                return false;
            }
            sel.deleteFromDocument();
            sel.getRangeAt(0).insertNode(document.createTextNode(paste));
            sel.removeAllRanges();
        } else if(typeof document.selection != 'undefined') {
            var sel = document.selection;
            if (sel.createRange) {
                range = sel.createRange();
                range.pasteHTML(paste);
                range.select();
            }
        }
        event.preventDefault();
        handleOnChange();
    }
    editor.on('paste', pasteHandler);


    function inputHandler(event) {
        handleOnChange();
    }
    editor.on('input', inputHandler);    


    // content

    function getContent() {
        return stripTags(editor.text());
    }

    function setContent(content) {
        editor.text(stripTags(content));
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
        var content = getContent();
        var data = null;
        try {
            data = $.csv.toArrays(content, {
                separator: params.csv_separator
            });
        } catch(e) {
            mistake = e.metadata;
            if(!silent) {
                content = 
                    content.substr(0, e.metadata.offset) + 
                    '<span class="mistake">' + e.metadata.token + '</span>' + 
                    content.substr(e.metadata.offset + e.metadata.token.length)
                editor.html(content);                    
            }
        }
        return data;
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
            wrapper.remove();
        }
    }

}