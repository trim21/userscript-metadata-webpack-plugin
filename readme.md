# userscript-metadata-webpack-plugin

`userscript-metadata-webpack-plugin` is a webpack plugin to
generate userscript metadata comments for UserScript.

require:

- webpack 5
- nodejs >= 14

when using `webpack 4`, install `userscript-metadata-webpack-plugin==0.0.6`

## usage

you can find a full template project in [webpack-userscript-template](https://github.com/Trim21/webpack-userscript-template)

### install

```bash
npm i userscript-metadata-webpack-plugin -D
```

### configure

`webpack.config.js`

```javascript
const pkg = require("../package.json");
const UserScriptMetaDataPlugin = require("userscript-metadata-webpack-plugin");

let metadata = {
  name: pkg.name,
  namespace: "https://trim21.me/",
  version: pkg.version,
  author: {
    name: "Trim21",
    email: "trim21me@gmail.com",
  },
  source: pkg.repository.url,
  supportURL: pkg.repository.url + "/issues",
  license: "MIT",
  match: ["https://bgm.tv/subject/*/edit", "https://bangumi.tv/subject/*/edit"],
  require: [
    `https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js`,
    `https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html.min.js`,
    `https://cdn.jsdelivr.net/npm/diff/dist/diff.min.js`,
  ],
  grant: ["GM.xmlhttpRequest"],
  connect: ["example.com", "www.example.com"],
  resource: {
    A: "https://resource.a",
    BB: "https://resource.b",
  },
  "run-at": "document-end",
};

const config = {
  // ...
  // ...
  plugins: [
    new UserScriptMetaDataPlugin({
      metadata,
      test: /\.user\.js$/, // optional, default /\.user\.js$/
    }),
  ],
};

module.exports = config;
```

```javascript
// ==UserScript==
// @name         userscript-metadata-webpack-plugin
// @namespace    https://trim21.me/
// @version      0.1.0
// @author       Trim21 <trim21me@gmail.com>
// @source       https://github.com/Trim21/userscript-metadata-webpack-plugin
// @supportURL   https://github.com/Trim21/userscript-metadata-webpack-plugin/issues
// @license      MIT
// @match        https://bgm.tv/subject/*/edit
// @match        https://bangumi.tv/subject/*/edit
// @require      https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html.min.js
// @require      https://cdn.jsdelivr.net/npm/diff/dist/diff.min.js
// @grant        GM.xmlhttpRequest
// @connect      example.com
// @connect      www.example.com
// @resource     A  https://resource.a
// @resource     BB https://resource.b
// @run-at       document-end
// ==/UserScript==

// other js code
```
