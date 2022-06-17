// page.js示例代码
Page({
  data: {
    radioItems: [{
        name: '慢充',
        value: '0',
        checked: true
      },
      {
        name: '快充',
        value: '1'
      }
    ],
    isfast: 0, //是否是快充
    degree: 0, //充电度数
  },
  radioChange: function (e) {
    let isfast = e.detail.value; //为isfast赋值
    console.log(isfast);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      [`formData.radio`]: e.detail.value
    });
  },

  submitForm(event) {
    const that = this;
    wx.showModal({
      title: '确认预约?',
      success(res) {
        if (res.confirm) {
          /*1.从表单中获取数据，然后将预约请求发送给服务器*/
          wx.request({
            header: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            url:  wx.getStorageSync('url')+'/user/lookUpChargeHistory',
            method: 'GET',
            data: {
              weixinid: wx.getStorageSync('order').weixinid,
              isfast: that.data.isfast,
              degree: that.data.degree,
            },
            success: (res) => {
              console.log("预约服务器返回信息",res)
              /*收到服务器响应后弹出“预约成功”*/
              console.log(weixinid);
              wx.showToast({
                title: '预约成功!',
                duration: 1000
              })
              /*然后根据服务器的返回值更新order*/
              console.log(res)
              let order = getStorageSync('order');
              order.orderid = res.data.orderid; //更新orderid
              order.isfast = that.data.isfast;
              order.degree = that.data.degree;
              order.state = 2; //成功预约后，进入状态2
              wx.setStorageSync('order', order); //更新缓存中的order
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  restForm(event) {
    wx.navigateBack({
      delta: 0,
    });
  },
  formInputChange(event) {
    let degree = event.detail.value;
    console.log(degree);
  }
});