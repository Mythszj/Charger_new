Page({
  data: {
    name: 'haha'
  },
  buttonHandler(event) {
    const that = this;
    wx.showModal({
      title: '登录确认',
      content: '你确认要登录吗？',
      success (res) {      
        if (res.confirm) {
             wx.showToast({
               title: '登录成功',
               duration: 700
             });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  }
});