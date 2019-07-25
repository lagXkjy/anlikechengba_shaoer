// newpage/MyBao/MyBao.js
const common = require('../../Common.js');
const util = require('../../utils/util.js')
const app = getApp()
let page = 1, size = 20;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      // {
      //   img: common.config.StaticPath + "boliang_07.png",
      //   yao: true,
      //   rema: false,
      //   ShiXiao: true,
      // },
      // {
      //   img: common.config.StaticPath +"boliang_07.png",
      //   imgAll: common.config.StaticPath +"yiguoQi_03.png",
      //   huise: "huise",
      //   yao: true,
      //   rema: true,
      //   ShiXiao: false,
      // },
      // {
      //   img: common.config.StaticPath +"boliang_07.png",
      //   imgAll: common.config.StaticPath +"yishiyong_03.png",
      //   huise:"huise",
      //   yao: true,
      //   rema: true,
      //   ShiXiao: false,
      // }
    ],
    yl: common.config.StaticPath + "yilinga_03.png",
    quan: [],
    y_quan: app.globalData.y_quan,
    n_quan: app.globalData.n_quan,
  },
  getDatas() {
    //util.showLoading('努力加载中...')
    //cpType：优惠券类型（0 全部  1 新人优惠券  2 普通优惠券）
    //beUsed：是否已使用（0 全部  1 未使用  2 已使用）

    util.request(
      common.config.GetCpInfos,
      "POST",
      {
        openId: wx.getStorageSync('openid'),
        mchId: common.data.MchId,
        cpType: 0,
        beUsed: 0,
        page,
        size
      },
      (res) => {
        console.log("获取我的优惠券", res)

        if (res.data.res) {
          let quan = this.data.quan
          let datas = res.data.data.cpInfos
          let now = (new Date()).valueOf()
          for (let i = 0; i < datas.length; i++) {
            let start = datas[i].CnStartTime.replace(/[^0-9]/ig, "")

            let end = datas[i].CnEndTime.replace(/[^0-9]/ig, "")
            console.log(util.formatDate(new Date(+end)))

            if (end - start == 0) {
              datas[i].time = '无使用时间限制'
            }
            else if (end - now < 0) {
              //过期改为已使用状态
              datas[i].CriBeUsed = 2
            }
            else {
              start = util.formatDate(new Date(+start))
              end = util.formatDate(new Date(+end))
              datas[i].time = start + " - " + end
            }
          }
          quan = quan.concat(datas)
          this.setData({ quan })
          page++
        }
      },
      (err) => {
        util.showModal('提示', '网络异常')
      },
      (res) => {

      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    this.getDatas()
    var ll = [];
    wx.request({
      url: common.config.GetMyCoupList,
      method: 'POST',
      data: { openid: wx.getStorageSync("openid") },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var list = res.data.list;
        for (var i = 0; i < list.length; i++) {
          var mm = {};
          var st = common.timeStamp2StringNian2(list[i].Coupons.StartTime);
          var et = common.timeStamp2StringNian2(list[i].EndTime);
          var coid = list[i].CouponsOrderId;
          var ttype = list[i].Type;
          if (coid == "0" && ttype == "2")//已领取,未使用
          {
            mm = {
              img: common.config.StaticPath + "boliang_07.png",
              price: list[i].Price,
              title: list[i].Coupons.Title,
              csid: list[i].Id,
              status: 0,
              st: st,
              et: et,
              yao: true,
              rema: false,
              ShiXiao: true,
            };
          }
          if (coid != "0" && ttype == "2")//已领取,已使用
          {
            mm = {
              img: common.config.StaticPath + "boliang_07.png",
              imgAll: common.config.StaticPath + "yishiyong_03.png",
              huise: "huise",
              price: list[i].Price,
              title: list[i].Coupons.Title,
              csid: list[i].Id,
              status: 1,
              st: st,
              et: et,
              yao: true,
              rema: true,
              ShiXiao: false,
            }
          }
          if (ttype == "3")//已领取,已过期
          {
            mm = {
              img: common.config.StaticPath + "boliang_07.png",
              imgAll: common.config.StaticPath + "yiguoQi_03.png",
              huise: "huise",
              price: list[i].Price,
              title: list[i].Coupons.Title,
              csid: list[i].Id,
              status: 2,
              st: st,
              et: et,
              yao: true,
              rema: true,
              ShiXiao: false,
            }
          }
          ll.push(mm);
        }
        that.setData({
          list: ll
        })
      }
    })
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
    this.setData({
      quan: [],
    })
    this.onLoad();
    wx.stopPullDownRefresh();
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

  },
  shiyong: function (e) {
    var csid = e.currentTarget.dataset.csid;
    var price = e.currentTarget.dataset.price;
    var status = e.currentTarget.dataset.status;
    if (status == "0") {
      wx.redirectTo({
        url: '../courses/courses?csid=' + csid + "&price=" + price
      });
    }
    // else{
    //   wx.redirectTo({
    //     url: '../courses/courses?csid=0&price=0'
    //   });
    // }
  },
  useQuan(e) {
    console.log(e)
    let quan_id = e.currentTarget.dataset.quan_id
    let quan_name = e.currentTarget.dataset.quan_name
    let quan_money = e.currentTarget.dataset.quan_money
    wx.redirectTo({
      url: '../../newpage/courses/courses?csid=' + quan_id + "&price=" + quan_money
    });
    // wx.navigateTo({
    //   url: `../../Kecheng/keke/keke?types=10&quan_id=${quan_id}&quan_name=${quan_name}&quan_money=${quan_money}`,
    // })
  }
})