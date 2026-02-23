// markdown & mathjax
(function() {
    function markdown() {
        if(!window.showdown) return;
        var showdownConverter = new showdown.Converter({
            headerLevelStart: 3,
            backslashEscapesHTMLTags: true
        });
        $('.markdown').each(function() {
            var newDiv = $('<div></div>'), el = $(this);
            newDiv.html(showdownConverter.makeHtml(el.html()));
            newDiv.addClass('markdown-translated');
            newDiv.insertAfter(el);
            el.remove();
        });
    }

    if (window.MathJax && window.MathJax.Hub) {
        MathJax.Hub.Config({
            tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
        });
        MathJax.Hub.Queue(markdown);
    } else {
        $(document).ready(markdown);
    }
})()