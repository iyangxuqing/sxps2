import { http } from 'http.js'

let app = getApp()

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

function getProductsSync(options) {
  let cid = options.cid
  let Products = app.products
  let products = Products['c' + cid]
  return products
}

function getProduct(options) {
  let id = options.id
  let cid = options.cid
  let Products = app.products
  let products = Products['c' + cid]
  for (let i in products) {
    if (products[i].id == id) {
      return products[i]
    }
  }
}

function set(product, cb) {
  let id = product.id
  let cid = product.cid
  let products = getProductsSync({ cid })

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

  let Products = app.products
  Products['_' + cid] = products
  app.listener.trigger('products', products, product)

  /* server start */
  if (app.user.role == 'admin') {
    let id = product.id
    let cid = product.cid
    let sort = product.sort
    let title = product.title
    let images = product.images
    let descs = product.descs
    let price = product.price
    http.get({
      url: 'sxps/product.php?m=set',
      data: product,
      // data: { id, cid, title, images, descs, price, sort }
    }).then(function (res) {
      cb && cb(res)
    })
  }
  /* server end */
}

function del(product, cb) {
  let id = product.id
  let cid = product.cid
  let products = getProductsSync({ cid })
  for (let i in products) {
    if (products[i].id == id) {
      products.splice(i, 1)
      break
    }
  }

  /* server start */
  if (app.user.role == 'admin') {
    http.get({
      url: 'sxps/product.php?m=del',
      data: { id, cid }
    }).then(function (res) {
      if (!res.error) {
        cb && cb(products, product)
        app.listener.trigger('products', products, product)
      }
    })
  }
  /* server end */
  return products
}

function sort(product, sourceIndex, targetIndex, cb) {
  let cid = product.cid
  let products = getProductsSync({ cid })
  if (sourceIndex < 0 || sourceIndex >= products.length) {
    return products
  }
  if (targetIndex < 0 || targetIndex >= products.length) {
    return products
  }
  products.splice(sourceIndex, 1)
  products.splice(targetIndex, 0, product)

  /* server start */
  if (app.user.role == 'admin') {
    for (let i in products) {
      if (products[i].sort != i) {
        products[i].sort = i
        http.get({
          url: 'sxps/product.php?m=set',
          data: {
            id: products[i].id,
            cid: products[i].cid,
            sort: products[i].sort
          }
        }).then(function (res) {
          if (!res.error) {
            cb && cb(products, product)
            app.listener.trigger('products', products)
          }
        })
      }
    }
  }
  /* server end */
  return products
}

export var Product = {
  getProducts: getProducts,
  getProduct: getProduct,
  set: set,
  del: del,
  sort: sort
}