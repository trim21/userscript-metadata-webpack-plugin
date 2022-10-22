import type { Compiler } from 'webpack';
import { ModuleFilenameHelpers, Compilation } from 'webpack';
import { ConcatSource, Source } from 'webpack-sources';
import generateMetadataBlock from 'userscript-metadata-generator';

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

    if (typeof test === 'string') {
      this.test = new RegExp(test);
    } else {
      this.test = test;
    }
  }

  apply(compiler: Compiler) {
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
                // @ts-ignore
                compilation.updateAsset(file, (old: Source) => new ConcatSource(this.header, old));
              }
            });
          });
        },
      );
    });
  }
}
