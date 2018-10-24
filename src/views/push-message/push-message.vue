<template>
  <div class="push-message">
    <div style="width: 100%;height: 1px;background-color:#5a98d5"></div>

    <div class="push-content">
      <Tabs value="推送通缉令" @on-click='tabs'>
        <TabPane label="推送通缉令" name="推送通缉令"><push-tongjiling></push-tongjiling></TabPane>
        <!-- <TabPane label="推送指令" name="tab_name2"><push-msg-cmd></push-msg-cmd></TabPane> -->
        <TabPane label="推送警情消息" name="推送警情消息"><push-warn-cmd></push-warn-cmd></TabPane>
      </Tabs>
    </div>


  </div>
</template>

<script>
    import pushTongjiling from './components/pushTongjiling.vue'
    // import pushMsgCmd from './components/pushMsgCmd.vue'
    import pushWarnCmd from './components/pushWarnCmd.vue'
    import { getOrgList } from 'api'
    export default {
      components: {
        pushTongjiling,
        // pushMsgCmd,
        pushWarnCmd
      },
      data () {
        return {
          tab_name: '',
          orgList: 'test-111',
          policeList: []
        }
      },
      methods: {
        // 下载组织架构
        getOrgLists () {
          getOrgList().then(res => {
            // console.log('length ---- ' + res.data.obj[0].children.length)
            this.policeList = res.data.obj[0].children
            // this.$store.commit('updateOrgList', this.policeList)
          })
        },
        backPage () {
          this.$router.go(-1)
        },
        tabs (name) {
          // console.log(name)
        }
      },
      mounted () {
        // this.policeStation = this.$store.state.station.stations
        // this.cityList = this.$store.state.station.citys
        this.getOrgLists()
      }
    }
</script>

<style lang="less">
  @import './push-message.less';
</style>
