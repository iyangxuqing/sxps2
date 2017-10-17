import { Loading } from '../../../template/loading/loading.js'
import { Toptip } from '../../../template/toptip/toptip.js'
import { User } from "../../../utils/user.js"

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

    let region = this.data.region
    if(options.province) region[0] = options.province
    if(options.city) region[1] = options.city
    if(options.district) region[2] = options.district
    let addressDetail = options.detail
    this.setData({
      region,
      addressDetail,
    })
  },

  onAddressSubmit: function (e) {
    let address_province = this.data.region[0]
    let address_city = this.data.region[1]
    let address_district = this.data.region[2]
    let address_detail = e.detail.value.addressDetail

    this.loading.show()
    User.setUser({
      address_province,
      address_city,
      address_district,
      address_detail
    }).then(function (res) {
      if (res.errno === 0) {
        this.loading.hide()
        this.toptip.show({
          title: '地址保存成功',
          success: function () {
            app.listener.trigger('userAddressUpdate', {
              province: address_province,
              city: address_city,
              district: address_district,
              detail: address_detail,
            })
            wx.navigateBack()
          }
        })
      }
    }.bind(this))
  },

  onAddressCancel: function (e) {
    wx.navigateBack()
  }

})