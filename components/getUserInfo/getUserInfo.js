// components/getUserInfo/getUserInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },
  ready() {
    let avatarUrl = wx.getStorageSync('avatarUrl')
    if (!avatarUrl) {
      this.setData({ isShow: true })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo(e) {
      let userInfo = e.detail.userInfo
      if (userInfo) {
        const $common = require('../../Common.js')
        $common.submitUserInfo(userInfo)
        this.setData({
          isShow: false
        })
      }else {
        wx.showToast({
          title: '拒绝授权，未获取到用户信息',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
})
