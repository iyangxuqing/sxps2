import { http } from 'http.js'

function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        http.post({
          url: 'sxps/user.php?m=login',
          data: { code: res.code }
        }).then(function (res) {
          if (res.errno === 0) {
            wx.setStorageSync('token', res.token)
            wx.setStorageSync('user', res.user)
            resolve()
          } else {
            reject(res)
          }
        })
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}

function getUser(options = {}) {
  return new Promise(function (resolve, reject) {
    let user = wx.getStorageSync('user')
    if (user && !options.nocache) {
      resolve(user)
    } else {
      http.get({
        url: 'sxps/user.php?m=get',
        data: options
      }).then(function (res) {
        if (res.errno === 0) {
          wx.setStorageSync('user', res.user)
          resolve(res.user)
        } else {
          reject(res.user)
        }
      }).catch(function (res) {
        reject(res)
      })
    }
  })
}

function setUser(options) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps/user.php?m=set',
      data: options
    }).then(function (res) {
      if (res.errno === 0) {
        let user = wx.getStorageSync('user')
        user = Object.assign({}, user, options)
        wx.setStorageSync('user', user)
        resolve(res)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function mobileCodeRequest(mobile) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps/mobile.php?m=codeRequest',
      data: {
        tplId: 29922,
        mobile: mobile
      }
    }).then(function (res) {
      if (res.errno === 0) {
        let user = wx.getStorageSync('user')
        user.mobileNumber = mobile
        wx.setStorageSync('user', user)
      } else {
        reject(res)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

function mobileCodeVerify(mobile, code) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps/mobile.php?m=codeVerify',
      data: { mobile, code },
    }).then(function (res) {
      resolve(res)
      if (res.mobileVerified === 1) {
        let user = wx.getStorageSync('user')
        user.mobileVerified = 1
        wx.setStorageSync('user', user)
      }
    }).catch(function (res) {
      reject(res)
    })
  })
}

export var User = {
  login: login,
  getUser: getUser,
  setUser: setUser,
  mobileCodeRequest: mobileCodeRequest,
  mobileCodeVerify: mobileCodeVerify,
}