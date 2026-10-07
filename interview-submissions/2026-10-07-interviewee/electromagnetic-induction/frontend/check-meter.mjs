import { writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'

const proc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--window-size=1440,900',
  '--remote-debugging-port=9224',
  'about:blank',
], { stdio: 'ignore' })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForTarget() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await fetch('http://127.0.0.1:9224/json/list').then((r) => r.json())
      const page = list.find((item) => item.type === 'page')
      if (page) return page
    } catch {
      // still starting
    }
    await sleep(150)
  }
  throw new Error('no page')
}

const page = await waitForTarget()
const ws = new WebSocket(page.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
const logs = []
ws.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message)
    pending.delete(message.id)
  }
  if (message.method === 'Runtime.exceptionThrown') {
    logs.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text)
  }
})
const send = (method, params = {}) => {
  id += 1
  const messageId = id
  ws.send(JSON.stringify({ id: messageId, method, params }))
  return new Promise((resolve) => pending.set(messageId, resolve))
}
await new Promise((resolve) => ws.addEventListener('open', resolve))
await send('Page.enable')
await send('Runtime.enable')
await send('Page.navigate', { url: 'http://localhost:5173/' })
await sleep(2200)
const shot = async (name) => {
  const result = await send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(name, Buffer.from(result.result.data, 'base64'))
}
await send('Runtime.evaluate', {
  expression: `[...document.querySelectorAll('.pane-title')].find(el => el.textContent.startsWith('Front'))?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))`,
})
await sleep(400)
await shot('C:/Users/UniplusUser02/Desktop/Electromagnetic Induction/frontend/meter-front.png')
await send('Runtime.evaluate', {
  expression: `[...document.querySelectorAll('button')].find(b => b.textContent.includes('Slide right'))?.click()`,
})
await sleep(500)
await shot('C:/Users/UniplusUser02/Desktop/Electromagnetic Induction/frontend/meter-slide.png')
await send('Runtime.evaluate', {
  expression: `[...document.querySelectorAll('.pane-title')].find(el => el.textContent.startsWith('Perspective'))?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))`,
})
await sleep(500)
await shot('C:/Users/UniplusUser02/Desktop/Electromagnetic Induction/frontend/meter-persp.png')
console.log(logs.join('\n') || 'none')
ws.close()
proc.kill()
