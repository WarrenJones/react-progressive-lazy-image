"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _intersectionObserverPolyfill = _interopRequireDefault(require("intersection-observer-polyfill"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ProgressiveLazyImage =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ProgressiveLazyImage, _React$Component);

  function ProgressiveLazyImage(props) {
    var _this;

    _classCallCheck(this, ProgressiveLazyImage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProgressiveLazyImage).apply(this, arguments));
    _this.state = _this._getInitialState(props);
    _this.loadImage = _this.loadImage.bind(_assertThisInitialized(_this));
    _this.onLoad = _this.onLoad.bind(_assertThisInitialized(_this));
    _this.setImageWithDelay = _this.setImageWithDelay.bind(_assertThisInitialized(_this));
    _this.setImage = _this.setImage.bind(_assertThisInitialized(_this)); // this.checkAndLoad = this.checkAndLoad.bind(this);

    _this.insideViewportCb = _this.insideViewportCb.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ProgressiveLazyImage, [{
    key: "_getInitialState",
    value: function _getInitialState() {
      return {
        loading: true,
        error: false,
        showingImage: "",
        alreadyLoaded: false
      };
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.canLoadRightNow && !this.props.canLoadRightNow) {
        this.loadImage(nextProps.src);
      }
    }
  }, {
    key: "insideViewportCb",
    value: function insideViewportCb(entries) {
      var _this2 = this;

      entries.forEach(function (element) {
        //在viewport里面
        if (element.intersectionRatio > 0 && !_this2.state.alreadyLoaded) {
          _this2.loadImage(_this2.props.src);
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          src = _this$props.src,
          needLazyUtilInViewPort = _this$props.needLazyUtilInViewPort,
          canLoadRightNow = _this$props.canLoadRightNow;

      if (needLazyUtilInViewPort) {
        //https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
        try {
          var node = _reactDom["default"].findDOMNode(this);

          this.observer = new _intersectionObserverPolyfill["default"](this.insideViewportCb);
          this.observer.observe(node);
        } catch (err) {
          console.log("err in finding node", err);
        }
      } else {
        if (canLoadRightNow) {
          this.loadImage(src);
        }
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this3 = this;

      var src = this.props.src; // We only invalidate the current image if the src has changed.

      if (src !== prevProps.src) {
        this.setState({
          loading: true
        }, function () {
          _this3.loadImage(src);
        });
      }
    }
  }, {
    key: "loadImage",
    value: function loadImage(src) {
      var _this4 = this;

      // If there is already an image we nullify the onload
      // and onerror props so it does not incorrectly set state
      // when it resolves
      if (this.image) {
        this.image.onload = null;
        this.image.onerror = null;
      }

      var image = new Image();
      this.image = image;
      image.onload = this.onLoad;

      image.onerror = function (e) {
        console.error("image on error", e);

        _this4.setState({
          error: true
        });
      };

      image.src = src;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.image) {
        this.image.onload = null;
        this.image.onerror = null;
      }

      if (this.delayTask) {
        clearTimeout(this.delayTask);
      }

      if (this.observer) {
        this.observer = null;
      }
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      if (this.props.delay) {
        this.setImageWithDelay();
      } else {
        this.setImage();
      }
    }
  }, {
    key: "setImageWithDelay",
    value: function setImageWithDelay() {
      var _this5 = this;

      this.delayTask = setTimeout(function () {
        _this5.setImage();
      }, this.props.delay);
    }
  }, {
    key: "setImage",
    value: function setImage() {
      var _this6 = this;

      // use this.image.src instead of this.props.src to
      // avoid the possibility of props being updated and the
      // new image loading before the new props are available as
      // this.props.
      this.setState({
        showingImage: this.image.src,
        alreadyLoaded: true,
        loading: false
      }, function () {
        if (_this6.props.loaded) {
          _this6.props.loaded(_this6.props.id);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          showingImage = _this$state.showingImage,
          loading = _this$state.loading,
          error = _this$state.error;
      var _this$props2 = this.props,
          placeholder = _this$props2.placeholder,
          className = _this$props2.className,
          onImageClick = _this$props2.onImageClick,
          onError = _this$props2.onError;
      return loading || error ? placeholder : _react["default"].createElement("img", {
        className: className,
        src: showingImage,
        onClick: onImageClick,
        onError: onError
      });
    }
  }]);

  return ProgressiveLazyImage;
}(_react["default"].Component);

exports["default"] = ProgressiveLazyImage;
ProgressiveLazyImage.propTypes = {
  src: _propTypes["default"].string.isRequired,
  //默认图片占位
  placeholder: _propTypes["default"].object.isRequired,
  delay: _propTypes["default"].number,
  className: _propTypes["default"].string,
  //在viewport里面才加载
  needLazyUtilInViewPort: _propTypes["default"].bool,
  //目前是否可以马上加载,用于漫画列表加载时候的判断
  canLoadRightNow: _propTypes["default"].bool,
  id: _propTypes["default"].number,
  loaded: _propTypes["default"].func,
  onImageClick: _propTypes["default"].func,
  onError: _propTypes["default"].func
};
ProgressiveLazyImage.defaultProps = {
  needLazyUtilInViewPort: true,
  canLoadRightNow: true
};