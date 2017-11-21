import { Cate } from '../../../utils/cates.js'

Page({

  data: {

  },

  touchstart: function (e) {
    if (!this.touch) this.touch = {}
    this.touch.id = e.currentTarget.dataset.id
    this.touch.top = e.currentTarget.offsetTop
    this.touch.left = e.currentTarget.offsetLeft
    this.touch.x1 = e.touches[0].clientX;
    this.touch.y1 = e.touches[0].clientY;
    this.touch.t1 = e.timeStamp;
    this.touch.x2 = e.touches[0].clientX;
    this.touch.y2 = e.touches[0].clientY;
    this.touch.t2 = e.timeStamp;
  },

  touchmove: function (e) {
    this.touch.x2 = e.touches[0].clientX;
    this.touch.y2 = e.touches[0].clientY;
    this.touch.t2 = e.timeStamp;
  },

  touchend: function (e) {
    this.touch.t2 = e.timeStamp
    let dx = this.touch.x2 - this.touch.x1
    let dy = this.touch.y2 - this.touch.y1
    let dt = this.touch.t2 - this.touch.t1
    if ((Math.abs(dy) < Math.abs(dx) && dt < 250)) {
      if (dx < -20) this.onSwipeLeft(this.touch)
      if (dx > 20) this.onSwipeRight(this.touch)
    }
  },

  onSwipeLeft: function (touch) {
    let editorId = this.data.editor && this.data.editor.id
    let editorShow = this.data.editor && this.data.editor.show
    if (editorId != touch.id && editorShow) {
      this.setData({
        'editor.show': false
      })
      setTimeout(function () {
        this.setData({
          'editor.show': true,
          'editor.id': touch.id,
          'editor.top': touch.top,
        })
      }.bind(this), 300)
    } else {
      this.setData({
        'editor.show': true,
        'editor.id': touch.id,
        'editor.top': touch.top,
      })
    }
  },

  onSwipeRight: function (touch) {
    this.setData({
      'editor.show': false,
    })
  },

  onEditorSortUp: function (e) {
    let id = this.data.editor.id
    this.setData({
      'editor.show': false
    })
    this.onCateSortUp(id)
  },

  onEditorSortDown: function (e) {
    let id = this.data.editor.id
    this.setData({
      'editor.show': false
    })
    this.onCateSortDown(id)
  },

  onEditorDelete: function (e) {
    let id = this.data.editor.id
    this.setData({
      'editor.show': false
    })
    this.onCateDelete(id)
  },

  onExpandTap: function (e) {
    let id = e.currentTarget.dataset.id
    let expandId = this.data.expandId
    if (id == expandId) id = ''
    this.setData({
      expandId: id
    })
  },

  onCateBlur: function (e) {
    let id = e.currentTarget.dataset.id
    let pid = e.currentTarget.dataset.pid
    let title = e.detail.value
    let cates = this.data.cates
    let oldTitle = ''
    if (pid == 0) {
      for (let i in cates) {
        if (cates[i].id == id) {
          oldTitle = cates[i].title
          break
        }
      }
    } else {
      for (let i in cates) {
        if (cates[i].id == pid) {
          for (let j in cates[i].children) {
            if (cates[i].children[j].id == id) {
              oldTitle = cates[i].children[j].title
              break
            }
          }
          break
        }
      }
    }

    if (title != oldTitle) {
      let cate = {
        id: id,
        pid: pid,
        title: title
      }
      Cate.set(cate).then(function (cates) {
        this.setData({
          cates: cates,
          newCateTitle: ''
        })
      }.bind(this))
    }
  },

  onCateSortUp: function (id) {
    Cate.sort({ id }, 1).then(function (cates) {
      this.setData({
        cates: cates,
      })
    }.bind(this))
  },

  onCateSortDown: function (id) {
    Cate.sort({ id }, 0).then(function (cates) {
      this.setData({
        cates: cates,
      })
    }.bind(this))
  },

  onCateDelete: function (id) {
    Cate.del({ id }).then(function (res) {
      if (res.reason) {
        wx.showModal({
          title: '提示',
          content: res.reason,
          showCancel: false,
          success: function () {
            this.setData({
            })
          }.bind(this)
        })
      } else {
        this.setData({
          cates: res.cates
        })
      }
    }.bind(this))
  },

  onLoad: function (options) {
    Cate.getCates().then(function (cates) {
      this.setData({
        cates,
        ready: true,
      })
    }.bind(this))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    Cate.getCates({ nocache: true }).then(function (cates) {
      this.setData({
        cates,
        ready: true,
      })
      wx.stopPullDownRefresh()
    }.bind(this))
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})