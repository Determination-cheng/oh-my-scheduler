import {
  unstable_IdlePriority as IdlePriority,
  unstable_getFirstCallbackNode as getFirstCallbackNode,
  unstable_cancelCallback as cancelCallback,
  unstable_scheduleCallback as scheduleCallback,
} from 'scheduler'
import type { CallbackNode } from 'scheduler'

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
function perform() {}

const init = () => {
  priority2UseList.forEach(priority => {
    const btn = document.createElement('button')
    app.appendChild(btn)
    btn.innerText = priority2Name[priority]

    btn.onclick = () => {
      // 插入工作
      workList.push({ priority, count: 100 })
    }
  })
}

init()
