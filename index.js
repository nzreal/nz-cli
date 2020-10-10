#!/usr/bin/env node

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const commander = require('commander')
const fse = require('fs-extra')
const path = require('path')
const ora = require('ora')

const configInquirer = require('./lib/configInquirer.js')
const {
  readTemplate,
  writeTemplate,
  getCurrentDirLocation,
} = require('./lib/templateParse.js')

const TEMPLATE_PATH = path.resolve(__dirname, 'template')
const spinner = ora('building project...')

clear()
console.log(
  chalk.yellow(figlet.textSync('NZ-CLI', { horizontalLayout: 'full' }))
)

commander.version('1.0.0', '-v --version')

commander.command('init <name>').action(async (name) => {
  const curDir = getCurrentDirLocation()

  if (fse.existsSync(path.resolve(curDir, name))) {
    console.log(chalk.red('there has been a same name dir'))
    return
  }

  try {
    // package 文件配置
    const package_config = await configInquirer()
    package_config.name = name

    spinner.start()

    const template = await readTemplate(TEMPLATE_PATH, 'template')
    await writeTemplate(curDir, template, name, package_config)

    spinner.stop()
    clear()
    console.log('\n All Done!')
  } catch (e) {
    console.log(chalk.red('something wrong happened'))
    console.log(e)
    // 清除文件夹
    if (fse.existsSync(path.resolve(curDir, name))) {
      fse.removeSync(path.resolve(curDir, name))
    }
    spinner.stop()
  }
})

commander.parse(process.argv)
