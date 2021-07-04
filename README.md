# 饮茶先

一款基于 [Electron](https://github.com/electron/electron) 的，提醒"打工人"定时休息的桌面软件，每工作 25 分钟，休息 1 分钟。

软件名称来源于饮茶哥视频: https://www.bilibili.com/s/video/BV1Xh411v7LW

## 1. 截图

### 1.1 工作页面

![20210704202932](https://raw.githubusercontent.com/yes1am/PicBed/master/img/20210704202932.png)

### 1.2 休息页面

![20210704203007](https://raw.githubusercontent.com/yes1am/PicBed/master/img/20210704203007.png)

## 2. 功能

1. 点击顶部托盘的**茶按钮**，可弹出工作页面，工作页面在进行**工作时间**(*默认 25 分钟*)倒计时
2. 点击工作页面的**重置按钮**，可重新开始倒计时
3. 点击工作页面的**立刻休息按钮**，可进入休息页面
4. 休息页面在进行**休息时间**(*默认 1 分钟*)倒计时
5. 点击休息页面的**跳过休息按钮**，可回到工作页面重新开始计时

## 3. 开发

1. `npm install` 安装依赖
2. `npm start` 启动项目

## 4. 编译

1. `yarn build` 打包出 `dmg` 包