const Server = require('webpack-dev-server/lib/Server')
const createLogger = require('webpack-dev-server/lib/utils/createLogger')
const webpack = require('webpack')
const chalk = require('chalk')

const basicConfig = require('../webpack.config.js')
const devConfig = require('../webpack.dev.js')

const webpackConfig = { ...config('development'), ...devConfig }

let configYargsPath
try {
  require.resolve('webpack-cli/bin/config/config-yargs')
  configYargsPath = 'webpack-cli/bin/config/config-yargs'
} catch (e) {
  configYargsPath = 'webpack-cli/bin/config-yargs'
}

// const config = require(convertArgvPath)(yargs, argv, {
//   outputFilename: '/bundle.js',
// });

function startDevServer() {
  let compiler

  try {
    compiler = webpack(webpackConfig, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }
      // console.log(stats)
    })
  } catch (e) {
    console.log(chalk.red('something wrong happened'))
    console.log(e)
  }

  try {
    new Server(compiler, {})
  }
}

startDevServer()
