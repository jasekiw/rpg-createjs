var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './src/app/App.ts',
    output: {
        path: './dist',
        filename: 'app.bundle.js',
        publicPath: "/"
    },
    devtool: 'source-map',
    devServer: {inline: true, outputPath: "./dist"},
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015!ts-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/index.html' },
            { from: 'src/assets', to: "assets" }
        ]),
        new webpack.optimize.UglifyJsPlugin()
    ]
};