<template>
  <view class="m-lottery-dial">
    <div class="m-ui-dial">
      <div id="js_pointer" class="pointer"><a class="btn" href="javascript:;" @tap="dial.start"></a></div>
    </div>
  </view>
</template>

<script module="dial" lang="renderjs">
let lottery = null;
export default {
  props: {
    // select: {
    //   type: Number,
    //   default: -1
    // }
  },

  data(){
    return {
      index: -1
    };
  },

	mounted() {
    if (typeof window.LotteryDial === 'function') {
    	this.init();
    } else {
    	// 动态引入较大类库避免影响页面展示
    	const script = document.createElement('script');
    	// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
    	script.src = './static/dial.js';
    	script.onload = this.init.bind(this);
    	document.head.appendChild(script);
    }
	},

	methods: {
    start(){
      //console.log("startGame!");
      this.$emit('startGame', '');
    },

    run(index){
      console.log("draw(%d)", index);
      this.index = index;
      lottery.setResult(index);
      lottery.draw();
    },

    init(){
      //speed: 每帧速度,  areaNumber: 奖区数量
      lottery = new LotteryDial(document.getElementById('js_pointer'), { speed: 12, areaNumber: 21 });
      lottery.on('start', () => {
        console.log('game start: ', this.index);
      });
      lottery.on('end', () => {
        //console.log('game end!');
        this.$emit('gameOver', this.index);
      });
    }
  }
}
</script>

<style>
@import url('./dial613.css');
</style>
