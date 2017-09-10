'use strict';
const webpack = require('webpack');
const { join } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rootPath = join(__dirname, '..');
// this plugin extract imported css into separate file
const extract_text_plugin = new ExtractTextPlugin({
    filename: 'css/[name].css'
});

module.exports = {
    // entry point to start bundling
    entry: {
        dom_tree: [join(rootPath, 'src', 'js', 'dom_tree.js')]
    },

    // where to put bundled files
    output: {
        filename: 'js/[name].js',
        // https://webpack.js.org/guides/author-libraries/
        library: "DomTree",
        libraryTarget: "umd",
        libraryExport: "default"
    },

    // rules to resolve encountered imports
    module: {
        rules: [
            // bundle css
            {
                test: /\.css$/,
                use: extract_text_plugin.extract({
                    use: [
                        // https://github.com/webpack-contrib/css-loader#importloaders
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        'postcss-loader'
                    ]
                })
            },
        ]
    },

    plugins: [extract_text_plugin]
};
