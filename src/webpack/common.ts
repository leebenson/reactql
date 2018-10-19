// Webpack (common)

// ----------------------------------------------------------------------------
// IMPORTS

/* Node */
import * as path from "path";

/* NPM */
import * as lodash from "lodash";
import * as webpack from "webpack";

// ----------------------------------------------------------------------------

const root = path.resolve(__dirname, "..", "..");

// Default merge customiser
export function defaultMerger(obj: any, src: any, key: any, _object: any, _source: any, _stack: any) {

  // Merge rules
  if (key === "rules" && [obj, src].every(v => Array.isArray(v))) {

    src.forEach((v: webpack.Rule, _i: number) => {
      const existingTest = (obj as webpack.Rule[]).find(rule => String(rule.test) === String(v.test));

      if (existingTest) {
        lodash.mergeWith(existingTest, v, defaultMerger);
      } else {
        obj.push(v);
      }
    });

    return obj;
  }

  // By default, merge arrays
  if (Array.isArray(obj)) {
    return obj.concat(src);
  }
}

const isProduction = process.env.NODE_ENV === "production";

// RegExp for file types
export const files = {
  fonts: /\.(woff|woff2|(o|t)tf|eot)$/i,
  images: /\.(jpe?g|png|gif|svg)$/i,
};

// Common config
export default (_ssr: boolean /* <-- not currently used */) => {

  const common: webpack.Configuration = {
    mode: isProduction ? "production" : "development",
    module: {
      rules: [
        // Typescript
        {
          exclude: /node_modules/,
          test: /\.(j|t)sx?$/i,
          use: [
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                plugins: [
                  "@babel/plugin-syntax-dynamic-import",
                  "react-hot-loader/babel",
                  ["styled-components", {
                    displayName: !isProduction,
                    ssr: true,
                  }],
                ],
              },
            },
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  module: "esnext",
                },

                // Avoid typechecking, to speed up bundling. To avoid the
                // complexity of type checking *both* @launch/app and a project's
                // `tsconfig.json`, this should be a userland exercise
                transpileOnly: true,
              },
            },
          ],
        },
      ],
    },

    output: {
      publicPath: "/",
    },

    resolve: {
      alias: {
        "@": path.resolve(root, "src"),
      },
      extensions: [".mjs", ".ts", ".tsx", ".jsx", ".js", ".json"],
      modules: [
        path.resolve(root, "node_modules"),
      ],
    },
  };

  return common;
};