# PostCSS Wxss [![Build Status][ci-img]][ci]

[PostCSS] plugin to transpile wxss or acss..

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/IOriens/postcss-wxss.svg
[ci]:      https://travis-ci.org/IOriens/postcss-wxss

```css
@media screen and (min-width: 480px) {
  body {
    background-color: lightgreen;
    animation-name: 'kkk';
  }
}

#main, icon {
  border: 1rpx solid black;
}

ul li, .page, page {
  padding: 5rpx 3rpx;
}
```

```css
@media screen and (min-width: 480px) {
  body {
    background-color: lightgreen;
    animation-name: 'kkk';
  }
}

#main, wx-icon {
  border: %%?1rpx?%% solid black;
}

ul li, .page, body {
  padding: %%?5rpx?%% %%?3rpx?%%;
}
```

## Usage

```js
postcss([ require('postcss-wxss') ])
```

See [PostCSS] docs for examples for your environment.
