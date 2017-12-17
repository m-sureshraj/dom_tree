'use strict';
var join = require('path').join;
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHardDiskPlugin = require('html-webpack-harddisk-plugin');
var webpackUtil = require('./webpack.util');
var common = require('./webpack.common');

// eslint-disable-next-line camelcase
var html_webpack_plugin = new HtmlWebpackPlugin({
    template: join(webpackUtil.rootPath, 'src', 'dom_tree.html'),
    filename: join(webpackUtil.rootPath, 'dev', 'index.html'),
    inject: 'head',
    alwaysWriteToDisk: true
});

module.exports = merge(common, {
    devtool: 'eval-source-map',
    output: {
        path: join(webpackUtil.rootPath, 'dev')
    },

    module: {
        rules: [
            // bundle css
            {
                test: /\.css$/,
                use: webpackUtil.getExtractTextPluginExtractOptions('dev')
            }
        ]
    },

    devServer: {
        contentBase: join(webpackUtil.rootPath, 'dev'),
        inline: true,
        port: 3333
    },

    plugins: [
        html_webpack_plugin, // eslint-disable-line camelcase
        new HtmlWebpackHardDiskPlugin(),
        webpackUtil.extractTextPlugin
    ]
});
