import { User } from '../../utils/user.js'

let data = {
  mobile: {
    codeRequestText: '发送验证码',
    number: '',
    code: '',
    numberError: false,
    codeError: false,
    verified: false,
  }
}

let methods = {

  onNumberBlur: function (e) {
    let mobileNumber = e.detail.value
    var reg = /^1[3|4|5|7|8]\d{9}$/
    if (reg.test(mobileNumber)) {
      User.setUser({
        mobileNumber: mobileNumber
      })
    }
  },

  onCodeRequest: function (e) {
    let page = getCurrentPages().pop()
    let mobile = e.detail.value.number
    if (mobile == '') return

    let codeRequestText = page.data.mobile.codeRequestText
    if (codeRequestText != '发送验证码') return

    var reg = /^1[3|4|5|7|8]\d{9}$/
    if (!reg.test(mobile)) {
      getApp().listener.trigger('toptip', '手机号码输入有误')
      page.setData({
        'mobile.numberError': true
      })
      return
    }

    page.setData({
      'mobile.number': mobile,
      'mobile.codeRequested': true,
    })

    User.mobileCodeRequest(mobile)
      .then(function (res) {
        if (res.error == 'this mobile is used') {
          getApp().listener.trigger('toptip', '手机号码已被绑定')
          page.setData({
            'mobile.numberError': true
          })
        }
      })

    let second = 60
    page.setData({
      'mobile.codeRequestText': '60秒后重发'
    })
    let timer = setInterval(function () {
      second--
      if (second == 0) {
        let codeRequestText = '发送验证码'
        page.setData({
          'mobile.codeRequestText': codeRequestText
        })
        clearInterval(timer)
      } else {
        let codeRequestText = second + '秒后重发'
        if (second < 10) codeRequestText = '0' + codeRequestText
        page.setData({
          'mobile.codeRequestText': codeRequestText
        })
      }
    }, 1000)
  },

  onNumberInputFocus: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'mobile.numberError': false
    })
  },

  onCodeInput: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'mobile.code': e.detail.value
    })
  },

  onCodeInputFocus: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'mobile.codeError': false
    })
  },

  onCodeConfirm: function (e) {
    let page = getCurrentPages().pop()
    let mobile = page.data.mobile.number
    let code = page.data.mobile.code
    if (code == '') return;

    User.mobileCodeVerify(mobile, code)
      .then(function (res) {
        if (!res.error) {
          page.setData({
            'mobile.codeInputAnimateCss': 'slideUp'
          })
          setTimeout(() => {
            page.setData({
              'mobile.verified': true,
              'mobile.codeRequested': false,
            })
          }, 300)
        } else {
          page.setData({
            'mobile.codeError': true
          })
          getApp().listener.trigger('toptip', '验证码错误')
        }
      }.bind(this))
      .catch(function (res) {
        page.setData({
          'mobile.codeError': true
        })
        getApp().listener.trigger('toptip', '验证码错误')
      }.bind(this))
  }
}

export class Mobile {
  constructor(options) {
    this.init()
  }

  init() {
    let page = getCurrentPages().pop()
    let mobile = Object.assign({}, data.mobile)
    page.setData({
      mobile: mobile
    })
    for (let key in methods) {
      page['mobile.' + key] = methods[key].bind(this)
      page.setData({
        ['mobile.' + key]: 'mobile.' + key
      })
    }
  }
}