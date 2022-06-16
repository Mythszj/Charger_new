App({
  globalData: {
    now: (new Date()).toLocaleString()
  },
  onLaunch() {
    // 初始化云开发环境
    wx.cloud.init({
      env: 'cloud1-5gwtyim430a85157' // 云开发环境id
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
});