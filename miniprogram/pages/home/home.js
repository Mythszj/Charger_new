Page({
  data: {
    order: {}, //这个order只用state
    queueTimer: null, //排队查询定时器
    chargeTimer: null, //充电查询定时器
    item: {
      fastprice: 3.3, //快充价格
      slowprice: 2.2, //慢充价格
    }
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
        wx.navigateTo({
          url: '../modify/modify',
        });
      }
      // 取消预约
      else if (btnid == 2) {
        const that = this;
        //7.取消预约
        wx.request({
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          url: wx.getStorageSync('url') + '/user/cancelOrder',
          method: 'GET',
          data: {
            orderid: wx.getStorageSync('order').orderid,
          },
          success: (res) => {
            console.log(res)
            if (res.code == 200) console.log("取消成功") //取消成功
            /*弹出提示框*/
            wx.showToast({
              title: '成功取消!',
              duration: 1000
            })
            let order = getStorageSync('order');
            order.state = 1; //回到状态1
            wx.setStorageSync('order', order);
            that.setData({
              order
            })
          }
        })
      }
    }
    // 叫号状态，能取消预约
    else if (state == 3) {
      const that = this;
      //7.取消预约
      wx.request({
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        url: wx.getStorageSync('url') + '/user/cancelOrder',
        method: 'GET',
        data: {
          orderid: wx.getStorageSync('order').orderid,
        },
        success: (res) => {
          console.log(res)
          if (res.code == 200) console.log("取消成功") //取消成功
          /*弹出提示框*/
          wx.showToast({
            title: '成功取消!',
            duration: 1000
          })
          let order = getStorageSync('order');
          order.state = 1; //回到状态1
          wx.setStorageSync('order', order);
          that.setData({
            order
          })
        }
      })
    }
    // 正在充电状态，能结束充电
    else if (state == 4) {
      const that = this;
      //弹出确认框
      wx.showModal({
        title: '确认结束充电?',
        success(res) {
          //发送结束充电请求，收到服务区正确回复后显示Toast并跳转
          if (res.confirm) {
            //8.取消充电
            wx.request({
              header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
              },
              url: wx.getStorageSync('url') + '/user/cancelCharge',
              method: 'GET',
              data: {
                orderid: wx.getStorageSync('order').orderid,
              },
              success: (res) => {
                if (res.code == 200) console.log("成功取消充电") //取消充电
                wx.showToast({
                  title: '充电已结束!',
                  duration: 1000
                })
                //跳转到状态5
                let order = that.data.order
                order.state = 5
                that.setData({
                  order
                })
              }
            })
          } else if (res.cancel) {}
        }
      });

    }
    // 充电结束，能结账
    else if (state == 5) {
      const that = this;
      //弹出确认框
      wx.showModal({
        title: '确认支付账单?',
        success(res) {
          //发送结束充电请求，收到服务区正确回复后跳转
          if (res.confirm) {
            wx.request({
              header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
              },
              url: wx.getStorageSync('url') + '/user/complete',
              method: 'GET',
              data: {
                orderid: wx.getStorageSync('order').orderid,
              },
              success: (res) => {
                console.log(res)
                if (res.code == 200) console.log("支付成功") //支付成功
                wx.showToast({
                  title: '支付成功!',
                  duration: 1000
                })
                //跳转到状态1
                let order = that.data.order
                order.state = 1
                that.setData({
                  order
                })
              }
            })

          } else if (res.cancel) {}
        }
      });
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
    } else {
      console.log('本地存储没有用户的数据');
      // 跳转到授权页面 
      wx.switchTab({
        url: '/pages/my/my',
      })
    }
    //获取缓存中的order，更新
    let order = wx.getStorageSync('order')
    order.state = 5;
    this.setData({
      order
    })
    //不同页面显示不同信息
    let state = this.data.order.state
    if (state == 1) {
      //获取快充和慢充的价格
      const that = this
      wx.request({
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        url: wx.getStorageSync('url') + '/admin/price',
        method: 'GET',
        success: (res) => {
          console.log(res)
          let fastprice = res.data.rapid;
          let slowprice = res.data.slow;
          that.setData({
            fastprice,
            slowprice
          })
        }
      })
    } else if (state == 2) {
      //3.排队查询，每1s查询一次
      const that = this
      that.data.queueTimer = setInterval(() => {
        wx.request({
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          url: wx.getStorageSync('url') + '/user/checkQueue',
          method: 'GET',
          data: {
            orderid: wx.getStorageSync('order').orderid,
          },
          success: (res) => {
            console.log(res)
            if (res.data.msg == "排队中") {
              let order = that.data.order;
              order.ahead = res.data.ahead;
              that.setData({
                order
              })
            } else if (res.data.msg == "叫号") {
              //跳转到叫号状态
              let order = that.data.order;
              order.state = 3
              that.setData({
                order
              })
            }
          }
        })
      }, 1000)
    } else if (state == 3) {
      //3.叫号查询，每1s查询一次
      const that = this
      that.data.queueTimer = setInterval(() => {
        wx.request({
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          url: wx.getStorageSync('url') + '/user/checkQueue',
          method: 'GET',
          data: {
            orderid: wx.getStorageSync('order').orderid,
          },
          success: (res) => {
            console.log(res)
            if (res.data.msg == "叫号") {
              //获取充电桩号
              let order = that.data.order;
              order.chargeid = res.data.chargeid;
              that.setData({
                order
              })
            } else if (res.data.msg == "开充") {
              let order = that.data.order;
              order.state = 4; //跳转到充电状态
              that.setData({
                order
              })
            }
          }
        })
      }, 1000)
    } else if (state == 4) {
      const that=this;
      that.data.chargeTimer=setInterval(() => {
        wx.request({
          header: {
            　　"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            　　},
          url: wx.getStorageSync('url')+'/user/lookUpChargeInfo',
          method: 'GET',
          data:{
            orderid: wx.getStorageSync('order').orderid,
          },
          success:(res)=>{
            console.log(res)
            if(res.msg=="充电中"){
              let order=that.data.order;
              order.already=res.data.already;//已充电
              order.left=res.data.left;//剩余电
              order.spent=res.data.spent;//已花钱
            }else if(res.msg=="充电完成"){
              let order=that.data.order;
              order.already=res.data.already;//已充电
              order.left=res.data.left;//剩余电
              order.spent=res.data.spent;//已花钱
              order.state=5;//跳转到支付界面
            }
            that.setData({
              order
            })
          }
        })
      },1000)
    } else if (state == 5) {

    }
  },
  // 离开页面
  onHide: function () {
    //保存临时order到缓存中
    let order = this.data.order;
    wx.setStorageSync('order', order);
    //关闭定时器
    if (this.data.queueTimer != null) {
      clearInterval(this.data.queueTimer);
      this.setData({
        queueTimer: null
      });
    }
    if (this.data.chargeTimer != null) {
      clearInterval(this.data.chargeTimer);
      this.setData({
        chargeTimer: null
      });
    }
  }
});