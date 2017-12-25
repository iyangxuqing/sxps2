let defaults = {
  items: [{
    title: '待发货',
  },
  {
    title: '已发货',
  },
  {
    title: '已完成',
  }],
  justify: 'justify-between'
}

let methods = {
  onTopnavTap: function (e) {
    let page = getCurrentPages().pop()
    let index = e.currentTarget.dataset.index
    let items = page.data.topnavs.items
    for (let i in items) {
      items[i].active = false
    }
    items[index].active = true
    page.setData({
      'topnavs.items': items
    })
    this.onTopnavTap && this.onTopnavTap(index, items[index])
  }
}

/**
 * options = {
 *  items: [],
 *  justify: 'justify-between' || 'justify-left',
 *  onTopnavTap: function(index, items[index]),
 * }
 */
export class Topnavs {

  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    this.onTopnavTap = options.onTopnavTap
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
      'topnavs.items': options.items,
      'topnavs.justify': options.justify,
    })
    for (let key in methods) {
      page['topnavs.' + key] = methods[key].bind(this)
      page.setData({
        ['topnavs.' + key]: 'topnavs.' + key
      })
    }
  }

  getActiveItem() {
    let page = getCurrentPages().pop()
    let items = page.data.topnavs.items
    for (let i in items) {
      if (items[i].active == true) {
        return items[i]
      }
    }
  }
}