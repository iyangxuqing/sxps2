let demo = {
  items: [
    {
      title: '全部商品',
      active: true,
    },
    {
      title: '上架商品'
    },
    {
      title: '下架商品'
    }
  ]
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
    this.onTabTap && this.onTabTap(index)
  }

}

export class Tabs {

  constructor(options = {}) {
    this.onTabTap = options.onTabTap
    let page = getCurrentPages().pop()
    page.setData({
      'tabs.items': options.items || demo.items
    })
    for (let key in methods) {
      page['tabs.' + key] = methods[key].bind(this)
      page.setData({
        ['tabs.' + key]: 'tabs.' + key
      })
    }
  }

}