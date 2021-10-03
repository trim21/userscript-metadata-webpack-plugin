const pkg = require('../package.json')

module.exports = {
  name: pkg.name,
  namespace: 'https://trim21.me/',
  version: pkg.version,
  author: pkg.author,
  source: pkg.repository.url,
  supportURL: pkg.repository.url + '/issues',
  license: 'MIT',
  match: [
    'https://bgm.tv/subject/*/edit',
    'https://bangumi.tv/subject/*/edit',
  ],
  require: [
    `https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js`,
    `https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html.min.js`,
    `https://cdn.jsdelivr.net/npm/diff/dist/diff.min.js`,
  ],
  grant: [
    'GM_xmlhttpRequest',
  ],
  connect: [
    'example.com',
    'www.example.com',
  ],
  'resource': {
    A: 'https://resource.a',
    BB: 'https://resource.b',
  },
  'run-at': 'document-end',
}
