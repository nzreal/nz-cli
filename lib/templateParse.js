const path = require('path')
const fse = require('fs-extra')

class Template {
  constructor() {}
  fill(name, path, type, children) {
    this.name = name
    this.type = type
    this.path = path
    this.children = children
  }
}

// 获得当前脚本运行所在位置
const getCurrentDirLocation = () => {
  return path.resolve(process.cwd())
}

// 读取生成模板
const readTemplate = (filePath, filename) => {
  const template = new Template()
  const stat = fse.statSync(filePath)

  if (stat.isDirectory()) {
    const childFiles = fse
      .readdirSync(filePath)
      // 过滤 node_modules
      .filter((name) => name !== 'node_modules')
      .map((file) => readTemplate(path.resolve(filePath, file), file))

    template.fill(filename, filePath, 'dir', childFiles)
  } else {
    const ext = path.extname(filename)
    template.fill(filename, filePath, ext)
  }

  return template
}

// 写入文件
const writeTemplate = (destPath, template, name, packageConfig, callback) => {
  function makePackageJson(destPath, template, name) {
    const config = {
      ...packageConfig,
      ...JSON.parse(fse.readFileSync(template.path)),
    }
    fse.writeFileSync(path.resolve(destPath, name), JSON.stringify(config))
  }

  function fileDispose(destPath, template, name) {
    switch (template.name) {
      case 'package.json': {
        makePackageJson(destPath, template, name)
        break
      }
      default: {
        fse.copyFileSync(template.path, path.resolve(destPath, name))
        break
      }
    }
  }

  function write(destPath, template, name) {
    if (template.type === 'dir') {
      const dirname = path.resolve(destPath, name)

      fse.mkdirSync(dirname)

      template.children.forEach((child) => {
        write(dirname, child, child.name)
      })
    } else {
      fileDispose(destPath, template, name)
    }
  }

  write(destPath, template, name, packageConfig)

  if (callback) callback()
}

module.exports = {
  getCurrentDirLocation,
  readTemplate,
  writeTemplate,
}
