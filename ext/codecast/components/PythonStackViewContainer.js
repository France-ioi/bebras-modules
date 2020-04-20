var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PythonStackViewContainer = function (_React$Component) {
    _inherits(PythonStackViewContainer, _React$Component);

    function PythonStackViewContainer(props) {
        _classCallCheck(this, PythonStackViewContainer);

        var _this = _possibleConstructorReturn(this, (PythonStackViewContainer.__proto__ || Object.getPrototypeOf(PythonStackViewContainer)).call(this, props));

        _this.getWindowWidth = function () {
            return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
        };

        _this.getWindowHeight = function () {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
        };

        _this.mouseDownHandler = function (e) {
            var rect = _this.ref.current.getBoundingClientRect();

            _this.setState(Object.assign({}, _this.state, {
                dragging: true,
                refLeft: e.pageX - rect.left,
                refTop: e.pageY - rect.top
            }));
        };

        _this.mouseUpHandler = function () {
            _this.setState(Object.assign({}, _this.state, {
                dragging: false
            }));
        };

        _this.mouseMoveHandler = function (mouseX, mouseY) {
            if (_this.state.dragging) {
                var rect = _this.ref.current.getBoundingClientRect();

                var minTop = 0;
                var maxTop = _this.getWindowHeight() - rect.height;
                var minRight = 0;
                var maxRight = _this.getWindowWidth() - rect.width;

                _this.setState(function (state) {
                    var newTop = mouseY - state.refTop;
                    if (newTop < minTop) {
                        newTop = minTop;
                    } else if (newTop > maxTop) {
                        newTop = maxTop;
                    }

                    var newRight = _this.getWindowWidth() - mouseX - rect.width + state.refLeft;
                    if (newRight < minRight) {
                        newRight = minRight;
                    } else if (newRight > maxRight) {
                        newRight = maxRight;
                    }

                    return Object.assign({}, _this.state, {
                        right: newRight,
                        top: newTop
                    });
                });
            }
        };

        _this.toggleCollapsedHandler = function () {
            _this.setState(function (state) {
                return Object.assign({}, state, {
                    collapsed: !state.collapsed
                });
            });
        };

        var MAX_CONTENT_HEIGHT = 225;

        var DESKTOP_TOP_MARGIN = 86;
        var DESKTOP_RIGHT_MARGIN = 36;

        var DESKTOP_MIN_WIDTH = 855;
        var MOBILE_BOTTOM_MENU_HEIGHT = 49;
        var MOBILE_RIGHT_MARGIN = 0;

        var initTop = DESKTOP_TOP_MARGIN;
        var initRight = DESKTOP_RIGHT_MARGIN;
        if (_this.getWindowWidth() < DESKTOP_MIN_WIDTH) {
            initTop = _this.getWindowHeight() - MAX_CONTENT_HEIGHT - MOBILE_BOTTOM_MENU_HEIGHT, initRight = MOBILE_RIGHT_MARGIN;
        }

        _this.ref = React.createRef();
        _this.state = {
            top: initTop,
            right: initRight,
            width: 275,
            maxContentHeight: MAX_CONTENT_HEIGHT,
            dragging: false,
            collapsed: false,
            show: true
        };
        return _this;
    }

    _createClass(PythonStackViewContainer, [{
        key: 'render',
        value: function render() {
            if (!this.props.analysis) {
                return React.createElement(React.Fragment, null);
            }

            var panelClasses = 'skulpt-analysis-container panel panel-default';
            var iconClasses = 'fas fa-minus-square';
            if (this.state.collapsed) {
                panelClasses += ' collapsed';
                iconClasses = 'fas fa-plus-square';
            }

            var display = 'block';
            if (!this.props.show) {
                display = 'none';
            }

            return React.createElement(
                'div',
                { ref: this.ref, style: {
                        top: this.state.top + 'px',
                        right: this.state.right + 'px',
                        width: this.state.width + 'px',
                        display: display
                    }, className: panelClasses },
                React.createElement(
                    'div',
                    {
                        className: 'panel-heading',
                        onMouseDown: this.mouseDownHandler
                    },
                    React.createElement(
                        'div',
                        { className: 'icon', onClick: this.toggleCollapsedHandler },
                        React.createElement('i', { className: iconClasses })
                    ),
                    'Variables'
                ),
                React.createElement(
                    'div',
                    { style: {
                            maxHeight: this.state.maxContentHeight + 'px'
                        }, className: 'panel-body' },
                    React.createElement(PythonStackView, {
                        analysis: this.props.analysis
                    })
                )
            );
        }
    }]);

    return PythonStackViewContainer;
}(React.Component);
