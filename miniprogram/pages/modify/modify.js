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
      isfast
    })
    this.setData({
      radioItems: radioItems,
      [`formData.radio`]: e.detail.value
    });
  },
  formInputChange(event) {
    let degree = event.detail.value;
    console.log(degree);
    this.setData({
      degree
    })
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
            url:  wx.getStorageSync('url')+'/user/modifyChargeInfo',
            method: 'GET',
            data: {
              weixinid: wx.getStorageSync('order').weixinid,
              orderId:wx.getStorageSync('order').orderid,
              oldChargeType:wx.getStorageSync('order').isfast,
              newChargeType: that.data.isfast,//读取快慢冲有问题
              newDegree: that.data.degree,
            },
            success: (res) => {
              console.log("修改预约服务器返回信息",res)
              /*收到服务器响应后弹出“预约成功”*/
              //console.log(weixinid);
              wx.showToast({
                title: '预约成功!',
                duration: 1000
              })
              /*然后根据服务器的返回值更新order*/
              console.log("充电类型为",that.data.isfast)
              console.log("充电度数为",that.data.degree)
              console.log(res)
              let order = wx.getStorageSync('order');
              order.orderid = res.data.data.orderid; //更新orderid
              order.isfast = that.data.isfast;//更新快充慢充
              order.degree = that.data.degree;//更新充电度数
              order.state = 2; //修改成功预约后，进入状态2
              wx.setStorageSync('order', order); //更新缓存中的order
              wx.navigateBack({
                delta: 0,
              });
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
 
});