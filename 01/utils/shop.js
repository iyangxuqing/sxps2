import { http } from 'http.js'

let app = getApp()

function getShop(options = {}) {
  return new Promise(function (resolve, reject) {
    let shop = app.shop
    if (shop && !options.nocache) {
      resolve(app.shop)
    } else {
      http.get({
        url: 'sxps/shop.php?m=get',
        data: options
      }).then(function (res) {
        if (res.errno === 0) {
          let shop = res.shop || {
            id: options.id,
            name: '',
            phone: '',
            address: '',
            logo: '',
            images: '[]',
            latitude: 29.26948,
            longitude: 120.05691,
          }
          shop.images = JSON.parse(shop.images)
          shop.latitude = Number(shop.latitude)
          shop.longitude = Number(shop.longitude)
          app.shop = shop
          resolve(shop)
        } else {
          reject(res)
        }
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function setShop(shop) {
  return new Promise(function (resolve, reject) {
    let data = Object.assign({}, shop)
    data.images = JSON.stringify(data.images)
    http.post({
      url: 'sxps/shop.php?m=set',
      data: data
    }).then(function (res) {
      if (res.errno === 0) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })

    /* app.shop */
    app.shop = shop
    app.listener.trigger('shop', shop)
  })
}

function registerShop(shop) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/shop.php?m=register',
      data: shop
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

export var Shop = {
  get: getShop,
  set: setShop,
  register: registerShop,
}