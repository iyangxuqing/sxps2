let cates = [
  {
    id: 1,
    name: '项目',
    children: [
      {
        id: 1001,
        name: '项目'
      },
      {
        id: 1002,
        name: '项目02'
      },
      {
        id: 1003,
        name: '项目1003'
      },
      {
        id: 1004,
        name: '项目1004'
      },
      {
        id: 1005,
        name: '项目1005'
      },
      {
        id: 1006,
        name: '项目1006'
      },
      {
        id: 1007,
        name: '项目1007'
      },
      {
        id: 1008,
        name: '项目1008'
      },
      {
        id: 1009,
        name: '项目1009'
      },
      {
        id: 1010,
        name: '项目1010'
      },
      {
        id: 1011,
        name: '项目1011'
      },
      {
        id: 1012,
        name: '项目1012'
      },
      {
        id: 1013,
        name: '项目1013'
      },
      {
        id: 1014,
        name: '项目1014'
      },
      {
        id: 1015,
        name: '项目1015'
      },
      {
        id: 1016,
        name: '项目1016'
      },                        
    ]
  },
  {
    id: 2,
    name: '项目二',
    children: [
      {
        id: 2001,
        name: '瓜类2001'
      },
      {
        id: 2002,
        name: '瓜类2002'
      },
      {
        id: 2003,
        name: '瓜类2003'
      },
      {
        id: 2004,
        name: '瓜类2004'
      },
      {
        id: 2005,
        name: '瓜类2005'
      },
      {
        id: 2006,
        name: '瓜类2006'
      },
      {
        id: 2007,
        name: '瓜类2007'
      },
      {
        id: 2008,
        name: '瓜类2008'
      },
    ]
  },
  {
    id: 3,
    name: '项目一'
  },
  {
    id: 4,
    name: '项目二'
  },
  {
    id: 5,
    name: '项目项目'
  },
  {
    id: 6,
    name: '项目项目五'
  },
  {
    id: 7,
    name: '项目'
  }
]

function getCates() {
  return new Promise(function (resolve, reject) {
    resolve(cates)
  })
}

function getCate2s(options) {
  return new Promise(function (resolve, reject) {
    for (let i in cates) {
      if (cates[i].id == options.id) {
        if (!cates[i].children) cates[i].children = []
        resolve(cates[i].children)
        break
      }
    }
  })
}

function getProducts(options) {
  let cid = options.cid
  let products = []
  for (let i = 0; i < 10; i++) {
    let product = {
      id: cid + '-' + i,
      name: '产品' + cid + '-9653' + i,
      desc: '产品描述产品附注',
      price: '123.56',
      image: '/images/product.jpg'
    }
    products.push(product)
  }
  return new Promise(function (resolve, reject) {
    if (cid) {
      resolve(products)
    } else {
      resolve([])
    }
  })
}

export let Cates = {
  getCates: getCates,
  getCate2s: getCate2s,
}

export let Products = {
  getProducts: getProducts,
}

