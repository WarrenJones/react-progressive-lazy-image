"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _intersectionObserverPolyfill = require("intersection-observer-polyfill");

var _intersectionObserverPolyfill2 = _interopRequireDefault(_intersectionObserverPolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //inspirations from https://github.com/FormidableLabs/react-progressive-image

//这是intersection的polyfill


var ProgressiveLazyImage = function (_React$Component) {
  _inherits(ProgressiveLazyImage, _React$Component);

  function ProgressiveLazyImage(props) {
    _classCallCheck(this, ProgressiveLazyImage);

    var _this = _possibleConstructorReturn(this, (ProgressiveLazyImage.__proto__ || Object.getPrototypeOf(ProgressiveLazyImage)).apply(this, arguments));

    _this.state = _this._getInitialState(props);
    _this.loadImage = _this.loadImage.bind(_this);
    _this.onLoad = _this.onLoad.bind(_this);
    _this.setImageWithDelay = _this.setImageWithDelay.bind(_this);
    _this.setImage = _this.setImage.bind(_this);
    // this.checkAndLoad = this.checkAndLoad.bind(this);
    _this.insideViewportCb = _this.insideViewportCb.bind(_this);
    return _this;
  }

  _createClass(ProgressiveLazyImage, [{
    key: "_getInitialState",
    value: function _getInitialState() {
      return {
        loading: true,
        error: false,
        showingImage: ""
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
        if (element.intersectionRatio > 0) {
          _this2.loadImage(_this2.props.src);
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _props = this.props,
          src = _props.src,
          needLazyUtilInViewPort = _props.needLazyUtilInViewPort,
          canLoadRightNow = _props.canLoadRightNow;

      if (needLazyUtilInViewPort) {
        //https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
        try {
          var node = _reactDom2.default.findDOMNode(this);
          this.observer = new _intersectionObserverPolyfill2.default(this.insideViewportCb);
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

      var src = this.props.src;
      // We only invalidate the current image if the src has changed.

      if (src !== prevProps.src) {
        this.setState({ loading: true }, function () {
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
        _this4.setState({ error: true });
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
      var _state = this.state,
          showingImage = _state.showingImage,
          loading = _state.loading,
          error = _state.error;
      var _props2 = this.props,
          placeholder = _props2.placeholder,
          className = _props2.className,
          onImageClick = _props2.onImageClick;

      return loading || error ? placeholder : _react2.default.createElement("img", { className: className, src: showingImage, onClick: onImageClick });
    }
  }]);

  return ProgressiveLazyImage;
}(_react2.default.Component);

exports.default = ProgressiveLazyImage;


ProgressiveLazyImage.propTypes = {
  src: _propTypes2.default.string.isRequired,
  //默认图片占位
  placeholder: _propTypes2.default.object.isRequired,
  delay: _propTypes2.default.number,
  className: _propTypes2.default.string,
  //在viewport里面才加载
  needLazyUtilInViewPort: _propTypes2.default.bool,
  //目前是否可以马上加载,用于漫画列表加载时候的判断
  canLoadRightNow: _propTypes2.default.bool,
  id: _propTypes2.default.number,
  loaded: _propTypes2.default.func,
  onImageClick: _propTypes2.default.func
};

ProgressiveLazyImage.defaultProps = {
  needLazyUtilInViewPort: true,
  canLoadRightNow: true
};