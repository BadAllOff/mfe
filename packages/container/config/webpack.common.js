// Export the common webpack configuration that will be shared between development and production builds
module.exports = {
    // Module configuration section - defines how different file types should be processed
    module: {
        // Array of rules that determine how modules are created
        rules: [
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
                        presets: ['@babel/preset-react', '@babel/preset-env'],
                        // Babel plugins: Transform runtime plugin for polyfills and helpers
                        plugins: ['@babel/plugin-transform-runtime'],
                    },
                },
            }
        ],
    },
};