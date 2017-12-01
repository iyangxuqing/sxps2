import { http } from 'http.js'

let dataver = {}

function getDataver(options = {}) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/dataver.php?m=get',
    }).then(function (res) {
      if (res.errno === 0) {
        for (let i in res.dataver) {
          dataver[res.dataver[i]['name']] = res.dataver[i]['version']
        }
        resolve(dataver)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function getExpired(name) {
  let localVersion = wx.getStorageSync('dataver-' + name) || 0
  let remoteVersion = dataver[name] || 9999999999
  if (remoteVersion > localVersion) return true
  return false
}

function setExpired(name, version) {
  wx.setStorageSync('dataver-' + name, version)
}

export var Dataver = {
  get: getDataver,
  getExpired: getExpired,
  setExpired: setExpired,
}