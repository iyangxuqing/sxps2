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
    if (Object.prototype.toString.call(options.fields) === '[object Array]') {
      options.fields = options.fields.join(',')
    }
    http.get({
      url: 'sxps/user.php?m=get',
      data: options
    }).then(function (res) {
      resolve(res.user)
    }).catch(function (res) {
      reject(res)
    })
  })
}

function setUser(options) {
  return new Promise(function (resolve, reject) {
    http.post({
      url: 'sxps/user.php?m=set',
      data: options
    }).then(function (res) {
      resolve(res)
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
      resolve(res)
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