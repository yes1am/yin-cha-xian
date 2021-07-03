// 渲染进程代码
const { ipcRenderer } = require('electron')
const Timer = require('timer.js')
const { IPC_EVENTS, TIME_TYPE } = require('../constant')
const timeMap = require('../time')
const ProgressBar = require('progressbar.js')
const { getMMSS } = require('../util')

class Page {
  constructor () {
    this.timer = null
    this.progressBar = null
    this.init()
  }

  // 初始化时执行
  init () {
    this.createProgress()
    this.bindEvents()
    this.startWork()
  }

  createProgress () {
    this.progressBar = new ProgressBar.Circle('#progress', {
      strokeWidth: 10, // 进度条前景色
      color: '#249a35',
      trailColor: 'rgb(250,250,250)',
      trailWidth: 10, // 进度条背景色
      svgStyle: null
    })
  }

  // 绑定事件
  bindEvents () {
    // // 监听 main 进程的事件
    // ipcRenderer.on(IPC_EVENTS.HOME_PAGE_START_WORK, () => {
    //   this.startWork()
    // })
    // 监听重置按钮
    const resetBtn = document.querySelector('#reset')
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.startWork()
      })
    }

    // 监听立刻休息按钮
    const resetNowBtn = document.querySelector('#rest-now')
    if (resetNowBtn) {
      resetNowBtn.addEventListener('click', () => {
        this.timer.stop()
        ipcRenderer.invoke(IPC_EVENTS.HOME_PAGE_TIME_END)
      })
    }
  }

  startWork () {
    if (this.timer) {
      this.timer.stop()
    } else {
      this.timer = new Timer({
        ontick: (ms) => {
          this.updateTime(ms)
        },
        onend: () => {
          ipcRenderer.invoke(IPC_EVENTS.HOME_PAGE_TIME_END)
        }
      })
    }
    this.timer.start(timeMap[TIME_TYPE.WORK_TIME])
  }

  // 更新时间, ms 为毫秒
  updateTime (ms) {
    const timeContainer = document.querySelector('#time-container')
    // 秒数取整
    const s = Math.round(ms / 1000)
    this.progressBar.set(1 - s / timeMap[TIME_TYPE.WORK_TIME])
    // 设置进度条的文字，暂时不使用
    // this.progressBar.setText(timeStr)

    const timeStr = getMMSS(ms)
    timeContainer.innerText = timeStr
    // 将最新的时间字符串，通知到托盘
    ipcRenderer.invoke(IPC_EVENTS.CHANGE_TRAY_TITLE, timeStr)
  }
}

new Page()
