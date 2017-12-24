import { http } from 'http.js'
import { Dataver } from 'dataver.js'

let app = getApp()

function getCates(options = {}) {
  return new Promise(function (resolve, reject) {
    let cates = wx.getStorageSync('cates')
    let expired = Dataver.getExpired('cates')
    if (cates && !expired && !options.nocache) {
      resolve(cates)
    } else {
      http.get({
        url: 'sxps/cate.php?m=get',
      }).then(function (res) {
        let cates = transformCates(res.cates)
        wx.setStorageSync('cates', cates)
        Dataver.setExpired('cates', res.dataver)
        resolve(cates)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function getCates_seller(options = {}) {
  return new Promise(function (resolve, reject) {
    let cates = app.cates_seller
    if (cates && !options.nocache) {
      resolve(cates)
    } else {
      http.get({
        url: 'sxps/cate.php?m=get',
      }).then(function (res) {
        let cates = transformCates(res.cates)
        app.cates_seller = cates
        resolve(cates)
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function setCate_seller(cate, method) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/cate.php?m=' + method,
      data: cate
    }).then(function (res) {
      if (!res.error) {
        res.cates = transformCates(res.cates)
        app.cates_seller = res.cates
      }
      resolve(res)
    }).catch(function (res) {
      reject(res)
    })
  })
}

function transformCates(cates) {
  let _cates = []
  for (let i in cates) {
    if (cates[i].pid == 0) {
      cates[i].children = []
      _cates.push(cates[i])
    } else {
      for (let j in _cates) {
        if (cates[i].pid == _cates[j].id) {
          _cates[j].children.push(cates[i])
          break
        }
      }
    }
  }
  return _cates
}

export var Cate = {
  getCates: getCates,
  getCates_seller: getCates_seller,
  setCate_seller: setCate_seller,
}