let config = require('utils/config.js')
import 'utils/util.js'
import { User } from 'utils/user.js'
import { Listener } from 'utils/listener.js'

App({
  onLaunch: function () {
    this.init()
  },

  init: function () {
    this.listener = new Listener()
    this.youImageMode = config.youImageMode

    User.login().then(function () {
      User.getUser({
        fields: 'role'
      }).then(function (user) {
        this.user = Object.assign({}, this.user, user)
        this.user.role = 'admin'
      }.bind(this))
    }.bind(this))
  }

})