const MicrobitBoard = {
    buttonStatesUpdators: {},
    galaxiaSvg: null,
    initialized: false,
    innerState: {},
    onUserEvent: function() {},

    init: function(selector, onUserEvent) {
        this.onUserEvent = onUserEvent;
        this.importGalaxia(selector);
        return this.updateState.bind(this);
    },

    importGalaxia: function(selector) {
        const svgPath = '../bebras-modules/img/quickpi/microbit.svg';

        fetch(svgPath)
            .then(response => response.text())
            .then(svgData => {
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

        var buttonIds = ['a', 'b'];
        for (var i = 0; i < buttonIds.length; i++) {
            var buttonId = buttonIds[i];
            this.bindPushButton(buttonId);
        }
        var padIds = [];
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

    setLedMatrix: function(state) {
        if(!this.initialized) { return; }
        for(var i=0; i<5; i++) {
            for(var j=0; j<5; j++) {
                var led = this.galaxiaSvg.find('#ledmatrix-' + i + '-' + j);
                led.toggle(!!state[i][j]);
            }
        }
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
        } else if(sensor.type === 'ledmatrix') {
            this.innerState.ledmatrix = sensor.state;
            this.setLedMatrix(sensor.state);
        }
    },

    displayInnerState: function() {
        // The display might be reset so we need to keep it up to date
        for(var id in this.buttonStatesUpdators) {
            this.buttonStatesUpdators[id][this.innerState[id] ? 'down' : 'up'](true);
        }
        this.setLedMatrix(this.innerState.ledmatrix || 'transparent');
        this.setConnected(this.innerState.connected);
    }
}