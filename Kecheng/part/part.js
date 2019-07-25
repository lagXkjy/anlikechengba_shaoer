// Kecheng/part/part.js
var common = require('../../Common.js');
Page({
  data: {
    partList: [],
    page: 1,
    size: 30
  },
  getPartNum() { //获取参与人数
    let { courseId, page, size } = this.data
    wx.request({
      url: common.config.GetGroupBookingUsersName,
      data: { courseId, page, size },
      method: 'POST',
      header: { 'content-type': 'application/json' },
      success: (res) => {
        if (res.data.result) {
          let { partList } = this.data
          partList = partList.concat(res.data.modle)
          const unique = function (arr, id) {
            let hash = {};
            return arr.reduce(function (item, target) {
              hash[target[id]] ? '' : hash[target[id]] = true && item.push(target);
              return item;
            }, []);
          }
          this.setData({
            partList: unique(partList, 'AvatarUrl')
          })
          this.data.page++
        }
      },
      fail: (res) => { }
    })
  },
  onLoad: function (options) {
    this.data.courseId = +options.kid
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getPartNum()
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
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getPartNum()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})