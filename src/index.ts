#!/usr/bin/env node
import path from 'node:path'
import { $, chalk } from 'zx'
import inquirer from 'inquirer'
import iconv from 'iconv-lite'
import open from 'open'
import { program } from 'commander'
import { doneBuildFn, preBuildFn } from './lifecycle'

// 定义命令行参数
program
  .option('--config <value>', 'Set config value')
program.parse()

// 获取命令行参数中的配置文件路径
const configValue = program.opts()

console.log(configValue)
const encoding = 'cp936'
// 匹配如下的正则
// 类型: Android自有证书 下载地址: https://ide.dcloud.net.cn/build/download/f2524060-1738-11ed-9bb9-813ac4138720 （注意该地址为临时下载地址，只能下载5次）
const regHttp = /(https:.*)（/gm
async function removeWinCliCommand() {
  if (process.platform === 'win32') {
    try {
      await $`Remove-Item Alias:cli -Force -ErrorAction Ignore`
    }
    catch (e) {
      console.error(
        chalk.red(JSON.stringify(e)),
        chalk.red('window 下执行命令错误，但是不影响脚本运行'),
      )
    }
  }
}
const listEx = {
  安装包1: '安装包1',
  安装包2: '安装包2',
  安装包3: '安装包3',

}
// const versionType = {
//   手动: '手动输入版本',
//   自动: '自动升级版本',
//   不变: '保持现有版本',
// }
const httpEnv = {
  正式环境: '正式环境',
  测试环境: '测试环境',
}
main()

const inquireParams = [
  {
    type: 'list',
    name: 'pkg',
    message: '请选择要打包的项目：',
    choices: Object.keys(listEx),
  },
  {
    type: 'list',
    name: 'packEnv',
    message: `请选择打包环境`,
    choices: [httpEnv.正式环境, httpEnv.测试环境],
  },
  // {
  //   type: 'list',
  //   name: 'versionType',
  //   message: `请选择版本更新方式，当前版本 ：${mainFileContent.versionName}`,
  //   choices: Object.values(versionType),
  // },
]
async function main() {
  try {
    await preBuildFn()
    await removeWinCliCommand()
    await inquirePrompt(inquireParams)
    await startPack()
    await doneBuildFn()
  }
  catch (e) {
    console.error('pack error', e)
  }
}

async function inquirePrompt(params: any) {
  return new Promise((resolve) => {
    inquirer
      .prompt(params).then((answers: any) => {
        resolve(answers)
      })
  })
}

async function startPack() {
  // const configPath = `${process.cwd()}\\build-config.json`
  // const packEnv = process.argv[3]
  const targetPath = path.join(process.cwd(), '/build-config.json')
  console.log(targetPath.split(path.sep).join('\\\\/').trim(), 'path--------------')

  // 配置项目路径文件
  const p = $`cli.exe pack --config ${targetPath.split(path.sep).join('\\\\/').trim()}`
  for await (const chunk of p.stdout) {
    // 格式化为中文进行输出
    // @ts-expect-error
    const formatStdout = iconv.decode(Buffer.from(chunk, 'gbk'), encoding)
    console.log(formatStdout)
    if (formatStdout.includes('配置文件') && formatStdout.includes('不存在')) {
      console.log(
        '用于 hbuilderx 打包的 json 文件不存在，请全局搜索 `cli.exe pack --config` 并将其后面的参数配置为正确 json 文件',
      )
      exit()
    }

    if (formatStdout.includes('证书文件不存在')) {
      // chalk.blue('证书文件不存在，请检查证书文件是否存在')
      console.log(
        '证书文件不存在，请在配置文件 build-config.json 修改  certfile 字段为 xxxxx.keystore 的路径',
      )
      exit()
    }
    // 正则表达式执行结果
    const regResult = regHttp.exec(formatStdout)
    if (regResult) {
      const url = regResult[1]
      doneBuildFn({ url })
      if (url.includes('https://'))
        open(url)
    }
    // 正则表达式执行结果
  }
}

function exit() {
  process.exit()
}
