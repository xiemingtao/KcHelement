<template>
  <div class="videoPlayer">
    <EasyPlayer :videoUrl="rtmpUrl" live :autoplay="true"></EasyPlayer>
  </div>
</template>

<script>
import EasyPlayer from 'easy-player'
export default {
  data () {
    return {
      rtmpUrl: 'rtmp://http://172.19.60.80:10554/hls/123456'
    }
  },
  props: ['rtmpUrl'],
  mounted () {
    this.rtmpUrl = this.rtmpUrl
  },
  methods: {},
  components: {
    EasyPlayer
  }
}
</script>


<style lang="less" scoped>
.videoPlayer {
  position: relative;
  box-sizing: border-box;
  width: 656px;
  height: 370PX;
  background: #000;
  border: 1px solid #0079ce;
}
</style>
