import { http } from 'http.js'
import { Item } from 'items.js'

let app = getApp()

function addTrade_buyer(trade) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps/trade_v2.php?m=add',
      data: trade
    }).then(function (res) {
      if (res.errno === 0) {
        app.trades_buyer = res.trades
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function getTrades_buyer(options = {}) {
  return new Promise(function (resolve, reject) {
    let trades = app.trades_buyer
    if (trades && !options.nocache) {
      resolve(JSON.parse(JSON.stringify(trades)))
    } else {
      getTrades({ buyer: true }).then(function (trades) {
        app.trades_buyer = trades
        resolve(JSON.parse(JSON.stringify(trades)))
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function getTrades(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/trade_v2.php?m=get',
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
      url: 'sxps/trade_v2.php?m=del',
      data: { id: options.id }
    }).then(function (res) {
      if (res.errno === 0) {
        app.trades_buyer = res.trades
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function getTrades_seller(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/trade_seller.php?m=get',
      data: { sid: wx.getStorageSync('sellerId') }
    }).then(function (res) {
      if (res.errno === 0) {
        app.trades_seller = res.orders
        resolve(res.orders)
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
  del: delTrade,

  addTrade_buyer: addTrade_buyer,
  getTrades_buyer: getTrades_buyer,

  getTrades_seller: getTrades_seller,
}