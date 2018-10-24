<template>
    <div class="add-equipment">
        <div style="width: 100%;height: 1px;background-color:#5a98d5"></div>
        <p class="title">新增设备
        </p>
        <div  class="add-equipmentForm">
            <Form :model="eForm" ref="formValidate" :rules="ruleValidate">
                <FormItem prop="equipmentNumber">
                    <label class="form-label">设备编号</label>
                    <Input v-model="eForm.equipmentNumber" placeholder="请输入设备编号" class="form-input-1" icon=" " ></Input>
                </FormItem>
                <FormItem prop="userPhone">
                    <label class="form-label">手机号码</label>
                    <Input v-model="eForm.userPhone" placeholder="请输入手机号码" class="form-input-1" icon= " " :maxlength="11"></Input>
                </FormItem>
                <FormItem v-show="hideCity">
                  <label class="form-label">设备所属组织</label>
                  <FormItem v-show="hideCity" prop="policeNames" style="float:left">
                    <!-- <areaCommon :regionName="regionName" :userLevel = "userLevel" @getRegionId="getRegionId"></areaCommon> -->
                    <Select v-model="eForm.policeNames" class="select-item" @on-change="onChangeArea" v-show="hideRegion" placeholder="请选择分局" filterable >
                      <Option v-for="item in policeList" :value="item.id" :key="item.id" >{{item.name}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem v-show="hideCity" prop="stations" style="float:left">
                    <Select v-model="eForm.stations" class="select-item" @on-change="onChangeId" v-show="hideRegionChild" clearable style="margin-left:10px; margin-right:10px;" placeholder="请选择派出所" :filterable="filterShow" ref="secLevel">
                      <Option v-for="item in policeStation" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                  </FormItem>
                </FormItem>
                <FormItem prop="sPolice">
                  <label class="form-label">警员信息</label>
                  <Select v-model="eForm.sPolice"  class="select-item"  label-in-value @on-change="getNum" placeholder="请选择警员" :filterable="prensonShow" ref="police">
                        <Option v-for="item in policeInfo" :value="item.userName" :key="item.id" :label="item.name"></Option>
                  </Select>
                  <input placeholder="警号" class="form-input" style="width: 120px; margin-left: 6px" disabled v-model="policeNum"></input>
                </FormItem>
                <FormItem>
                  <div style="padding-left: 100px;margin-top: 40px">
                      <Button  class="btn-cancel" @click="backPage">返回</Button>
                      <Button  class="btn-confirm" @click="addDevice" :loading="loadShow">确定</Button>
                  </div>
                </FormItem> 
            </Form>
        </div>
    </div>
</template>

<script>
    import { insertDvcList, findUserList, getOrgList, getOrgName } from 'api'
    import areaCommon from '../areaList/areaList'
    export default {
      data () {
        const PhonePass = (rule, value, callback) => {
          let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
          if (value === '') {
            callback(new Error('手机号不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        }
        const devnum = (rule, value, callback) => {
          let reg = /^[a-z|A-Z]{4}\d{5}$/
          if (value === '') {
            callback(new Error('设备号不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('请输入正确的设备编号'))
          } else {
            callback()
          }
        }
        const organ = (rule, value, callback) => {
          // console.log(value)
          // console.log(this.eForm.policeNames)
          if (value == this.regionId || this.regionId == this.eForm.stations) {
            callback()
            } else {
            callback(new Error('请添加设备所属组织'))
          }
        }
        const organs = (rule, value, callback) => {
          // console.log(value)
          if (value == this.eForm.policeNames || value == this.eForm.stations) {
            callback()
          }  else {
            callback(new Error('请添加设备所属组织'))
          }
        }
        return {
          regionName: JSON.parse(sessionStorage.getItem('user')).organizationName,
          userLevel: JSON.parse(sessionStorage.getItem('user')).userLevel,
          hideCity: true,
          loadShow: false,
          policeList: [],
          filterShow: false, 
          prensonShow: false,
          hideRegion: true,
          hideRegionChild: true,
          policeN: '',
          eForm: {
            stations: '',
            policeNames: '',
            equipmentNumber: '',
            sPolice: '',
            userPhone: ''
          },
          policeInfo: [],
          policeStation: [],
          regionId: JSON.parse(sessionStorage.getItem('regionId')),
          userName: '',
          policeNum: '',
          policeName: '',
          ruleValidate: {
            userPhone: [
              { validator: PhonePass, trigger: 'blur' }
            ],
            equipmentNumber: [
              { required: true, message: '请添加设备编号', trigger: 'blur'},
              // { validator: devnum, trigger: 'blur' },
              // { type: 'string', min: 9, message: '设备编号最大长度不能小于9位', trigger: 'blur'}
            ],
            sPolice: [
              { required: true, message: '请添加警员信息', trigger: 'blur'}
            ],
            policeNames: [
              // { required: true, message: '请添加设备所属组织', trigger: 'blur'},
              { validator: organ, trigger: 'blur' },
            ],
            stations: [
              // { required: true, message: '请添加设备所属组织', trigger: 'blur'},
              { validator: organs, trigger: 'blur' },
            ]
          },
          filterShow: false,
          name:JSON.parse(sessionStorage.getItem('user')).organizationName,
          stationId: ''
        }
      },
      created () {
        let that = this
        document.querySelector('body').onkeydown = (e) => {
          if (e.keyCode == 13) {
            that.addDevice()
            e.preventDefault()
          }
        }
      },
      mounted () {
        if (this.userLevel == '2') {
          this.hideCity = false
          this.getPerson()
          this.eForm.stations = this.regionId
        }
        if (this.name === '超级管理员') {
          this.name = '上海市公安局'
        }
        getOrgName({name: this.name}).then(res => {
          if (this.userLevel === '2') {
            this.policeStation = res.data.obj
            this.hideRegion = false
            this.hideRegionChild = false
          } else if (this.userLevel === '1') {
            // this.hideRegion = false
            this.policeList = res.data.obj
            this.policeStation = res.data.obj[0].children
          } else if (this.userLevel === '0' || this.userLevel === '9') {
            // console.log(res.data.obj[0])
            this.policeList = res.data.obj[0].children
            const childList = this.policeList.find(item => item.id === this.eForm.policeNames)
            if (!childList) return
            this.policeStation = childList.children
          }
        })
      },
      methods: {
        // 取消返回
        backPage () {
          this.$store.commit('delTag', this.$route.name)
          this.$router.push({
            name: 'equipment-control_index'
          })
        },
        // 确定编辑
        addDevice () {
          // console.log(this.regionId)
          // if (this.eForm.equipmentNumber.trim() === '') {
          //   this.$Message.warning('设备编号不能为空')
          //   return
          // }
          // if (!this.policeNum) {
          //   this.$Message.warning('请输入警员信息')
          //   return
          // }
            // if (this.regionId == '16') {
            //   this.$Message.warning('请输入设备所属组织')
            //   return
            // }
          this.$refs.formValidate.validate((valid) => {
            if (valid) {
              this.loadShow = true
              insertDvcList({
                policeName: this.policeN,
                policeNum: this.policeNum,
                regionId: this.regionId,
                deviceNum: this.eForm.equipmentNumber,
                telephone: this.eForm.userPhone
              }).then(res => {
                this.loadShow = false
                // console.log(res.data)
                if (res.data.success) {
                  this.$Message.success('设备添加成功')
                  this.$refs.formValidate.resetFields()
                  // this.$store.commit('delTag', this.$route.name)
                  // this.$router.push({
                  //   name: 'equipment-control_index'
                  // })
                } else {
                  this.$Message.warning(res.data.msg)
                }
              })
            }
          })
        },
        // 获取当前派出所人员
        getPerson () {
          findUserList({
            pageIndex: 1,
            pageSize: 100000,
            regionId: this.regionId
          }).then(res => {
            if (res.data.success) {
              // res.data.success.length == 0 ? this.prensonShow = false : this.prensonShow = true
               if (res.data.obj.length == 0) {
                 this.prensonShow = false
                 this.$refs.police.setQuery('')
               } else {
                 this.prensonShow = true
               }
              this.policeInfo = res.data.obj.map(item => {
                return {
                  name: item.policeName,
                  userName: item.userName,
                  id: item.id
                }
              })
            }
          })
        },
        // 获取当前警员编号
        getNum (val) {
          console.log(val)
          if (!val.label) {
            this.policeNum = ''
            return
          }
          this.policeN = val.label
          this.policeInfo.forEach(item => {
            if (item.userName === val.value) {
              this.policeNum = item.userName
              this.policeN = item.name
            }
          })
        },
        onChangeArea (id) {
          // console.log(this.eForm.policeNames)
          // console.log(id)
          this.stationId = id
          this.regionId = id
          this.getPerson()
          const childList = this.policeList.find(item => item.id == id)
          // console.log(childList)
          if (!childList) return
          this.policeStation = childList.children
          if (this.policeStation.length == 0) {
            this.filterShow = false
            this.$refs.secLevel.setQuery('')
          } else {
            this.filterShow = true
          }
        },
        onChangeId (id) {
          // console.log(this.eForm.stations)
          if (!id) {
            id = this.stationId
            this.eForm.sPolice = ''
            this.policeNum = ''
          }
          this.regionId = id
          this.getPerson()
        }
      },
      components: {
        areaCommon
      },
      beforeDestroy () {
        document.querySelector('body').onkeydown = null
      }
    }
</script>

<style lang="less">
    @import 'add-equipment.less';
    /*@import '../../styles/kc_select_style.less';*/
</style>
