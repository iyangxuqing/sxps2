let config = require('config.js')

function get(options) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: config.apiUrl + options.url,
      header: {
        'ver': config.ver,
        'aid': config.aid,
        'token': wx.getStorageSync('token'),
        'Content-Type': 'application/json',
      },
      data: options.data,
      success: function (res) {
        if (res.data && res.data.errno === 0) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}

function post(options) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: config.apiUrl + options.url,
      method: 'POST',
      header: {
        'ver': config.ver,
        'aid': config.aid,
        'token': wx.getStorageSync('token'),
        'Content-Type': 'application/json',
      },
      data: options.data,
      success: function (res) {
        if (res.data && res.data.errno === 0) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}

/**
 * options = {
 *  source: source,
 *  target: target,
 * }
 */
function cosUpload(options) {
  return new Promise(function (resolve, reject) {
    let source = options.source
    let extension = source.split('.').pop()
    let target = config.aid + '/' + options.target + '.' + extension
    http.get({
      url: 'sxps/cos.php?m=signature',
      data: { filename: target }
    }).then(function (res) {
      if (res.errno === 0) {
        let url = res.url
        let sign = res.multi_signature
        wx.uploadFile({
          url: url,
          name: 'filecontent',
          filePath: source,
          header: {
            Authorization: sign,
          },
          formData: {
            op: 'upload',
            insertOnly: 0,
          },
          success: function (res) {
            if (res.statusCode == 200) {
              let data = JSON.parse(res.data)
              if (data.message && data.message == 'SUCCESS') {
                let url = config.youImageHost + target
                resolve({
                  url,
                  target,
                  errno: 0,
                  error: '',
                })
              } else {
                reject(res)
              }
            }
          },
          fail: function (res) {
            reject(res)
          }
        })
      }
    })
  })
}

/**
 * options = {
 *  filename: filename
 * }
 */
function cosDelete(options) {
  return new Promise(function (resolve, reject) {
    http.get({
      url: 'sxps/cos.php?m=signature',
      data: {
        filename: options.filename
      }
    }).then(function (res) {
      let url = res.url
      let sign = res.once_signature
      wx.request({
        url: url,
        header: {
          'Authorization': sign,
        },
        method: 'POST',
        data: { op: "delete" },
        success: function (res) {
          if (res.statusCode === 200) {
            let data = res.data
            if (data.message && data.message === 'SUCCESS') {
              resolve({ errno: 0, error: '' })
            }
          }
        },
      })
    })
  })
}

function chooseImage() {
  return new Promise(function (resolve, reject) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        let tempFilePath = res.tempFilePaths[0]
        wx.showNavigationBarLoading()
        http.cosUpload({
          source: tempFilePath,
          target: Date.now()
        }).then(function (res) {
          if (res.errno === 0) {
            resolve(res.url)
            wx.hideNavigationBarLoading()
          } else {
            reject(res)
            wx.hideNavigationBarLoading()
          }
        }).catch(function (res) {
          reject(res)
          wx.hideNavigationBarLoading()
        })
      },
    })
  })
}

export var http = {
  get: get,
  post: post,
  cosUpload: cosUpload,
  cosDelete: cosDelete,
  chooseImage: chooseImage,
}