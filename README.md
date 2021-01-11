# Bookshop Addon HTML

This addon for Bookshop adds a tab that displays some import code for each
story. It is forked from [whitespace-se/storybook-addon-html](https://github.com/whitespace-se/storybook-addon-html)

![Animated preview](https://raw.githubusercontent.com/whitespace-se/storybook-addon-html/master/image.gif)

## Getting Started

With NPM:

```sh
npm i --save-dev @robbie-cook/bookshop-addon-import-tab
```

With Yarn:

```sh
yarn add -D @robbie-cook/bookshop-addon-import-tab
```

### Register addon

```js
// .storybook/main.js

module.exports = {
  // ...
  addons: [
    '@robbie-cook/bookshop-addon-import-tab',
    // ...
  ],
};
```
