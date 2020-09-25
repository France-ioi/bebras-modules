/*

step1: validate csv
step2: diff with valid data

*/

function CSVTextEditor(params) {

    var defaults = {
        width: '100%',
        min_height: '100px',
        styles: {
            error_line: 'background: #FFAAAA',
            error_char: 'background: #990000; color: #FFFFFF', 
            border: '1px solid #000000'
        },
        csv_separator: ',',
        content: null
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

    // element
    var el = $('<pre/>')
        .attr('contentEditable', true)
        .attr('spellcheck', false)
        .css('width', params.width + 'px')
        .css('min-height', params.min_height + 'px')
        .css('border', params.styles.border)
    params.parent.append(el);


    // sys 
    function addEventListener(obj, evt, handler) {
        if(obj.addEventListener) {
            obj.addEventListener(evt, handler, false);
        } else if(obj.attachEvent) {
            return obj.attachEvent('on' + evt, handler);
        }        
    }    

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
            if(typeof event.preventDefault != 'undefined') {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
    }
    el.on('keypress', enterKeyPressHandler)

    function focusHandler(event) {
        el.text(stripTags(el.text()));
    }
    el.on('focus', focusHandler)


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
    }
    el.on('paste', pasteHandler);



    // interface
    function getContent() {
        return stripTags(el.text());
    }

    function setContent(content) {
        el.text(stripTags(content));
    }



    // validation
    function displayParseError(data, mistakes) {
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


    function parseEditorContent(silent) {
        var content = getContent();
        var data = null;
        try {
            data = $.csv.toArrays(content, {
                separator: params.csv_separator
            });
        } catch(e) {
            if(!silent) {
                content = 
                    content.substr(0, e.metadata.offset) + 
                    '<span style="background: #F00; color: #FFF">' + e.metadata.token + '</span>' + 
                    content.substr(e.metadata.offset + e.metadata.token.length)
                el.html(content);                    
            }
        }
        return data;
    }


    function displayDiffError(data, mistakes) {
        var lines = [];
        for(var i=0; i<data.length; i++) {
            var cells = [], v;
            for(var j=0; j<data[i].length; j++) {
                v = data[i][j];
                if(v.indexOf(params.csv_separator) !== -1) {
                    v = '"' + v.replace(/"/g, '""') + '"';
                }
                if(mistakes[i][j]) {
                    if(v === '') {
                        v = '&nbsp;';
                    }
                    v = '<span style="background: #F00; color: #FFF">' + v + '</span>';
                }
                cells.push(v);
            }
            lines[i] = cells.join(params.csv_separator);
        }
        el.html(lines.join('\n'));
    }


    function getValidValue(row, col) {
        if(row < params.valid_data.length && col < params.valid_data[row].length) {
            return params.valid_data[row][col];
        } 
        return undefined;
    }


    function diff(data, silent) {
        var mistakes = [];
        var fl = data.length == params.valid_data.length;
        var rows = Math.max(data.length, params.valid_data.length);
        for(var i=0; i<rows; i++) {
            var cols = Math.max(data[i].length, i < params.valid_data.length ? params.valid_data[i].length : 0);
            mistakes[i] = [];
            for(var j=0; j<cols; j++) {
                mistakes[i][j] = getValidValue(i, j) !== data[i][j];
                fl = fl && !mistakes[i][j];
            }
        }
        if(!silent && !fl) {
            displayDiffError(data, mistakes);
        }
        return fl;
    }



    function validate(valid_csv, silent) {
        var data = parseEditorContent(silent);
        if(data) {
            return diff(data, silent);
        }
        return false;
    }


    if('content' in params) {
        setContent(params.content);
    }
    
    return {
        setContent: setContent,
        getContent: getContent,
        validate: validate,
        destroy: function() {
            el.remove();
        }
    }

}