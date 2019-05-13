// Webpack (common)

// ----------------------------------------------------------------------------
// IMPORTS

/* Node */
import path from "path";

/* NPM */
import lodash from "lodash";
import webpack from "webpack";

// ----------------------------------------------------------------------------

const root = path.resolve(__dirname, "..", "..");

// Default merge customiser
export function defaultMerger(
  obj: any,
  src: any,
  key: any,
  _object: any,
  _source: any,
  _stack: any
) {
  // Merge rules
  if (key === "rules" && [obj, src].every(v => Array.isArray(v))) {
    src.forEach((v: webpack.Rule, _i: number) => {
      const existingTest = (obj as webpack.Rule[]).find(
        rule => String(rule.test) === String(v.test)
      );

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
  images: /\.(jpe?g|png|gif|svg)$/i
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
                presets: ["@babel/typescript", "@babel/react"],
                plugins: [
                  ["@babel/proposal-class-properties", { loose: true }],
                  "@babel/proposal-object-rest-spread",
                  "@babel/plugin-syntax-dynamic-import",
                  "react-hot-loader/babel",
                  "emotion"
                ]
              }
            }
          ]
        }
      ]
    },

    output: {
      publicPath: "/"
    },

    resolve: {
      alias: {
        "@": path.resolve(root, "src"),
        "react-dom": "@hot-loader/react-dom"
      },
      extensions: [".mjs", ".ts", ".tsx", ".jsx", ".js", ".json"],
      modules: [path.resolve(root, "node_modules")]
    }
  };

  return common;
};
