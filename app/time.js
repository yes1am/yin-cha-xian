const { TIME_TYPE } = require('./constant')

const time = {
  // 工作时间，单位为 s
  [TIME_TYPE.WORK_TIME]: 25 * 60,
  // 休息时间，单位为 s
  [TIME_TYPE.REST_TIME]: 1 * 60
}

module.exports = time
