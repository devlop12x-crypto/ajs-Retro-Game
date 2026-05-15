const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction ? '[name].[contenthash].js' : '[name].js',
        assetModuleFilename: 'assets/[hash][ext]',
        clean: true,
    },

    devtool: isProduction ? 'source-map' : 'eval-source-map',

    devServer: {
        port: 9000,
        open: true,
        hot: true,
        historyApiFallback: true,
        compress: true,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: isProduction,
        }),
        ...(isProduction ? [
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css',
            }),
        ] : []),
    ],

    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

    performance: {
        hints: isProduction ? 'warning' : false,
        maxAssetSize: 512000,
        maxEntrypointSize: 512000,
    },
};