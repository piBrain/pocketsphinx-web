var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var APP_DIR = path.resolve(__dirname, 'src');

var config = {
    entry: APP_DIR+'/index.js',
    resolve : {
        extensions: ['.js']
    },
    module : {
        rules : [
            {
                test: /^(?!.*worker).+\.js$/,
                exclude: /node_modules/,
                include: APP_DIR,
                use:{
                    loader: "babel-loader",
                    options: { presets: ["es2015"] }
                }
            },
            {
                test: /\.worker\.js$/,
                use: { loader: "worker-loader", options: { } },
            },
        ],
    },
};

module.exports = config;
