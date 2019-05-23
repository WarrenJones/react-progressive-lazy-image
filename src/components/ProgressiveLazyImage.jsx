//inspirations from https://github.com/FormidableLabs/react-progressive-image
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
//这是intersection的polyfill
import IntersectionObserver from 'intersection-observer-polyfill'
export default class ProgressiveLazyImage extends React.Component {
  constructor(props) {
    super(...arguments);
    this.state = this._getInitialState(props);
    this.loadImage = this.loadImage.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.setImageWithDelay = this.setImageWithDelay.bind(this);
    this.setImage = this.setImage.bind(this);
    // this.checkAndLoad = this.checkAndLoad.bind(this);
    this.insideViewportCb = this.insideViewportCb.bind(this);
  }
  _getInitialState() {
    return {
      loading: true,
      error: false,
      showingImage: "",
      alreadyLoaded:false,
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.canLoadRightNow && !this.props.canLoadRightNow) {
      this.loadImage(nextProps.src);
    }
  }

  insideViewportCb(entries) {
    entries.forEach(element => {
      //在viewport里面
      if (element.intersectionRatio >0&&!this.state.alreadyLoaded) {
        this.loadImage(this.props.src);
      }
    });
  }

  componentDidMount() {
    const { src, needLazyUtilInViewPort, canLoadRightNow } = this.props;
    if (needLazyUtilInViewPort) {
      //https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      try {
        const node = ReactDOM.findDOMNode(this);
        this.observer = new IntersectionObserver(this.insideViewportCb);
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

  componentDidUpdate(prevProps) {
    const { src } = this.props;
    // We only invalidate the current image if the src has changed.
    if (src !== prevProps.src) {
      this.setState({ loading: true }, () => {
        this.loadImage(src);
      });
    }
  }
  loadImage(src) {
    // If there is already an image we nullify the onload
    // and onerror props so it does not incorrectly set state
    // when it resolves
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
    const image = new Image();
    this.image = image;
    image.onload = this.onLoad;
    image.onerror = e => {
      console.error("image on error", e);
      this.setState({ error: true });
    };
    image.src = src;
  }

  componentWillUnmount() {
    if (this.image) {
      this.image.onload = null;
      this.image.onerror = null;
    }
    if (this.delayTask) {
      clearTimeout(this.delayTask);
    }
    if(this.observer){
      this.observer = null;
    }
  }

  onLoad() {
    if (this.props.delay) {
      this.setImageWithDelay();
    } else {
      this.setImage();
    }
  }
  setImageWithDelay() {
    this.delayTask = setTimeout(() => {
      this.setImage();
    }, this.props.delay);
  }

  setImage() {
    // use this.image.src instead of this.props.src to
    // avoid the possibility of props being updated and the
    // new image loading before the new props are available as
    // this.props.
    this.setState(
      {
        showingImage: this.image.src,
        alreadyLoaded:true,
        loading: false
      },
      () => {
        if (this.props.loaded) {
          this.props.loaded(this.props.id);
        }
      }
    );
  }

  render() {
    const { showingImage, loading, error } = this.state;
    const { placeholder, className, onImageClick } = this.props;
    return loading || error ? (
      placeholder
    ) : (
      <img className={className} src={showingImage} onClick={onImageClick} />
    );
  }
}

ProgressiveLazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  //默认图片占位
  placeholder: PropTypes.object.isRequired,
  delay: PropTypes.number,
  className: PropTypes.string,
  //在viewport里面才加载
  needLazyUtilInViewPort: PropTypes.bool,
  //目前是否可以马上加载,用于漫画列表加载时候的判断
  canLoadRightNow: PropTypes.bool,
  id: PropTypes.number,
  loaded: PropTypes.func,
  onImageClick: PropTypes.func
};

ProgressiveLazyImage.defaultProps = {
  needLazyUtilInViewPort: true,
  canLoadRightNow: true
};
