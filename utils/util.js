function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

function validMobile(m) {
  const reg = /^[1]([3-9])[0-9]{9}$/;
  return reg.test(m) ? '' : '号码错误！';
}

function setAwardList(_this) {
  //奖品item设置
  var awardList = [];
  //间距,怎么顺眼怎么设置吧.
  var topAward = 30;
  var leftAward = 30;
  for (var j = 0; j < 8; j++) {
    if (j == 0) {
      topAward = 25;
      leftAward = 25;
    } else if (j < 3) {
      topAward = topAward;
      //166.6666是宽.15是间距.下同
      leftAward = leftAward + 166.6666 + 15;
    } else if (j < 5) {
      leftAward = leftAward;
      //150是高,15是间距,下同
      topAward = topAward + 150 + 15;
    } else if (j < 7) {
      leftAward = leftAward - 166.6666 - 15;
      topAward = topAward;
    } else if (j < 8) {
      leftAward = leftAward;
      topAward = topAward - 150 - 15;
    }
    var imageAward = _this.imageAward[j];
    awardList.push({
      topAward: topAward,
      leftAward: leftAward,
      imageAward: imageAward
    });
  }
  _this.setData({
    awardList
  });
}

function setCircleList(_this) {
  //圆点设置
  var leftCircle = 7.5;
  var topCircle = 7.5;
  var circleList = [];
  for (var i = 0; i < 24; i++) {
    if (i == 0) {
      topCircle = 15;
      leftCircle = 15;
    } else if (i < 6) {
      topCircle = 7.5;
      leftCircle = leftCircle + 102.5;
    } else if (i == 6) {
      topCircle = 15;
      leftCircle = 620;
    } else if (i < 12) {
      topCircle = topCircle + 94;
      leftCircle = 620;
    } else if (i == 12) {
      topCircle = 565;
      leftCircle = 620;
    } else if (i < 18) {
      topCircle = 570;
      leftCircle = leftCircle - 102.5;
    } else if (i == 18) {
      topCircle = 565;
      leftCircle = 15;
    } else if (i < 24) {
      topCircle = topCircle - 94;
      leftCircle = 7.5;
    } else {
      return;
    }
    circleList.push({
      topCircle: topCircle,
      leftCircle: leftCircle
    });
  }
  //圆点闪烁
  _this.setData({
    circleList
  });
  setInterval(function() {
    if (_this.colorCircleFirst == '#FFDF2F') {
      _this.setData({
        colorCircleFirst: '#FE4D32',
        colorCircleSecond: '#FFDF2F'
      });
    } else {
      _this.setData({
        colorCircleFirst: '#FFDF2F',
        colorCircleSecond: '#FE4D32'
      });
    }
  }, 500);
}

function request(action, data = {}, header = {}) {
  const url = 'https://www.all2key.cn/yz/lottery/' + action;
  const sid = wx.getStorageSync('sid');
  return new Promise(function(resolve, reject) {
    uni.request({
      url,
      data: {
        sid,
        ...data
      },
      header,
      success: res => resolve(res.data),
      fail: reject
    });
  });
}

function request51(action, data = {}, header = {}) {
  const url = 'https://www.all2key.cn/yz/holiday51/' + action;
  const sid = wx.getStorageSync('sid');
  return new Promise(function(resolve, reject) {
    uni.request({
      url,
      data: {
        sid,
        appToken: 'holiday51',
        app: 'holiday51',
        ...data
      },
      header,
      success: res => resolve(res.data),
      fail: reject
    });
  });
}

function request613(action, data = {}, header = {}) {
  const url = 'https://www.all2key.cn/yz/holiday613/' + action;
  const sid = wx.getStorageSync('sid');
  return new Promise(function(resolve, reject) {
    uni.request({
      url,
      data: {
        sid,
        appToken: 'holiday613',
        app: 'holiday613',
        ...data
      },
      header,
      success: res => resolve(res.data),
      fail: reject
    });
  });
}

function logPromise(msg) {
  return function(res) {
    console.log(msg, res);
    return Promise.resolve(res);
  };
}

function startGame(_this, key, finalSelect = 0) {
  let indexSelect = 0;
  let timer = setInterval(function() {
    indexSelect++;
    const tempIndex = indexSelect >= 8 ? indexSelect % 8 : indexSelect;
    _this.setData({
      indexSelect: tempIndex
    });

    if (indexSelect > 16 && tempIndex === finalSelect) {
      //去除循环
      clearInterval(timer);
      request('saveAward', {
        finalSelect, key
      }).then(res => {
        console.log('saveAward: ', res);
        const {
          code,
          max
        } = res;
        _this.setData({
          max
        });
        const msg = code ? '恭喜您获得了' + _this.awardName[parseInt(tempIndex)] + '！' : '抽奖失败!';
        //获奖提示
        wx.showModal({
          title: '抽奖结果',
          content: msg,
          //去掉取消按钮
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              _this.setData({
                isRunning: false
              });
            }
          }
        });
      }).catch(err => console.log(err));
    }
  }, _this.times);
}

function webSocketConnect(_this) {
  const socketTask = uni.connectSocket({
    url: 'wss://www.all2key.cn/lottery',
    // only weapp
    //header: { 'content-type': 'application/json', 'apptoken': 'yz_lottery', 'sid': sid },
    success: msg => console.log('connectSocket success: ', msg),
    complete: () => {}
  });

  socketTask.onOpen(msg => console.log('websocket onOpen: ', msg));

  socketTask.onMessage(function(res) {
    const msg = JSON.parse(res.data);
    console.log('recevied msg: ', msg);
    const {
      mobile,
      award
    } = msg;
    if (mobile && award) {
      _this.setData({
        notice: `恭喜手机号为${hideMobile(mobile)}的客户抽中奖品${award}！`
      });
    }
  });
}

function hideMobile(m) {
  return m.slice(0, -4) + '****';
}

module.exports = {
  formatTime,
  setCircleList,
  setAwardList,
  request,
  request51,
  request613,
  startGame,
  webSocketConnect,
  validMobile
};
