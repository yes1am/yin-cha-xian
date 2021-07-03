// 首页地址, 相对根路径的地址
const HOME_PAGE_PATH = './app/home-page/index.html'

// 休息页地址
const REST_PAGE_PATH = './app/rest-page/index.html'

// ICON 地址
const ICON_PATH = './app/assets/icon.png'

// 默认托盘(托盘在 mac 上，就是右上角的快捷图标) title
const DEFAULT_TRAY_TITLE = '喂, 三点几了'

const MAC_OS_SYSTEM = 'darwin'

const IPC_EVENTS = {
  // 改变托盘文字的事件
  CHANGE_TRAY_TITLE: 'changeTrayTitle',
  // 当 home page 计时器结束时触发的事件, 此时应该休息了
  HOME_PAGE_TIME_END: 'homePageTimeEnd',
  // 当休息页计时结束，需要告诉 home page 开始工作
  HOME_PAGE_START_WORK: 'homePageStartWork',
  // 当 rest page 计时器结束时触发的事件, 此时应该开始工作了
  REST_PAGE_TIME_END: 'restPageTimeEnd'
}

// 时间类型
const TIME_TYPE = {
  WORK_TIME: Symbol('workTime'),
  REST_TIME: Symbol('restTime')
}

module.exports = {
  HOME_PAGE_PATH,
  REST_PAGE_PATH,
  ICON_PATH,
  DEFAULT_TRAY_TITLE,
  MAC_OS_SYSTEM,
  IPC_EVENTS,
  TIME_TYPE
}
