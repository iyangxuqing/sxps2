let methods = {

  onItemTap: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let items = page.data.sellerItemsGrid.items
    let item = {}
    for (let i in items) {
      if (items[i].id == id) {
        item = items[i]
        break
      }
    }
    page.setData({
      'sellerItemsGrid.editItemId': ''
    })
    this.onItemTap && this.onItemTap(item)
  },

  onItemDel: function (e) {
    let self = this
    wx.showModal({
      title: '删除提示',
      content: '确定要把该项删除吗？删除后不能恢复。',
      success: function (res) {
        if (res.confirm) {
          let page = getCurrentPages().pop()
          let id = e.currentTarget.dataset.id
          let items = page.data.sellerItemsGrid.items
          let item = {}
          let index = -1
          for (let i in items) {
            if (items[i].id == id) {
              item = items[i]
              index = i
              break
            }
          }
          items.splice(index, 1)
          page.setData({
            'sellerItemsGrid.editItemId': '',
            'sellerItemsGrid.items': items
          })
          self.onItemDel && self.onItemDel(item)
        }
      }
    })
  },

  onItemSortUp: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let items = page.data.sellerItemsGrid.items
    let index = -1
    for (let i in items) {
      if (items[i].id == id) {
        index = i
        break
      }
    }
    let temp = items[index]
    if (index > 0) {
      items[index] = items[index - 1]
      items[index - 1] = temp
      this.onItemSort && this.onItemSort(items, this.sort)
      if (this.sort == 'desc') {
        for (let i in items) {
          items[i].sort = items.length - i
        }
      } else {
        for (let i in items) {
          items[i].sort = i
        }
      }
    }
    page.setData({
      'sellerItemsGrid.editItemId': '',
      'sellerItemsGrid.items': items
    })

  },

  onItemSortDown: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let items = page.data.sellerItemsGrid.items
    let index = -1
    for (let i in items) {
      if (items[i].id == id) {
        index = i
        break
      }
    }
    let temp = items[index]
    if (index < items.length - 1) {
      items[index] = items[Number(index) + 1]
      items[Number(index) + 1] = temp
      this.onItemSort && this.onItemSort(items, this.sort)
      if (this.sort == 'desc') {
        for (let i in items) {
          items[i].sort = items.length - i
        }
      } else {
        for (let i in items) {
          items[i].sort = i
        }
      }
    }
    page.setData({
      'sellerItemsGrid.editItemId': '',
      'sellerItemsGrid.items': items
    })
  },

  onItemLongPress: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    page.setData({
      'sellerItemsGrid.editItemId': id,
    })
    clearTimeout(this.editItemTimer)
    this.editItemTimer = setTimeout(function () {
      page.setData({
        'sellerItemsGrid.editItemId': '',
      })
    }, 6000)
  }

}

export class SellerItemsGrid {

  constructor(options = {}) {
    this.editItemTimer = null
    this.onItemTap = options.onItemTap
    this.onItemDel = options.onItemDel
    this.onItemSort = options.onItemSort

    let sellerItemsGrid = {
      items: options.items || [],
      editItemId: '',
    }

    let page = getCurrentPages().pop()
    page.setData({
      sellerItemsGrid: sellerItemsGrid
    })
    for (let key in methods) {
      page['sellerItemsGrid.' + key] = methods[key].bind(this)
      page.setData({
        ['sellerItemsGrid.' + key]: 'sellerItemsGrid.' + key
      })
    }
  }

}