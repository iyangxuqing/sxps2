import { Item } from '../../../utils/items.js'
import { Trade } from '../../../utils/trades.js'

let app = getApp()

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
    this.showTrades()
  },

  onSubmitOrder: function (e) {
    let trade = this.trades[0]
    wx.showModal({
      title: '订单提交',
      content: '　　确定把购物车中的商品进行提交吗？',
      success: function (res) {
        if (res.confirm) {
          Trade.addTrade_buyer(trade).then(function (res) {
            wx.showModal({
              title: '订单提交',
              content: '　　订单提交成功，将进入采买程序。',
              showCancel: false,
              success: function () {
                wx.removeStorageSync('shoppings')
                app.listener.trigger('shoppings')
                this.loadTrades()
              }.bind(this)
            })
          }.bind(this))
        }
      }.bind(this)
    })
  },

  onCancelOrder: function (e) {
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '订单撤回',
      content: '　　确定要把这笔订单撤回吗？撤回后的订单将合并到当前的购物车中。',
      success: function (res) {
        if (res.confirm) {
          Trade.del({ id }).then(function (res) {
            let trade = {}
            let trades = this.data.trades
            let shoppings = wx.getStorageSync('shoppings') || []
            for (let i in trades) {
              if (trades[i].id == id) {
                trade = trades[i]
                break
              }
            }
            for (let j in trade.orders) {
              let order = trade.orders[j]
              let shopping = {
                iid: order.iid,
                num: order.num,
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
            wx.showModal({
              title: '订单撤回',
              content: '　　订单撤回成功，您可以在购物车中进行更改编辑和再次提交。',
              showCancel: false,
              success: function () {
                wx.setStorageSync('shoppings', shoppings)
                app.listener.trigger('shoppings')
                this.loadTrades()
              }.bind(this)
            })
          }.bind(this))
        }
      }.bind(this)
    })
  },

  loadTrades: function () {
    Promise.all([
      Item.getItems(),
      Trade.getTrades_buyer(),
    ]).then(function (res) {
      let items = res[0]
      let trades = res[1]
      let shoppings = wx.getStorageSync('shoppings')
      if (shoppings.length > 0) {
        let trade = {
          id: '未提交',
          status: '未提交',
          created: Math.floor(Date.now() / 1000),
          orders: []
        }
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
                realNum: 0,
              }
              trade.orders.push(order)
              break
            }
          }
        }
        trades.unshift(trade)
      }
      for (let i in trades) {
        let trade = trades[i]
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
      this.trades = trades
      this.showTrades()
    }.bind(this))
  },

  showTrades: function () {
    let status = ''
    let navs = this.data.navs
    for (let i in navs) {
      if (navs[i].active) {
        status = navs[i].title
        break
      }
    }
    let trades = []
    for (let i in this.trades) {
      if (this.trades[i].status == status) {
        trades.push(this.trades[i])
      }
    }
    this.setData({
      trades: trades,
      ready: true
    })
  },

  onLoad: function () {
    let index = wx.getStorageSync('orderIndex') || 0
    let navs = this.data.navs
    for (let i in navs) {
      navs[i].active = false
    }
    navs[index].active = true
    this.setData({ navs })
  },

  onReady: function () {

  },

  onShow: function () {
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