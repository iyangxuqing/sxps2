import { Trade } from '../../../utils/trades.js'
import { Product } from '../../../utils/products.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs: [
      {
        title: '全部',
        active: true
      },
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
    let navs = this.data.navs
    for (let i in navs) {
      navs[i].active = false
    }
    navs[index].active = true
    this.setData({
      navs: navs,
    })
    this.loadTrades({ index })
  },

  onSubmitOrder: function (e) {
    let self = this
    wx.showModal({
      title: '订单提交',
      content: '　　确定把购物车中的商品进行提交吗？提交后的订单在当天23：00前还可以进行撤回更改。23：00后将进入采买程序，就不再可以更改了。',
      success: function (res) {
        if (res.confirm) {
          let shoppings = wx.getStorageSync('shoppings')
          let orders = []
          for (let i in shoppings) {
            orders.push({
              iid: shoppings[i].iid,
              price: shoppings[i].price,
              num: shoppings[i].num
            })
          }
          Trade.add(orders).then(function (res) {
            wx.showModal({
              title: '订单提交',
              content: '　　订单提交成功，将进入采买程序。',
              showCancel: false,
              success: function () {
                wx.setStorageSync('shoppings', [])
                self.loadTrades()
              }
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
                          shoppings[k].num = shoppings[k].num + Number(shopping.num)
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

  loadTrades: function () {
    let self = this
    Trade.get({ nocache: true }).then(function (trades) {
      let shoppings = wx.getStorageSync('shoppings') || []
      if (shoppings.length > 0) {
        let orders = []
        for (let i in shoppings) {
          orders.push({
            iid: shoppings[i].iid,
            price: shoppings[i].price,
            bookNum: shoppings[i].num,
            realNum: shoppings[i].num,
          })
        }
        let shoppingsTrade = {
          id: '未提交',
          status: '未提交',
          orders: orders,
          created: Date.now() / 1000,
        }
        trades.unshift(shoppingsTrade)
      }

      for (let i in trades) {
        let trade = trades[i]
        if (!isNaN(trade.id)) trade.id = 10000000 + Number(trade.id)
        trade.time = new Date(trade.created * 1000).Format('yyyy-MM-dd hh:mm:ss')
        let bookNum = 0;
        let realNum = 0;
        let bookAmount = 0;
        let realAmount = 0;
        for (let j in trade.orders) {
          let order = trade.orders[j]
          let iid = order.iid
          let product = Product.getProduct({ id: iid })
          if (product){
            order.image = product.images[0]
            order.title = product.title
            order.descs = product.descs || product.title + '(500克)'
            order.price = product.price
            order.bookAmount = (Number(order.bookNum) * order.price).toFixed(2)
            order.realAmount = (Number(order.realNum) * order.price).toFixed(2)
            bookNum = bookNum + Number(order.bookNum)
            bookAmount = bookAmount + Number(order.bookNum) * Number(order.price)
            realNum = realNum + Number(order.realNum)
            realAmount = realAmount + Number(order.realNum) * Number(order.price)
          }
        }
        trade.bookNum = bookNum
        trade.bookAmount = bookAmount.toFixed(2)
        trade.realNum = realNum
        trade.realAmount = realAmount.toFixed(2)
      }

      let status = ''
      let navs = self.data.navs
      for (let i in navs) {
        if (navs[i].active) status = navs[i].title
      }
      if (status == '全部') status = ''
      let _trades = []
      for (let i in trades) {
        if (trades[i].status == status || !status) {
          _trades.push(trades[i])
        }
      }
      self.trades = trades
      self.setData({
        trades: _trades,
        ready: true
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let index = 0
    if (id == 'link-0') index = 1
    if (id == 'link-1') index = 2
    if (id == 'link-2') index = 3
    if (id == 'link-3') index = 4
    let navs = this.data.navs
    for (let i in navs) {
      navs[i].active = false
    }
    navs[index].active = true
    this.setData({
      navs: navs
    })
    this.loadTrades()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})