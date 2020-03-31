/*
    options: {
        strings: {..}, //
        extensions: '' // string
    }
*/

function FilesRepository(options) {

    var defaults = {
        extensions: '',
        strings: {
            caption: 'Audio files list',
            hint: 'Use file number as param for playRecord function',
            add: 'Add',
            incompatible_browser: 'Incompatible browser',
            confirm_overwrite: 'Overwrite files?',
            file_not_found: 'File not found: '
        }
    }
    this.options = Object.assign(defaults, options);
    this.browser_compatible = window.File && window.FileReader && window.FileList && window.Blob;
    this.files = {}
    this.popup = null;
    this.level = null;


    this.initLevel = function(params) {
        this.level = params.level;
        this.options.strings = Object.assign(defaults.strings, params.strings);
    }


    this.open = function() {
        if(!this.files[this.level]) {
            this.files[this.level] = {};
        }
        this.renderPopup();
        this.renderFiles();
    }


    this.close = function() {
        this.popup.remove();
        this.popup = null;
    }


    this.onFileInputChange = function(e) {
        if(!e.target.files.length) {
            return;
        }

        var existing_files = [];
        for(var i=0; i<e.target.files.length; i++) {
            var filename = e.target.files[i].name;
            if(filename in this.files[this.level]) {
                existing_files.push(filename);
            }
        }
        if(existing_files.length > 0 && !confirm(this.options.strings.confirm_overwrite + '\n' + existing_files.join('\n'))) {
            e.target.value = '';
            return;
        }
        for(var i=0; i<e.target.files.length; i++) {
            var file = e.target.files[i];
            this.files[this.level][file.name] = file;
        }
        e.target.value = '';
        this.renderFiles();
    }


    this.renderFiles = function() {
        var html = '';

        var n = 1;
        for(var filename in this.files[this.level]) {
            html +=
                '<tr><td>' + n + ') </td>' +
                '<td>' + filename + '</td>' +
                '<td><button type="button" class="btn close" data-filename="'+ filename +'">x</button></td></tr>'
            n++;
        }
        var el = $('#files_repository_list').empty().append(html);
        el.find('button.close').click(this.onRemoveFileClick.bind(this));
    }


    this.onRemoveFileClick = function(e) {
        var filename = $(e.target).data('filename');
        delete this.files[this.level][filename];
        this.renderFiles();
    }


    this.onCopyFileNameClick = function(e) {
        var text = $(e.target).data('filename');
        if(navigator.clipboard) {
            navigator.clipboard.writeText(text)
            return;
        }
        var el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.focus();
        el.select();
        try {
            document.execCommand('copy');
        } catch (e) {
            console.error('document.execCommand(\'copy\') error', e);
        }
        document.body.removeChild(el);
    }


    this.renderPopup = function() {
        var inner_html;
        if(this.browser_compatible) {
            inner_html =
                '<p>' + this.options.strings.hint + '</p>' +
                '<table id="files_repository_list"></table>' +
                '<div>' +
                    '<input type="file" class="btn" multiple accept="' + this.options.extensions + '" title="' + this.options.strings.add + '"/>' +
                '</div>'
        } else {
            inner_html =
                '<p>' + this.options.strings.incompatible_browser + '</p>';
        }
        this.popup = $(
            '<div id="files_repository_modal" class="modalWrapper">' +
                '<div class="modal">' +
                    '<button type="button" class="btn close">x</button>' +
                    '<p><b>' + this.options.strings.caption + '</b></p>' +
                    inner_html +
                '</div>' +
            '</div>'
        );
        this.popup.find('button.close').click(this.close.bind(this));
        this.popup.find('input[type=file]').change(this.onFileInputChange.bind(this));
        $(document.body).append(this.popup);
        this.popup.show();
    }


    this.getFile = function(filename) {
        if(this.files[this.level]) {
            if(parseInt(filename, 10) == filename) {
                // filename is file number
                var n = 1;
                for(var k in this.files[this.level]) {
                    if(!this.files[this.level].hasOwnProperty(k)) {
                        continue;
                    }
                    if(n == filename) {
                        return this.files[this.level][k];
                    }
                    n++;
                }
            } else if(filename in this.files[this.level]) {
                // filename is string
                return this.files[this.level][filename];
            }
        }
        throw new Error(this.options.strings.file_not_found + filename);
    }


    this.getFileNames = function() {
        return Object.keys(this.files[this.level]);
    }


}