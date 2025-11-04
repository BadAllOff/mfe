// Import webpack-merge to combine common config with development-specific settings
const { merge } = require('webpack-merge');
// Import HtmlWebpackPlugin to generate HTML files with script tags
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Import ModuleFederationPlugin for microfrontend architecture
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
// Import package.json to access dependencies for shared modules
const packageJson = require('../package.json');
// Import the common webpack configuration
const commonConfig = require('./webpack.common');

// Development-specific webpack configuration
const devConfig = {
  // Set webpack mode to development for faster builds and better debugging
  mode: 'development',
  output: {
    publicPath: 'http://localhost:8082/',
  },
  // Development server configuration
  devServer: {
    // Port number for the development server
    port: 8082,
    // Enable HTML5 History API fallback for client-side routing
    historyApiFallback: {
      // Allow fallback to index.html for any 404 errors
      historyApiFallback: true,
      index: '/index.html',
    },
  },
  // Array of webpack plugins to use during development
  plugins: [
    // HTML Webpack Plugin to generate index.html with script tags
    new HtmlWebpackPlugin({
      // Template file to use for generating HTML
      template: './public/index.html',
    }),
    // Module Federation plugin for microfrontend architecture
    new ModuleFederationPlugin({
      // Name of this microfrontend (must be unique across the application)
      name: 'auth',
      // Filename for the remote entry point that other apps can consume
      filename: 'remoteEntry.js',
      // Modules that this microfrontend exposes to other applications
      exposes: {
        // Expose the AuthApp component from bootstrap file
        './AuthApp': './src/bootstrap',
      },
      // Dependencies that should be shared between microfrontends
      shared: {
        // Spread all dependencies from package.json as shared modules
        ...packageJson.dependencies,
        // React configuration for sharing
        react: {
          // Ensure only one instance of React is loaded across all microfrontends
          singleton: true,
          // Required version of React from package.json
          requiredVersion: packageJson.dependencies.react,
        },
        // React DOM configuration for sharing
        'react-dom': {
          // Ensure only one instance of React DOM is loaded
          singleton: true,
          // Required version of React DOM from package.json
          requiredVersion: packageJson.dependencies['react-dom'],
        },
        // React Router DOM configuration for sharing
        'react-router-dom': {
          // Ensure only one instance of React Router is loaded
          singleton: true,
          // Required version of React Router DOM from package.json
          requiredVersion: packageJson.dependencies['react-router-dom'],
        },
      },
    }),
  ],
};

// Export the merged configuration (common + development-specific settings)
module.exports = merge(commonConfig, devConfig);
