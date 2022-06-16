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
    isfast: 0,//是否是快充
    degree: 0,//充电度数
  },
  radioChange: function (e) {
    let isfast=e.detail.value;
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
          /*TODO：获取页面中的表单，将预约请求发送给服务器*/
          let weixinid=wx.getStorageSync('userInfo').openId;//获取微信id
          /*将预约信息发送给服务器*/
          wx.request({
            header: {
              　　"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
              　　},
            url: wx.getStorage('userInfo').openId,
            method: 'GET',
            data:{
              userId:"liangg",
              isFast:isfast,
              degree:degree
            },
            //成功回调函数
            success:(res)=>{
              console.log(res)
            }
          })
          /*弹出“预约成功”*/
          console.log(weixinid);
          wx.showToast({
            title: '预约成功!',
            duration: 700
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
  formInputChange(event){
    let degree=event.detail.value;
    console.log(degree);
  }
});