import { SwiperImagesEditor } from '../../template/swiperImagesEditor/swiperImagesEditor.js'
import { Category } from '../../utils/categorys.js'

Page({

  data: {
  },

  onLoad: function (options) {
    let item = {
      images: []
    }
    this.swiperImagesEditor = new SwiperImagesEditor({
      maxImagesLength: 3,
      images: item.images,
      onImagesChanged: this.onImagesChanged
    })

    let that = this
    Category.getCategorys().then(function (cates) {
      that.cates = cates
      let range = [cates, cates[0].children]
      let value = [0, 0]
      that.setData({
        range,
        value,
      })
    })
  },

  onCatesPickerChange: function (e) {
    let value = e.detail.value
    this.setData({
      value
    })
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

})