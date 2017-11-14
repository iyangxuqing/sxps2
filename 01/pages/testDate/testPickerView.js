import { Popup } from '../../template/popup/popup.js'
import { DTPicker } from '../../template/DTPicker/DTPicker.js'

Page({

  data: {

  },

  onDTPickerConfirm: function (dateId, date) {
    console.log(dateId, date)
    if (dateId == 'startDate') {
      this.setData({
        startDate: date,
        strStartDate: date.Format('yyyy-MM-dd hh:mm:ss')
      })
    } else if (dateId == 'endDate') {
      this.setData({
        endDate: date,
        strEndDate: date.Format('yyyy-MM-dd hh:mm:ss')
      })
    }
  },

  onDateEdit: function (e) {
    let id = e.currentTarget.dataset.id
    let date = e.currentTarget.dataset.date
    this.DTPicker.show(id, new Date(date))
  },

  onLoad: function (options) {
    this.DTPicker = new DTPicker({
      onDTPickerConfirm: this.onDTPickerConfirm
    })

    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let hour = date.getHours()
    let monute = date.getMinutes()
    let second = date.getSeconds()
    let startDate = new Date(year, month, day)
    if (hour < 10) {
      startDate = new Date(startDate.getTime() - 86400000)
    }
    let endDate = new Date(startDate.getTime() + 86400000)
    let strStartDate = startDate.Format('yyyy-MM-dd hh:mm:ss')
    let strEndDate = endDate.Format('yyyy-MM-dd hh:mm:ss')
    this.setData({
      startDate,
      endDate,
      strStartDate,
      strEndDate,
    })
  },

})