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
    publicPath: '/dashboard/latest/',
  },
  // Array of webpack plugins to use during production build
  plugins: [
    // Module Federation plugin for microfrontend architecture
    new ModuleFederationPlugin({
      // Name of this microfrontend (must be unique across the application)
      name: 'dashboard',
      // Filename for the remote entry point that other apps can consume
      filename: 'remoteEntry.js',
      // Modules that this microfrontend exposes to other applications
      exposes: {
        // Expose the AuthApp component from bootstrap file
        './DashboardApp': './src/bootstrap',
      },
      // Dependencies that should be shared between microfrontends
      shared: packageJson.dependencies,
    }),
  ],
};

// Export the merged configuration (common + production-specific settings)
module.exports = merge(commonConfig, prodConfig);
