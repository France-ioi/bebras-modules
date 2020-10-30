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


    // interface
    return {
        setContent: setContent,
        getContent: getContent,
        destroy: function() {
            clearTimeout(on_change_timeout);
            editor.destroy();
            editor = null;
        }
    }

}