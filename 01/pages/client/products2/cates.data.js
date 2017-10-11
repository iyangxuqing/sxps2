let cates2 = [
  {
    id: 1,
    title: '大类一',
    children: [
      {
        id: 1001,
        title: '类目1001'
      },
      {
        id: 1002,
        title: '类目1002'
      },
      {
        id: 1003,
        title: '类目1003'
      },
      {
        id: 1004,
        title: '类目1004'
      },
      {
        id: 1005,
        title: '类目1005'
      },
      {
        id: 1006,
        title: '类目1006'
      },
    ]
  },
  {
    id: 2,
    title: '大类二',
    children: [
      {
        id: 2001,
        title: '类目2001'
      },
      {
        id: 2002,
        title: '类目2002'
      },
      {
        id: 2003,
        title: '类目2003'
      },
      {
        id: 2004,
        title: '类目2004'
      },
      {
        id: 2005,
        title: '类目2005'
      },
      {
        id: 2006,
        title: '类目2006'
      },
    ]
  },
  {
    id: 3,
    title: '大类三',
    children: [
      {
        id: 3001,
        title: '类目3001'
      },
      {
        id: 3002,
        title: '类目3002'
      },
      {
        id: 3003,
        title: '类目3003'
      },
      {
        id: 3004,
        title: '类目3004'
      },
      {
        id: 3005,
        title: '类目3005'
      },
      {
        id: 3006,
        title: '类目3006'
      },
    ]
  },
  {
    id: 4,
    title: '大类四',
    children: [
      {
        id: 4001,
        title: '类目4001'
      },
      {
        id: 4002,
        title: '类目4002'
      },
      {
        id: 4003,
        title: '类目4003'
      },
      {
        id: 4004,
        title: '类目4004'
      },
      {
        id: 4005,
        title: '类目4005'
      },
      {
        id: 4006,
        title: '类目4006'
      },
    ]
  },
  {
    id: 5,
    title: '大类五',
    children: [
      {
        id: 5001,
        title: '类目5001'
      },
      {
        id: 5002,
        title: '类目5002'
      },
      {
        id: 5003,
        title: '类目5003'
      },
      {
        id: 5004,
        title: '类目5004'
      },
      {
        id: 5005,
        title: '类目5005'
      },
      {
        id: 5006,
        title: '类目5006'
      },
    ]
  },
  {
    id: 6,
    title: '大类六',
    children: [
      {
        id: 6001,
        title: '类目6001'
      },
      {
        id: 6002,
        title: '类目6002'
      },
      {
        id: 6003,
        title: '类目6003'
      },
      {
        id: 6004,
        title: '类目6004'
      },
      {
        id: 6005,
        title: '类目6005'
      },
      {
        id: 6006,
        title: '类目6006'
      },
    ]
  },    
  
]

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
    resolve(cates2)
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

