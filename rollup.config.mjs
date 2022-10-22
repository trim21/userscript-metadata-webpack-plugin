import typescript from "rollup-plugin-typescript2";
import externals from "rollup-plugin-node-externals";
import pkg from "./package.json" assert { type: "json" };

export default {
  input: "./src/index.ts",
  plugins: [
    externals(),
    typescript({
      tsconfig: "tsconfig.json",
      // useTsconfigDeclarationDir: true,
    }),
  ],
  output: [
    // ES module (for bundlers) build.
    {
      format: "esm",
      file: pkg.module,
    },
    // CommonJS (for Node) build.
    {
      format: "cjs",
      file: pkg.main,
    },
  ],
};
