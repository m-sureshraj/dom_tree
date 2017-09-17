'use strict';
var join = require('path').join;
var webpackUtil = require('./webpack.util');

module.exports = {
    // entry point to start bundling
    entry: {
        dom_tree: [join(webpackUtil.rootPath, 'src', 'js', 'dom_tree.js')]
    },

    // where to put bundled files
    output: {
        filename: 'js/[name].js',
        // https://webpack.js.org/guides/author-libraries/
        library: 'DomTree',
        libraryTarget: 'umd',
        libraryExport: 'default'
    }
};
