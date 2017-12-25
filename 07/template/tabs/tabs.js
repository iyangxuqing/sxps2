let defaults = {
  items: [{
    title: '全部商品',
  },
  {
    title: '上架商品'
  },
  {
    title: '下架商品'
  }]
}

let methods = {
  onTabTap: function (e) {
    let page = getCurrentPages().pop()
    let index = e.currentTarget.dataset.index
    let items = page.data.tabs.items
    for (let i in items) {
      items[i].active = false
    }
    items[index].active = true
    page.setData({
      'tabs.items': items
    })
    this.onTabTap && this.onTabTap(index, items[index])
  }
}

export class Tabs {
  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    this.onTabTap = options.onTabTap
    let hasSetActive = false
    for (let i in options.items) {
      if ('active' in options.items[i]) {
        hasSetActive = true
        break
      }
    }
    if (!hasSetActive) {
      options.items[0].active = true
    }
    page.setData({
      'tabs.items': options.items
    })
    for (let key in methods) {
      page['tabs.' + key] = methods[key].bind(this)
      page.setData({
        ['tabs.' + key]: 'tabs.' + key
      })
    }
  }
}