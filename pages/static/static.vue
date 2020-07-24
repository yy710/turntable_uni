<template>
	<view>
		<van-cell-group title="奖品数量统计">
		  <van-cell v-for="item in awards" :title="item._id" :value="item.count" />
		</van-cell-group>
	</view>
</template>

<script>
  const { request } = require('../../utils/util.js');
	export default {
		data() {
			return {
				awards: []
			}
		},
    onLoad() {
      request('static').then(res => {
        console.log('static: ', res);
        this.setData({ awards: res.content });
        }).catch(err => console.log(err));
    },
		methods: {
			
		}
	}
</script>

<style>

</style>
