function FilesRepository(options) {

    var defaults = {
        extensions: '',
        strings: {
            caption: 'Audio files list',
            hint: 'Use file number as param for playRecord function',
            add: 'Add',
            incompatible_browser: 'Incompatible browser'
        }
    }

    options = Object.assign(defaults, options);

    var browser_compatible = window.File && window.FileReader && window.FileList && window.Blob;


    function initModal() {
        if($('#files_repository_modal')[0]) return;
        var inner_html;
        if(browser_compatible) {
            inner_html =
                '<p>' + options.strings.hint + '</p>' +
                '<table id="files_repository_list"></table>' +
                '<div id="files_repository_inputs"></div>'

        } else {
            inner_html =
                '<p>' + options.strings.incompatible_browser + '</p>';
        }
        var html =
            '<div id="files_repository_modal" class="modalWrapper">' +
                '<div class="modal">' +
                    '<button type="button" class="btn close" onclick="$(`#files_repository_modal`).hide()">x</button>' +
                    '<p><b>' + options.strings.caption + '</b></p>' +
                    inner_html
                '</div>' +
            '</div>';
        $(options.parent).append($(html));
    }


    function enumerateFiles() {
        $('#files_repository_list > tbody > tr').each(function(idx, tr) {
            $(tr).find('td:nth-child(1)').text(idx + 1 + '. ');
        })
    }


    function addFilesGroup(files, group_idx) {
        var html = '';
        for(var i = 0, f; f = files[i]; i++) {
            html += '<tr group_idx="' + group_idx + '"><td></td><td>' + f.name + '</td>';
            if(i==0) {
                html +=
                    '<td rowspan="' + files.length + '">' +
                        '<button type="button" class="btn close">x</button>' +
                    '</td>';
            }
            html += '</tr>';
        }
        var tr = $(html);
        tr.find('button.close').click(function() {
            $('#files_repository_list > tbody > tr[group_idx=' +  group_idx + ']').remove();
            $('#files_repository_inputs > input[group_idx=' +  group_idx + ']').remove();
            enumerateFiles();
        })
        $('#files_repository_list').append(tr);
        enumerateFiles();
    }


    var group_idx = 0;

    function addInput() {
        group_idx ++;
        var input = $(
            '<input group_idx="' + group_idx + '" ' +
            'type="file" class="btn" multiple ' +
            'accept="' + options.extensions + '" ' +
            'title="' + options.strings.add + '"/>');

        $('#files_repository_inputs').append(input);
        input.change(function() {
            if(!this.files.length) return;
            addFilesGroup(this.files, group_idx);
            $(this).hide();
            addInput();
        })
    }



    // interface
    this.show = function() {
        $('#files_repository_modal').show();
    }


    this.getFile = function(n) {
        var p = 0;
        var inputs = $('#files_repository_inputs > input[type=file]');
        for(var i=0, input; input = inputs[i]; i++) {
            if(n >= p && n < p + input.files.length) {
                return input.files[n - p];
            }
            p += input.files.length;
        }
        return null;
    }


    // init
    initModal();
    if(!browser_compatible) return;
    addInput();
}