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
    checkboxItems: [{
        name: 'standard is dealt for u.',
        value: '0',
        checked: true
      },
      {
        name: 'standard is dealicient for u.',
        value: '1'
      }
    ],
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      [`formData.radio`]: e.detail.value
    });
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems,
      [`formData.checkbox`]: e.detail.value
    });
  },
  submitForm(event) {
    const that = this;
    wx.showModal({
      title: '确认预约?',
      success(res) {
        if (res.confirm) {
          /*TODO：获取页面中的表单，将预约请求发送给服务器*/
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
  formInputChange(event) {
    console.log(event)
    let degree = event.detail.value
    console.log(degree)
  },
  restForm(event) {
    wx.navigateBack({
      delta: 0,
    });
  }
});