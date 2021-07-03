// 渲染进程代码
const { ipcRenderer } = require('electron')
const Timer = require('timer.js')
const { IPC_EVENTS, TIME_TYPE } = require('../constant')
const timeMap = require('../time')
const { getMMSS } = require('../util')

class Page {
  constructor () {
    this.init()
  }

  // 初始化时执行
  init () {
    this.bindEvent()
    this.startWork()
  }

  bindEvent () {
    document.querySelector('#skip').addEventListener('click', () => {
      // 跳过休息
      this.handleSkip()
    })
  }

  handleSkip () {
    ipcRenderer.invoke(IPC_EVENTS.REST_PAGE_TIME_END)
  }

  startWork () {
    const timer = new Timer({
      ontick: (ms) => {
        this.updateTime(ms)
      },
      onend: () => {
        ipcRenderer.invoke(IPC_EVENTS.REST_PAGE_TIME_END)
      }
    })
    timer.start(timeMap[TIME_TYPE.REST_TIME])
  }

  // 更新时间, ms 为毫秒
  updateTime (ms) {
    const timeContainer = document.querySelector('#time-container')
    // 秒数取整
    const timeStr = getMMSS(ms)
    timeContainer.innerText = timeStr
    ipcRenderer.invoke(IPC_EVENTS.CHANGE_TRAY_TITLE, timeStr)
  }
}

new Page()
