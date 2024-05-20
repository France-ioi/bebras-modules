const GalaxiaBoard = {
    buttonStatesUpdators: {},
    galaxiaSvg: null,
    galaxiaSvgInline: null,
    initialized: false,
    innerState: {},
    onUserEvent: function() {},

    ledColors: {
        'transparent': '#d3d3d3',
        'green': '#B8E986',
        'red': '#FF001F',
        'blue': '#00C1FF',
        'orange': '#F5A623'
    },

    init: function(selector, onUserEvent) {
        this.onUserEvent = onUserEvent;
        this.importGalaxia(selector);
        return this.updateState.bind(this);
    },

    fetchGalaxiaCard: function (callback) {
        // Cache results
        if (this.galaxiaSvgInline) {
            callback(this.galaxiaSvgInline);
            return;
        }

        const svgPath = (window.modulesPath || '') + 'img/quickpi/galaxia.svg';

        fetch(svgPath)
            .then(response => response.text())
            .then(svgData => {
                this.galaxiaSvgInline = svgData;
                callback(svgData);
            })
    },

    importGalaxia: function(selector) {
        this.fetchGalaxiaCard((svgData) => {
            $(selector).html(svgData).css('user-select', 'none');
            this.galaxiaSvg = $(selector + ' svg');

            this.initInteraction();
            this.displayInnerState();
            this.initialized = true;
        })
    },

    initInteraction: function() {
        this.galaxiaSvg.attr('width', "100%");
        this.galaxiaSvg.attr('height', "100%");

        var buttonIds = ['a', 'b', 'sys'];
        for (var i = 0; i < buttonIds.length; i++) {
            var buttonId = buttonIds[i];
            this.bindPushButton(buttonId);
        }
        var padIds = ['up', 'down', 'left', 'right'];
        for (var i = 0; i < padIds.length; i++) {
            var padId = padIds[i];
            this.bindPadButton(padId);
        }
    },

    bindPushButton: function(buttonId) {
        var that = this;
        var buttons = this.galaxiaSvg.find('#button-' + buttonId + '-top, #button-' + buttonId + '-bot');
        var buttonTop = buttons.filter('#button-' + buttonId + '-top');
        var buttonBot = buttons.filter('#button-' + buttonId + '-bot');
        var colorTop = buttons.filter('#button-' + buttonId + '-top').css('fill');
        var colorBot = buttons.filter('#button-' + buttonId + '-bot').css('fill');
        var buttonDown = function(isSet) {
            buttonTop.css('fill', 'transparent');
            buttonBot.css('fill', colorTop);
            if(isSet !== true && !that.innerState[buttonId]) {
                that.onUserEvent(buttonId, true);
            }
            that.innerState[buttonId] = true;
        }
        var buttonUp = function(isSet) {
            buttonTop.css('fill', colorTop);
            buttonBot.css('fill', colorBot);
            if(isSet !== true && that.innerState[buttonId]) {
                that.onUserEvent(buttonId, false);
            }
            that.innerState[buttonId] = false;
        }
        buttons.mousedown(buttonDown);
        buttons.mouseup(buttonUp);
        buttons.mouseleave(buttonUp);

        this.buttonStatesUpdators[buttonId] = {'down': buttonDown, 'up': buttonUp};
    },

    bindPadButton: function(buttonId) {
        var that = this;
        var button = this.galaxiaSvg.find('#pad-' + buttonId);

        var buttonDown = function (isSet) {
            button.css('fill-opacity', '1');
            if(isSet !== true && !that.innerState[buttonId]) {
                that.onUserEvent(buttonId, true);
            }
            that.innerState[buttonId] = true;
        };
        var buttonUp = function (isSet) {
            button.css('fill-opacity', '0');
            if(isSet !== true && that.innerState[buttonId]) {
                that.onUserEvent(buttonId, false);
            }
            that.innerState[buttonId] = false;
        };
        button.mousedown(buttonDown);
        button.mouseup(buttonUp);
        button.mouseleave(buttonUp);
        this.buttonStatesUpdators[buttonId] = {'down': buttonDown, 'up': buttonUp};
    },

    setLed: function(color) {
        if(!this.initialized) { return; }
        if(this.ledColors[color] !== undefined) {
            color = this.ledColors[color];
        }
        var led = this.galaxiaSvg.find('#led');
        led.css('fill', color);
    },

    setConnected: function(isConnected) {
        if(!this.initialized) { return; }
        var cable = this.galaxiaSvg.find('#cable');
        cable.toggle(isConnected);
    },

    updateState: function(sensor) {
        if(sensor === 'connected') {
            this.innerState.connected = true;
            this.setConnected(true);
        } else if(sensor === 'disconnected') {
            this.innerState.connected = false;
            this.setConnected(false);
        } else if(sensor.name.substring(0, 3) == 'btn') {
            var button = sensor.name.substring(3).toLowerCase();
            this.innerState[button] = sensor.state;
            if(!this.initialized) { return; }
            this.buttonStatesUpdators[button][sensor.state ? 'down' : 'up'](true);
        } else if(sensor.type === 'led') {
            if(sensor.state) {
                this.innerState.led = sensor.subType || 'green';
            } else {
                this.innerState.led = 'transparent';
            }
            this.setLed(this.innerState.led);
        }
    },

    displayInnerState: function() {
        // The display might be reset so we need to keep it up to date
        for(var id in this.buttonStatesUpdators) {
            this.buttonStatesUpdators[id][this.innerState[id] ? 'down' : 'up'](true);
        }
        this.setLed(this.innerState.led || 'transparent');
        this.setConnected(this.innerState.connected);
    }
}