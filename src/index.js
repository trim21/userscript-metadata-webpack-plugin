const ConcatSource = require('webpack-sources').ConcatSource
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers')
const Compilation = require('webpack/lib/Compilation')

function longestLength (a) {
  return a.reduce(function (a, b) { return a.length > b.length ? a : b }).length
}

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
  let pad = longestLength(Object.keys(metadata)) + 3

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
        if (typeof values === 'object' && !Array.isArray(values)) {
          let subLongest = longestLength(Object.keys(values))

          for (const [key, value] of Object.entries(values)) {
            block += '// @' + key.padEnd(pad) + `${key.padEnd(subLongest)} ${value}` + '\n'
          }
        } else {
          if (!Array.isArray(values)) {
            values = [values]
          }
          for (let i = 0; i < values.length; i++) {
            block += '// @' + key.padEnd(pad) + values[i] + '\n'
          }
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
      throw new TypeError('"Options" must have property "metadata"')
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
      compilation.hooks.processAssets.tap(
        {
          name: 'UserScriptMetaDataPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          compilation.chunks.forEach(chunk => {
            chunk.files.forEach(file => {
              if (ModuleFilenameHelpers.matchObject(tester, file)) {
                compilation.updateAsset(
                  file,
                  old => new ConcatSource(String(header), '\n', old)
                )
              }
            })
          })
        })
    })
  }
}

module.exports = UserScriptMetaDataPlugin
