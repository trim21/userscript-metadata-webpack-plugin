# userscript-metadata-webpack-plugin

`userscript-metadata-webpack-plugin` is a webpack plugin to
generate userscript metadata comments for UserScript.

require:

- webpack 5
- nodejs >= 16

## usage

you can find a full template project in [webpack-userscript-template](https://github.com/Trim21/webpack-userscript-template)

### install

```bash
npm i userscript-metadata-webpack-plugin -D
```

### configure

`webpack.config.js`

```javascript
const pkg = require('../package.json');
const {UserScriptMetaDataPlugin} = require('userscript-metadata-webpack-plugin');


const config = {
  // ...
  // ...
  plugins: [
    new UserScriptMetaDataPlugin({
      metadata: {...},
      test: /\.user\.js$/, // optional, default /\.user\.js$/
    }),
  ],
};

module.exports = config;
```

you can see more details about metadata here <https://github.com/trim21/userscript-metadata-generator>
