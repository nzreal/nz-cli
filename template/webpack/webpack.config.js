const path = require('path');

const __DEV__ = 'development';
const __PROD__ = 'production';

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvProduction && MiniCssExtractPlugin.loader,
    isEnvDevelopment && require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: false,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: false,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
};

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        enforce: 'pre',
        exclude: /node_module/,
        include: /src/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_module/,
        include: /src/,
        loader: require.resolve('babel-loader'),
        options: { presets: ['@babel/preset-env', '@babel/preset-react'] },
      },
      {
        oneOf: [
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: isEnvProduction && shouldUseSourceMap,
              modules: true,
            }),
            sideEffects: true,
          },
          // {
          //   test: cssModuleRegex,
          //   use: getStyleLoaders({
          //     importLoaders: 1,
          //     sourceMap: isEnvProduction && shouldUseSourceMap,
          //     modules: {
          //       getLocalIdent: getCSSModuleLocalIdent,
          //     }
          //   }),
          // },
          {
            test: lessRegex,
            exclude: lessModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: isEnvProduction && shouldUseSourceMap,
                modules: true,
              },
              'less-loader'
            ),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
          // {
          //   test: lessModuleRegex,
          //   use: getStyleLoaders(
          //     {
          //       importLoaders: 3,
          //       sourceMap: isEnvProduction && shouldUseSourceMap,
          //       modules: {
          //         getLocalIdent: getCSSModuleLocalIdent,
          //       }
          //     },
          //     'less-loader'
          //   ),
          // },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|bmp)$/,
        loader: require.resolve('url-loader'), // file-loader
        options: {
          limit: 200 * 1024,
          outputPath: 'static/media/',
        },
      },
      {
        loader: require.resolve('file-loader'),
        exclude: [
          /\.(js|mjs|jsx|ts|tsx)$/,
          /\.html$/,
          /\.json$/,
          /\.(css|less|sass|stylus)$/,
        ],
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
};
