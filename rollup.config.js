import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
export default {
  input: "lib/index.js",
  external: ["joi", "boom", "assert", "crypto", "buffer-equal-constant-time"],
  plugins: [
    babel({
      babelrc: false,
      exclude: ["./node_modules/**", "*.json"],
      presets: [["env", { modules: false, targets: { node: 8 } }]]
    }),
    json({
      preferConst: true,
      indent: ""
    })
  ],
  output: [
    { file: "dist/index.cjs.js", format: "cjs", sourcemap: true },
    { file: "dist/index.es.js", format: "es", sourcemap: true }
  ]
};
