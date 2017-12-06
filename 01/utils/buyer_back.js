import { http } from 'http.js'

let app = getApp()

function getBuyer(options = {}) {
  return new Promise(function (resolve, reject) {
    if ('buyer' in app && !options.nocache) {
      resolve(app.buyer)
    } else {
      http.get({
        url: 'sxps/buyer.php?m=get',
      }).then(function (res) {
        if (res.errno === 0) {
          app.buyer = res.buyer
          resolve(app.buyer)
        } else {
          reject(res)
        }
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function setBuyer(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/buyer.php?m=set',
      data: options
    }).then(function (res) {
      if (res.errno === 0) {
        Object.assign(app.buyer, options)
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

export var Buyer = {
  getBuyer: getBuyer,
  setBuyer: setBuyer,
}