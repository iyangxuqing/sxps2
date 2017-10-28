import { SwiperImagesEditor } from '../../../template/swiperImagesEditor/swiperImagesEditor.js'
import { Category } from '../../../utils/categorys.js'
import { Item } from '../../../utils/items.js'

let app = getApp()

Page({

  hasChanged: false,

  data: {
    youImageMode: app.youImageMode_v5
  },

  onCatesPickerChange: function (e) {
    let value = e.detail.value
    this.setData({
      value
    })
    this.onCategoryChanged(value)
  },

  onCatesPickerColumnChange: function (e) {
    let column = e.detail.column
    let value = e.detail.value
    if (column == 0) {
      let range = [this.cates, this.cates[value].children]
      this.setData({
        range
      })
    }
  },

  onCategoryChanged: function (value) {
    let level1Index = value[0]
    let level2Index = value[1]
    let cid = this.cates[level1Index].children[level2Index].id
    let oldCid = this.data.item.cid
    if (cid != oldCid) {
      this.setData({
        'item.cid': cid
      })
      this.hasChanged = true
    }
  },

  onImagesChanged: function (images) {
    this.setData({
      'item.images': images
    })
    this.hasChanged = true
  },

  onTitleBlur: function (e) {
    let title = e.detail.value
    let oldTitle = this.data.item.title
    if (title == '' || title == oldTitle) {
      this.setData({
        'item.title': oldTitle
      })
    } else {
      this.setData({
        'item.title': title
      })
      this.hasChanged = true
    }
  },

  onDescsBlur: function (e) {
    let descs = e.detail.value
    let oldDescs = this.data.item.descs
    if (descs != oldDescs) {
      this.setData({
        'item.descs': descs
      })
      this.hasChanged = true
    }
  },

  onPriceBlur: function (e) {
    let price = e.detail.value
    let oldPrice = this.data.item.price
    if (price != oldPrice) {
      this.setData({
        'item.price': price
      })
      this.hasChanged = true
    }
  },

  onMinVolBlur: function (e) {
    let minVol = e.detail.value
    let oldMinVol = this.data.item.minVol
    if (minVol != oldminVol) {
      this.setData({
        'item.minVol': minVol
      })
      this.hasChanged = true
    }
  },

  onVolumnBlur: function (e) {
    let volumn = e.detail.value
    let oldVolumn = this.data.item.volumn
    if (volumn != oldVolumn) {
      this.setData({
        'item.volumn': volumn
      })
      this.hasChanged = true
    }
  },

  onSellingChanged: function (e) {
    let onSell = e.detail.value ? 1 : 0
    this.setData({
      'item.onSell': onSell
    })
    this.hasChanged = true
  },

  saveData() {
    let item = this.data.item
    item.sid = wx.getStorageSync('sellerId')
    Item.setSellerItem(item)
  },

  onLoad: function (options) {
    let id = options.id
    let item = Item.getSellerItem({ id })
    if (!item) {
      item = {
        price: 0,
        minVol: 10,
        volumn: 2000,
        onSell: true,
      }
    }
    item.price = Number(item.price).toFixed(2)
    this.setData({
      item: item
    })

    this.swiperImagesEditor = new SwiperImagesEditor({
      maxImagesLength: 1,
      images: item.images,
      onImagesChanged: this.onImagesChanged
    })

    let that = this
    Category.getCategorys().then(function (cates) {
      that.cates = cates
      let range = [cates, cates[0].children]
      let level1Index = -1
      let level2Index = -1
      for (let i in cates) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].id == item.cid) {
            level1Index = i
            level2Index = j
            break
          }
        }
        if (level1Index >= 0) break
      }
      let value = [level1Index, level2Index]
      that.setData({
        range,
        value,
        ready: true
      })
    })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {
    if (this.hasChanged) {
      this.saveData()
    }
  },

  onUnload: function () {
    if (this.hasChanged) {
      this.saveData()
    }
  },

})