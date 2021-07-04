// 主进程文件，这个文件的名称需要和 package.json 中的 main 一致

// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, ipcMain, Tray } = require('electron')
const path = require('path')

const {
  HOME_PAGE_PATH,
  REST_PAGE_PATH,
  DEFAULT_TRAY_TITLE,
  MAC_OS_SYSTEM,
  IPC_EVENTS
} = require('./constant')

let homePageWindow = null // 首页的 window 对象
let restPageWindow = null

// 将 tray 移动到外面, 防止被垃圾回收
// https://github.com/electron/electron/issues/11572#issuecomment-539929156
// https://code.iamhefang.cn/content/fix-electron-tray-icon-disappear.html
let tray = null // 托盘对象

class Main {
  constructor () {
    this.init()
  }

  init () {
    this.listenAppEvent()
  }

  listenAppEvent () {
    // 这个方法会在 Electron 初始化后调用，并且之后可以创建浏览器窗口
    // 一些 API 只能在这个事件之后才能使用
    app.whenReady().then(() => {
      this.createWindow()
      this.createTray()

      app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow()
        }
      })

      this.listenIPCEvents()
    })

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', function () {
      if (process.platform !== MAC_OS_SYSTEM) {
        app.quit()
      }
    })
    // In this file you can include the rest of your app's specific main process
    // code. You can also put them in separate files and require them here.
  }

  // 处理 IPC 事件
  listenIPCEvents () {
    // 更新托盘文字
    ipcMain.handle(IPC_EVENTS.CHANGE_TRAY_TITLE, (_, timeStr) => {
      if (tray && tray.setTitle) {
        tray.setTitle(timeStr)
      }
    })
    // 当 home page 倒计时结束时，打开 rest page
    ipcMain.handle(IPC_EVENTS.HOME_PAGE_TIME_END, () => {
      this.createRestWindow()
    })
    // 当 rest page 计时器结束时, 此时应该关闭休息页，让 home page 开始工作
    ipcMain.handle(IPC_EVENTS.REST_PAGE_TIME_END, () => {
      this.createWindow()
      // 向渲染进程发送事件
      // homePageWindow.webContents.send(IPC_EVENTS.HOME_PAGE_START_WORK)
    })
  }

  destroyAllWindow () {
    if (homePageWindow) {
      homePageWindow.destroy()
    }
    if (restPageWindow) {
      restPageWindow.destroy()
    }
  }

  // 创建窗口
  createWindow () {
    this.destroyAllWindow()
    homePageWindow = new BrowserWindow({
      width: 360,
      height: 480,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      show: false,
      resizable: false, // 禁止改变大小
      frame: false // 不显示关闭, 缩小等按钮
    })
    // 加载文件
    homePageWindow.loadFile(HOME_PAGE_PATH)
    // 打开调试控制台
    // homePageWindow.webContents.openDevTools()
  }

  // 创建休息页窗口
  createRestWindow () {
    this.destroyAllWindow()
    const size = screen.getPrimaryDisplay().workAreaSize
    restPageWindow = new BrowserWindow({
      width: size.width,
      height: size.height,
      // 默认不显示窗口
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      resizable: false, // 禁止改变大小
      frame: false // 不显示关闭, 缩小等按钮
    })
    // 加载文件
    restPageWindow.loadFile(REST_PAGE_PATH)
    // 打开调试控制台
    // restPageWindow.webContents.openDevTools()
  }

  // 创建托盘
  createTray () {
    tray = new Tray(path.resolve(__dirname, './assets/icon.png'))
    tray.setTitle(DEFAULT_TRAY_TITLE)
    tray.on('click', () => {
      this.toggleHomePageWindowShow()
    })
  }

  // 切换 HomePageWindow 的显示和隐藏状态
  toggleHomePageWindowShow () {
    if (!homePageWindow.isDestroyed()) {
      if (homePageWindow.isVisible()) {
        homePageWindow.hide()
      } else {
        this.showHomePageWindow()
      }
    }
  }

  // 获取 window 应该放置的位置
  getWindowPosition () {
    const windowBounds = homePageWindow.getBounds()
    const trayBounds = tray.getBounds()
    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)
    return { x: x, y: y }
  }

  // 根据 tray 托盘的位置，在适当的位置展示 HomePage 的窗口
  showHomePageWindow () {
    const position = this.getWindowPosition()
    homePageWindow.setPosition(position.x, position.y, false)
    homePageWindow.show()
  }
}

new Main()
