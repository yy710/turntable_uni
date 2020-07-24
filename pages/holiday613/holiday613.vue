<template>
	<view>
    <van-divider contentPosition="center">欢迎{{ nickName }},您有{{ max }}次抽奖机会！</van-divider>
    
    <login ref='login' @login="onLogin"></login>
    
		<dial ref="dial" @startGame="onStartGame" @gameOver="onGameOver"></dial>
    
    <van-divider contentPosition="center">获奖通知</van-divider>
    <van-notice-bar wrapable scrollable="false" left-icon="volume" :text="notice" />
	</view>
</template>

<script>
  import dial from '@/components/dial613/dial613.vue';
  import login from '@/components/login613/login613.vue';
  var app = getApp().globalData;
  const { request613, webSocketConnect, validMobile } = require('../../utils/util.js');
  //import parseHtml from '../../utils/html-parser.js';
  
	export default {
    components: { dial, login },
		data() {
			return {
        sid: null,
        nickName: '谊众客户',
        max: 1,
        notice: '',
        finalSelect: -1,
        key: null
			}
		},
    
    async onLoad(){
      const res = await request613('login');
      console.log("login: ", res);
      const { code, msg, sid, nickName, max } = res;
      code && this.setData({ sid, nickName, max });
    },
    
		methods: {
      onLogin(res){
        const { code, nickName, mobile, sid, max } = res;
        if (sid && code) {
          uni.setStorageSync('sid', sid);
          this.setData({ sid, max, nickName });
        }
      },
      
			async onStartGame(){
        const that = this;
        const sid = this.sid || uni.getStorageSync('sid');
        if(sid){
          // get radom number
          const res = await request613('getSelect');
          console.log('getSelect: ', res);
          const { code, key, finalSelect, msg } = res;
          
          if(!code && key){
            this.key = key;
            this.$refs.dial.run(parseInt(finalSelect));
          }else{
            wx.showModal({
              title: '提示',
              content: msg,
              //去掉取消按钮
              showCancel: false,
              success: res =>  {
                that.setData({ max: 0 });
                code == 2 && this.$refs.login.show();
              }
            });
          }
        }else{
          this.$refs.login.show();
        }
      },
      
      onGameOver(index){
        const that = this;
        console.log('game over!');
        request613('saveAward', { finalSelect: index, key: this.key })
        .then(res => {
          console.log('saveAward: ', res);
          const { code, max, award } = res;
          that.setData({ max });
          //获奖提示
          wx.showModal({
            title: '抽奖结果',
            content: code ? '恭喜您获得礼品: ' + award + ' !' : '抽奖失败!',
            //去掉取消按钮
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                //
              }
            }
          });
        }).catch(err => console.log(err));
      }
    }
  };
</script>

<style>

</style>
