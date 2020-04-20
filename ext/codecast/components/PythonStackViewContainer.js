"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PythonStackViewContainer = /*#__PURE__*/function (_React$Component) {
  _inherits(PythonStackViewContainer, _React$Component);

  var _super = _createSuper(PythonStackViewContainer);

  function PythonStackViewContainer(props) {
    var _this;

    _classCallCheck(this, PythonStackViewContainer);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "getWindowWidth", function () {
      return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
    });

    _defineProperty(_assertThisInitialized(_this), "getWindowHeight", function () {
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
    });

    _defineProperty(_assertThisInitialized(_this), "mouseDownHandler", function (e) {
      var rect = _this.ref.current.getBoundingClientRect();

      _this.setState(_objectSpread({}, _this.state, {
        dragging: true,
        refLeft: e.pageX - rect.left,
        refTop: e.pageY - rect.top
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "mouseUpHandler", function () {
      _this.setState(_objectSpread({}, _this.state, {
        dragging: false
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "mouseMoveHandler", function (mouseX, mouseY) {
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

          return _objectSpread({}, _this.state, {
            right: newRight,
            top: newTop
          });
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "toggleCollapsedHandler", function () {
      _this.setState(function (state) {
        return _objectSpread({}, state, {
          collapsed: !state.collapsed
        });
      });
    });

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
      collapsed: false
    };
    return _this;
  }

  _createClass(PythonStackViewContainer, [{
    key: "render",
    value: function render() {
      if (!this.props.analysis) {
        return /*#__PURE__*/React.createElement(React.Fragment, null);
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

      return /*#__PURE__*/React.createElement("div", {
        ref: this.ref,
        style: {
          top: this.state.top + 'px',
          right: this.state.right + 'px',
          width: this.state.width + 'px',
          display: display
        },
        className: panelClasses
      }, /*#__PURE__*/React.createElement("div", {
        className: "panel-heading",
        onMouseDown: this.mouseDownHandler
      }, /*#__PURE__*/React.createElement("div", {
        className: "icon",
        onClick: this.toggleCollapsedHandler
      }, /*#__PURE__*/React.createElement("i", {
        className: iconClasses
      })), "Variables"), /*#__PURE__*/React.createElement("div", {
        style: {
          maxHeight: this.state.maxContentHeight + 'px'
        },
        className: "panel-body"
      }, /*#__PURE__*/React.createElement(PythonStackView, {
        analysis: this.props.analysis
      })));
    }
  }]);

  return PythonStackViewContainer;
}(React.Component);

;