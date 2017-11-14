import { Popup } from '../popup/popup.js'

let defaults = {

}

function getDateRange(date) {
  if (!date) date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  let years = [year - 2, year - 1, year]
  let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

  let days = []
  if (month == 2) {
    for (let i = 0; i < 28; i++) days[i] = i + 1
    if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) days[28] = 29
  } else {
    for (let i = 0; i < 30; i++) days[i] = i + 1
    if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) >= 0) days[30] = 31
  }
  for (let i in days) {
    if (days[i] < 10) {
      days[i] = '0' + days[i]
    } else {
      days[i] = String(days[i])
    }
  }

  let hours = [];
  for (let i = 0; i < 24; i++) {
    if (i < 10) {
      hours[i] = '0' + i
    } else {
      hours[i] = String(i)
    }
  }

  let minutes = [];
  let seconds = [];
  for (let i = 0; i < 60; i++) {
    if (i < 10) {
      minutes[i] = '0' + i
      seconds[i] = '0' + i
    } else {
      minutes[i] = String(i)
      seconds[i] = String(i)
    }
  }

  let value = [2, month - 1, day - 1, hour, minute, second]

  let result = {
    years, months, days, hours, minutes, seconds,
    value: [9999, month - 1, day - 1, hour, minute, second]
  }
  return result
}

let methods = {
  onPickerChange: function (e) {
    let value = e.detail.value
    let page = getCurrentPages().pop()
    let years = page.data.DTPicker.years
    let months = page.data.DTPicker.months
    let year = years[value[0]]
    let month = months[value[1]]
    let days = []
    if (month == '02') {
      for (let i = 0; i < 28; i++) days[i] = i + 1
      if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) days[28] = 29
    } else {
      for (let i = 0; i < 30; i++) days[i] = i + 1
      if (['01', '03', '05', '07', '08', '10', '12'].indexOf(month) >= 0) days[30] = 31
    }
    for (let i in days) {
      if (days[i] < 10) {
        days[i] = '0' + days[i]
      } else {
        days[i] = String(days[i])
      }
    }
    page.setData({
      'DTPicker.days': days,
      'DTPicker.value': value,
    })
  }
}

export class DTPicker {

  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    this.onDTPickerConfirm = options.onDTPickerConfirm

    this.popup = new Popup({
      onPopupConfirm: this.confirm.bind(this)
    })

    let result = getDateRange(options.date)
    page.setData({
      'DTPicker.years': result.years,
      'DTPicker.months': result.months,
      'DTPicker.days': result.days,
      'DTPicker.hours': result.hours,
      'DTPicker.minutes': result.minutes,
      'DTPicker.seconds': result.seconds,
      'DTPicker.value': result.value,
    })
    for (let key in methods) {
      page['DTPicker.' + key] = methods[key].bind(this)
      page.setData({
        ['DTPicker.' + key]: 'DTPicker.' + key
      })
    }
  }

  show(dateId, date) {
    let page = getCurrentPages().pop()
    let result = getDateRange(date)
    this.dateId = dateId
    page.setData({
      'DTPicker.years': result.years,
      'DTPicker.months': result.months,
      'DTPicker.days': result.days,
      'DTPicker.hours': result.hours,
      'DTPicker.minutes': result.minutes,
      'DTPicker.seconds': result.seconds,
      'DTPicker.value': result.value,
    })
    this.popup.show()
  }

  confirm() {
    let page = getCurrentPages().pop()
    let years = page.data.DTPicker.years
    let months = page.data.DTPicker.months
    let days = page.data.DTPicker.days
    let hours = page.data.DTPicker.hours
    let minutes = page.data.DTPicker.minutes
    let seconds = page.data.DTPicker.seconds
    let value = page.data.DTPicker.value
    if (value[0] >= years.length) value[0] = years.length - 1
    if (value[1] >= months.length) value[1] = months.length - 1
    let year = years[value[0]]
    let month = months[value[1]] - 1
    let day = days[value[2]]
    let hour = hours[value[3]]
    let minute = minutes[value[4]]
    let second = seconds[value[5]]
    let date = new Date(year, month, day, hour, minute, second)
    this.onDTPickerConfirm && this.onDTPickerConfirm(this.dateId, date)
  }

}