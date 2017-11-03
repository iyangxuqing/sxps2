let config = require('utils/config.js')
import 'utils/util.js'
import { User } from 'utils/user.js'
import { Dataver } from 'utils/dataver.js'
import { Listener } from 'utils/listener.js'

App({
  onLaunch: function () {
    this.init()
  },

  init: function () {
    this.listener = new Listener()
    this.expired = config.expired
    this.youImageMode = config.youImageMode
    this.youImageMode_v2 = config.youImageMode_v2
    this.youImageMode_v5 = config.youImageMode_v5

    Dataver.get()

    User.login().then(function () {
      User.getUser({
        fields: 'role'
      }).then(function (user) {
        this.user = Object.assign({}, this.user, user)
      }.bind(this))
    }.bind(this))

  }

})