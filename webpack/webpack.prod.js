const { join } = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rootPath = join(__dirname, '..');
const distPath = join(rootPath, 'dist');
const sourcePath = join(rootPath, 'src');

module.exports = {
    mode: 'production',
    devtool: false,

    entry: {
        dom_tree: join(sourcePath, 'dom_tree.js'),
    },

    output: {
        path: distPath,
        filename: 'js/[name].min.js',
        // https://webpack.js.org/guides/author-libraries/
        library: 'DomTree',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },

    module: {
        rules: [
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

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    warnings: true,
                },
            }),
            // To minify the css file
            new OptimizeCSSAssetsPlugin(),
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].min.css',
        }),
    ],
};
