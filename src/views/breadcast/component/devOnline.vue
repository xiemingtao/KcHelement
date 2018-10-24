<template>
  <div>
    <Menu theme="light" width="180" @on-select="change" @on-open-change="changes" :accordion="false">
        <Submenu :name="item.id" v-for="item in policeLists" :key="item.id">
          <template slot="title">{{item.name}} <p class="number">{{item.devNumber}}</p></template>
          <MenuItem :name="dates.deviceNum" v-for="dates in devList" :key="dates.id">{{dates.policeName}}
            <p class="btns">
              <button @click.stop="endBtn(dates)" v-show="dates.liveStatus !== '0'">关闭直播</button>
              <button @click.stop="startBtn(dates)" v-show="dates.liveStatus === '0'">开启直播</button>
            </p>
          </MenuItem>
          <Submenu :name="ele.id" v-for="ele in item.children" :key="ele.id" icon=" " ref="childrenList">
            <template slot="title">{{ele.name}} <p class="number">{{ele.devNumber}}</p></template>
            <!-- <MenuItem name="1">1111111111</MenuItem> -->
            <MenuItem :name="date.deviceNum" v-for="date in devLists" :key="date.id">{{date.policeName}}
              <p class="btns">
                <button @click.stop="endBtn(date)" v-show="date.liveStatus !== '0'">关闭直播</button>
                <button @click.stop="startBtn(date)" v-show="date.liveStatus === '0'">开启直播</button>
              </p>
            </MenuItem>
          </Submenu>
        </Submenu>
      </Menu>
  </div>
</template>

<script>
import { findDevOnline, pushCommand, getOrgList } from 'api'
export default {
  data() {
    return {
      policeLists: [],
      devList: [],
      organizedIdList: [JSON.parse(sessionStorage.getItem('regionId'))],
      devLists: [],
      name: ''
    }
  },
  created () {
    this.userInfo = JSON.parse(sessionStorage.getItem('user'))
    this.name = this.userInfo.organizationName
    if (this.name === '超级管理员') {
      this.name = '上海市公安局'
    }
    // this.getDevNumber()
  },
  mounted() {
    // this.userInfo = JSON.parse(sessionStorage.getItem('user'))
    // this.name = this.userInfo.organizationName
    // if (this.name === '超级管理员') {
    //   this.name = '上海市公安局'
    // }
    this.getDevNumber()
    setInterval(() => {
      this.getDevNumber()
    },10000)
  },
  methods: {
    change (name) {
      // console.log(name)
      // console.log(this.$refs)
    },
    changes(name) {
      // console.log(name[name.length-1])
      // console.log(this.$refs.childrenList)
    },
    startBtn () {},
    endBtn () {},
    getDevNumber() {
      getOrgList({name:this.name}).then(res => {
        if (this.userInfo.userLevel === '1' || this.userInfo.userLevel === '2') {
          this.policeLists = res.data.obj
        } else if (this.userInfo.userLevel === '0' || this.userInfo.userLevel === '9') {
          this.policeLists = res.data.obj[0].children
        }
        this.policeLists.forEach(item => {
          this.organizedIdList = [item.id]
          findDevOnline({
          organizeIdList: this.organizedIdList
          }).then(res => {
            this.$set(item, 'devNumber', res.data.obj.length)
          })
          item.children.forEach(ele => {
            this.organizedIdList = [ele.id]
            findDevOnline({
            organizeIdList: this.organizedIdList
            }).then(res => {
              this.$set(ele, 'devNumber', res.data.obj.length)
              this.devLists = res.data.obj
            })
          })
        })
      })
    },
    getOrgLists () {
      getOrgList({name:this.name}).then(res => {
        if (this.userInfo.userLevel === '1' || this.userInfo.userLevel === '2') {
          this.policeLists = res.data.obj
        } else if (this.userInfo.userLevel === '0' || this.userInfo.userLevel === '9') {
          this.policeLists = res.data.obj[0].children
        }
      })
    },
    getfindDevOnline () {
      findDevOnline({
        organizeIdList: this.organizedIdList
      }).then(res => {
        this.devList = res.data.obj.find(item => {
          return item.id === this.organizedIdList[0]
        })
        // console.log(res.data)
        // this.devNumber = this.devList.length
      })
    },
  }
}
</script>

<style>

</style>
