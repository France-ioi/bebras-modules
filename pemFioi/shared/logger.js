function Logger(options) {

    var defaults = {
        size: 10,
        collapsed: true,
        styles: {
            container: 'position: relative; font-size: 75%;',
            expander: 'position: absolute; right: 0; bottom: 0; padding: 2px; font-weight: bold; border: 1px solid #000; border-radius: 3px; cursor: pointer; display: none;'
        }
    }
    options = Object.assign(defaults, options);

    var container = $('<div style="' + options.styles.container + '"></div>');
    $(options.parent).append(container);
    var expander = $('<div style="' + options.styles.expander + '">^</div>');
    container.append(expander);


    var collapsed = options.collapsed;

    function refreshVisibility() {
        var els = container.find('pre');
        els.each(function(i, pre) {
            $(pre).toggle(collapsed ? i == els.length - 1 : true);
        })
    }

    function truncate() {
        var els = container.find('pre');
        while(els.length > options.size) {
            var pre = els[0];
            pre.remove();
            els = els.splice(els.length - 1, 1);
        }
    }

    expander.on('click', function() {
        collapsed = !collapsed;
        refreshVisibility();
    });


    this.clear = function() {
        container.find('pre').remove();
        expander.hide();
    }

    this.put = function(message) {
        if(typeof message == 'number' || typeof message == 'string') {
            var html = message;
        } else {
            var html = JSON.stringify(message);
        }
        container.append('<pre>' + html + '</pre>');
        expander.toggle(container.find('pre').length > 1);
        truncate();
        refreshVisibility();
    }

    this.destroy = function() {
        container.remove();
        delete container;
    }
}