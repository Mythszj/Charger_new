Page({
  data: {
    order: {}, //这个order只用state
    queueTimer: null, //排队查询定时器
    chargeTimer: null, //充电查询定时器
    fastprice: 3.3, //快充价格
    slowprice: 2.2, //慢充价格

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
      // 修改充电信息按钮
      if (btnid == 1) {
        wx.navigateTo({
          url: '../modify/modify',
        });
      }
      // 取消预约按钮
      else if (btnid == 2) {
        const that = this;
        //7.取消预约
        wx.showModal({
          title: '确认取消预约?',
          success(res) {
            if (res.confirm) {
              wx.request({
                header: {
                  "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                url: wx.getStorageSync('url') + '/user/cancelOrder',
                method: 'GET',
                data: {
                  orderid: that.data.order.orderid,
                  isFast: that.data.order.isfast
                },
                success: (res) => {
                  console.log(res)
                  if (res.data.data.code == 200 || 201) {
                    console.log("取消成功") //取消成功
                    /*弹出提示框*/
                    wx.showToast({
                      title: '成功取消!',
                      duration: 1000
                    })
                    let order = that.data.order
                    order.state = 1; //回到状态1
                    that.setData({
                      order
                    })

                  }
                }
              })
            } else {}
          }
        })

      }
    }
    // 叫号状态，能取消预约
    else if (state == 3) {
      const that = this;
      //7.取消预约按钮
      wx.showModal({
        title: '确认取消预约?',
        success(res) {
          if (res.confirm) {
            wx.request({
              header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
              },
              url: wx.getStorageSync('url') + '/user/cancelOrder',
              method: 'GET',
              data: {
                orderid: that.data.order.orderid,
                isFast: that.data.order.isfast
              },
              success: (res) => {
                console.log(res)
                if (res.data.data.code == 200 || 201) {
                  console.log("取消成功") //取消成功
                  /*弹出提示框*/
                  wx.showToast({
                    title: '成功取消!',
                    duration: 1000
                  })
                  let order = that.data.order
                  order.state = 1; //回到状态1
                  that.setData({
                    order
                  })

                }
              }
            })
          } else {}
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
            wx.request({
              header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
              },
              url: wx.getStorageSync('url') + '/user/cancelOrder',
              method: 'GET',
              data: {
                orderid: that.data.order.orderid,
                isFast: that.data.order.isfast
              },
              success: (res) => {
                console.log(res)
                if (res.data.msg == "正在充电") {
                  console.log("取消成功") //取消成功
                  /*弹出提示框*/
                  wx.showToast({
                    title: '成功取消!',
                    duration: 1000
                  })
                  let order = that.data.order
                  order.state = 5; //转到状态1
                  that.setData({
                    order
                  })
                  //取消充电状态查询计时器
                  if (that.data.chargeTimer != null) {
                    that.data.chargeTimer.clearInterval()
                    that.setData({
                      chargeTimer: null
                    })
                  }
                } else {
                  console.log("取消充电返回消息错误") //取消成功
                  /*弹出提示框*/
                  wx.showToast({
                    title: '取消失败!',
                    duration: 1000
                  })
                }
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
                console.log("确认支付后的返回", res)
                if (res.data.code == 200) {
                  console.log("支付成功") //支付成功
                  wx.showToast({
                    title: '支付成功!',
                    duration: 1000
                  })
                  //关闭定时器
                  if (that.data.queueTimer != null) {
                    clearInterval(that.data.queueTimer);
                    that.setData({
                      queueTimer: null
                    });
                  }
                  if (that.data.chargeTimer != null) {
                    clearInterval(that.data.chargeTimer);
                    that.setData({
                      chargeTimer: null
                    });
                  }
                  //跳转到状态1
                  let order = that.data.order
                  order.state = 1
                  that.setData({
                    order
                  })
                  wx.setStorageSync('order', order)
                  
                }
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
    this.setData({
      order
    })
    //不同页面显示不同信息
    let state = this.data.order.state
    //初始状态，查询电价
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
          console.log("查询价格返回值", res)
          let fastprice = res.data.data.rapid;
          let slowprice = res.data.data.slow;
          that.setData({
            fastprice,
            slowprice
          })
        }
      })
    }
    //排队状态，查询排队状态 
    else if (state == 2) {
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
            orderId: that.data.order.orderid,
            isFast: that.data.order.isfast
          },
          success: (res) => {
            console.log(res)
            if (res.data.msg == "排队中") {
              let order = that.data.order;
              order.ahead = res.data.data.ahead;
              that.setData({
                order
              })
            } else if (res.data.msg == "已叫号") {
              //跳转到叫号状态
              let order = that.data.order;
              order.state = 3
              order.chargeid = res.data.data.pile
              that.setData({
                order
              })
              /*关闭queuetimer*/
              if (that.data.queueTimer != null) {
                clearInterval(that.data.queueTimer);
                that.setData({
                  queueTimer: null
                });
              }
            } else if (res.data.msg == "正在充电") {
              //跳转到正在充电状态
              let order = that.data.order;
              order.state = 4
              that.setData({
                order
              })
              /*关闭queuetimer*/
              if (that.data.queueTimer != null) {
                clearInterval(that.data.queueTimer);
                that.setData({
                  queueTimer: null
                });
              }
            }
          }
        })
      }, 1000)
    }
    //叫号状态，叫号查询状态
    else if (state == 3) {
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
            orderId: that.data.order.orderid,
            isFast: that.data.order.isfast
          },
          success: (res) => {
            console.log(res)
            if (res.data.msg == "已叫号") {
              //获取充电桩号
              let order = that.data.order;
              order.chargeid = res.data.chargeid;
              that.setData({
                order
              })
            } else if (res.data.msg == "正在充电") {
              let order = that.data.order;
              order.state = 4; //跳转到充电状态
              that.setData({
                order
              })
              wx.setStorageSync('order', order)
            }
          }
        })
      }, 1000)
    }
    //充电状态，查询充电状态
    else if (state == 4) {
      /*发送查询充电状态请求*/
      const that = this;
      that.data.chargeTimer = setInterval(() => {
        wx.request({
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          url: wx.getStorageSync('url') + '/user/lookUpChargeInfo',
          method: 'GET',
          data: {
            orderid: wx.getStorageSync('order').orderid,
          },
          success: (res) => {
            console.log(res)
            if (res.data.msg == "充电中") {
              let order = that.data.order;
              order.already = res.data.data.already; //已充电
              order.left = res.data.data.left; //剩余电
              order.spent = res.data.data.spent; //已花钱
              // 改为保留两位小数
              order.spent = order.spent.toFixed(2)
              order.left = order.left.toFixed(2)
              order.already = order.already.toFixed(2)
              that.setData({
                order
              })
            } else if (res.data.msg == "充电完成") {
              let order = that.data.order;
              order.already = res.data.data.already; //已充电
              order.left = res.data.data.left; //剩余电
              order.spent = res.data.data.spent; //已花钱
              order.state = 5; //跳转到支付界面
              // 改为保留两位小数
              order.spent = order.spent.toFixed(2)
              order.left = order.left.toFixed(2)
              order.already = order.already.toFixed(2)
              that.setData({
                order
              })
            }
          }
        })
      }, 1000)
    }
    //支付状态 
    else if (state == 5) {}
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
  },


});