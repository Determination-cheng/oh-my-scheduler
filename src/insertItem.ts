export function insertItem(container: HTMLDivElement, content: string) {
  const ele = document.createElement('span')
  ele.innerText = content
  ele.className = `pri-${content}`
  doSomeBusyWork(1e7)
  container.appendChild(ele)
}

// 电脑性能太好，不做些大的计算任务体现不出优先级
function doSomeBusyWork(len: number) {
  let result = 0
  while (len--) result += len
  return result
}
