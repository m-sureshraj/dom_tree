'use strict';
var join = require('path').join;
var merge = require('webpack-merge');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var common = require('./webpack.common');
var webpackUtil = require('./webpack.util');

var uglify_js_plugin = new UglifyJSPlugin({
    parallel: {
        cache: true
    },
    uglifyOptions: {
        ecma: 5,
        mangle: true,
        warnings: true
    }
});

module.exports = merge(common, {
    output: {
        path: join(webpackUtil.rootPath, 'dist')
    },

    module: {
        rules: [
            // bundle css
            {
                test: /\.css$/,
                use: webpackUtil.getExtractTextPluginExtractOptions('prod')
            }
        ]
    },

    plugins: [
        uglify_js_plugin,
        webpackUtil.extractTextPlugin
    ]
});
