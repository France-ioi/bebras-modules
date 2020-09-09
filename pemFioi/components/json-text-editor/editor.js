function JSONTextEditor(params) {

    var el = document.createElement('pre');
    el.className = 'json-editor';
    el.contentEditable = true;
    el.spellcheck = false;
    el.style.height = '500px';


    function enterKeyPressHandler(evt) {
        var sel, range, br, addedBr = false;
        evt = evt || window.event;
        var charCode = evt.which || evt.keyCode;
        if (charCode == 13) {
            if (typeof window.getSelection != "undefined") {
                console.log(1)
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    br = document.createElement("br");
                    range.insertNode(br);
                    range.setEndAfter(br);
                    range.setStartAfter(br);                   
                    sel.removeAllRanges();
                    sel.addRange(range);
                    addedBr = true;
                }
            } else if (typeof document.selection != "undefined") {
                console.log(2)
                sel = document.selection;
                if (sel.createRange) {
                    range = sel.createRange();
                    range.pasteHTML("\n");
                    range.select();
                    addedBr = true;
                }
            }
    
            // If successful, prevent the browser's default handling of the keypress
            if (addedBr) {
                if (typeof evt.preventDefault != "undefined") {
                    console.log('preventDefault')
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
            }
        }
    }


    function addEventListener(obj, evt, handler) {
        if(obj.addEventListener) {
            obj.addEventListener(evt, handler, false);
        } else if(obj.attachEvent) {
            return obj.attachEvent('on' + evt, handler);
        }        
    }


    addEventListener(el, 'keyup', enterKeyPressHandler);
    

/*
    function getJSONParseError(json) {
        var parser = clarinet.parser(),
          firstError = undefined;
    
        // generate a detailed error using the parser's state
        function makeError(e) {
          var currentNL = 0, nextNL= json.indexOf('\n'), line = 1;
          while (line < parser.line) {
            currentNL = nextNL;
            nextNL = json.indexOf('\n', currentNL + 1);
            ++line;
          }
          return {
            snippet:json.substr(currentNL + 1, nextNL - currentNL - 1),
            message: (e.message || '').split('\n', 1)[0],
            line:parser.line,
            column:parser.column
          }
        }
        
        // trigger the parse error
        parser.onerror = function(e) {
          firstError = makeError(e);
          parser.close();
        };
        try {
          parser.write(json).close();
        } catch(e) {
          if (firstError === undefined) {
            return makeError(e);
          } else {
            return firstError;
          }
        }
        
        return firstError;
      }
      */

    function validate() {
        var str = el.innerHTML;
        str = str.replace(/<br>/gi, '\n');
        str = str.replace(/(<([^>]+)>)/gi, '');

        /*
        var err = getJSONParseError(str);
        console.log(err)
        */
        
        try {
            var res = jsonlint.parse(str);
        } catch(e) {
            var lines = str.split('\n');
            line = lines[e.metadata.line];
            var c1 = e.metadata.loc.first_column + 1;
            var c2 = e.metadata.loc.last_column + 1;
            line = 
                '<span style="background: #FFAAAA">' + 
                line.substr(0, c1) + 
                '<span style="background: #990000; color: #FFFFFF;">' + 
                line.substr(c1, c2 - c1) + 
                '</span>' +
                line.substr(c2) + 
                '</span>';
            lines[e.metadata.line] = line;
            el.innerHTML = lines.join('\n');
            console.error(e.metadata)
        }
        
        document.getElementById('output').value = str;
    }

    addEventListener(el, 'blur', validate);



    params.parent.appendChild(el);


    return {


        setContent: function(obj) {
            var str = JSON.stringify(obj, null, 4);
            console.log(str)
            str = str.replace(/\n/g, '<br>')
            console.log(str)
            el.innerHTML = str;
        },


        getContent: function() {

        }
    }

}