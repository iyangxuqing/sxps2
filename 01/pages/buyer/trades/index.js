import { Item } from '../../../utils/items.js'
import { Trade } from '../../../utils/trades.js'

Page({

  data: {
    navs: [
      {
        title: '未提交'
      },
      {
        title: '已提交'
      },
      {
        title: '已发货'
      },
      {
        title: '已完成'
      }
    ]
  },

  onNavTap: function (e) {
    let index = e.currentTarget.dataset.index
    wx.setStorageSync('orderIndex', index)
    let navs = this.data.navs
    for (let i in navs) {
      navs[i].active = false
    }
    navs[index].active = true
    this.setData({
      navs: navs,
    })
    this.loadTrades(status)
  },

  onSubmitOrder: function (e) {
    let that = this
    wx.showModal({
      title: '订单提交',
      content: '　　确定把购物车中的商品进行提交吗？',
      success: function (res) {
        if (res.confirm) {
          let orders = []
          let shoppings = wx.getStorageSync('shoppings')
          Item.getItems().then(function (items) {
            for (let i in shoppings) {
              for (let j in items) {
                if (shoppings[i].iid == items[j].id) {
                  let order = {
                    iid: items[j].id,
                    sid: items[j].sid,
                    title: items[j].title,
                    descs: items[j].descs,
                    image: items[j].images[0],
                    price: items[j].price,
                    num: shoppings[i].num,
                  }
                  orders.push(order)
                  break
                }
              }
            }
            Trade.add({ orders }).then(function (res) {
              wx.showModal({
                title: '订单提交',
                content: '　　订单提交成功，将进入采买程序。',
                showCancel: false,
                success: function () {
                  wx.removeStorageSync('shoppings')
                  wx.removeStorageSync('trades_buyer')
                  that.loadTrades()
                }
              })
            })
          })
        }
      }
    })
  },

  onCancelOrder: function (e) {
    let id = e.currentTarget.dataset.id
    let self = this
    wx.showModal({
      title: '订单撤回',
      content: '　　确定要把这笔订单撤回吗？撤回后的订单将合并到当前的购物车中。',
      success: function (res) {
        if (res.confirm) {
          Trade.del({
            id: id - 10000000
          }).then(function (res) {
            wx.showModal({
              title: '订单撤回',
              content: '　　订单撤回成功，您可以在购物车中进行更改编辑和再次提交。',
              showCancel: false,
              success: function () {
                let trades = self.trades
                let shoppings = wx.getStorageSync('shoppings') || []
                for (let i in trades) {
                  if (trades[i].id == id) {
                    let trade = trades[i]
                    for (let j in trade.orders) {
                      let order = trade.orders[j]
                      let shopping = {
                        iid: order.iid,
                        title: order.title,
                        image: order.image,
                        price: order.price,
                        descs: order.descs,
                        num: order.bookNum,
                      }
                      let index = -1
                      for (let k in shoppings) {
                        if (shoppings[k].iid == shopping.iid) {
                          index = k
                          break
                        }
                      }
                      if (index < 0) {
                        shoppings.push(shopping)
                      }
                    }
                    break
                  }
                }
                wx.setStorageSync('shoppings', shoppings)
                self.loadTrades()
              }
            })
          })
        }
      }
    })
  },

  loadTradesFromLocal: function () {
    let shoppings = wx.getStorageSync('shoppings')
    Item.getItems().then(function (items) {
      let num = 0
      let amount = 0
      let realNum = 0
      let realAmount = 0
      let trades = []
      let orders = []
      for (let i in shoppings) {
        for (let j in items) {
          if (shoppings[i].iid == items[j].id) {
            let order = {
              iid: items[j].id,
              sid: items[j].sid,
              title: items[j].title,
              descs: items[j].descs,
              image: items[j].images[0],
              price: items[j].price,
              minVol: items[j].minVol,
              maxVol: items[j].volumn,
              num: shoppings[i].num,
              amount: Number(items[j].price * shoppings[i].num).toFixed(2)
            }
            num = num + Number(order.num)
            amount = amount + Number(order.amount)
            orders.push(order)
            break
          }
        }
      }
      if (orders.length > 0) {
        let trade = {
          id: '未提交',
          status: '未提交',
          orders: orders,
          created: Date.now() / 1000,
          time: new Date().Format('yyyy-MM-dd hh:mm:ss'),
          num: num,
          amount: amount.toFixed(2),
          realNum: realNum,
          realAmount: realAmount.toFixed(2)
        }
        trades.push(trade)
      }
      this.setData({
        trades: trades,
        ready: true
      })
    }.bind(this))
  },

  loadTradesFromRemote: function (status) {
    Trade.getTrades_buyer().then(function (trades) {
      for (let i in trades) {
        let trade = trades[i]
        trade.id = 10000000 + Number(trade.id)
        trade.time = new Date(trade.created * 1000).Format('yyyy-MM-dd hh:mm:ss')
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
        trade.num = num
        trade.amount = amount.toFixed(2)
        trade.realNum = realNum
        trade.realAmount = realAmount.toFixed(2)
      }

      let _trades = []
      for (let i in trades) {
        if (trades[i].status == status) {
          _trades.push(trades[i])
        }
      }
      this.setData({
        trades: _trades,
        ready: true
      })
    }.bind(this))
  },

  loadTrades() {
    let status = ''
    let navs = this.data.navs
    for (let i in navs) {
      if (navs[i].active) {
        status = navs[i].title
        break
      }
    }
    if (status == '未提交') {
      this.loadTradesFromLocal()
    } else {
      this.loadTradesFromRemote(status)
    }
  },

  onLoad: function () {

  },

  onReady: function () {

  },

  onShow: function () {
    let index = wx.getStorageSync('orderIndex') || 0
    let navs = this.data.navs
    for (let i in navs) {
      navs[i].active = false
    }
    navs[index].active = true
    this.setData({ navs })
    this.loadTrades()
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})