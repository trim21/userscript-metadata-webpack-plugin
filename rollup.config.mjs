import fs from 'node:fs';

import { externals } from 'rollup-plugin-node-externals';
import typescript from 'rollup-plugin-typescript2';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default {
  input: './src/index.ts',
  plugins: [
    externals(),
    typescript({
      tsconfig: 'tsconfig.json',
      // useTsconfigDeclarationDir: true,
    }),
  ],
  output: [
    // ES module (for bundlers) build.
    {
      format: 'esm',
      file: pkg.module,
    },
    // CommonJS (for Node) build.
    {
      format: 'cjs',
      file: pkg.main,
    },
  ],
};
