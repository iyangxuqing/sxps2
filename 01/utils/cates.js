import { http } from 'http.js'

let app = getApp()

function getCates(options = {}) {
  return new Promise(function (resolve, reject) {
    let cates = wx.getStorageSync('cates')
    if (cates && !options.nocache) {
      resolve(cates)
    }
    http.get({
      url: 'sxps/cate.php?m=get',
    }).then(function (res) {
      if (res.errno === 0) {
        let cates = transformCates(res.cates)
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

// function getCates(options = {}) {
//   return new Promise(function (resolve, reject) {
//     if (app.cates && !options.nocache) {
//       resolve(app.cates)
//     } else {
//       http.get({
//         url: 'sxps/cate.php?m=get',
//       }).then(function (res) {
//         if (res.errno === 0) {
//           app.cates = transformCates(res.cates)
//           resolve(app.cates)
//         } else {
//           reject(res)
//         }
//       }).catch(function (res) {
//         reject(res)
//       })
//     }
//   })
// }

function transformCates(cates) {
  cates = JSON.parse(JSON.stringify(cates))
  let _cates = []
  for (let i in cates) {
    let cate = cates[i]
    if (cate.pid == 0) {
      cate.children = []
      _cates.push(cate)
    } else {
      for (let j in _cates) {
        if (cate.pid == _cates[j].id) {
          _cates[j].children.push(cate)
          break
        }
      }
    }
  }
  return _cates
}

function set(cate) {
  return new Promise(function (resolve, reject) {
    let cates = app.cates
    let id = cate.id
    let pid = cate.pid
    let title = cate.title
    if (id == '') {
      if (pid == 0) {
        let max = 0
        for (let i in cates) {
          if (max < cates[i].sort) max = cates[i].sort
        }
        max = Number(max) + 1
        cate.sort = max
        cate.children = []
        cates.push(cate)
      } else {
        for (let i in cates) {
          if (cates[i].id == pid) {
            let max = 0
            for (let j in cates[i].children) {
              if (max < cates[i].children[j].sort) max = cates[i].children[j].sort
            }
            max = Number(max) + 1
            cate.sort = max
            cates[i].children.push(cate)
            break
          }
        }
      }
    } else {
      if (pid == 0) {
        for (let i in cates) {
          if (cates[i].id == id) {
            if (cates[i].title != title) {
              cates[i].title = title
            }
            break
          }
        }
      } else {
        for (let i in cates) {
          if (cates[i].id == pid) {
            for (let j in cates[i].children) {
              if (cates[i].children[j].id == id) {
                if (cates[i].children[j].title != title) {
                  cates[i].children[j].title = title
                }
                break
              }
            }
            break
          }
        }
      }
    }

    let data = {
      id: cate.id,
      pid: cate.pid,
      title: cate.title,
    }
    if (cate.sort) data.sort = cate.sort
    http.get({
      url: 'sxps/cate.php?m=set',
      data: data
    }).then(function (res) {
      if (res.errno === 0) {
        if (res.insertId) cate.id = res.insertId
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
          let cates = app.cates
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
        let cates = app.cates
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
}