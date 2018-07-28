# userscript-metadata-webpack-plugin

`userscript-metadata-webpack-plugin` is a webpack plugin to generate `userscript metadata` and prepend to file which name matched `*.user.js`

Only work with `webpack 4`

## usage

### install

```bash
npm i userscript-metadata-webpack-plugin -D
```

### configure

```javascript
const pkg = require('../package.json')
const UserScriptMetaDataPlugin = require('userscript-metadata-webpack-plugin')

let metadata = {
  'name': 'UserScript name' || pkg.name,
  'namespace': pkg.repository.url,
  'version': pkg.version,
  'author': pkg.author, // could be a object { name , email } or string
  'source': pkg['repository']['url'],
  'license': pkg.license,
  'match': [
    'www.google.com'
  ],
  'require': [
    'https://code.jquery.com/jquery-3.3.1.min.js',
  ],
  'grant': [
    'GM_addStyle',
    'GM_openInTab',
    'GM_addStyle',
    'GM_xmlhttpRequest',
  ],
  'connect': [
    'localhost',
    'www.google.com'
  ],
  'run-at': 'document-end'
}

const config = {
  plugins: [
    new UserScriptMetaDataPlugin({
      metadata
    })
  ]
}

module.exports = config
```