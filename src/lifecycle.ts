export let preBuildFn = () => {}
export let doneBuildFn = (...a: any) => {}
export function preBuild(fn: any) {
  preBuildFn = fn
}
function packDone(fn: any) {
  doneBuildFn = fn
}
