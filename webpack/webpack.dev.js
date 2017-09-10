'use strict';
const webpack = require('webpack');
const { join } = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHardDiskPlugin = require('html-webpack-harddisk-plugin');
const common = require('./webpack.common');

const rootPath = join(__dirname, '..');
// initialize html_webpack_plugin
const html_webpack_plugin = new HtmlWebpackPlugin({
    template: join(rootPath, 'src', 'dom_tree.html'),
    filename: join(rootPath, 'dev', 'index.html'),
    inject: 'head',
    alwaysWriteToDisk: true
});

module.exports = merge(common, {
    output: {
        path: join(rootPath, 'dev'),
    },

    devServer: {
        contentBase: join(rootPath, 'dev'),
        inline: true,
        port: 3333
    },

    plugins: [
        html_webpack_plugin,
        new HtmlWebpackHardDiskPlugin(),
    ]
});
