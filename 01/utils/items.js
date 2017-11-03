import { http } from 'http.js'

let app = getApp()

function getItems(options = {}) {
  return new Promise(function (resolve, reject) {
    let items = wx.getStorageSync('items')
    if (items && !options.nocache) {
      resolve(items)
    }
    http.get({
      url: 'sxps/item.php?m=get',
    }).then(function (res) {
      if (res.errno === 0) {
        let items = res.items
        for (let i in items) {
          if (!items[i].images) items[i].images = '[]'
          items[i].images = JSON.parse(items[i].images)
          items[i].price = Number(items[i].price).toFixed(2)
        }
        wx.setStorageSync('items', items)
        resolve(items)
      } else {
        reject(items)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

// function getItems(options = {}) {
//   return new Promise(function (resolve, reject) {
//     // let items = app.items
//     let items = wx.getStorageSync('items')
//     if (items && !options.nocache) {
//       resolve(items)
//     } else {
//       http.get({
//         url: 'sxps/item.php?m=get',
//       }).then(function (res) {
//         if (res.errno === 0) {
//           let items = res.items
//           for (let i in items) {
//             if (!items[i].images) items[i].images = '[]'
//             items[i].images = JSON.parse(items[i].images)
//             items[i].price = Number(items[i].price).toFixed(2)
//           }
//           // app.items = items
//           wx.setStorageSync('items', items)
//           resolve(items)
//         } else {
//           reject(items)
//         }
//       }).catch(function (res) {
//         reject(res)
//       })
//     }
//   })
// }

function getSellerItems_buyer(options = {}) {
  return new Promise(function (resolve, reject) {
    getItems().then(function (items) {
      let sellerItems = []
      for (let i in items) {
        if (items[i].sid == options.sid) {
          sellerItems.push(items[i])
        }
      }
      resolve(sellerItems)
    })
  })
}

function getCategoryItems_buyer(options = {}) {
  return new Promise(function (resolve, reject) {
    getItems().then(function (items) {
      let categoryItems = []
      for (let i in items) {
        if (items[i].cid == options.cid) {
          categoryItems.push(items[i])
        }
      }
      resolve(categoryItems)
    })
  })
}

function getSellerItems(options = {}) {
  return new Promise(function (resolve, reject) {
    let sellerItems = app.sellerItems
    if (sellerItems && !options.nocache) {
      resolve(sellerItems)
    } else {
      http.get({
        url: 'sxps/item.php?m=get',
        data: {
          sid: wx.getStorageSync('sellerId')
        }
      }).then(function (res) {
        if (res.errno === 0) {
          let items = res.items
          for (let i in items) {
            if (!items[i].images) items[i].images = '[]'
            items[i].images = JSON.parse(items[i].images)
          }
          app.sellerItems = items
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

function getSellerItem(options) {
  let sellerItems = app.sellerItems
  for (let i in sellerItems) {
    if (sellerItems[i].id == options.id) {
      return sellerItems[i]
    }
  }
}

function setSellerItem(item) {
  return new Promise(function (resolve, reject) {
    let id = item.id
    let items = app.sellerItems

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
        app.listener.trigger('items', items, item)
        resolve(items, item)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function delSellerItem(item) {
  let id = item.id
  let items = app.sellerItems
  for (let i in items) {
    if (items[i].id == id) {
      items.splice(i, 1)
      break
    }
  }
  http.get({
    url: 'sxps/item.php?m=del',
    data: item
  })
}

function sortSellerItems(items) {
  let oldItems = app.sellerItems
  for (let i in items) {
    let id = items[i].id
    for (let j in oldItems) {
      if (oldItems[j].id == id) {
        if (i != j) {
          http.get({
            url: 'sxps/item.php?m=set',
            data: { id, sort: i }
          })
        }
      }
    }
  }
  app.sellerItems = items
}

export var Item = {
  getSellerItems: getSellerItems,
  getSellerItem: getSellerItem,
  setSellerItem: setSellerItem,
  delSellerItem: delSellerItem,
  sortSellerItems: sortSellerItems,

  getItems: getItems,
  getSellerItems_buyer: getSellerItems_buyer,
  getCategoryItems_buyer: getCategoryItems_buyer,
}