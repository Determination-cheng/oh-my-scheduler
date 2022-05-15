import {
  unstable_IdlePriority as IdlePriority,
  unstable_ImmediatePriority as ImmediatePriority,
  unstable_LowPriority as LowPriority,
  unstable_NormalPriority as NormalPriority,
  unstable_UserBlockingPriority as UserBlockingPriority,
  unstable_getFirstCallbackNode as getFirstCallbackNode,
  unstable_scheduleCallback as scheduleCallback,
  unstable_shouldYield as shouldYield,
  unstable_cancelCallback as cancelCallback,
  CallbackNode,
} from 'scheduler'

import './style.css'

type Priority =
  | typeof IdlePriority
  | typeof ImmediatePriority
  | typeof LowPriority
  | typeof NormalPriority
  | typeof UserBlockingPriority

interface Work {
  priority: Priority
  count: number
}

const app = document.querySelector<HTMLDivElement>('#app')!
const content = document.getElementById('content') as HTMLDivElement

const priority2UseList: Priority[] = [
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
]

const priority2Name = [
  'noop',
  'ImmediatePriority',
  'UserBlockingPriority',
  'NormalPriority',
  'LowPriority',
  'IdlePriority',
]

const init = () => {
  priority2UseList.forEach(priority => {
    const btn = document.createElement('button')
    app.appendChild(btn)
    btn.innerText = priority2Name[priority]

    btn.onclick = () => {}
  })
}

init()
