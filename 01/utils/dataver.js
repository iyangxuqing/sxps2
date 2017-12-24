import { http } from 'http.js'

function getDataver(options = {}) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/dataver.php?m=get',
    }).then(function (res) {
      let dataver = wx.getStorageSync('dataver') || {}
      for (let i in res.dataver) {
        dataver['remote-' + res.dataver[i].name] = res.dataver[i].version
      }
      wx.setStorageSync('dataver', dataver)
      resolve(dataver)
    }).catch(function (res) {
      reject(res)
    })
  })
}

function getExpired(name) {
  let dataver = wx.getStorageSync('dataver') || {}
  let localVersion = dataver['local-' + name] || 0
  let remoteVersion = dataver['remote-' + name] || 0
  if (remoteVersion < localVersion) return false
  return true
}

function setExpired(name, version) {
  let dataver = wx.getStorageSync('dataver') || {}
  dataver['local-' + name] = version
  wx.setStorageSync('dataver', dataver)
}

export var Dataver = {
  get: getDataver,
  getExpired: getExpired,
  setExpired: setExpired,
}