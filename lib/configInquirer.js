const inquirer = require('inquirer')
const minimist = require('minimist')

function askForBasicConfig() {
  const argv = minimist(process.argv.slice(4))

  const questions = [
    {
      type: 'input',
      name: 'author',
      default: argv._[0] || 'NZ',
      message: 'author: ',
    },
    {
      type: 'input',
      name: 'description',
      default: argv._[1] || null,
      message: 'description: ',
    },
    {
      type: 'input',
      name: 'version',
      default: argv._[2] || '1.0.0',
      message: 'version: ',
    },
  ]

  return inquirer.prompt(questions).then((ans) => ans)
}

module.exports = askForBasicConfig
