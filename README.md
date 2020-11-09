[![npm][npm]][npm-url]
[![node][node]][node-url]
![npm](https://img.shields.io/npm/dw/inject-assets-list-webpack-plugin.svg)

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>Inject Assets List Webpack Plugin</h1>
  <p>Inject assets list into your HTML template</p>
</div>

## Install

- This Plugin dependent on [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin)

```bash
  npm i --save-dev inject-assets-list-webpack-plugin
```

```bash
  yarn add --dev inject-assets-list-webpack-plugin
```

## Usage

The plugin will generate an JS array for you that includes all your `webpack`
assets(RawSource) in the `<head>` using `<script>` tags. Just add the plugin to your `webpack`
config as follows:

**webpack.config.js**

```js
// !! HtmlWebpackPlugin required
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InjectAssetsListWebpackPlugin = require('inject-assets-list-webpack-plugin');

module.exports = {
  entry: 'index.js',
  publicPath: '/',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  plugins: [new HtmlWebpackPlugin(), new InjectAssetsListWebpackPlugin()],
};
```

This will generate a file `dist/index.html` containing the following

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Webpack App</title>
    <script type="text/javascript">
      var __assets = [
        '/img/apple.707709ec.png',
        '/img/banana.51a48343.png',
        /* Webpack assets */
      ];
    </script>
  </head>
  <body>
    <script src="bundle.js"></script>
  </body>
</html>
```

Assets list value format: `<publicPath>name.ext` (eg. /img/banana.51a48343.png)

## Options

You can pass a hash of configuration options to `inject-assets-list-webpack-plugin`.
Allowed values are as follows:

|        Name         |    Type    |  Default   | Description                              |
| :-----------------: | :--------: | :--------: | :--------------------------------------- |
|     **`name`**      | `{String}` | `__assets` | The name to use for the global variable  |
| **`allowPattern`**  | `{RegExp}` | undefined  | Regular expression for allow assets name |
| **`ignorePattern`** | `{RegExp}` | undefined  | Regular expression for ignoring assets   |

Here's an example webpack config illustrating how to use these options

**webpack.config.js**

```js
module.exports = {
  entry: 'index.js',
  publicPath: '/',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new InjectAssetsListWebpackPlugin({
      name: 'myAssets',
      allowPattern: /[png|jpg]/, // Allow `png`, `jpg`
      ignorePattern: /[gif|ttf]/, // ignoring `gif`, `ttf` files
    }),
  ],
};
```

**Sample assets**

```
assets
  ├─ img
  │   ├── apple.png
  │   ├── animation.gif
  │   └── banana.png
  │
  ├─ font
  │   └── my-font.ttf
  │
  └─ content
      ├── post_1.jpg
      ├── post_2.jpg
      └── post_3.jpg
```

**Result**

```js
// in <script>
var myAssets = [
  '/img/apple.707709ec.png',
  '/img/banana.51a48343.png',
  '/content/post_1.6b60786f.jpg',
  '/content/post_2.26053162.jpg',
  '/content/post_3.a416371c.jpg',
];
```

You can uses assets list list like this.

```js
function preload() {
  Promise.allSettled(myAssets.map((uri) => fetch(uri))).then(() => {
    console.log(`${myAssets.length} resource(s) loaded.`);
  });
}

preload(); // 5 resource(s) loaded.
```

## Development

```bash
# Install dependencies
npm i

# Build module
npm run build
```

## Changelog

- `1.0.1` (2020.11.09)
  - Add `allowPattern` option
  - Change `name` property to optional
- `1.0.0` (2020.11.09)
  - First Release!

## Contributors

This project exists thanks to all the people who contribute.

You're free to contribute to this project by submitting [issues](https://github.com/jantimon/inject-assets-list-webpack-plugin/issues) and/or [pull requests](https://github.com/jantimon/inject-assets-list-webpack-plugin/pulls).

[npm]: https://img.shields.io/npm/v/inject-assets-list-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/inject-assets-list-webpack-plugin
[node]: https://img.shields.io/node/v/inject-assets-list-webpack-plugin.svg
[node-url]: https://nodejs.org
