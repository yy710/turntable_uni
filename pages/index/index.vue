<template>
  <view>
    <van-divider contentPosition="center">欢迎{{ nickName }},您有{{ max }}次抽奖机会！</van-divider>

    <van-cell-group title="请输入领奖信息：" v-if="showInput">
      <van-field :value="mobile" type="digit" maxlength="20" label="手机号：" @change="onChange" data-id="mobile" placeholder="填错不能兑奖" :error-message="errMobile">
        <van-button slot="button" size="small" type="primary" @tap="commitInfo">确认信息正确</van-button>
      </van-field>
      <van-field :value="plateNum" maxlength="10" label="车牌号：" @change="onChange" data-id="plateNum" placeholder="请填写车牌照号码"></van-field>
      <van-field :value="nickName" maxlength="10" label="昵 称：" @change="onChange" data-id="nickName" placeholder="可不填"></van-field>
    </van-cell-group>

    <view class="container-out">
      <view
        class="circle"
        v-for="(item, index) in circleList"
        :key="index"
        :style="'top:' + item.topCircle + 'rpx;left:' + item.leftCircle + 'rpx;background-color: ' + (index % 2 == 0 ? colorCircleFirst : colorCircleSecond) + ';'"
      ></view>
      <view class="container-in">
        <view
          class="content-out"
          v-for="(item, index) in awardList"
          :key="index"
          :style="'top:' + item.topAward + 'rpx;left:' + item.leftAward + 'rpx;background-color: ' + (index == indexSelect ? colorAwardSelect : colorAwardDefault) + ';'"
        >
          <image class="award-image" :src="item.imageAward"></image>
        </view>
        <view class="start-btn" @tap="startGame" :style="'background-color:' + (isRunning ? '#e7930a' : '#ffe400')">开始</view>
      </view>
    </view>

    <van-divider contentPosition="center">获奖通知</van-divider>

    <van-notice-bar wrapable scrollable="false" left-icon="volume" :text="notice" />
  </view>
</template>

<script>
var app = getApp().globalData;
const { setCircleList, setAwardList, request, startGame, webSocketConnect, validMobile } = require('../../utils/util.js');
import parseHtml from '../../utils/html-parser.js';

export default {
  data() {
    return {
      //圆点数组
      circleList: [],
      //奖品数组
      awardList: [],
      //圆点颜色1
      colorCircleFirst: '#FFDF2F',
      //圆点颜色2
      colorCircleSecond: '#FE4D32',
      //奖品默认颜色
      colorAwardDefault: '#F5F0FC',
      //奖品选中颜色
      colorAwardSelect: '#ffe400',
      //被选中的奖品index
      indexSelect: 0,
      //是否正在抽奖
      isRunning: false,
      //奖品图片数组
      imageAward: [
        '/static/images/1.jpg',
        '/static/images/2.jpg',
        '/static/images/3.jpg',
        '/static/images/4.jpg',
        '/static/images/5.jpg',
        '/static/images/6.jpg',
        '/static/images/7.jpg',
        '/static/images/8.jpg'
      ],
      //转盘转动的速度，越大越慢
      times: '200',
      sid: null,
      awardName: ['挡泥板', '捷达雨伞', '车内沾灰神器', '燃油添加剂', '玻璃水', '设备换油', '车内沾灰神器', '捷达精品车模'],
      nickName: '',
      mobile: '',
      plateNum: '云A-',
      showInput: false,
      notice: '',
      max: 5,
      errMobile: '',
      key: null
    };
  },

  components: {},

  props: {},

  onLoad: async function() {
    const res = await request('login');
    console.log("login: ", res);
    const { code, msg, sid, nickName, max } = res;
    code && this.setData({ sid, nickName, max });

    webSocketConnect(this);
    setCircleList(this);
    setAwardList(this);
  },

  methods: {
    onChange(e) {
      //console.log("onChange event: ", e);
      this.setData({ [`${e.target.dataset.id}`]: e.detail });
      this.setData({ errMobile: validMobile(this.mobile) });
      //console.log("this.mobile: ", this.mobile);
    },

    async commitInfo(){
      if(this.errMobile)return 0;
      const data = { nickName: this.nickName || '谊众客户', mobile: this.mobile, plateNum: this.plateNum };
      const res = await request('login', data);
      console.log("login: ", res);
      const { code, nickName, mobile, sid } = res;
      if(sid){
        uni.setStorageSync('sid', sid);
      }
      if(code){
        this.setData({ showInput: false, sid });
      }
    },

    async startGame() {
      console.log('this.sid: ', this.sid);

      if (!this.sid) {
        this.showInput = true;
      } else {
        this.startGame2();
      }
    },

    //开始游戏
    async  startGame2() {
      const _this = this;
      if (this.isRunning) return 0;
      this.setData({ isRunning: true });
      const res = await request('getSelect');
      console.log('getSelect: ', res);
      const { code, key, finalSelect, msg } = res;
      if(code && key){
        startGame(this, key, finalSelect);
      }else{
        wx.showModal({
          title: '提示',
          content: msg,
          //去掉取消按钮
          showCancel: false,
          success: res =>  _this.setData({ isRunning: false, max: 0 })
        });
      }
    }
  }
};
</script>
<style>
@import './index.css';
</style>
