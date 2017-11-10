import { http } from 'http.js'
import { Item } from 'items.js'

let app = getApp()

function getTrades_buyer_v3(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/trade_v3.php?m=get',
    }).then(function (res) {
      if (res.errno === 0) {
        let trades = transformOrdersToTrades_buyer(res.orders)
        app.trades_buyer = trades
        resolve(trades)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function addTrade_buyer_v3(orders) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps/trade_v3.php?m=add',
      data: orders
    }).then(function (res) {
      if (res.errno === 0) {
        let trades = transformOrdersToTrades_buyer(res.orders)
        app.trades_buyer = trades
        resolve(trades)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function transformOrdersToTrades_buyer(orders) {
  let trades = []
  for (let i in orders) {
    let created = orders[i].created
    let index = -1
    for (let j in trades) {
      if (trades[j].id == created) {
        index = j
        break
      }
    }
    if (index < 0) {
      index = trades.length
      trades.push({
        id: orders[i].created,
        time: new Date(orders[i].created * 1000).Format('yyyy-MM-dd hh:mm:ss'),
        orders: []
      })
    }
    trades[index].orders.push(orders[i])
  }
  return trades
}

function addTrade_buyer_v3_old(orders) {
  let trades = []
  for (let i in orders) {
    let order = orders[i]
    let sid = order.sid
    let index = -1
    for (let j in trades) {
      if (trades[j].sid == sid) {
        index = j
        break
      }
    }
    if (index < 0) {
      index = trades.length
      trades.push({
        sid: sid,
        orders: []
      })
    }
    trades[index].orders.push({
      iid: order.iid,
      title: order.title,
      image: order.image,
      descs: order.descs,
      price: order.price,
      num: order.num
    })
  }
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps/trade_v3.php?m=add',
      data: trades
    }).then(function (res) {
      if (res.errno === 0) {
        app.trades_buyer_v3 = res.trades
        resolve(res.trades)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

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

  addTrade_buyer_v3: addTrade_buyer_v3,
  getTrades_buyer_v3: getTrades_buyer_v3,
}