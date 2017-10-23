import { http } from '../../utils/http.js'

let methods = {

  onImageTap: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'swiperImagesEditor.delImageIndex': -1
    })
    let index = e.currentTarget.dataset.index
    let images = page.data.swiperImagesEditor.images

    http.chooseImage().then(function (image) {
      if (index == -1) {
        index = images.length
        images.push('')
      }
      images[index] = image
      page.setData({
        'swiperImagesEditor.images': images
      })
      this.onImagesChanged && this.onImagesChanged(images)
    }.bind(this))
  },

  onImageDel: function (e) {
    let page = getCurrentPages().pop()
    let index = e.currentTarget.dataset.index
    let images = page.data.swiperImagesEditor.images
    images.splice(index, 1)
    page.setData({
      'swiperImagesEditor.images': images,
      'swiperImagesEditor.delImageIndex': -1
    })
    this.onImagesChanged && this.onImagesChanged(images)
  },

  onImageLongPress: function (e) {
    let page = getCurrentPages().pop()
    let index = e.currentTarget.dataset.index
    page.setData({
      'swiperImagesEditor.delImageIndex': index
    })
    clearTimeout(this.delImageTimer)
    this.delImageTimer = setTimeout(function () {
      page.setData({
        'swiperImagesEditor.delImageIndex': -1
      })
    }, 5000)
  }

}

export class SwiperImagesEditor {

  constructor(options) {
    this.delImageTimer = null
    this.imagesChanged = options.imagesChanged || false
    this.onImagesChanged = options.onImagesChanged || null

    let page = getCurrentPages().pop()
    let swiperImagesEdiotr = {
      delImageIndex: -1,
      images: options.images || [],
      maxImagesLength: options.maxImagesLength || 5
    }
    page.setData({
      swiperImagesEditor: swiperImagesEdiotr
    })

    for (let key in methods) {
      page['swiperImagesEditor.' + key] = methods[key].bind(this)
      page.setData({
        ['swiperImagesEditor.' + key]: 'swiperImagesEditor.' + key
      })
    }
  }

}