Page({
  data: {
    order: {},
  },

  buttonHandler(event) {
    wx.navigateTo({
      url: '../fill/fill',
    });
  },

  // 页面显示
  onShow: function () {
    console.log("onShow")
    // tabBar 加入的函数
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    // 如果有用户的信息
    if (wx.getStorageSync('userInfo')) {
      const updateFlag = wx.getStorageSync('updateFlag')
      console.log('显示页面的时候刷新标志', updateFlag)
      console.log('本地存储有用户的数据');
      if (updateFlag) {
        // 先清空一下，如果发布了在最上面显示
        this.setData({
          postlist: []
        })
        wx.startPullDownRefresh();
      }
    }
    else {
      console.log('本地存储没有用户的数据');
      // 跳转到授权页面 
      wx.switchTab({
        url: '/pages/my/my',
      })
    }

    let order = wx.getStorageSync('order')
    this.setData({
      order
    })
  },
});