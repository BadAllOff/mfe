// Import webpack-merge to combine common config with production-specific settings
const { merge } = require('webpack-merge');
// Import ModuleFederationPlugin for microfrontend architecture
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
// Import package.json to access dependencies for shared modules
const packageJson = require('../package.json');
// Import the common webpack configuration
const commonConfig = require('./webpack.common');

// Production-specific webpack configuration
const prodConfig = {
  // Set webpack mode to production for optimized builds
  mode: 'production',
  // Output configuration for production builds
  output: {
    // Add content hash to filenames for cache busting when content changes
    filename: '[name].[contenthash].js',
    // Public path where assets will be served from in production
    // publicPath: '/marketing/latest/',
  },
  // Array of webpack plugins to use during production build
  plugins: [
    // Module Federation plugin for microfrontend architecture
    new ModuleFederationPlugin({
      // Name of this microfrontend (must be unique across the application)
      name: 'marketing',
      // Filename for the remote entry point that other apps can consume
      filename: 'remoteEntry.js',
      // Modules that this microfrontend exposes to other applications
      exposes: {
        // Expose the MarketingApp component from bootstrap file
        './MarketingApp': './src/bootstrap',
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

// Export the merged configuration (common + production-specific settings)
module.exports = merge(commonConfig, prodConfig);
