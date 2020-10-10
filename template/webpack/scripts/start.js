const devServer = require('webpack-dev-server')

const config = require('../webpack.config.js')
const devConfig = require('../webpack.dev.js')

console.log(config('development'))
