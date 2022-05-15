import { priority2UseList, priority2Name } from './priorityConfig'
import type { Priority } from './priorityConfig'
import './style.css'

interface Work {
  priority: Priority
  count: number
}

const app = document.querySelector<HTMLDivElement>('#app')!
const content = document.getElementById('content') as HTMLDivElement

const init = () => {
  priority2UseList.forEach(priority => {
    const btn = document.createElement('button')
    app.appendChild(btn)
    btn.innerText = priority2Name[priority]

    btn.onclick = () => {}
  })
}

init()
