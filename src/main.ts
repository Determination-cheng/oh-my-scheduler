import { unstable_IdlePriority as IdlePriority } from 'scheduler'
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
