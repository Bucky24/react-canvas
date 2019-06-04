"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasComponent = exports.Image = exports.Shape = exports.Text = exports.Container = exports.Canvas = exports.ButtonTypes = exports.EventTypes = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _handlerToProps;

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

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EventTypes = {
  MOVE: 'mousemove',
  MOUSE_DOWN: 'mousedown',
  MOUSE_UP: 'mouseup',
  KEY_DOWN: 'keydown',
  KEY_UP: 'keyup'
};
exports.EventTypes = EventTypes;
var ButtonTypes = {
  LEFT: 'left',
  MIDDLE: 'middle',
  RIGHT: 'right' // 0=left, 1=middle, 2=right

};
exports.ButtonTypes = ButtonTypes;
var ButtonMap = [ButtonTypes.LEFT, ButtonTypes.MIDDLE, ButtonTypes.RIGHT];

function drawShape(x, y, context, points, color, fill) {
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
}

var okCodes = ['Space'];

function getChar(_ref) {
  var key = _ref.key,
      code = _ref.code;

  if (code.indexOf('Key') === 0) {
    return key;
  }

  if (okCodes[code]) {
    return key;
  } // if not key and not in map, then no char for it

}

function getCode(_ref2) {
  var code = _ref2.code;
  return code;
}

var handlerToProps = (_handlerToProps = {}, _defineProperty(_handlerToProps, EventTypes.MOVE, 'onMove'), _defineProperty(_handlerToProps, EventTypes.MOUSE_DOWN, 'onMouseDown'), _defineProperty(_handlerToProps, EventTypes.MOUSE_UP, 'onMouseUp'), _handlerToProps);

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
    _this.reattachListeners = _this.reattachListeners.bind(_assertThisInitialized(_this));
    _this.handleMouseMove = _this.handleMouseMove.bind(_assertThisInitialized(_this));
    _this.handleMouseUp = _this.handleMouseUp.bind(_assertThisInitialized(_this));
    _this.handleMouseDown = _this.handleMouseDown.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    _this.handleKeyUp = _this.handleKeyUp.bind(_assertThisInitialized(_this));
    _this.registerListener = _this.registerListener.bind(_assertThisInitialized(_this));
    _this.unregisterListener = _this.unregisterListener.bind(_assertThisInitialized(_this)); // map of event to array of function callbacks

    _this.listeners = {};
    return _this;
  }

  _createClass(Canvas, [{
    key: "registerListener",
    value: function registerListener(event, fn) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }

      this.listeners[event].push(fn);
    }
  }, {
    key: "unregisterListener",
    value: function unregisterListener(event, fn) {
      if (!this.listeners[event]) {
        return;
      }

      var index = this.listeners[event].indexOf(fn);
      if (index < 0) return;
      this.listeners[event].splice(index, 1);
    }
  }, {
    key: "getChildContext",
    value: function getChildContext() {
      return {
        context: this.state.context,
        registerListener: this.registerListener,
        unregisterListener: this.unregisterListener
      };
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(newProps) {
      if (newProps.width !== this.canvas.width) {
        this.canvas.width = newProps.width;
      }

      if (newProps.height !== this.canvas.height) {
        this.canvas.height = newProps.height;
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.width !== this.canvas.width) {
        this.canvas.width = this.props.width;
      }

      if (this.props.height !== this.canvas.height) {
        this.canvas.height = this.props.height;
      }
    }
  }, {
    key: "reattachListeners",
    value: function reattachListeners() {
      // remove previous event handlers. this is so we avoid
      // double and triple triggering events
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mouseup', this.handleMouseDown);
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      this.canvas.addEventListener('mousemove', this.handleMouseMove);
      this.canvas.addEventListener('mousedown', this.handleMouseDown);
      this.canvas.addEventListener('mouseup', this.handleMouseUp);
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      this.triggerEvent(EventTypes.MOVE, {
        x: event.clientX,
        y: event.clientY
      });
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(event) {
      this.triggerEvent(EventTypes.MOUSE_DOWN, {
        x: event.clientX,
        y: event.clientY,
        button: ButtonMap[event.button]
      });
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(event) {
      this.triggerEvent(EventTypes.MOUSE_UP, {
        x: event.clientX,
        y: event.clientY,
        button: ButtonMap[event.button]
      });
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event) {
      this.triggerEvent(EventTypes.KEY_DOWN, {
        char: getChar(event),
        code: getCode(event)
      });
    }
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(event) {
      this.triggerEvent(EventTypes.KEY_UP, {
        char: getChar(event),
        code: getCode(event)
      });
    }
  }, {
    key: "triggerEvent",
    value: function triggerEvent(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(function (fn) {
          fn(data);
        });
      }

      if (handlerToProps[event]) {
        var propName = handlerToProps[event];
        var propFn = this.props[propName];

        if (propFn) {
          propFn(data);
        }
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
              }, function () {
                _this2.reattachListeners();
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
  context: _propTypes.default.object,
  registerListener: _propTypes.default.func,
  unregisterListener: _propTypes.default.func
};

var Container = function Container(_ref3) {
  var children = _ref3.children;

  if (Array.isArray(children)) {
    return _toConsumableArray(children);
  } else {
    return children;
  }
};

exports.Container = Container;
Container.contextTypes = Canvas.childContextTypes;

var Text = function Text(_ref4, _ref5) {
  var children = _ref4.children,
      x = _ref4.x,
      y = _ref4.y;
  var context = _ref5.context;

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

var Shape = function Shape(_ref6, _ref7) {
  var x = _ref6.x,
      y = _ref6.y,
      points = _ref6.points,
      color = _ref6.color,
      fill = _ref6.fill;
  var context = _ref7.context;

  if (points.length < 3 || !context) {
    return null;
  }

  drawShape(x, y, context, points, color, fill);
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

var CanvasComponent =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(CanvasComponent, _React$Component3);

  function CanvasComponent(props) {
    var _this4;

    _classCallCheck(this, CanvasComponent);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(CanvasComponent).call(this, props));
    _this4.bounds = null;
    _this4.handleMove = _this4.handleMove.bind(_assertThisInitialized(_this4));
    _this4.handleUp = _this4.handleUp.bind(_assertThisInitialized(_this4));
    _this4.handleDown = _this4.handleDown.bind(_assertThisInitialized(_this4));
    _this4.onKeyDown = _this4.onKeyDown.bind(_assertThisInitialized(_this4));
    _this4.onKeyUp = _this4.onKeyUp.bind(_assertThisInitialized(_this4));
    return _this4;
  }

  _createClass(CanvasComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.context.registerListener(EventTypes.MOVE, this.handleMove);
      this.context.registerListener(EventTypes.MOUSE_UP, this.handleUp);
      this.context.registerListener(EventTypes.MOUSE_DOWN, this.handleDown);
      this.context.registerListener(EventTypes.KEY_DOWN, this.onKeyDown);
      this.context.registerListener(EventTypes.KEY_DOWN, this.onKeyUp);
    }
  }, {
    key: "insideMe",
    value: function insideMe(x, y) {
      if (!this.bounds) {
        return false;
      }

      return x > this.bounds.x && x < this.bounds.x + this.bounds.width && y > this.bounds.y && y < this.bounds.y + this.bounds.height;
    }
  }, {
    key: "handleMove",
    value: function handleMove(data) {
      var insideMe = this.insideMe(data.x, data.y);
      this.onMouseMove(data, insideMe);
    }
  }, {
    key: "handleUp",
    value: function handleUp(data) {
      var insideMe = this.insideMe(data.x, data.y);
      this.onMouseUp(data, insideMe);
    }
  }, {
    key: "handleDown",
    value: function handleDown(data) {
      var insideMe = this.insideMe(data.x, data.y);
      this.onMouseDown(data, insideMe);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.context.unregisterListener(EventTypes.MOVE, this.handleMove);
      this.context.unregisterListener(EventTypes.MOUSE_UP, this.handleUp);
      this.context.unregisterListener(EventTypes.MOUSE_DOWN, this.handleDown);
      this.context.unregisterListener(EventTypes.KEY_DOWN, this.onKeyDown);
      this.context.unregisterListener(EventTypes.KEY_DOWN, this.onKeyUp);
    } // stubs

  }, {
    key: "onMouseMove",
    value: function onMouseMove() {}
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {}
  }, {
    key: "onMouseDown",
    value: function onMouseDown() {}
  }, {
    key: "onKeyDown",
    value: function onKeyDown() {}
  }, {
    key: "onKeyUp",
    value: function onKeyUp() {}
  }]);

  return CanvasComponent;
}(_react.default.Component);

exports.CanvasComponent = CanvasComponent;
CanvasComponent.contextTypes = Canvas.childContextTypes;