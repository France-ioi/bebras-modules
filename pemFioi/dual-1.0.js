window.Dual = {
    current: 1,
    isSmall: false,
    params: {},
    resizeFunctions: [],

    init: function () {
        console.log('Dual init');
        var params = this.params;
        if (!params.sideurl) {
            console.log('No sideurl provided for Dual.');
            return;
        }

        var that = this;

        $('body').addClass('sidecontent');
        $(window).on('resize', this.onResize.bind(this));
        this.initStyle();

        $(`<div id="sidecontent-buttons">
            <div id="sidecontent-left" onclick="Dual.moveLeft()"><span class="fas fa-chevron-left"></span></div>
            <div id="sidecontent-right" onclick="Dual.moveRight()"><span class="fas fa-chevron-right"></span></div>
        </div>
        <div id="sidecontent-separator"></div>
        <div id="sidecontent-container">
        <div id="sidecontent">
            <iframe id="sidecontent-iframe" width="100%" height="100%" src="" frameborder="0" scrolling="yes"></iframe>
        </div></div>`).appendTo('body');
        $('#task').appendTo('#sidecontent-container');
        var sideUrl = params.sideurl;
        // add a ranhom parameter to the URL to prevent caching
        if (sideUrl.indexOf('?') === -1) {
            sideUrl += '?';
        }
        sideUrl += '&random=' + (new Date()).getTime();
        $('#sidecontent-iframe').attr('src', sideUrl);
        FontsLoader.loadFonts(['fontawesome', 'titillium-web']);


        setTimeout(function () {
            that.onResize();
        }, 10);
    },

    initStyle: function() {
        $('head').append(`
            <style>
body.sidecontent {
  overflow-x: hidden;
  overflow-y: hidden;
}

#sidecontent-container {
  position: absolute;
  left: 0px;
  top: 0px;
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
}

body.sidecontent #task {
  max-width: none;
  overflow-y: auto;
  max-height: 95vh;
  margin: 0;
}

#sidecontent-separator {
  position: fixed;
  top: 0px;
  left: 18px;
  height: 100vh;
  width: 1px;
  background-color: #4a90e2;
  z-index: 1000000;
}

#sidecontent-buttons {
  position: fixed;
  top: 40vh;
  top: calc(50vh - 36px);
  font-size: 36px;
  border-radius: 5px;
  border: 1px solid #4a90e2;
  background-color: #fff;
  z-index: 1000001;
  text-align: center;
}

#sidecontent-buttons div {
  width: 36px;
  height: 36px;
}

#sidecontent {
  height: 100%;
  overflow-y: hidden;
}
  </style>
`);
    },

    onResize: function () {
        this.updateHalves();
        this.updateSeparator();
    },

    addResizeFunction: function (func) {
        if (typeof func === 'function' && this.resizeFunctions.indexOf(func) === -1) {
            this.resizeFunctions.push(func);
        }
    },

    updateHalves: function () {
        var widthAvailable = $('body').width() - 32;
        $('#sidecontent').show();
        $('#task').show();
        if (this.current == 1 && !this.isSmall) {
            $('#sidecontent').css('width', widthAvailable * this.current / 2);
            $('#task').css('width', widthAvailable * (2 - this.current) / 2);
            $('#sidecontent-container').css('justify-content', 'space-between');
        } else if (this.current == 0) {
            $('#sidecontent').hide();
            $('#task').css('width', widthAvailable);
            $('#sidecontent-container').css('justify-content', 'flex-end');
        } else {
            $('#sidecontent').css('width', widthAvailable);
            $('#task').hide();
            $('#sidecontent-container').css('justify-content', 'flex-start');
        }
        this.resizeFunctions.forEach(function (func) {
            func();
        });
    },

    updateSeparator: function () {
        var current = this.current;
        if (current == 1 && this.isSmall) { current = 2; }
        var widthAvailable = $('body').width() - 32;
        var separatorPos = (widthAvailable * current / 2) + 8;
        $('#sidecontent-separator').css('left', separatorPos);
        $('#sidecontent-buttons').css('left', separatorPos - 16);
    },

    onResize: function () {
        this.isSmall = $('body').width() < 700;
        this.updateHalves();
        this.updateSeparator();
    },

    moveLeft: function () {
        if (this.current > 0) {
            this.current--;
            if (this.isSmall) {
                this.current = 0;
            }
            this.updateHalves();
            this.updateSeparator();
        }
    },

    moveRight: function () {
        if (this.current < 2) {
            this.current++;
            if (this.isSmall) {
                this.current = 2;
            }
            this.updateHalves();
            this.updateSeparator();
        }
    }
}

$(Dual.init.bind(Dual));