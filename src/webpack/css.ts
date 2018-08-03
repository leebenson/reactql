// Webpack (CSS style loading)

// ----------------------------------------------------------------------------
// IMPORTS

/* NPM */
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Loader } from "webpack";

// ----------------------------------------------------------------------------

// Types
type ModuleSettings = [string, { modules: boolean }];

export interface IPostCSSConfig {
  exec?: boolean;
  parser?: string | object;
  syntax?: string | object;
  plugins?: any[] | ((loader: any) => any[]);
  sourceMap?: string | boolean;
}

export interface IStylesConfig {
  postcss?: boolean | IPostCSSConfig;
}

export interface IRule {
  ext: string;
  use: Loader[];
}

// Returns string RegEx and modules settings based on style file extension
function getExtensionSettings(ext: string): ModuleSettings[] {
  return [
    [`^(?!.*\\.global\\.${ext}$).*\\.${ext}$`, { modules: true }],
    [`\\.global\\.${ext}$`, { modules: false }],
  ];
}

// Rules configuration for each style file extension
export const rules: IRule[] = [
  {
    ext: "css",
    use: [],
  },
  {
    ext: "s(c|a)ss",
    use: [
      {
        loader: "resolve-url-loader",
      },
      {
        loader: "sass-loader",
        options: {
          sourceMap: true,
        },
      },
    ],
  },
  {
    ext: "less",
    use: ["less-loader"],
  },
];

const isProduction = process.env.NODE_ENV === "production";

// Create generator to get rules
export default function *css(isClient = true) {

  // Source maps depend on us being in development
  const sourceMap = !isProduction;

  for (const loader of rules) {
    // Iterate over CSS/SASS/LESS and yield local and global mod configs
    for (const [test, modules] of getExtensionSettings(loader.ext)) {

      // Build the use rules
      const use = [
        // CSS hot loading on the client, in development
        (isClient && !isProduction) && "css-hot-loader",

        // Add MiniCSS if we're on the client
        isClient && MiniCssExtractPlugin.loader,

        // Set-up `css-loader`
        {
          // If we're on the server, we only want to output the name
          loader: isClient ? "css-loader" : "css-loader/locals",

          options: {
            // Calculate how many loaders follow this one
            importLoaders: loader.use.length + 1,

            // Format for 'localised' CSS modules
            localIdentName: "[local]-[hash:base64]",

            // No need to minimize-- CSSNano already did it for us
            minimize: false,

            // Add sourcemaps if we're in dev
            sourceMap,

            // Specify modules options
            ...modules,
          },
        },

        // Add PostCSS
        {
          loader: "postcss-loader",
          options: {
            ident: "postcss",
            plugins() {
              return [
                // TODO - MAKE PLUGINS WORK WITH SASS!
                require("postcss-cssnext")({
                  features: {
                      autoprefixer: false,
                    },
                  },
                ),
                require("cssnano")(),
              ];
            },
            // Enable sourcemaps in development
            sourceMap,
          },
        },

        // Copy over the loader's specific rules
        ...loader.use,
      ];

      // Yield the full rule
      yield {
        test: new RegExp(test),

        // Remove all falsy values
        use: use.filter(l => l) as Loader[],
      };
    }
  }
}
