function JSONTextEditor(params) {

    var defaults = {
        tab_size: 4,
        font_size: 16,
        validation_interval: 200
    }
    params = Object.assign({}, defaults, params);


    var editor = ace.edit(params.parent);
    editor.$blockScrolling = Infinity;
    editor.setFontSize(params.font_size);
    editor.getSession().setOptions({
        mode: 'ace/mode/json',
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
    if('content' in params) {
        setContent(params.content);
    }


    function getSyntaxError(silent) {
        if(mistake_marker) {
            editor.getSession().removeMarker(mistake_marker);
            mistake_marker = false;
        }        
        var annotations = editor.getSession().getAnnotations();
        if(!annotations.length) {
            return true;
        }
        var a = annotations[0];
        if(!silent) {
            editor.getSelection().setRange(new Range(0, 0, 0, 0)); // important string :)
            var range = new Range(a.row, a.column, a.row, a.column + 1);                
            mistake_marker = editor.getSession().addMarker(range, 'mistake', 'fullLine');            
        }
        return {
            msg: a.text
        }
    }


    // interface
    return {
        setContent: setContent,
        getContent: getContent,
        getSyntaxError: getSyntaxError,
        destroy: function() {
            clearTimeout(on_change_timeout);
            editor.destroy();
            editor = null;
        }
    }

}