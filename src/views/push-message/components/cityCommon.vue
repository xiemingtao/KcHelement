<template>
  <div class="selectStyle">
      <FormItem label="推送设备" prop="addr" v-show="hideCity">
        <Select v-model="formData.sPoliceName" placeholder="请选择分局" class="select-item"  @on-change="onChangeArea" multiple v-show="hideDev" filterable style="width:168px"> 
          <Option v-for="item in policeList" :value="item.id" :key="item.id" :label="item.name">{{item.name}}</Option>
        </Select>
        <Select v-model="formData.sStationName" placeholder="请选择派出所" class="select-item" style="margin-left: 6px; width:180px" multiple @on-change="onChangeChild" filterable >
          <Option v-for="item in policeStation" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
        
      </FormItem>
      <FormItem prop="checkAllGroup" class="checkStyle">
          <div style="background-color: #003558; border: 1px solid #003558; border-radius: 5px;padding: 10px;">
            <div style="border-bottom: 1px solid #5a98d5;padding-bottom:6px;margin-bottom:6px;">
              <Checkbox
                :indeterminate="indeterminate"
                :value="checkAll"
                @click.prevent.native="handleCheckAll">全选
              </Checkbox>
              <Button  class="refresh" @click="refresh">刷新列表</Button>
            </div>
            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
              <Checkbox :label="item" style="margin-right: 20px;" v-for="item in equipmentList" :key="item.index"></Checkbox>
            </CheckboxGroup>
          </div>

        </FormItem>
      
      <!-- <FormItem prop="checkAllGroup" label="在线设备">
        <div style="background-color: #003558; border: 1px solid #003558; border-radius: 5px;padding: 10px;">
          <div style="border-bottom: 1px solid #5a98d5;padding-bottom:6px;margin-bottom:6px;">
            <Checkbox
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll">全选</Checkbox>
          </div>
          <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <Checkbox :label="item" style="margin-right: 20px;" v-for="item in equipmentList" :key="item.index"></Checkbox>
          </CheckboxGroup>
        </div>

      </FormItem> -->
  </div>
</template>

<script>
import { getOrgList, findDevOnline, getOrgName } from 'api'
export default {
  props: ['value'],
  data () {
    return {
      userLevel: JSON.parse(sessionStorage.getItem('user')).userLevel,
      regionName: JSON.parse(sessionStorage.getItem('user')).organizationName,
      hideDev: true,
      hideCity: true,
      formData: {
        sPoliceName: [],
        sStationName: []
      },
      indeterminate: true,
      checkAll: false,
      checkAllGroup: [],
      policeList: [],
      policeStation: [],
      organizedIdList: [JSON.parse(sessionStorage.getItem('regionId'))],
      equipmentList: [],
      newIds: [],
    }
  },
  mounted () {
    if (this.userLevel === '1') {
      this.hideDev = false
    }
    if (this.userLevel === '2') {
      this.hideDev = false
      this.hideCity = false
    }
    if (this.regionName === '超级管理员') {
      this.regionName = '上海市公安局'
    }
    this.getOrgLists()
  },
  methods: {
    getOrgLists () {
      getOrgName({
        name: this.regionName
      }).then(res => {
        // console.log(res.data.obj)
        if (res.data.success) {
          if (this.userLevel === '1') {
            this.policeStation = res.data.obj[0].children
          } else if (this.userLevel === '2') {
            this.policeStation = res.data.obj
            this.organizedIdList.push(res.data.obj[0].id)
            // this.$emit('getDevId', this.organizedIdList)
          } else if (this.userLevel === '0' || this.userLevel === '9') {
            this.policeList = res.data.obj[0].children
          }
          this.getOnlineDev()
        }
      })
    },
    getOnlineDev () {
      // console.log(this.organizedIdList)
      findDevOnline({
        organizeIdList: this.organizedIdList
      }).then(res => {
        if (res.data.success) {
          this.equipmentList.splice(0)
          res.data.obj.forEach(item => {
             this.equipmentList.push(item.userName)
             this.equipmentList = Array.from(new Set(this.equipmentList))
          })
        }
      })
    },
    //  区域变更
    onChangeArea (idList) {
      // console.log(idList)
      if (idList.length === 0) {
        this.organizedIdList =[JSON.parse(sessionStorage.getItem('regionId'))]
      } else {
        this.organizedIdList = idList
      }
      this.newIds = idList
      // this.equipmentList.splice(0)
      this.getOnlineDev()
      this.policeStation.splice(0)
      idList.forEach(id => {
        this.policeList.find(item => item.id === id).children.forEach(item => {
          this.policeStation.push(item)
        })
      })
      if (this.policeStation.length === 0) {
        this.policeStation = []
      }
    },
    onChangeChild (idList) {
      if (idList.length == 0) {
        if (this.userLevel == '1') {
          this.organizedIdList = [JSON.parse(sessionStorage.getItem('regionId'))]
        } else {
          this.organizedIdList = this.newIds
        }
        // console.log(this.organizedIdList)
      } else {
        this.organizedIdList = idList
      }
      // this.equipmentList.splice(0)
      this.getOnlineDev()
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        this.$emit('getDevId', this.equipmentList)
        this.checkAllGroup = this.equipmentList
      } else {
        this.$emit('getDevId', [])
        this.checkAllGroup = []
      }
    },
    checkAllGroupChange (data) {
      this.$emit('getDevId', data)
      if (data.length === this.equipmentList.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    refresh () {
      this.checkAllGroup = []
      this.indeterminate = true
      // this.organizedIdList = [JSON.parse(sessionStorage.getItem('regionId'))]
      this.getOnlineDev()
    }
  },
  watch: {
    value (val) {
      if (val === '2') {
        this.checkAllGroup = []
        // this.formData.sPoliceName = []
        // this.formData.sStationName = []
        // this.organizedIdList = [JSON.parse(sessionStorage.getItem('regionId'))]
        this.indeterminate = true
        this.$emit('input', '1')
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .selectStyle {
    .ivu-form-item {
      .checkStyle {
        margin-top: 10px;
      }
    }
    .checkStyle {
  .ivu-form-item-content {
    button {
      width: auto;
      height: 28px;
      text-align: center;
      color: #5a98d5;
      text-shadow: 1px 1px 1px #333;
      border-radius: 5px;
      outline: none;
      cursor: pointer;
      line-height: 14px;
      padding: 0 10px;
      &.refresh {
        // float: right;
        font-size: 12px;
        margin-left: 10px;
        border: 1px solid rgba(8, 75, 132, 1);
        // box-shadow: 0 1px 2px #8fcaee inset, 0 -1px 0 #497897 inset, 0 -2px 3px #8fcaee inset;
        background-color: rgba(0, 53, 88, 1);
        &:hover {
          background-color: rgba(0, 53, 88, .8);
          color: #fff;
        }
        &:active {
          top: 1px;
          background-color: rgba(0, 53, 88, .5);
          color: #ccc;
        }
      }
    }
  }
}
  }
</style>


