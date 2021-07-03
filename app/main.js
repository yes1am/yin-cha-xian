// 主进程文件，这个文件的名称需要和 package.json 中的 main 一致

// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, ipcMain, Tray, nativeImage } = require('electron')

const {
  HOME_PAGE_PATH,
  REST_PAGE_PATH,
  ICON_PATH,
  DEFAULT_TRAY_TITLE,
  MAC_OS_SYSTEM,
  IPC_EVENTS
} = require('./constant')

class Main {
  constructor () {
    this.homePageWindow = null // 首页的 window 对象
    this.restPageWindow = null
    this.tray = null // 托盘对象

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
      if (this.tray && this.tray.setTitle) {
        this.tray.setTitle(timeStr)
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
      // this.homePageWindow.webContents.send(IPC_EVENTS.HOME_PAGE_START_WORK)
    })
  }

  destroyAllWindow () {
    if (this.homePageWindow) {
      this.homePageWindow.destroy()
    }
    if (this.restPageWindow) {
      this.restPageWindow.destroy()
    }
  }

  // 创建窗口
  createWindow () {
    this.destroyAllWindow()
    this.homePageWindow = new BrowserWindow({
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
    this.homePageWindow.loadFile(HOME_PAGE_PATH)
    // 打开调试控制台
    // this.homePageWindow.webContents.openDevTools()
  }

  // 创建休息页窗口
  createRestWindow () {
    this.destroyAllWindow()
    const size = screen.getPrimaryDisplay().workAreaSize
    this.restPageWindow = new BrowserWindow({
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
    this.restPageWindow.loadFile(REST_PAGE_PATH)
    // 打开调试控制台
    // this.restPageWindow.webContents.openDevTools()
  }

  // 创建托盘
  createTray () {
    const icon = nativeImage.createFromPath(ICON_PATH)
    this.tray = new Tray(icon)
    this.tray.setTitle(DEFAULT_TRAY_TITLE)
    this.tray.on('click', () => {
      this.toggleHomePageWindowShow()
    })
  }

  // 切换 HomePageWindow 的显示和隐藏状态
  toggleHomePageWindowShow () {
    if (!this.homePageWindow.isDestroyed()) {
      if (this.homePageWindow.isVisible()) {
        this.homePageWindow.hide()
      } else {
        this.showHomePageWindow()
      }
    }
  }

  // 获取 window 应该放置的位置
  getWindowPosition () {
    const windowBounds = this.homePageWindow.getBounds()
    const trayBounds = this.tray.getBounds()
    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)
    return { x: x, y: y }
  }

  // 根据 tray 托盘的位置，在适当的位置展示 HomePage 的窗口
  showHomePageWindow () {
    const position = this.getWindowPosition()
    this.homePageWindow.setPosition(position.x, position.y, false)
    this.homePageWindow.show()
  }
}

new Main()
