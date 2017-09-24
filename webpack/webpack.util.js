'use strict';
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var join = require('path').join;

// this plugin extract imported css into separate file
var extractTextPlugin = new ExtractTextPlugin({
    filename: 'css/[name].css',
    allChunks: true
});

exports.rootPath = join(__dirname, '..');

exports.extractTextPlugin = extractTextPlugin;

exports.getExtractTextPluginExtractOptions = function(env) {
    if (!env) throw new Error('Required argument is missing!');

    return extractTextPlugin.extract({
        use: [
            {
                loader: 'css-loader',
                options: {
                    // https://github.com/webpack-contrib/css-loader#importloaders
                    importLoaders: 1,
                    minimize: env === 'prod'
                }
            },
            'postcss-loader'
        ]
    });
};
