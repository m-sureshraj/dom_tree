const { join } = require('path');
const { existsSync, copyFileSync } = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHardDiskPlugin = require('html-webpack-harddisk-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rootPath = join(__dirname, '..');
const sourcePath = join(rootPath, 'src');
const buildPath = join(rootPath, 'dev');
const template = join(sourcePath, 'dom_tree.html');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template,
    filename: join(buildPath, 'index.html'),
    inject: 'head',
    alwaysWriteToDisk: true,
});

function copyTemplate() {
    if (existsSync(template)) return;

    copyFileSync(join(sourcePath, 'dom_tree_template.html'), template);
}

module.exports = (env, argv) => {
    const { script = 'dev' } = argv;
    const isStartScript = script === 'start';

    if (isStartScript) copyTemplate();

    return {
        mode: 'development',
        devtool: isStartScript ? 'eval-cheap-source-map' : false,

        entry: {
            dom_tree: join(sourcePath, 'dom_tree.js'),
        },

        output: {
            path: buildPath,
            filename: 'js/[name].js',
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

        devServer: {
            contentBase: buildPath,
            inline: true,
            port: 3000,
        },

        plugins: [
            new CleanWebpackPlugin(),
            isStartScript && htmlWebpackPlugin,
            isStartScript && new HtmlWebpackHardDiskPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
            }),
        ].filter(Boolean),
    };
};
