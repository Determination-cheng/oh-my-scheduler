import {
  unstable_IdlePriority as IdlePriority,
  unstable_ImmediatePriority as ImmediatePriority,
  unstable_getFirstCallbackNode as getFirstCallbackNode,
  unstable_shouldYield as shouldYield,
  unstable_cancelCallback as cancelCallback,
  unstable_scheduleCallback as scheduleCallback,
} from 'scheduler'
import type { CallbackNode } from 'scheduler'

import { insertItem } from './insertItem'
import { priority2UseList, priority2Name } from './priorityConfig'
import type { Priority } from './priorityConfig'
import './style.css'

interface Work {
  priority: Priority
  count: number
}

const workList: Work[] = []
let prevPriority: Priority = IdlePriority
let curCallback: CallbackNode | null

const app = document.querySelector<HTMLDivElement>('#app')!
const content = document.getElementById('content') as HTMLDivElement

//* 调度逻辑
function schedule() {
  const cbNode = getFirstCallbackNode()
  // 取出最高优先级的工作
  const curWork = workList.sort((a, b) => a.priority - b.priority)[0]

  // 如果没有需要执行的工作则退出调度
  if (!curWork) {
    curCallback = null
    cbNode && cancelCallback(cbNode)
    return
  }

  const { priority: curPriority } = curWork

  // 如果有工作在进行，比较该工作和正在进行工作的优先级
  // 如果优先级相同，说明不需要新的调度，此时退出调度
  if (curPriority === prevPriority) return

  // 代码走到这说明当前工作优先级更高，需要发起新调度
  // 调度之前如果有工作在进行则将其中断
  cbNode && cancelCallback(cbNode)

  // 调度当前最高优先级的工作
  curCallback = scheduleCallback(curPriority, perform.bind(null, curWork))
}

//* 调度执行的具体工作
function perform(
  work: Work,
  isTimeout?: boolean,
): void | ((...args: any[]) => any) {
  //* 判断是否需要同步执行
  //*   1.工作的优先级是同步的
  //*   2.调度任务过期了，需要马上同步执行
  const needSync = work.priority === ImmediatePriority || isTimeout

  while ((needSync || !shouldYield()) && work.count) {
    work.count--
    insertItem(content, `${work.priority}`)
  }
  prevPriority = work.priority

  // 工作已完成
  if (!work.count) {
    // 在任务列表中清除已经完成的工作
    const ind = workList.indexOf(work)
    workList.splice(ind, 1)
    // 重置优先级至空闲优先级
    prevPriority = IdlePriority
  }

  //! 开始新一轮的调度
  const prevCallback = curCallback
  schedule()
  const newCallback = curCallback

  // 调度完之后，如果 callback 没变，代表没被打断，只是之前的时间切片时间用尽了 (默认5ms)
  // 在下一次时间切片继续执行未完成的任务
  if (newCallback && prevCallback === newCallback) {
    return perform.bind(null, work)
  }
}

const init = () => {
  priority2UseList.forEach(priority => {
    const btn = document.createElement('button')
    app.appendChild(btn)
    btn.innerText = priority2Name[priority]

    btn.onclick = () => {
      // 插入工作
      workList.push({ priority, count: 100 })
      schedule()
    }
  })
}

init()
