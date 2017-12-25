let defaults = {}

let methods = {

  getActiveCId: function () {
    let page = getCurrentPages().pop()
    let cates = page.data.cates.cates
    for (let i in cates) {
      if (cates[i].active == true) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].active == true) {
            return cates[i].children[j].id
          }
        }
      }
    }
  },

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
    this.cateChanged && this.cateChanged(this.getActiveCId())
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