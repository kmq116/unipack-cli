console.log('unipack.config console.log')
export default {
  // 打包前的回调
  preBuild() {
    console.log('preBuild')
  },
  // 打包完成的回调
  buildDone() {
    console.log('buildDone')
  },
}
