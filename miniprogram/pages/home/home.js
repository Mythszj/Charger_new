Page({
  data: {
    order: {},
  },

  buttonHandler(event) {
    console.log(event)
    let state = event.currentTarget.dataset.state
    console.log(state)
    // 初始化状态，点击后预约开始排队
    if (state == 1) {
      wx.navigateTo({
        url: '../fill/fill',
      });
    }
    // 排队状态，能修改信息，取消预约
    else if (state == 2) {
      // 状态2需要，两个按钮
      let btnid = event.currentTarget.dataset.btnid;
      // 修改充电信息
      if (btnid == 1) {

      }
      // 取消预约
      else if (btn == 2) {

      }
    }
    // 叫号状态，能取消预约
    else if (state == 3) {
      
    }
    // 正在充电状态，能结束充电
    else if (state == 4) {
      
    }
    // 充电结束，能结账
    else if (state == 5) {
      
    }
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
    order.state = 5;
    this.setData({
      order
    })
  },
});