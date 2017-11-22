import { http } from 'http.js'
import { Item } from 'items.js'

let app = getApp()

function getTrades_buyer_v4(options = {}) {
  return new Promise(function (resolve, reject) {
    if (app.trades_buyer && !options.nocache) {
      resolve(app.trades_buyer)
    } else {
      http.get({
        url: 'sxps/trade_buyer_v4.php?m=get',
      }).then(function (res) {
        if (res.errno === 0) {
          let trades = transform(res.trades)
          app.trades_buyer = trades
          resolve(trades)
        } else {
          reject(res)
        }
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function addTrade_buyer_v4(orders) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps/trade_buyer_v4.php?m=add',
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

function getTrades_seller_v4(options = {}) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/trade_seller_v4.php?m=get',
      data: options
    }).then(function (res) {
      if (res.errno === 0) {
        let trades = transformTrades(res.trades)
        resolve(trades)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function setTrades_seller_v4(options) {
  return new Promise(function (resolve, reject) {
    if (!('length' in options)) options = [options]
    http.post({
      url: 'sxps/trade_seller_v4.php?m=set',
      data: options
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

function transformTrades(trades) {
  for (let i in trades) {
    let trade = trades[i]
    let num = 0;
    let amount = 0;
    let realNum = 0;
    let realAmount = 0;
    for (let j in trade.orders) {
      let order = trade.orders[j]
      order.amount = (Number(order.num) * order.price).toFixed(2)
      order.realAmount = (Number(order.realNum) * order.price).toFixed(2)
      num = num + Number(order.num)
      amount = amount + Number(order.amount)
      realNum = realNum + Number(order.realNum)
      realAmount = realAmount + Number(order.realAmount)
    }
    trade.time = new Date(trade.created * 1000).Format('yyyy-MM-dd hh:mm:ss')
    trade.num = num
    trade.amount = amount.toFixed(2)
    trade.realNum = realNum
    trade.realAmount = realAmount.toFixed(2)
  }
  return trades
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

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

function getTrades_seller_v3(options = {}) {
  return new Promise(function (resolve, reject) {
    options.sid = wx.getStorageSync('sellerId')
    http.get({
      url: 'sxps/trade_seller_v3.php?m=get',
      data: options
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

function getTradesSummary_seller(options = {}) {
  return new Promise(function (resolve, reject) {
    options.sid = wx.getStorageSync('sellerId')
    http.get({
      url: 'sxps/trade_seller_v3.php?m=getSummary',
      data: options
    }).then(function (res) {
      if (res.errno === 0) {
        resolve(res.orders)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function setTrades_seller(orders) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps/trade_seller_v3.php?m=set',
      data: { orders }
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

function deliveryTrades(trades) {
  if (!('length' in trades)) trades = [trades]
  let orders = []
  for (let i in trades) {
    if (trades[i].distributed) {
      for (let j in trades[i].orders) {
        orders.push({
          id: trades[i].orders[j].id,
          realNum: trades[i].orders[j].realNum,
          status: '卖家发货',
        })
      }
    }
  }
  http.post({
    url: 'sxps/trade_seller_v3.php?m=set',
    data: { orders: orders }
  }).then(function (res) {
  })
}

function getItemTrades(orders) {
  let trades = []
  for (let i in orders) {
    let order = orders[i]
    let index = -1
    for (let j in trades) {
      if (trades[j].iid == order.iid) {
        index = j
        break
      }
    }
    if (index < 0) {
      index = trades.length
      trades.push({
        iid: order.iid,
        title: order.title,
        image: order.image,
        descs: order.descs,
        num: 0,
        buyers: [],
      })
    }
    trades[index].num += Number(order.num)
    trades[index].buyers.push({
      oid: order.id,
      bid: order.bid,
      name: order.name,
      phone: order.phone,
      address: order.address,
      num: order.num,
      realNum: order.realNum,
    })
  }
  return trades
}

function getBuyerTrades(orders) {
  let trades = []
  for (let i in orders) {
    let order = orders[i]
    let index = -1
    for (let j in trades) {
      if (trades[j].id == order.created + order.bid) {
        index = j
        break
      }
    }
    if (index < 0) {
      index = trades.length
      trades.push({
        id: order.created + order.bid,
        time: new Date(order.created * 1000).Format('yyyy-MM-dd hh:mm:ss'),
        bid: order.bid,
        buyerName: order.name,
        buyerPhone: order.phone,
        buyerAddress: order.address,
        orders: [],
      })
    }
    trades[index].orders.push({
      id: order.id,
      iid: order.iid,
      title: order.title,
      image: order.image,
      descs: order.descs,
      price: Number(order.price).toFixed(2),
      num: order.num,
      realNum: order.realNum,
    })
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
  addTrade_buyer_v4: addTrade_buyer_v4,
  getTrades_buyer_v4: getTrades_buyer_v4,

  getTrades_seller_v3: getTrades_seller_v3,
  getTrades_seller_v4: getTrades_seller_v4,
  setTrades_seller_v4: setTrades_seller_v4,

  getTradesSummary_seller: getTradesSummary_seller,
  deliveryTrades: deliveryTrades,
  setTrades_seller: setTrades_seller,
  getItemTrades: getItemTrades,
  getBuyerTrades: getBuyerTrades,
}