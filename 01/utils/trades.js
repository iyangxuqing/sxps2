import { http } from 'http.js'

let app = getApp()

function addTrade(orders) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps/trade.php?m=add',
      data: orders
    }).then(function (res) {
      if (res.errno === 0) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function getTrades() {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/trade.php?m=get',
    }).then(function (res) {
      if (res.errno === 0) {
        resolve(res.trades)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function delTrade(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/trade.php?m=del',
      data: { id: options.id }
    }).then(function (res) {
      if (res.errno === 0) {
        resolve(res.trades)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

export var Trade = {
  get: getTrades,
  add: addTrade,
  del: delTrade,
}