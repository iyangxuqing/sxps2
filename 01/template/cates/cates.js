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
      page['cates.' + key] = methods[key].bind(this)
      page.setData({
        ['cates.' + key]: 'cates.' + key
      })
    }
  }

}