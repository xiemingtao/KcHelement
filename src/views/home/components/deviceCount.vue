<template>
  <div class="deviceCount">
    <div>在线设备数：<span class="count">{{this.value}}</span></div>
    <div>在线直播数量：<span class="count">{{this.liveNum}}</span></div>
    <!-- <div>警员数：<span class="count">7</span></div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props:['value', 'liveNum']
}
</script>

<style lang="less">
.deviceCount {
  width: 220px;
  height: 62px;
  line-height: 62px;
  display: flex;
  justify-content: space-around;
  color: #9fd1f2;
  background: url("/static/images/deviceCount_bg.png") ~"0 0 / 100% 100%" no-repeat;
  >div {
    text-align: center;
  }
  .count {
    font-size: 18px;
    color: #ffaf38;
  }
}
</style>
