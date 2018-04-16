const merge = require('webpack-merge')
const common = require('./webpack.common.js')
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'example');
module.exports = merge(common, {
    devtool: 'inline-source-maps',
    devServer: {
        inline: true,
        contentBase: './example',
        port: 9000
    },
    output: {
        path: BUILD_DIR,
        filename: 'dev.bundle.js',
    }
})
