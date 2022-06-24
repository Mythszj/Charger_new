// 授权页面
Page({
  data: {
    // 用户信息
    userInfo: {},
    order: {},
    // 历史记录信息列表
  },

  historytap(event) {
    //点击历史记录时，向服务器请求历史信息
    const that=this
    wx.request({
      header: {
        　　"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        　　},
      url: wx.getStorageSync('url')+'/user/lookUpChargeHistory',
      method: 'GET',
      data:{
        weixinid: wx.getStorageSync('order').weixinid
      },
      //成功回调函数
      success:(res)=>{
        console.log("服务器返回的历史记录",res);
        let record=res.data.data;
        // 将历史记录信息存到缓存中
        wx.setStorageSync('record', record);
        console.log("历史记录内容", record);
        // 用于页面渲染
        this.setData({
            record
        })
      }
    })
    // let res = {
    //   "code": 200,
    //   "msg": "success",
    //   "data": [{
    //       "id": "10001",
    //       "time": "2018-08-06 10:32:23",
    //       "duration": 13,
    //       "degree": 3.97,
    //       "total": 6.35
    //     },
    //     {
    //       "id": "10002",
    //       "time": "2018-08-06 10:32:23",
    //       "duration": 13,
    //       "degree": 3.97,
    //       "total": 6.35
    //     },
    //     {
    //       "id": "10003",
    //       "time": "2018-08-06 10:32:23",
    //       "duration": 13,
    //       "degree": 3.97,
    //       "total": 6.35
    //     }
    //   ]
    // };
    // let record = res.data;
    // wx.setStorageSync('record', record);
    
  },

  onShow() {
    // tabBar的函数
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }

    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
  },

  // 调用微信提供的api，获取用户信息
  getUserProfile() {
    wx.getUserProfile({
        // 下面这个字段必须有
        "desc": "完善信息"
      })
      .then(res => {
        console.log("获取用户信息成功", res);
        const {
          userInfo
        } = res;
        // 获取用户的openid
        wx.cloud.callFunction({
            name: 'get_user_info'
          })
          .then(res => {
            console.log("获取到用户id", res);
            // 将用户的 openId放入到 userInfo中
            userInfo.openId = res.result.openid;
            // 将用户的个人信息存到缓存中
            wx.setStorageSync('userInfo', userInfo);
            // 用于页面渲染
            this.setData({
              userInfo
            })
            let order = {};
            order.state = 1;
            order.weixinid = userInfo.openId;
            order.isfast = 0;
            order.degree = 0;
            order.orderid = 10001;
            order.ahead = 0;
            order.already = 0;
            order.left = 0;
            order.spent = 0;
            order.chargeid = 0;
            wx.setStorageSync('order', order)
            // 将url存到缓存
            let url = "http://1.15.79.191:1919"
            wx.setStorageSync('url', url)
          })
          .catch(err => {
            console.error("没获取用户id", err);
          })
      })
      .catch(err => {
        console.error("获取用户信息失败", err);
      })
  }
})