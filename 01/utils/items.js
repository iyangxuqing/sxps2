import { http } from 'http.js'
import { Dataver } from 'dataver.js'

let app = getApp()

function getItems_seller(options = {}) {
  return new Promise(function (resolve, reject) {
    let items = app.items_seller
    if (items && !options.nocache) {
      resolve(app.items_seller)
    } else {
      http.get({
        url: 'sxps/item_v2.php?m=get',
      }).then(function (res) {
        if (res.errno === 0) {
          let items = res.items
          for (let i in items) {
            if (!items[i].images) items[i].images = '[]'
            items[i].images = JSON.parse(items[i].images)
            items[i].price = Number(items[i].price).toFixed(2)
          }
          app.items_seller = items
          Dataver.setExpired('items', res.dataver)
          resolve(items)
        } else {
          reject(res)
        }
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function setItem_seller(item, method) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/item_v2.php?m=' + method,
      data: item
    }).then(function (res) {
      if (res.errno === 0) {
        let items = res.items
        for (let i in items) {
          if (!items[i].images) items[i].images = '[]'
          items[i].images = JSON.parse(items[i].images)
          items[i].price = Number(items[i].price).toFixed(2)
        }
        app.items_seller = items
        Dataver.setExpired('items', res.dataver)
        app.listener.trigger('items', items)
        resolve(items)
      } else {
        app.listener.trigger('request fail', res)
        reject(res)
      }
    }).catch(function (res) {
      app.listener.trigger('request fail', res)
      reject(res)
    })
  })
}

function getItems(options = {}) {
  return new Promise(function (resolve, reject) {
    let items = wx.getStorageSync('items')
    let expired = Dataver.getExpired('items')
    if (items && !expired && !options.nocache) {
      resolve(items)
    } else {
      http.get({
        url: 'sxps/item_v2.php?m=get',
      }).then(function (res) {
        if (res.errno === 0) {
          let items = res.items
          for (let i in items) {
            if (!items[i].images) items[i].images = '[]'
            items[i].images = JSON.parse(items[i].images)
            items[i].price = Number(items[i].price).toFixed(2)
          }
          wx.setStorageSync('items', items)
          Dataver.setExpired('items', res.dataver)
          resolve(items)
        } else {
          reject(res)
        }
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function getItem(options) {
  let items = wx.getStorageSync('items')
  for (let i in items) {
    if (items[i].id == options.id) {
      return items[i]
    }
  }
}

function getItem_seller(options) {
  let items = app.items_seller
  for (let i in items) {
    if (items[i].id == options.id) {
      return items[i]
    }
  }
}

function setItem(item) {
  return new Promise(function (resolve, reject) {
    let id = item.id
    let items = wx.getStorageSync('items') || []
    let index = -1
    for (let i in items) {
      if (items[i].id == id) {
        index = i
        break
      }
    }
    if (index < 0) {
      let max = -1
      for (let i in items) {
        if (Number(items[i].sort) > max) {
          max = Number(items[i].sort)
        }
      }
      item.sort = max + 1
      items.push(item)
    } else {
      items[index] = item
    }
    http.get({
      url: 'sxps/item.php?m=set',
      data: item,
    }).then(function (res) {
      if (res.errno === 0) {
        if (res.insertId) item.id = res.insertId
        wx.setStorageSync('items', items)
        app.listener.trigger('items', items)
        resolve(items)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function delItem(item) {
  let id = item.id
  let items = wx.getStorageSync('items') || []
  for (let i in items) {
    if (items[i].id == id) {
      items.splice(i, 1)
      break
    }
  }
  wx.setStorageSync('items', items)
  http.get({
    url: 'sxps/item.php?m=del',
    data: item
  })
}

function sortItems(_items, item1, item2) {
  let items = wx.getStorageSync('items')
  http.post({
    url: 'sxps/item.php?m=sort',
    data: [{
      id: item1.id,
      sort: item1.sort,
    }, {
      id: item2.id,
      sort: item2.sort,
    }]
  })

  let i1 = -1
  let i2 = -1
  for (let i in items) {
    if (items[i].id == item1.id) i1 = i
    if (items[i].id == item2.id) i2 = i
    if (i1 > -1 && i2 > -1) break
  }
  let temp = items[i1]
  items[i1] = items[i2]
  items[i2] = temp
  wx.setStorageSync('items', items)
}

export var Item = {
  getItems: getItems,
  getItem: getItem,
  setItem: setItem,
  delItem: delItem,
  sortItems: sortItems,
  getItems_seller: getItems_seller,
  getItem_seller: getItem_seller,
  set_seller: setItem_seller,
}