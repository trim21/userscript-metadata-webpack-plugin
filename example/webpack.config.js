const pkg = require('../package.json')
const UserScriptMetaDataPlugin = require('userscript-metadata-webpack-plugin')

let metadata = {
  'name': 'UserScript name' || pkg.name,
  'name:zh': '用户脚本名',
  'namespace': pkg.repository.url,
  'version': pkg.version,
  'author': pkg.author, // could be a object { name , email } or string
  'source': pkg.repository.url,
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
