// 授权页面
Page({
  data: {
      // 用户信息
      userInfo: {},
      order: {}
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
              const { userInfo } = res;
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
                      order.orderid = '';
                      order.ahead = 0;
                      order.already = 0;
                      order.left = 0;
                      order.spent = 0;
                      wx.setStorageSync('order', order)
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