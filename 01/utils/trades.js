import { http } from 'http.js'

let app = getApp()

function addTrade(orders) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps/trade.php?m=add',
      data: orders
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

function getTrades() {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/trade.php?m=get',
    }).then(function (res) {
      if (res.errno === 0) {
        resolve(res.trades)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

/**
 * options = {
 *  cid: cid,
 *  nocache: false,
 * }
 */
function getProducts(options) {
  return new Promise(function (resolve, reject) {
    let cid = options.cid
    let Products = app.products || {}
    let products = Products['c' + cid]
    if (products && !options.nocache) {
      resolve(products)
    } else {
      getProductsFromServer(options).then(function (products) {
        let Products = app.products || {}
        Products['c' + cid] = products
        app.products = Products
        resolve(products)
      })
        .catch(function (res) {
          reject(res)
        })
    }
  })
}

function getProductsFromServer(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/product.php?m=get',
      data: { cid: options.cid },
    }).then(function (res) {
      if (res.errno === 0) {
        let products = res.products
        for (let i in products) {
          products[i].images = JSON.parse(products[i].images)
        }
        resolve(products)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function getProduct(options) {
  let id = options.id
  let cid = options.cid
  let products = app.products['c' + cid]
  for (let i in products) {
    if (products[i].id == id) {
      return products[i]
    }
  }
}

function set(product, cb) {
  let id = product.id
  let cid = product.cid
  let products = app.products['c' + cid]

  let index = -1
  for (let i in products) {
    if (products[i].id == id) {
      index = i
      break
    }
  }
  if (index < 0) {
    let max = -1
    for (let i in products) {
      if (Number(products[i].sort) > max) {
        max = Number(products[i].sort)
      }
    }
    product.sort = max + 1
    products.push(product)
  } else {
    products[index] = product
  }

  if (app.user.role == 'admin') {
    http.get({
      url: 'sxps/product.php?m=set',
      data: product,
    }).then(function (res) {
      cb && cb(res)
    })
  }
  app.listener.trigger('products', products, product)
}

function del(product) {
  let id = product.id
  let cid = product.cid
  let products = app.products['c' + cid]
  for (let i in products) {
    if (products[i].id == id) {
      products.splice(i, 1)
      break
    }
  }

  if (app.user.role == 'admin') {
    http.get({
      url: 'sxps/product.php?m=del',
      data: product
    })
  }
  app.listener.trigger('products', products)
}

function sort(products) {
  let cid = products[0].cid
  let oldProducts = app.products['c' + cid]
  for (let i in products) {
    let id = products[i].id
    for (let j in oldProducts) {
      if (oldProducts[j].id == id) {
        if (i != j) {
          if (app.user.role == 'admin') {
            http.get({
              url: 'sxps/product.php?m=set',
              data: { id, sort: i }
            })
          }
        }
        break
      }
    }
  }

  app.products['c' + cid] = products
  app.listener.trigger('products', products)
}

export var Trade = {
  get: getTrades,
  add: addTrade,
}