import { Cate } from '../../utils/cates.js'

let defaults = {}

let methods = {

  onCateTap: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let cates = page.data.cates.cates
    if (!pid) {
      for (let i in cates) {
        cates[i].active = false
        if (cates[i].id == id) cates[i].active = true
      }
    } else {
      for (let i in cates) {
        if (cates[i].id == pid) {
          for (let j in cates[i].children) {
            cates[i].children[j].active = false
            if (cates[i].children[j].id == id) cates[i].children[j].active = true
          }
          break
        }
      }
    }
    page.setData({
      'cates.cates': cates
    })
    let activeCateId = ''
    for (let i in cates) {
      if (cates[i].active == true) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].active == true) {
            activeCateId = cates[i].children[j].id
            break
          }
        }
        break
      }
    }
    this.cateChanged && this.cateChanged(activeCateId)
  },

  onCateLongPress: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let page = getCurrentPages().pop()
    let cates = page.data.cates.cates
    let cate = {}
    if (!pid) {
      for (let i in cates) {
        cates[i].editing = false
        if (cates[i].id == id) {
          cate = cates[i]
          cates[i].editing = true
        }
      }
    } else {
      for (let i in cates) {
        if (cates[i].id == pid) {
          for (let j in cates[i].children) {
            cates[i].children[j].editing = false
            if (cates[i].children[j].id == id) {
              cate = cates[i].children[j]
              cates[i].children[j].editing = true
            }
          }
          break
        }
      }
    }
    page.setData({
      'cates.cates': cates,
      'cates.editor.item': cate,
      'cates.editor.show': true,
    })
  },

  onCateNewBlur: function (e) {
    let page = getCurrentPages().pop()
    let pid = e.currentTarget.dataset.pid
    let title = e.detail.value
    if (title) {
      Cate.setCate_seller({ pid, title }, 'insert').then(function (res) {
        page.setData({ 'cates.newCateTitle': '' })
        this.update(res.cates)
      }.bind(this))
    }
  },

  onEditorSortUp: function (e) {
    let page = getCurrentPages().pop()
    let cate = page.data.cates.editor.item
    Cate.setCate_seller(cate, 'sortUp').then(function (res) {
      this.update(res.cates)
    }.bind(this))
    this.onEditorCancel()
  },

  onEditorSortDown: function (e) {
    let page = getCurrentPages().pop()
    let cate = page.data.cates.editor.item
    Cate.setCate_seller(cate, 'sortDown').then(function (res) {
      this.update(res.cates)
    }.bind(this))
    this.onEditorCancel()
  },

  onEditorRenameInput: function (e) {
    let value = e.detail.value
    let page = getCurrentPages().pop()
    page.setData({
      'cates.editor.item.rename': value
    })
  },

  onEditorRenameConfirm: function (e) {
    let page = getCurrentPages().pop()
    let cate = page.data.cates.editor.item
    if (cate.rename && cate.rename != cate.title) {
      Cate.setCate_seller({
        id: cate.id,
        title: cate.rename,
      }, 'update').then(function (res) {
        page.setData({
          'cates.editor.item.rename': '',
        })
        this.update(res.cates)
      }.bind(this))
    }
    this.onEditorCancel()
  },

  onEditorDelete: function (e) {
    wx.showModal({
      title: '类目管理',
      content: '确定要删除该类目吗？删除后将不可恢复。',
      success: function (res) {
        if (res.confirm) {
          let page = getCurrentPages().pop()
          let item = page.data.cates.editor.item
          Cate.setCate_seller({ id: item.id }, 'delete').then(function (res) {
            if (res.error) {
              wx.showModal({
                title: '类目管理',
                content: res.error,
                showCancel: false,
                success: function () { }
              })
            } else {
              this.update(res.cates)
            }
          }.bind(this))
        }
      }.bind(this),
      complete: function (res) {
        this.onEditorCancel()
      }.bind(this)
    })
  },

  onEditorCancel: function (e) {
    let page = getCurrentPages().pop()
    let cates = page.data.cates.cates
    for (let i in cates) {
      cates[i].editing = false
      for (let j in cates[i].children) {
        cates[i].children[j].editing = false
      }
    }
    page.setData({
      'cates.cates': cates,
      'cates.editor.show': false,
    })
  },

}

export class Cates {

  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    this.cateChanged = options.cateChanged
    for (let key in methods) {
      this[key] = methods[key].bind(this)
      page['cates.' + key] = methods[key].bind(this)
      page.setData({
        ['cates.' + key]: 'cates.' + key
      })
    }
  }

  update(cates) {
    let page = getCurrentPages().pop()
    let oldCates = page.data.cates.cates
    let activeIds = []
    for (let i in oldCates) {
      if (oldCates[i].active == true) {
        activeIds.push(oldCates[i].id)
      }
      for (let j in oldCates[i].children) {
        if (oldCates[i].children[j].active == true) {
          activeIds.push(oldCates[i].children[j].id)
          break
        }
      }
    }
    for (let i in cates) {
      if (activeIds.indexOf(cates[i].id) > -1) {
        cates[i].active = true
      }
      for (let j in cates[i].children) {
        if (activeIds.indexOf(cates[i].children[j].id) > -1) {
          cates[i].children[j].active = true
        }
      }
    }
    let hasActived = false
    for (let i in cates) {
      if (cates[i].active == true) {
        hasActived = true
        break
      }
    }
    if (!hasActived) cates[0].active = true
    for (let i in cates) {
      hasActived = false
      for (let j in cates[i].children) {
        if (cates[i].children[j].active == true) {
          hasActived = true
          break
        }
      }
      if (!hasActived && cates[i].children && cates[i].children.length) {
        cates[i].children[0].active = true
      }
    }
    page.setData({
      'cates.cates': cates
    })
  }

}