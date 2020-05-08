'use strict';
var join = require('path').join;
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHardDiskPlugin = require('html-webpack-harddisk-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var common = require('./webpack.common');

var rootPath = join(__dirname, '..');

var htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: join(rootPath, 'src', 'dom_tree.html'),
    filename: join(rootPath, 'dev', 'index.html'),
    inject: 'head',
    alwaysWriteToDisk: true, // HtmlWebpackHardDiskPlugin require this option
});

module.exports = function(env) {
    var isStartScript = env.script === 'start';

    return merge(common, {
        devtool: 'eval-source-map',
        mode: 'development',

        output: {
            path: join(rootPath, 'dev'),
        },

        module: {
            rules: [
                // bundle css
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        'css-loader',
                        'postcss-loader',
                    ],
                },
            ],
        },

        devServer: {
            contentBase: join(rootPath, 'dev'),
            inline: true,
            port: 3333,
        },

        plugins: [
            isStartScript && htmlWebpackPlugin,
            isStartScript && new HtmlWebpackHardDiskPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
            }),
        ].filter(Boolean),
    });
};
