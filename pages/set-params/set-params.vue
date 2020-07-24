<template>
  <view class="all">
    <!-- <van-nav-bar title="标题" left-text="返回" left-arrow bind:click-left="onClickLeft" bind:click-right="onClickRight" /> -->
    <view class="myflex">
      <text style="flex: 2;">设置可抽奖次数：</text>
      <van-stepper style="flex: 1;" :value="chance" @change="onChangeChance" min="0" integer />
    </view>

    <van-button plain type="primary" block @click="setChance">按设置次数开始新的抽奖</van-button>

    <van-divider contentPosition="center">按百分比设置奖品概率</van-divider>
    <van-notice-bar wrapable scrollable="false" left-icon="volume" :text="'所有奖品概率总和为100，现可分配点数：' + points" />
    <view class="myflex" v-for="(item, index) in awards" :key="index">
      <text style="flex: 1;">{{ item.name }}：</text>
      <van-slider style="flex: 2;" :value="item.prob" use-button-slot @drag="onDrag" bar-height="6px" active-color="#ee0a24" min="0" max="50" :data-index="index" :id="index">
        <view class="custom-button" slot="button">{{ item.prob }}</view>
      </van-slider>
    </view>

    <van-button plain type="primary" block @click="setProbs">确认奖品概率设置</van-button>
  </view>
</template>

<script>
const { request } = require('../../utils/util.js');
export default {
  data() {
    return {
      chance: 0,
      probs: [3, 3, 21, 5, 22, 24, 21, 1],
      points: 0,
      awards: [
        { name: '挡泥板', prob: 3 },
        { name: '捷达雨伞', prob: 3 },
        { name: '车内沾灰神器', prob: 21 },
        { name: '燃油添加剂', prob: 5 },
        { name: '玻璃水', prob: 22 },
        { name: '设备换油', prob: 24 },
        { name: '车内沾灰神器', prob: 21 },
        { name: '捷达精品车模', prob: 1 }
      ]
    };
  },

  onLoad() {
    request('getParams', {})
      .then(res => {
        console.log('getParams: ', res);
        const chance = res.content.chance;
        const awards = probs2awards(this.awards, res.content.probs);
        this.setData({ chance, awards });
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
            request('setChance', { chance: _this.chance })
              .then(res => {
                console.log('setParams: ', res);
                wx.showToast({ title: res.msg });
              })
              .catch(err => console.log(err));
          }
        }
      });
    },

    setProbs() {
      if (this.points !== 0) {
        wx.showModal({
          title: '提示',
          content: '还有概率点数未用完！',
          //去掉取消按钮
          showCancel: false,
          success() {}
        });
        return 0;
      }

      const probs = getProbs(this.awards);
      request('setProbs', { probs })
        .then(res => {
          console.log('setProbs: ', res);
          wx.showToast({ title: res.msg });
        })
        .catch(err => console.log(err));
    },

    onSliderChange(e) {
      console.log('onSliderChange: ', e);
      //this.setData({ [`awards.${e.currentTarget.dataset.index}.prob`]: e.detail.value });
    },

    onDrag(e) {
      //console.log('onDrag: ', e);
      const awards = this.awards;
      const index = parseInt(e.currentTarget.dataset.index);
      let prob = e.detail.value;
      awards[index].prob = prob;
      let points = getPoints(awards);

      if (points < 0) {
        points = 0;
        awards[index].prob = 0;
        prob = getPoints(awards);
      }

      this.setData({ [`awards.${index}.prob`]: prob, points });
    }
  }
};

function getPoints(awards) {
  if (!Array.isArray(awards)) return 0;
  let probs = 100;
  awards.forEach(item => (probs = probs - item.prob));
  return probs;
}

function getProbs(awards) {
  if (!Array.isArray(awards)) return 0;
  return awards.map(item => item.prob);
}

function probs2awards(awards, probs) {
  return awards.map((item, index) => {
    item.prob = probs[index];
    return item;
  });
}
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
