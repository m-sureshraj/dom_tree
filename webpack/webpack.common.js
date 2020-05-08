'use strict';
var join = require('path').join;

module.exports = {
    // entry point to start bundling
    entry: {
        // eslint-disable-next-line camelcase
        dom_tree: join(__dirname, '..', 'src', 'js', 'dom_tree.js'),
    },

    // where to put bundled files
    output: {
        filename: 'js/[name].js',
        // https://webpack.js.org/guides/author-libraries/
        library: 'DomTree',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
};
