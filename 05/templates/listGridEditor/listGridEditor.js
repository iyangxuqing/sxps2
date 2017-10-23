import { http } from '../../utils/http.js'

let methods = {

  onItemTap: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let items = page.data.listGridEditor.items
    let item = {}
    for (let i in items) {
      if (items[i].id == id) {
        item = items[i]
        break
      }
    }
    page.setData({
      'listGridEditor.editItemId': ''
    })
    this.onItemTap && this.onItemTap(item)
  },

  onItemDel: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let items = page.data.listGridEditor.items
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
      'listGridEditor.editItemId': '',
      'listGridEditor.items': items
    })
    this.onItemDel && this.onItemDel(item)
  },

  onItemSortUp: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let items = page.data.listGridEditor.items
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
      'listGridEditor.editItemId': '',
      'listGridEditor.items': items
    })

  },

  onItemSortDown: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let items = page.data.listGridEditor.items
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
      'listGridEditor.editItemId': '',
      'listGridEditor.items': items
    })
  },

  onItemLongPress: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    page.setData({
      'listGridEditor.editItemId': id,
    })
    clearTimeout(this.editItemTimer)
    this.editItemTimer = setTimeout(function () {
      page.setData({
        'listGridEditor.editItemId': '',
      })
    }, 6000)
  }

}

export class ListGridEditor {

  constructor(options = {}) {
    this.touchPositionX = 0
    this.touchPositionY = 0
    this.editItemTimer = null
    this.onItemTap = options.onItemTap
    this.onItemDel = options.onItemDel
    this.onItemSort = options.onItemSort

    let listGridEditor = {
      items: options.items || [],
      editItemId: '',
      moving: {
        sourceIndex: -1,
        targetIndex: -1,
        top: 0,
        left: 0,
        display: 'none',
        item: {}
      }
    }

    let page = getCurrentPages().pop()
    page.setData({
      listGridEditor: listGridEditor
    })
    for (let key in methods) {
      page['listGridEditor.' + key] = methods[key].bind(this)
      page.setData({
        ['listGridEditor.' + key]: 'listGridEditor.' + key
      })
    }
  }

}