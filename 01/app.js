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
    this.youImageMode = config.youImageMode
    this.youImageMode_v2 = config.youImageMode_v2
    this.youImageMode_v5 = config.youImageMode_v5

    User.login()
    Dataver.get()

  }

})