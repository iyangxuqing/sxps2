let defaults = {
  show: false,
  message: '空空如也...',
}

let methods = {

}

export class Empty {
  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    page.setData({
      'empty.show': options.show,
      'empty.message': options.message,
    })
    for (let key in methods) {
      page['empty.' + key] = methods[key].bind(this)
      page.setData({
        ['empty.' + key]: 'empty.' + key
      })
    }
  }
}