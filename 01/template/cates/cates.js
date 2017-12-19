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

  onEditorSortUp: function (e) {
    let page = getCurrentPages().pop()
    let cate = page.data.cates.editor.item
    Cate.set_seller(cate, 'sortUp').then(function (res) {
      this.update(res.cates)
    }.bind(this))
    this.onEditorCancel()
  },

  onEditorSortDown: function (e) {
    let page = getCurrentPages().pop()
    let cate = page.data.cates.editor.item
    Cate.set_seller(cate, 'sortDown').then(function (res) {
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

  onEditorInsertChildInput: function (e) {
    let value = e.detail.value
    let page = getCurrentPages().pop()
    page.setData({
      'cates.editor.item.insertChild': value
    })
  },

  onEditorInsertAfterInput: function (e) {
    let value = e.detail.value
    let page = getCurrentPages().pop()
    page.setData({
      'cates.editor.item.insertAfter': value
    })
  },

  onEditorRenameConfirm: function (e) {
    let page = getCurrentPages().pop()
    let cate = page.data.cates.editor.item
    if (cate.rename == '') {
      wx.showModal({
        title: '类目管理',
        content: '　　商品类目不可为空。',
        showCancel: false,
        success: function () {
          return
        }
      })
    } else {
      if (cate.title != cate.rename) {
        Cate.set_seller({
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
    }
  },

  onEditorInsertChildConfirm: function (e) {
    let page = getCurrentPages().pop()
    let cate = page.data.cates.editor.item
    if (cate.insertChild == '') {
      wx.showModal({
        title: '类目管理',
        content: '　　商品类目不可为空。',
        showCancel: false,
        success: function () {
          return
        }
      })
    } else {
      Cate.set_seller({
        pid: cate.id,
        title: cate.insertChild,
      }, 'insertChild').then(function (res) {
        page.setData({
          'cates.editor.item.insertChild': '',
        })
        this.update(res.cates)
      }.bind(this))
    }
    this.onEditorCancel()
  },

  onEditorInsertAfterConfirm: function (e) {
    let page = getCurrentPages().pop()
    let cate = page.data.cates.editor.item
    if (cate.insertAfter == '') {
      wx.showModal({
        title: '类目管理',
        content: '　　商品类目不可为空。',
        showCancel: false,
        success: function () {
          return
        }
      })
    } else {
      Cate.set_seller({
        pid: cate.pid,
        title: cate.insertAfter,
        sort: Number(cate.sort) + 1,
      }, 'insertAfter').then(function (res) {
        page.setData({
          'cates.editor.item.insertAfter': '',
        })
        this.update(res.cates)
      }.bind(this))
    }
    this.onEditorCancel()
  },

  onEditorDelete: function (e) {
    wx.showModal({
      title: '类目管理',
      content: '　　确定要删除该类目吗？删除后将不可恢复。',
      success: function (res) {
        if (res.confirm) {
          let page = getCurrentPages().pop()
          let item = page.data.cates.editor.item
          Cate.set_seller({ id: item.id }, 'delete').then(function (res) {
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

  update: function (cates) {
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

}