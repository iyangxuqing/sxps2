import { http } from 'http.js'
import { Dataver } from 'dataver.js'

let app = getApp()

function getCates_seller(options = {}) {
  return new Promise(function (resolve, reject) {
    let cates = app.cates_seller
    if (cates && !options.nocache) {
      resolve(cates)
    } else {
      http.get({
        url: 'sxps/cate_v2.php?m=get',
      }).then(function (res) {
        if (res.errno === 0) {
          let cates = transformCates(res.cates)
          app.cates_seller = cates
          resolve(cates)
        } else {
          reject(res)
        }
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function setCate_seller(cate, method) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/cate_v2.php?m=' + method,
      data: cate
    }).then(function (res) {
      if (!res.error) {
        res.cates = transformCates(res.cates)
        app.cates_seller = res.cates
      }
      resolve(res)
    }).catch(function (res) {
      app.listener.trigger('request fail', res)
      reject(res)
    })
  })
}

function getCates(options = {}) {
  return new Promise(function (resolve, reject) {
    let cates = wx.getStorageSync('cates')
    let expired = Dataver.getExpired('cates')
    if (cates && !expired && !options.nocache) {
      resolve(cates)
    } else {
      http.get({
        url: 'sxps/cate.php?m=get',
      }).then(function (res) {
        if (res.errno === 0) {
          let cates = transformCates(res.cates)
          wx.setStorageSync('cates', cates)
          Dataver.setExpired('cates', res.dataver)
          resolve(cates)
        } else {
          reject(res)
        }
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function transformCates(_cates) {
  let cates = []
  for (let i in _cates) {
    let cate = _cates[i]
    if (cate.pid == 0) {
      cate.children = []
      cates.push(cate)
    } else {
      for (let j in cates) {
        if (cate.pid == cates[j].id) {
          cates[j].children.push(cate)
          break
        }
      }
    }
  }
  return cates
}

function set(cate) {
  return new Promise(function (resolve, reject) {
    let cates = wx.getStorageSync('cates')
    let id = cate.id
    let pid = cate.pid
    let title = cate.title
    if (id == '') {
      if (pid == 0) {
        cate.children = []
        cates.push(cate)
      } else {
        for (let i in cates) {
          if (cates[i].id == pid) {
            cates[i].children.push(cate)
            break
          }
        }
      }
    } else {
      if (pid == 0) {
        for (let i in cates) {
          if (cates[i].id == id) {
            cates[i].title = title
            break
          }
        }
      } else {
        for (let i in cates) {
          if (cates[i].id == pid) {
            for (let j in cates[i].children) {
              if (cates[i].children[j].id == id) {
                cates[i].children[j].title = title
                break
              }
            }
            break
          }
        }
      }
    }

    let data = JSON.parse(JSON.stringify(cate))
    if ('children' in data) delete data.children
    http.get({
      url: 'sxps/cate.php?m=set',
      data: data,
    }).then(function (res) {
      if (res.errno === 0) {
        if (res.insertId) {
          cate.id = res.insertId
          cate.sort = res.insertId
        }
        wx.setStorageSync('cates', cates)
        resolve(cates)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function del(cate) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/cate.php?m=del',
      data: cate
    }).then(function (res) {
      if (res.errno === 0) {
        if (res.affectedRows) {
          let cates = wx.getStorageSync('cates')
          for (let i in cates) {
            if (cates[i].id == cate.id) {
              cates.splice(i, 1)
              break
            }
            for (let j in cates[i].children) {
              if (cates[i].children[j].id == cate.id) {
                cates[i].children.splice(j, 1)
                break
              }
            }
          }
          wx.setStorageSync('cates', cates)
          res.cates = cates
        }
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function sort(cate, asc = 1) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/cate.php?m=sort',
      data: {
        id: cate.id,
        asc: asc
      }
    }).then(function (res) {
      if (res.errno === 0) {
        let id = cate.id
        let cates = wx.getStorageSync('cates')
        for (let i in cates) {
          if (cates[i].id == id) {
            if (asc) {
              if (i > 0) {
                let temp = cates[i]
                cates[i] = cates[i - 1]
                cates[i - 1] = temp
              }
            } else {
              if (i < cates.length - 1) {
                let temp = cates[i]
                cates[i] = cates[Number(i) + 1]
                cates[Number(i) + 1] = temp
              }
            }
            break
          }
          for (let j in cates[i].children) {
            if (cates[i].children[j].id == id) {
              if (asc) {
                if (j > 0) {
                  let temp = cates[i].children[j]
                  cates[i].children[j] = cates[i].children[j - 1]
                  cates[i].children[j - 1] = temp
                }
              } else {
                if (j < cates[i].children.length - 1) {
                  let temp = cates[i].children[j]
                  cates[i].children[j] = cates[i].children[Number(j) + 1]
                  cates[i].children[Number(j) + 1] = temp
                }
              }
              break
            }
          }
        }
        wx.setStorageSync('cates', cates)
        resolve(cates)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

export var Cate = {
  getCates: getCates,
  set: set,
  del: del,
  sort: sort,
  getCates_seller: getCates_seller,
  set_seller: setCate_seller,
}