'use strict';
var join = require('path').join;
var merge = require('webpack-merge');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var common = require('./webpack.common');
var webpackUtil = require('./webpack.util');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',

    output: {
        path: join(webpackUtil.rootPath, 'dist'),
        filename: 'js/[name].min.js'
    },

    module: {
        rules: [
            // bundle css
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader',
                    'postcss-loader'
                ]
            }
        ]
    },

    optimization: {
        minimizer: [
            // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
            new UglifyJSPlugin({
                parallel: true,
                uglifyOptions: {
                    warnings: true,
                    mangle: true
                }
            }),
            // will minify the css file
            new OptimizeCSSAssetsPlugin()
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css'
        })
    ]
});
