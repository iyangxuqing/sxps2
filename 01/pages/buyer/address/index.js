import { Loading } from '../../../template/loading/loading.js'
import { Toptip } from '../../../template/toptip/toptip.js'
import { Buyer } from "../../../utils/buyer.js"

let app = getApp()

Page({

  data: {
    region: ['浙江省', '金华市', '义乌市'],
  },

  onRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
    })
  },

  onLoad: function (options) {
    this.toptip = new Toptip()
    this.loading = new Loading()
    this.loading.show()
    Buyer.getBuyer().then(function (buyer) {
      if (!buyer) buyer = {}
      let region = this.data.region
      if (buyer.province) region[0] = buyer.province
      if (buyer.city) region[1] = buyer.city
      if (buyer.district) region[2] = buyer.district
      this.setData({
        region,
        name: buyer.name,
        address: buyer.address,
        ready: true,
      })
      this.loading.hide()
    }.bind(this)).catch(function (res) {
      this.loading.hide()
    }.bind(this))
  },

  onAddressSubmit: function (e) {
    let buyer = {
      name: e.detail.value.name,
      address: e.detail.value.address,
      district: this.data.region[2],
      city: this.data.region[1],
      province: this.data.region[0],
    }
    this.loading.show()
    Buyer.setBuyer(buyer).then(function (res) {
      if (res.errno === 0) {
        this.toptip.show({
          title: '地址保存成功',
          success: function () {
            app.listener.trigger('buyerUpdate', buyer)
            wx.navigateBack()
          }
        })
        this.loading.hide()
      }
    }.bind(this)).catch(function (res) {
      this.loading.hide()
    }.bind(this))
  },

  onAddressCancel: function (e) {
    wx.navigateBack()
  }

})