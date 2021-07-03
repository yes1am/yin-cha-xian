/**
 * 从毫秒中，解析出分钟和秒钟，比如解析出 08:30
 * @param {*} ms 毫秒数
 * @returns 分钟和秒钟
 */
function getMMSS (ms) {
  const s = Math.round(ms / 1000)
  const ss = String(s % 60)
  const mm = String(Math.floor(s / 60))
  return `${mm.padStart(2, '0')}:${ss.padStart(2, '0')}`
}

module.exports = {
  getMMSS
}
