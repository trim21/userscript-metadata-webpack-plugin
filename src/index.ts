import { ConcatSource } from 'webpack-sources';
import * as ModuleFilenameHelpers from 'webpack/lib/ModuleFilenameHelpers';
import * as Compilation from 'webpack/lib/Compilation';

function longestLength(a) {
  return a.reduce(function (a, b) {
    return a.length > b.length ? a : b;
  }).length;
}

function parseAuthor(author) {
  if (typeof author === 'string') return author;

  let a = author['name'];
  if (author['email']) {
    a += ' <' + author['email'] + '>';
  }
  if (author['url']) {
    a += ' (' + author['url'] + ')';
  }

  return a;
}

export function generateMetadataBlock(metadata: {
  [keys: string]: string | string[] | undefined | null | Object;
}): string {
  let pad = longestLength(Object.keys(metadata)) + 3;

  let block = '';
  for (let key in metadata) {
    if (metadata.hasOwnProperty(key)) {
      let value = metadata[key];

      if (key === 'author') {
        if (value === undefined || value === null) {
          continue;
        }

        value = parseAuthor(value);
      }

      let values = value;

      if (values) {
        if (typeof values === 'object' && !Array.isArray(values)) {
          let subLongest = longestLength(Object.keys(values));

          for (const [itemKey, itemValue] of Object.entries(values)) {
            block += '// @' + key.padEnd(pad) + `${itemKey.padEnd(subLongest)} ${itemValue}` + '\n';
          }
        } else {
          if (Array.isArray(values)) {
            for (let i = 0; i < values.length; i++) {
              block += '// @' + key.padEnd(pad) + values[i] + '\n';
            }
          } else {
            block += '// @' + key.padEnd(pad) + values + '\n';
          }
        }
      } else {
        block += '// @' + key + '\n';
      }
    }
  }
  return '// ==UserScript==\n' + block + '// ==/UserScript==';
}

export default class UserScriptMetaDataPlugin {
  private readonly header: string;
  private readonly test: RegExp;

  /**
   * Plugin to prepend UserScript Metadata.
   * @param metadata metadata object, required
   * @param test file pattern, default `/\.user\.js$/`
   */
  constructor({ metadata, test = /\.user\.js$/ }: { metadata: {}; test: string | RegExp | undefined }) {
    if (metadata == undefined) {
      throw new TypeError('Must pass "metadata"');
    }

    this.header = generateMetadataBlock(metadata) + '\n\n';

    if (typeof test === 'string' || test instanceof String) {
      this.test = new RegExp(test);
    } else {
      this.test = test;
    }
  }

  apply(compiler) {
    const header = this.header;
    const tester = { test: this.test };

    compiler.hooks.compilation.tap('UserScriptMetaDataPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'UserScriptMetaDataPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          compilation.chunks.forEach((chunk) => {
            chunk.files.forEach((file) => {
              if (ModuleFilenameHelpers.matchObject(tester, file)) {
                compilation.updateAsset(file, (old) => new ConcatSource(String(header), '\n', old));
              }
            });
          });
        },
      );
    });
  }
}
