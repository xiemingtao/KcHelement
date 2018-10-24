<template>
  <div class="orgChart">
    <div class="titleCnt">组织架构</div>
    <div class="listWrap">
      <template>
        <Menu theme="light" width="220px" :accordion="true" @on-select="change" @on-open-change="changes">
          <Submenu :name="item.id" v-for="item in orgStructure" :key="item.id">
            <template slot="title">{{item.name}} <p class="devOnNum">({{item.devNumber}} / {{item.devNumbers}})</p> </template>
            <MenuItem :name="itm.id" v-for="itm in item.children" :key="itm.id">{{itm.name}}<p class="devOnNums">({{itm.devNumber}} / {{itm.devNumbers}})</p></MenuItem>
          </Submenu>
        </Menu>
      </template>
    </div>
  </div>
</template>

<script>
import { getOrgList, findDevOnline, findDvcList, getOrgName, findUserList } from 'api'
export default {
  data () {
    return {
      orgStructure: [],
      latlng: null,
      policeStation: null,
      name: '',
      userInfo: null,
      organizeIdList: '',
      address: '',
      regionId: '',
      timer: ''
    }
  },
  methods: {
    getOrgLists () {
      getOrgName({
        name: this.name
      }).then(res => {
        // console.log(res.data.obj)
        if (res.data.success) {
          // sessionStorage.setItem('regionId', JSON.stringify(res.data.obj[0].id))
          if (this.userInfo.userLevel === '1' || this.userInfo.userLevel === '2') {
            this.orgStructure = res.data.obj
            const orgStr = res.data.obj[0]
            this.address = orgStr.address
            this.name = orgStr.name
            this.latlng = {
              lng: orgStr.longitude,
              lat: orgStr.latitude
            }
            this.$emit('latlng', this.latlng, this.address, this.name, res.data.obj[0].id)
          } else if (this.userInfo.userLevel === '0' || this.userInfo.userLevel === '9') {
            this.orgStructure = res.data.obj[0].children
            const orgStr = res.data.obj[0]
            this.address = orgStr.address
            this.name = orgStr.name
            this.latlng = {
              lng: orgStr.longitude,
              lat: orgStr.latitude
            }
            this.$emit('latlng', this.latlng, this.address, this.name, res.data.obj[0].id)
          }
          this.devNumber()
        }
      })
    },
    change (val) {
      // console.log(val)
      const orgStr = this.policeStation.find(item => item.id === val)
      this.latlng = {
        lat: orgStr.latitude,
        lng: orgStr.longitude
      }
      this.address = orgStr.address
      this.name = orgStr.name
      this.$emit('latlng', this.latlng, this.address, this.name, val)
    },
    changes (val) {
      // console.log(val)
      if (!val[0]) return
      const orgStr =  this.orgStructure.find(item => item.id === val[0])
      this.policeStation = orgStr.children
      this.latlng = {
        lat: orgStr.latitude,
        lng: orgStr.longitude
      }
      this.address = orgStr.address
      this.name = orgStr.name
       this.$emit('latlng', this.latlng, this.address, this.name, val)
    },
    devNumber() {
      this.regionId =JSON.parse(sessionStorage.getItem('regionId'))
      this.organizeIdList = [JSON.parse(sessionStorage.getItem('regionId'))]
      // 获取在线设备
      findDevOnline({organizeIdList: this.organizeIdList}).then(res => {
        // console.log(res.data.obj)
        if (res.data.success) {
          let childrenDevlist
          this.orgStructure.forEach(item => {
            if (this.userInfo.userLevel === '2') {
              childrenDevlist = res.data.obj.filter(ele => item.id === ele.regionId)
            } else {
              childrenDevlist = res.data.obj.filter(ele => {
                return item.id === (ele.parentId === 16 ? ele.regionId : ele.parentId)
              })
            }
            // console.log(childrenDevlist)
            // this.$set(item, 'childrenDevlist', childrenDevlist)
            this.$set(item, 'devNumber', childrenDevlist.length)
            item.children.forEach(element => {
              childrenDevlist = res.data.obj.filter(ele => element.id === ele.regionId)
            // this.$set(Element, 'childrenDevlist', childrenDevlist)
              this.$set(element, 'devNumber', childrenDevlist.length)
            })
          })
        }
      })
      // 获取总设备数
      findUserList({regionId: this.regionId}).then(res => {
        if (res.data.success) {
          let childrenDevlist
          this.orgStructure.forEach(item => {
            if (this.userInfo.userLevel === '2') {
              childrenDevlist = res.data.obj.filter(ele => item.id === ele.regionId)
            } else {
              childrenDevlist = res.data.obj.filter(ele => item.id === ele.parentId)
            }
            // console.log(childrenDevlist)
            // this.$set(item, 'childrenDevlist', childrenDevlist)
            this.$set(item, 'devNumbers', childrenDevlist.length)
            item.children.forEach(element => {
              childrenDevlist = res.data.obj.filter(date => element.id === date.regionId)
            // this.$set(Element, 'childrenDevlist', childrenDevlist)
            this.$set(element, 'devNumbers', childrenDevlist.length)
            })
          })
        }
      })
    }
  },
  mounted () {
    this.userInfo = JSON.parse(sessionStorage.getItem('user'))
    this.name = this.userInfo.organizationName
    if (this.name === '超级管理员') {
      this.name = '上海市公安局'
    }
    this.$nextTick(() => {
      this.getOrgLists()
    })
    this.timer = setInterval(() => {
      this.devNumber()
    },4000)
  },
  created () {
    // console.log(JSON.parse(sessionStorage.getItem('regionId')))
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
@import "./styles/organizationChart.less";
</style>

<style lang="less">
  @import "./styles/orgChart.less";
</style>
