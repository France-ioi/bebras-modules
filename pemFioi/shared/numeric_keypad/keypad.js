var NumericKeypad = {

    bodyStyle: document.createElement('style'),
    bodyMinHeight: 0,
    attachedInputs: [],

    data: {
        value: '',
        initialValue: '',
        callbackModify: function() {},
        callbackFinished: function() {},
    },

    renderKeypad: function() {
        if($('#numeric-keypad').length) { return; }

        // Type of the screen element
        var screenType = NumericKeypad.touchDetected ? 'div' : 'input';

        var html = '' +
            '<div id="numeric-keypad"><div class="keypad">' +
//            '   <div class="keypad-exit" data-btn="C"><span class="fas fa-times"></span></div>' +
            '   <div class="keypad-row">' +
            '       <'+screenType+' class="keypad-value"></'+screenType+'>' +
            '   </div>' +
            '   <div class="keypad-row keypad-row-margin">' +
            '       <div class="keypad-btn" data-btn="1">1</div>' +
            '       <div class="keypad-btn" data-btn="2">2</div>' +
            '       <div class="keypad-btn" data-btn="3">3</div>' +
            '   </div>' +
            '   <div class="keypad-row">' +
            '       <div class="keypad-btn" data-btn="4">4</div>' +
            '       <div class="keypad-btn" data-btn="5">5</div>' +
            '       <div class="keypad-btn" data-btn="6">6</div>' +
            '   </div>' +
            '   <div class="keypad-row">' +
            '       <div class="keypad-btn" data-btn="7">7</div>' +
            '       <div class="keypad-btn" data-btn="8">8</div>' +
            '       <div class="keypad-btn" data-btn="9">9</div>' +
            '   </div>' +
            '   <div class="keypad-row">' +
            '       <div class="keypad-btn" data-btn="0">0</div>' +
            '       <div class="keypad-btn" data-btn=".">.</div>' +
            '       <div class="keypad-btn" data-btn="-">+/-</div>' +
            '   </div>' +
            '   <div class="keypad-row keypad-row-margin">' +
            '       <div class="keypad-btn keypad-btn-r" data-btn="R"><span class="fas fa-backspace"></span></div>' +
            '       <div class="keypad-btn keypad-btn-v" data-btn="V"><span class="fas fa-check-circle"></span></div>' +
            '   </div>' +
            '</div></div>';
        $('body').append(html);
        $('#numeric-keypad').on('click keydown', this.handleKeypadKey.bind(this));
        document.head.appendChild(this.bodyStyle);
    },

    handleKeypadKey: function(e) {
        // Update if we detected a touch event
        if ($('input.keypad-value').length && NumericKeypad.touchDetected) {
            $('input.keypad-value').replaceWith('<div class="keypad-value"></div>');
        }

        var finished = false;

        var btn = null;
        if(e && e.type == 'click') {
            // Click on buttons
            var btn = $(e.target).closest('div.keypad-btn, div.keypad-exit').attr('data-btn');
            if(!btn && $(e.target).closest('div.keypad').length == 0) {
                // Click outside of the keypad
                finished = true;
            }
        } else if(e && e.type == 'keydown') {
            // Key presses
            // Note : keyCode is deprecated, but there aren't good
            // cross-browser replacements as of now.
            if(e.key && /^\d$/.test(e.key)) {
                btn = e.key;
            } else if(e.key == 'Backspace' || e.keyCode == 8) {
                btn = 'R';
            } else if(e.key == 'Enter' || e.keyCode == 13) {
                btn = 'V';
            } else if(e.key == 'Escape' || e.keyCode == 27) {
                btn = 'C';
            } else if(e.key == '.' || e.key == ',' || e.keyCode == 110 || e.keyCode == 188 || e.keyCode == 190) {
                btn = '.';
            } else if(e.key == '-' || e.keyCode == 54 || e.keyCode == 109) {
                btn = '-';
            } else if(e.keyCode >= 96 && e.keyCode <= 105) {
                var btn = '' + (e.keyCode - 96);
            }
            e.preventDefault();
        }

        var data = this.data;
        if(btn == 'R') {
            data.value = data.value.substring(0, data.value.length - 1);
            if(data.value == '' || data.value == '-') { data.value = '0'; }
        } else if(btn == 'C') {
            data.value = data.initialValue;
            finished = true;
        } else if(btn == 'V') {
            if(data.value == '') { data.value = '0'; }
            finished = true;
        } else if(btn == '0') {
            data.value += '0';
        } else if(btn == '-') {
            if(data.value == '') {
                data.value = '0';
            }
            if(data.value[0] == '-') {
                data.value = data.value.substring(1);
            } else {
                data.value = '-' + data.value;
            }
        } else if(btn == '.') {
            if(data.value == '') {
                data.value = '0';
            }
            if(data.value.indexOf('.') == -1) {
                data.value += '.';
            }
        } else if(btn) {
            data.value += btn;
        }

        while(data.value.length > 1 && data.value.substring(0, 1) == '0' && data.value.substring(0, 2) != '0.') {
            data.value = data.value.substring(1);
        }
        while(data.value.length > 2 && data.value.substring(0, 2) == '-0' && data.value.substring(0, 3) != '-0.') {
            data.value = '-' + data.value.substring(2);
        }

        if(data.value.length > 16) {
            data.value = data.value.substring(0, 16);
        }
        else if(data.value.length > 12) {
            $('.keypad-value').addClass('keypad-value-small');
        } else {
            $('.keypad-value').removeClass('keypad-value-small');
        }

        var displayValue = data.value == '' ? '0' : data.value;
        $('input.keypad-value').val(displayValue);
        $('div.keypad-value').text(displayValue);

        if(finished) {
            $('#numeric-keypad').hide();
            // Second argument could be !!btn if we want to be able to click on
            // the block's input
            var finalValue = data.value == '' ? data.initialValue : data.value;
            data.callbackFinished(parseFloat(finalValue), true);
            return;
        } else if(e !== null) {
            data.callbackModify(parseFloat(data.value || 0));
        }
        $('input.keypad-value').focus();
    },


    positionKeypad: function(position) {
        $('#numeric-keypad .keypad').css('top', position.top).css('left', position.left);
    },


    displayKeypad: function(initialValue, position, callbackModify, callbackFinished) {
        this.renderKeypad();
        this.positionKeypad(position);
        $('#numeric-keypad').show();
        this.data = {
            value: '',
            initialValue: initialValue,
            callbackModify: callbackModify,
            callbackFinished: callbackFinished
        };
        this.handleKeypadKey(null);
    },


    attach: function(input) {
        var self = this;

        // Make sure the body has enough height for the keypad
        this.bodyMinHeight = Math.max(this.bodyMinHeight, (input.offset().top || 0) + 272);
        this.bodyStyle.innerText = 'body, #container { min-height: ' + this.bodyMinHeight + 'px; }';
        $('#container').css('padding-bottom', '110px');

        if (self.touchDetected) {
            input.attr('inputmode', 'none');
            input.attr('readonly', 'readonly');
        }
        self.attachedInputs.push(input);

        input.on('focus', function() {
            if (self.touchDetected) {
                input.blur();
            }   
            self.renderKeypad();
            $('#numeric-keypad').show();
            var position = input.offset();
            self.positionKeypad(position);
            var v = input.val();
            self.data = {
                value: v,
                initialValue: v || '0',
                callbackModify: function(v) { 
                    input.val(v); 
                },
                callbackFinished: function(v) { 
                    input.val(v); 
                }
            };
            self.handleKeypadKey(null);
        });
    },

    detectTouchInit: function () {
        var self = this;
        var detectTouch = function () {
            self.touchDetected = true;
            window.removeEventListener('touchstart', detectTouch);
            for (var i = 0; i < self.attachedInputs.length; i++) {
                self.attachedInputs[i].attr('inputmode', 'none').attr('readonly', 'readonly');
            }
        }
        window.addEventListener('touchstart', detectTouch);
    }
}

NumericKeypad.detectTouchInit();