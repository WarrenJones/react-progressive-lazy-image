# SnapShots

### senario1
image-lazyload with placeholder.

![](https://res.unclewarren.cn/scenario1.gif)

### sernario2
image list shows in order.

![](https://res.unclewarren.cn/scenario2.gif)

----

# react-progressive-lazy-image

## Why it's better

 - Use [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) instead of [Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
 - With IntersectionObserver Polyfill
 - very easy to use
 - Thoroughly tested

## Installation

> 1.0.5 is finally out,  it's almost painless to upgrade!

```
$ npm install --save react-progressive-lazy-image
```

## Usage

for senario1
```javascript
import ProgressiveLazyImage from "react-progressive-lazy-image";
const imagePlaceholder = className => (
    <div className={`${className} placeholder`}>
      <Icon img="icon_default" />
    </div>
  );

 <ProgressiveLazyImage
    src={`imagesrc`}
    className={`imageClassName`}
    loaded={this.loaded.bind(this)}
    onImageClick={this.onImageClick.bind(this)}
    placeholder={imagePlaceholder(placeholderClassName)}
    />
```

for senario2

```javascript
import ProgressiveLazyImage from "react-progressive-lazy-image";
const imagePlaceholder = className => (
    <div className={`${className} placeholder`}>
      <Icon img="icon_default" />
    </div>
  );
imagelist.map((data, index) => {
return <ProgressiveImage
              key={data.url}
              needLazyUtilInViewPort={false}
              id={index}
              loaded={()=>{this.setState({nextIndex:nextIndex+1})}}
              canLoadRightNow={index <= this.state.nextIndex}
              src={imagesrc}
              placeholder={mangaPlaceholder}
            />
```
## Special Tips

You should be aware that your component will only be mounted when it's visible in viewport, before that a placeholder will be rendered.

So you can safely send request in your component's `componentDidMount` without worrying about performance loss or add some pretty entering effects.

## Props
```
static propTypes = {
    //imgae src
    src: PropTypes.string.isRequired,
    //placeholder before the image shows
    placeholder: PropTypes.object.isRequired,
    //only need when need to delay load
    delay: PropTypes.number,
    //className of the img
    className: PropTypes.string,
    //only load when inside viewport
    needLazyUtilInViewPort: PropTypes.bool,
    //can load right now,most probably use for list image load in order
    canLoadRightNow: PropTypes.bool,
    //the id of the image,use for callback func loaded
    id: PropTypes.number,
    //when the image loaded successfully
    loaded: PropTypes.func,
    //onImageClick
    onImageClick: PropTypes.func
  };
  
  static defaultProps = {
    //default lazyload and canLoadRightNow
    needLazyUtilInViewPort: true,
    canLoadRightNow: true
  };
 ```

## Contributors

[unlcewarren](https://github.com/WarrenJones)



## License

ISC