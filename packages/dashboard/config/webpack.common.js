// Import VueLoaderPlugin to handle Vue.js files
const { VueLoaderPlugin } = require('vue-loader');

// Export the common webpack configuration that will be shared between development and production builds
module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.js', '.vue'],
  },
  // Module configuration section - defines how different file types should be processed
  module: {
    // Array of rules that determine how modules are created
    rules: [
      {
        test: /\.((png|jpe?g|gif|woff|svg|eot|ttf)$)/i,
        use: {
          loader: 'file-loader',
        },
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.scss|\.css$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader', 'style-loader'],
      },
      {
        // Test condition: matches files ending with .js or .mjs extensions
        test: /\.m?js$/,
        // Exclude node_modules directory from processing to avoid transforming third-party libraries
        exclude: /node_modules/,
        // Specify the loader and its options for processing matching files
        use: {
          // Use babel-loader to transform JavaScript files
          loader: 'babel-loader',
          // Configuration options for babel-loader
          options: {
            // Babel presets: React preset for JSX transformation, Env preset for modern JavaScript features
            presets: ['@babel/preset-env'],
            // Babel plugins: Transform runtime plugin for polyfills and helpers
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
};