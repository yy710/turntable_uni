<template>
  <view>
    <van-cell-group title="奖品剩余数量统计"><van-cell v-for="item in awards" :key="item.index" :title="item.name" :value="item.amount + '/' + item.initAmount" /></van-cell-group>
  </view>
</template>

<script>
const { request51 } = require('../../utils/util.js');
export default {
  data() {
    return {
      awards: []
    };
  },
  computed: {
    amount() {
      return this.data ;
    }
  },
  onLoad() {
    request51('static')
      .then(res => {
        console.log('static: ', res);
        this.setData({ awards: res.content });
      })
      .catch(err => console.log(err));
  },
  methods: {}
};
</script>

<style></style>
