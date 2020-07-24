<template>
  <view class="all">
    <!-- <van-nav-bar title="标题" left-text="返回" left-arrow bind:click-left="onClickLeft" bind:click-right="onClickRight" /> -->
    <view class="myflex">
      <text style="flex: 2;">设置可抽奖次数：</text>
      <van-stepper style="flex: 1;" :value="chance" @change="onChangeChance" min="0" integer />
    </view>

    <van-button plain type="primary" block @click="setChance">按设置次数开始新的抽奖</van-button>
  </view>
</template>

<script>
const { request51 } = require('../../utils/util.js');
export default {
  data() {
    return { chance: 0 };
  },

  onLoad() {
    request51('getParams', {})
      .then(res => {
        console.log('getParams: ', res);
        const chance = res.content.chance;
        this.setData({ chance });
      })
      .catch(err => console.log(err));
  },

  methods: {
    onChangeChance(e) {
      console.log(e.detail);
      this.setData({ chance: e.detail });
    },

    setChance() {
      const _this = this;
      uni.showModal({
        title: '警告！',
        content: '此操作会清空所有抽奖数据，请确保已下载备份之前的抽奖记录！',
        success(res) {
          if (res.confirm) {
            request51('setChance', { chance: _this.chance })
              .then(res => {
                console.log('setParams: ', res);
                wx.showToast({ title: res.msg });
              })
              .catch(err => console.log(err));
          }
        }
      });
    }
  }
};
</script>

<style>
.all {
  font-size: 24rpx;
  color: #646566;
  padding: 10rpx;
}

.award {
  height: 80rpx;
  color: #1989fa;
}

.custom-button {
  width: 60rpx;
  height: 38rpx;
  border-radius: 10rpx;
  background-color: #aaaaff;
  text-align: center;
}

.myflex {
  display: flex;
  align-items: center;
  align-content: space-around;
  margin: 15rpx;
  padding-top: 10rpx;
  padding-bottom: 10rpx;
  width: 90%;
}
</style>
