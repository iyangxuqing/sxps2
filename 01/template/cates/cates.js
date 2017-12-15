import { Cate } from '../../utils/cates.js'

let defaults = {

}

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
    this.onCateChanged && this.onCateChanged(activeCateId)
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

    // wx.showActionSheet({
    //   itemList: ['往前移', '往后移', '重命名', '插入', '删除'],
    //   success: function (res) {
    //     if (res.tapIndex == 0) {
    //       this.sortUp(id, pid)
    //     } else if (res.tapIndex == 1) {
    //       this.sortDown(id, pid)
    //     } else if (res.tapIndex == 2) {
    //       page.setData({
    //         'cates.editor': true
    //       })
    //     }
    //   }.bind(this),
    //   complete: function (res) {
    //     for (let i in cates) {
    //       cates[i].editing = false
    //       for (let j in cates[i].children) {
    //         cates[i].children[j].editing = false
    //       }
    //     }
    //     page.setData({
    //       'cates.cates': cates
    //     })
    //   }.bind(this)
    // })
  },

  onEditorSortUp: function (e) {
    let page = getCurrentPages().pop()
    let id = page.data.cates.editor.item.id
    console.log('sortUp', id)
    this.onEditorCancel()
  },

  onEditorSortDown: function (e) {
    let page = getCurrentPages().pop()
    let item = page.data.cates.editor.item
    console.log('sortDown', item)
    this.onEditorCancel()
  },

  onEditorRenameInput: function (e) {
    let value = e.detail.value
    let page = getCurrentPages().pop()
    page.setData({
      'cates.editor.item.rename': value
    })
  },

  onEditorInsertInput: function (e) {
    let value = e.detail.value
    let page = getCurrentPages().pop()
    page.setData({
      'cates.editor.item.insert': value
    })
  },

  onEditorRenameConfirm: function (e) {
    let page = getCurrentPages().pop()
    let id = page.data.cates.editor.item.id
    let title = page.data.cates.editor.item.title
    let rename = page.data.cates.editor.item.rename
    if (rename == '') {
      wx.showModal({
        title: '类目管理',
        content: '　　商品类目不可为空。',
        showCancel: false,
        success: function () {
          return
        }
      })
    } else {
      if (title != rename) {
        Item.set_seller({
          id: id,
          title: rename,
        }).then(function (res) {
          console.log(res)
        })
      }
      this.onEditorCancel()
    }
  },

  onEditorInsertConfirm: function (e) {

  },

  onEditorDelete: function (e) {
    let page = getCurrentPages().pop()
    let id = page.data.cates.editor.id
    console.log('sortDown', id)
    this.onEditorCancel()
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
  }

}

export class Cates {

  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    this.onCateChanged = options.onCateChanged
    let cates = options.cates
    for (let i in cates) {
      cates[i].active = false
      if (i == 0) cates[i].active = true
      for (let j in cates[i].children) {
        cates[i].children[j].active = false
        if (j == 0) cates[i].children[j].active = true
      }
    }
    page.setData({
      'cates.cates': cates
    })
    for (let key in methods) {
      this[key] = methods[key].bind(this)
      page['cates.' + key] = methods[key].bind(this)
      page.setData({
        ['cates.' + key]: 'cates.' + key
      })
    }
  }

  show(item) {
    let id = item.id
    let pid = item.pid
    let page = getCurrentPages().pop()
    let cates = page.data.cates.cates
    page.setData({
      'cates.editor.item': item,
      'cates.editor.show': true,
    })
  }

  sortUp(id, pid) {
    let page = getCurrentPages().pop()
    let cates = page.data.cates.cates
    if (!pid) {
      for (let i in cates) {
        if (cates[i].id == id) {
          if (i > 0) {
            let temp = cates[i]
            cates[i] = cates[i - 1]
            cates[i - 1] = temp
          }
          break
        }
      }
    } else {
      for (let i in cates) {
        if (cates[i].id == pid) {
          for (let j in cates[i].children) {
            if (cates[i].children[j].id == id) {
              if (j > 0) {
                let temp = cates[i].children[j]
                cates[i].children[j] = cates[i].children[j - 1]
                cates[i].children[j - 1] = temp
              }
              break
            }
          }
          break
        }
      }
    }
    page.setData({
      'cates.cates': cates
    })
  }

  sortDown(id, pid) {
    let page = getCurrentPages().pop()
    let cates = page.data.cates.cates
    if (!pid) {
      for (let i in cates) {
        if (cates[i].id == id) {
          if (i < cates.length - 1) {
            let temp = cates[i]
            cates[i] = cates[Number(i) + 1]
            cates[Number(i) + 1] = temp
          }
          break
        }
      }
    } else {
      for (let i in cates) {
        if (cates[i].id == pid) {
          for (let j in cates[i].children) {
            if (cates[i].children[j].id == id) {
              if (j < cates[i].children.length - 1) {
                let temp = cates[i].children[j]
                cates[i].children[j] = cates[i].children[Number(j) + 1]
                cates[i].children[Number(j) + 1] = temp
              }
              break
            }
          }
          break
        }
      }
    }
    page.setData({
      'cates.cates': cates
    })
  }


}