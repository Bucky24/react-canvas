"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Image = exports.Shape = exports.Text = exports.Container = exports.Canvas = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Canvas =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Canvas, _React$Component);

  function Canvas(props) {
    var _this;

    _classCallCheck(this, Canvas);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Canvas).call(this, props));
    _this.state = {
      context: null
    };
    return _this;
  }

  _createClass(Canvas, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        context: this.state.context
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement("canvas", {
        ref: function ref(c) {
          if (_this2.canvas !== c && c) {
            _this2.canvas = c;

            _this2.setState({
              context: c ? c.getContext("2d") : null
            });
          }
        },
        width: this.props.width,
        height: this.props.height
      }, this.props.children);
    }
  }]);

  return Canvas;
}(_react.default.Component);

exports.Canvas = Canvas;
;
Canvas.childContextTypes = {
  context: _propTypes.default.object
};

var Container = function Container(_ref) {
  var children = _ref.children;
  return _objectSpread({}, children);
};

exports.Container = Container;
Container.contextTypes = Canvas.childContextTypes;

var Text = function Text(_ref2, _ref3) {
  var children = _ref2.children,
      x = _ref2.x,
      y = _ref2.y;
  var context = _ref3.context;

  if (!context) {
    return null;
  }

  context.save();
  context.fillText(children, x, y);
  context.restore();
  return null;
};

exports.Text = Text;
Text.contextTypes = Canvas.childContextTypes;

var Shape = function Shape(_ref4, _ref5) {
  var x = _ref4.x,
      y = _ref4.y,
      points = _ref4.points,
      color = _ref4.color,
      fill = _ref4.fill;
  var context = _ref5.context;

  if (points.length < 3 || !context) {
    return null;
  }

  context.save();
  context.fillStyle = color;
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(points[0].x + x, points[0].y + y);

  for (var i = 1; i < points.length; i++) {
    context.lineTo(points[i].x + x, points[i].y + y);
  }

  context.closePath();
  if (fill) context.fill();
  context.stroke();
  context.restore();
  return null;
};

exports.Shape = Shape;
Shape.contextTypes = Canvas.childContextTypes;

var Image =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Image, _React$Component2);

  function Image(props) {
    var _this3;

    _classCallCheck(this, Image);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Image).call(this, props));
    _this3.state = {
      loaded: false,
      imageHandle: null
    };
    return _this3;
  }

  _createClass(Image, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          src = _this$props.src,
          x = _this$props.x,
          y = _this$props.y,
          width = _this$props.width,
          height = _this$props.height;
      var context = this.context.context;

      if (!context) {
        return null;
      }

      var finishLoading = function finishLoading() {
        context.drawImage(img, x, y, width, height);
      };

      var body = document.getElementsByTagName("body")[0];
      var img = document.createElement("img");
      img.src = src;
      img.onload = finishLoading;

      if (img.loaded) {
        finishLoading();
      }

      body.append(img);
      return null;
    }
  }]);

  return Image;
}(_react.default.Component);

exports.Image = Image;
;
Image.contextTypes = Canvas.childContextTypes;