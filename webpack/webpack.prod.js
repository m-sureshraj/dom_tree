'use strict';
const webpack = require('webpack');
const { join } = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.common');

const rootPath = join(__dirname, '..');
// clean dist dir before building
const clean_webpack_plugin = new CleanWebpackPlugin('dist', {
    root: rootPath
});

// https://github.com/survivejs/webpack-merge/issues/17
module.exports = merge.strategy({ plugins: 'prepend' })(common, {
    output: {
        path: join(rootPath, 'dist'),
    },

    plugins: [
        clean_webpack_plugin
    ]
});

// todo
// uglify, compress css, js
