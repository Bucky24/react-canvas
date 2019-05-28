"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Image = exports.Shape = exports.Text = exports.Container = exports.Canvas = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      if (this.props.width !== this.canvas.width) {
        this.canvas.width = this.props.width;
      }

      if (this.props.height !== this.canvas.height) {
        this.canvas.height = this.props.height;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement("canvas", {
        ref: function ref(c) {
          if (c) {
            var newContext = c.getContext('2d');

            if (_this2.state.context !== newContext) {
              _this2.canvas = c;

              _this2.setState({
                context: newContext
              });
            }
          }
        }
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

  if (Array.isArray(children)) {
    return _toConsumableArray(children);
  } else {
    return children;
  }
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
var imageMap = {};

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

      var img;

      var finishLoading = function finishLoading() {
        var image = imageMap[src];
        context.drawImage(image, x, y, width, height);
      };

      if (imageMap[src]) {
        finishLoading(imageMap[src]);
      } else {
        var body = document.getElementsByTagName("body")[0];

        var _img = document.createElement("img");

        _img.src = src;

        _img.onload = function () {
          imageMap[src] = _img;
          finishLoading();
        };

        if (_img.loaded) {
          imageMap[src] = _img;
          finishLoading();
        }

        _img.style.display = 'none';
        body.append(_img);
      }

      return null;
    }
  }]);

  return Image;
}(_react.default.Component);

exports.Image = Image;
;
Image.contextTypes = Canvas.childContextTypes;