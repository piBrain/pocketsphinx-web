const merge = require('webpack-merge')
const common = require('./webpack.common.js')
var path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var BUILD_DIR = path.resolve(__dirname, 'dist');
module.exports = merge(common, {
    output: {
        path: BUILD_DIR,
        filename: 'bundle.min.js',
        libraryTarget: 'umd',
        library: 'pocketsphinx-web'
    },
    devtool: 'source-map',
    plugins: [
        new UglifyJSPlugin({ sourceMap: true })
    ]
})
