let methods = {

  onItemTap: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let items = page.data.itemsGrid.items
    let item = {}
    for (let i in items) {
      if (items[i].id == id) {
        item = items[i]
        break
      }
    }
    page.setData({
      'itemsGrid.editItemId': ''
    })
    this.onItemTap && this.onItemTap(item)
  },

  onItemDel: function (e) {
    wx.showModal({
      title: '删除提示',
      content: '确定要把该项删除吗？删除后不能恢复。',
      success: function (res) {
        if (res.confirm) {
          let page = getCurrentPages().pop()
          let id = e.currentTarget.dataset.id
          let items = page.data.itemsGrid.items
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
            'itemsGrid.editItemId': '',
            'itemsGrid.items': items
          })
          this.onItemDel && this.onItemDel(item)
        }
      }.bind(this)
    })
  },

  onItemSortUp: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let items = page.data.itemsGrid.items
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
      this.onItemSort && this.onItemSort(items, temp, items[index])
    }
    page.setData({
      'itemsGrid.editItemId': '',
      'itemsGrid.items': items
    })

  },

  onItemSortDown: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let items = page.data.itemsGrid.items
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
      this.onItemSort && this.onItemSort(items, temp, items[index])
    }
    page.setData({
      'itemsGrid.editItemId': '',
      'itemsGrid.items': items
    })
  },

  onItemLongPress: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    page.setData({
      'itemsGrid.editItemId': id,
    })
    clearTimeout(this.editItemTimer)
    this.editItemTimer = setTimeout(function () {
      page.setData({
        'itemsGrid.editItemId': '',
      })
    }, 6000)
  }

}

export class itemsGrid {

  constructor(options = {}) {
    this.editItemTimer = null
    this.onItemTap = options.onItemTap
    this.onItemDel = options.onItemDel
    this.onItemSort = options.onItemSort

    let itemsGrid = {
      items: options.items || [],
      editItemId: '',
    }

    let page = getCurrentPages().pop()
    page.setData({
      itemsGrid: itemsGrid
    })
    for (let key in methods) {
      page['itemsGrid.' + key] = methods[key].bind(this)
      page.setData({
        ['itemsGrid.' + key]: 'itemsGrid.' + key
      })
    }
  }

}