import path from 'node:path'

export let preBuildFn = () => {}
export let doneBuildFn = (...a: any) => {}
export function preBuild(fn: any) {
  preBuildFn = fn
}
function packDone(fn: any) {
  doneBuildFn = fn
}
console.log('lifecycle')
export function definePackConfig(options: any) {
  const { preBuildFn, packDoneFn } = options
  if (preBuildFn)
    preBuild(preBuildFn)
  if (packDoneFn)
    packDone(packDoneFn)
}

export function loadConfigFile(configPath: string | undefined = undefined) {
  try {
    configPath = `${path.join('file://', process.cwd(), 'unipack.config.js')}`
    console.log({ configPath })
    // 使用 Node.js 的 require 机制加载配置文件

    return import(configPath)
  }
  catch (err) {
    console.log(err, 'unipack.config.js')
    // 处理加载配置文件失败的情况
    // ...
  }
}
