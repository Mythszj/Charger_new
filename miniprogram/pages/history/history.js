// 帖子列表的展示页面
const util = require('../../utils/util.js');

Page({
  data: {
    // 输入框是否获得焦点
    isFocus: false,
    // 输入的关键字
    searchKey: '',
    // 是否有搜索，显示 相关信息
    noSearch: true,
    // 所有的帖子
    postlist: [{'orderId': '100104', time: '2018-07-05 10:53:06', last:'14', degree: '0.2',money:'0.32'}],
    // 搜索到用户的信息
    userlist: [],
    // 轮播图
    swiperList: ['/images/text.png', '/images/text1.png', '/images/text2.png'],
    commentLoaded: false,
    inputValue: ''
  },

  // 发送评论
  sendComment: function (e) {
    console.log(e)
    let { authorid, postid, content, image_url, index } = e.currentTarget.dataset;
    let value = e.detail.value
    if (value.length < 1) {
        wx.showToast({
            icon: 'error',
            title: '评论不能为空',
        })
        return;
    }

    wx.showLoading({
        title: '发布中',
    })

    const userInfo = wx.getStorageSync('userInfo');
    // console.log(userInfo);
},
})