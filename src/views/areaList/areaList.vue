<template>
  <div style="display:inline-block" class="select_style">
    <Select v-model="policeName" class="select-item" @on-change="onChangeArea" v-show="hideRegion" style="margin-right:0px;"  placeholder="请选择分局"  >
      <Option v-for="item in policeList" :value="item.id" :key="item.id" >{{item.name}}</Option>
    </Select>
    <Select v-model="stations" placeholder="请选择派出所" class="select-item" @on-change="onChangeId" v-show="hideRegionChild"  clearable :filterable="filterShow" style=" margin-right:10px;" ref="secLevel">
      <Option v-for="item in policeStation" :value="item.id" :key="item.id">{{item.name}}</Option>
    </Select>
    <!-- <Button type="primary" style="margin-left: 10px;margin-right: 20px;" @click="resetList">重置</Button> -->
  </div>
</template>

<script>
  import { getOrgList, getOrgName } from 'api'
  export default {
    props: ['regionId', 'parentId', 'value'],
    data () {
      return {
        policeName: '',
        stations: '',
        policeList: [], 
        policeStation: [],
        hideRegion: true,
        hideRegionChild: true,
        id: '',
        name: JSON.parse(sessionStorage.getItem('user')).organizationName,
        userLevel: JSON.parse(sessionStorage.getItem('user')).userLevel,
        stationId: '',
        filterShow: false
      }
    },
    mounted () {
      // this.getOrgLists()
      this.policeName = this.parentId
      this.stations = this.regionId
      if (this.name === '超级管理员') {
          this.name = '上海市公安局'
        }
      this.getOrgLists()
      // console.log(this.policeName, this.stations)
    },
    methods: {
      getOrgLists () {
        getOrgName({
          name: this.name
        }).then(res => {
          this.id = res.data.obj[0].id
          // console.log(this.id)
          // this.$emit('getRegionId', this.id)
          // sessionStorage.setItem('regionId', JSON.stringify(this.id))
          if (this.userLevel === '2') {
            this.$emit('getRegionId', this.id)
            this.policeStation = res.data.obj
            this.hideRegion = false
            this.hideRegionChild = false
          } else if (this.userLevel === '1') {
            // this.hideRegion = false
            this.policeList = res.data.obj
            this.policeStation = res.data.obj[0].children
          } else if (this.userLevel === '0' || this.userLevel === '9') {
            this.policeList = res.data.obj[0].children
            const childList = this.policeList.find(item => item.id === this.parentId)
            if (!childList) return
            this.policeStation = childList.children
          }
        })
      },
      onChangeArea (id) {
        if (!id) {
          if (this.userLevel == 1) {
            this.$emit('getRegionId', JSON.parse(sessionStorage.getItem('regionId')))
             this.stationId = JSON.parse(sessionStorage.getItem('regionId'))
          } else if (this.userLevel == 0 || this.userLevel == 9) {
            this.stationId = 16
            this.$emit('getRegionId', this.stationId)
          }
          // this.$emit('getRegionId', '16')
          this.policeStation = []
          return
        }
        this.$emit('getRegionId', id)
        this.stationId = id
        const childList = this.policeList.find(item => item.id == id)
        this.policeStation = childList.children
        if (this.policeStation.length == 0) {
           this.filterShow = false
           this.$refs.secLevel.setQuery('')
        } else {
          this.filterShow = true
        }
      },
      onChangeId (id) {
        // console.log(id)
        if (!id) {
          if (this.userLevel == 1) {
             this.$emit('getRegionId', JSON.parse(sessionStorage.getItem('regionId')))
          }
          if (this.userLevel == 0 || this.userLevel == 9) {
            id = this.stationId
            this.$emit('getRegionId', id)
            this.filterShow = false
          }
        } else {
        // id = this.stationId
        this.$emit('getRegionId', id)
        }
      }
    },
    watch: {
      value (val) {
        if (val === '2') {
          this.policeName = ''
          this.policeStation = []
          this.$emit('input', '1')
        }
      }
    } 
  }
</script>

<style lang="less">
  .select_style {
    .select-item {
      .ivu-select-selection {
        .ivu-select-input {
          color: #DDD;
        }
        .ivu-select-placeholder {
          color: #DDD;
          background-color: transparent;
        }
      }
    }
  }
</style>
