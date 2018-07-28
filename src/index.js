const ConcatSource = require('webpack-sources').ConcatSource
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers')

function parseAuthor (author) {
  if (typeof author === 'string') return author

  let a = author['name']
  if (author['email']) {
    a += ' <' + author['email'] + '>'
  }
  if (author['url']) {
    a += ' (' + author['url'] + ')'
  }

  return a
}

/**
 * Generate the user
 * @param {Object.<string, string|string[]|undefined|null>} metadata the metadata.
 * @return {string} the metadata block as a string.
 */
function generateMetadataBlock (metadata) {
  let keys = Object.keys(metadata)
  var longest = keys.reduce(function (a, b) { return a.length > b.length ? a : b })
  let pad = longest.length

  let block = ''
  for (let key in metadata) {
    if (metadata.hasOwnProperty(key)) {
      let values

      if (key !== 'author') {
        values = metadata[key]
      } else {
        values = parseAuthor(metadata[key])
      }

      if (values) {
        if (!Array.isArray(values)) {
          values = [values]
        }
        for (let i = 0; i < values.length; i++) {
          block += '// @' + key.padEnd(pad + 3) + values[i] + '\n'
        }
      } else {
        block += '// @' + key + '\n'
      }
    }
  }
  return '// ==UserScript==\n'
    + block
    + '// ==/UserScript==\n\n'
}

class UserScriptMetaDataPlugin {
  /**
   * Prepend UserScript Metadata to `*.user.js` file
   * @param {Object} options options
   * @param {Object} options.metadata metadata object
   */
  constructor (options) {
    if (typeof options !== 'object') {
      throw new TypeError('Argument "options" must be an object.')
    }
    if (!options.hasOwnProperty('metadata')) {
      throw  new TypeError('"Options" must have property "metadata"')
    }

    this.header = generateMetadataBlock(options.metadata)
    this.test = /\.user\.js$/
  }

  /**
   *
   * @param {webpack.Compiler} compiler
   */
  apply (compiler) {
    const header = this.header
    const tester = { test: this.test }

    compiler.hooks.compilation.tap('UserScriptMetaDataPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tapAsync('UserScriptMetaDataPlugin', (chunks, done) => {
        wrapChunks(compilation, chunks)
        done()
      })
    })

    function wrapFile (compilation, fileName) {
      compilation.assets[fileName] = new ConcatSource(
        String(header),
        compilation.assets[fileName],
      )
    }

    function wrapChunks (compilation, chunks) {
      chunks.forEach(chunk => {
        const args = {
          hash: compilation.hash
        }
        chunk.files.forEach(fileName => {
          if (ModuleFilenameHelpers.matchObject(tester, fileName)) {
            wrapFile(compilation, fileName, args)
          }
        })
      })
    }
  }
}

module.exports = UserScriptMetaDataPlugin
