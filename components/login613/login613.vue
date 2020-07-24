<template>
  <view>
    <van-cell-group title="请输入领奖信息：" v-if="showInput">
      <van-field :value="mobile" type="digit" maxlength="20" label="手机号：" @change="onChange" data-id="mobile" placeholder="填错不能兑奖" :error-message="errMobile">
        <van-button slot="button" size="small" type="primary" @tap="commitInfo">确认信息正确</van-button>
      </van-field>
      <van-field :value="plateNum" maxlength="10" label="车牌号：" @change="onChange" data-id="plateNum" placeholder="请填写车牌照号码"></van-field>
      <van-field :value="nickName" maxlength="10" label="昵 称：" @change="onChange" data-id="nickName" placeholder="可不填"></van-field>
    </van-cell-group>
  </view>
</template>

<script>
const { validMobile, request613 } = require('@/utils/util.js');
export default {
  data() {
    return {
      sid: null,
      errMobile: '',
      showInput: false,
      mobile: '',
      plateNum: '云A',
      nickName: '谊众客户'
    };
  },

  lifetimes: {
    attached() {
      console.log('components login attached!');
    }
  },

  methods: {
    show() {
      this.showInput = true;
    },

    onChange(e) {
      //console.log("onChange event: ", e);
      this.setData({ [`${e.target.dataset.id}`]: e.detail });
      this.setData({ errMobile: validMobile(this.mobile) });
      //console.log("this.mobile: ", this.mobile);
    },

    async commitInfo() {
      if (this.errMobile || this.plateNum == '云A') {
        wx.showModal({
          title: '提示',
          content: '请正确填写手机号和车牌号！',
          //去掉取消按钮
          showCancel: false,
          success: res => {}
        });
        return 0;
      }
      const data = { nickName: this.nickName || '谊众客户', mobile: this.mobile, plateNum: this.plateNum };
      const res = await request613('login', data);
      console.log('login: ', res);
      this.$emit('login', res);
      this.setData({ showInput: false });
    }
  }
};
</script>

<style></style>
