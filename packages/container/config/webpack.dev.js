// Import webpack-merge to combine common config with development-specific settings
const { merge } = require('webpack-merge');
// Import the common webpack configuration
const commonConfig = require('./webpack.common');
// Import ModuleFederationPlugin for microfrontend architecture
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
// Import package.json to access dependencies for shared modules
const packageJson = require('../package.json');

// Development-specific webpack configuration
const devConfig = {
  // Set webpack mode to development for faster builds and better debugging
  mode: 'development',
  // Development server configuration
  devServer: {
    // Port number for the development server
    port: 8080,
    // Enable HTML5 History API fallback for client-side routing
    historyApiFallback: {
      // Allow fallback to index.html for any 404 errors
      historyApiFallback: true,
      index: 'index.html',
    },
  },
  // Array of webpack plugins to use during development
  plugins: [
    // Module Federation plugin for microfrontend architecture
    new ModuleFederationPlugin({
      // Name of this microfrontend (must be unique across the application)
      name: 'container',

      remotes: {
        // Remote entry point for the marketing microfrontend
        marketing: 'marketing@http://localhost:8081/remoteEntry.js',
      },
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
