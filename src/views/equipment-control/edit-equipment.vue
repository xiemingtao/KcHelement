<template>
    <div class="edit-equipment">
        <div style="width: 100%;height: 1px;background-color:#5a98d5"></div>
        <p class="title">编辑设备
          <!-- <Button type="primary" @click="backPage" class="btn-cancel">返回</Button> -->
        </p>
        <div  class="add-equipment-form">
            <Form :model="eForm" ref="formValidate" :rules="ruleValidate">
                <Form-item>
                    <label class="form-label">设备编号</label>
                    <label style="color: #DDDDDD;">{{eForm.deviceNum}}</label>
                </Form-item>
                <Form-item prop="userPhone">
                   <label class="form-label">手机号码</label>
                   <Input v-model="eForm.userPhone" placeholder="输入手机号码" class="form-input-1" icon =" "></Input>
                </Form-item>
                <Form-item v-if="hideDev">
                <label class="form-label">设备所属组织</label>
                <!-- <areaCommon  @getRegionId="getRegionId" :regionId="regionId" :parentId="parentId"></areaCommon> -->
                <Select v-model="eForm.policeNames" class="select-item" @on-change="onChangeArea" v-show="hideRegion" placeholder="请选择分局" filterable >
                  <Option v-for="item in policeList" :value="item.id" :key="item.id" >{{item.name}}</Option>
                </Select>
                <Select v-model="eForm.stations" class="select-item" @on-change="onChangeId" v-show="hideRegionChild" clearable style="margin-left:10px; margin-right:10px;" placeholder="请选择派出所" :filterable="filterShow" ref="secLevel">
                  <Option v-for="item in policeStation" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select>
                </Form-item>
                <Form-item prop="policeName">
                  <label class="form-label">警员信息</label>
                  <Select v-model="eForm.policeName"  class="select-item"   @on-change="getNum" :filterable = "presonShow" label-in-value ref="police">
                        <Option v-for="item in policeInfo" :value="item.userName" :key="item.id" :label="item.name">{{item.name}}</Option>
                  </Select>
                  <input placeholder="警号" class="form-input" style="width: 120px; margin-left: 6px" disabled v-model="policeNum" ></input>
                </Form-item>
            </Form>
            <div style="padding-left: 100px;margin-top: 40px">
                <Button  class="btn-cancel" @click="backPage">返回</Button>
                <Button  class="btn-confirm" @click="editDevice" :loading="loadShow">确定</Button>
            </div>
        </div>
    </div>
</template>

<script>
    import { updateDvcList, findUserList, findDvcById, getOrgList, getOrgName } from 'api'
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
        const organ = (rule, value, callback) => {
          console.log(value)
          console.log(this.eForm.policeNames)
          if (value == this.regionId || this.regionId == this.eForm.stations) {
            callback()
            } else {
            callback(new Error('请添加设备所属组织'))
          }
        }
        const organs = (rule, value, callback) => {
          console.log(value)
          if (value == this.eForm.policeNames || value == this.eForm.stations) {
            callback()
          }  else {
            callback(new Error('请添加设备所属组织'))
          }
        }
        return {
          name: JSON.parse(sessionStorage.getItem('user')).organizationName,
          userLevel: JSON.parse(sessionStorage.getItem('user')).userLevel,
          regionId: '',
          parentId: '',
          hideDev: true,
          eForm: {
            userPhone: '',
            policeName: '',
            policeNames: '',
            stations: '',

          },
          loadShow: false,
          policeNum: '',
          policeInfo: [],
          hideRegion: true,
          hideRegionChild: true,
          editId: '',
          policeList: [],
          policeStation: [],
          stationId: '',
          ruleValidate: {
            userPhone: [
              { validator: PhonePass, trigger: 'blur' }
            ],
            policeName: [
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
          filterShow: true,
          presonShow: true,
          policeN: ''
        }
      },
      created () {
        document.querySelector('body').onkeydown = (e) => {
          if (e.keyCode == 13) {
            this.editDevice()
          }
        }
      },
      mounted () {
        this.editId = JSON.parse(sessionStorage.getItem('editId') || 0)
        if (this.name === '超级管理员') {
          this.name = '上海市公安局'
        }
        findDvcById ({id: this.editId}).then(res => {
          // console.log(res.data.obj)
          this.eForm = res.data.obj
          this.policeNum = this.eForm.policeNum
          this.eForm.policeName = this.eForm.policeNum
          this.eForm.stations = this.eForm.organizeLevel === '3' ? this.eForm.regionId : ''
          this.eForm.userPhone = this.eForm.telephone
          this.eForm.policeNames = this.eForm.organizeLevel === '2' ? this.eForm.regionId : this.eForm.organizeLevel === '3' ? this.eForm.parentId : ''
          this.regionId = this.eForm.organizeLevel === '2' ? this.eForm.regionId : this.eForm.organizeLevel === '3' ? this.eForm.regionId : ''
          this.getPerson()
        })
        if (JSON.parse(sessionStorage.getItem('user') || {}).userLevel === '2') {
          this.hideDev = false
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
        backPage () {
          this.$store.commit('delTag', this.$route.name)
          sessionStorage.removeItem('editId')
          this.$router.push({
            name: 'equipment-control_index',
            params: {
              searchTxt: this.$route.params.searchTxt,
              deviceTxt: this.$route.params.deviceTxt,
              parentId: this.$route.params.policeId,
              stationsId: this.$route.params.stationsId,
              pageIndex: this.$route.params.pageIndex,
              curPage: this.$route.params.curPage,
              regionId: this.$route.params.regionId
            }
          })
        },
        editDevice () {
          // console.log(this.regionId)
          
          // if (!this.policeNum) {
          //   this.$Message.warning('请输入警员信息')
          //   return
          // }
          // if (!this.regionId || this.regionId === 16) {
          //   this.$Message.warning('请输入设备所属组织')
          //   return
          // }
          this.$refs.formValidate.validate((valid) => {
            // console.log(valid)
            if (valid) {
              this.loadShow = true
              updateDvcList({
                policeName: this.policeN,
                policeNum: this.policeNum,
                regionId: this.regionId,
                id: this.eForm.id,
                telephone: this.eForm.userPhone
                }).then(res => {
                  this.loadShow = false
                  if (res.data.success) {
                    this.$Message.success('设备编辑成功')
                    setTimeout(() => {
                      this.$store.commit('delTag', this.$route.name)
                      this.$router.push({
                      name: 'equipment-control_index',
                      params: {
                        searchTxt: this.$route.params.searchTxt,
                        deviceTxt: this.$route.params.deviceTxt,
                        parentId: this.$route.params.policeId,
                        stationsId: this.$route.params.stationsId,
                        pageIndex: this.$route.params.pageIndex,
                        curPage: this.$route.params.curPage,
                        regionId: this.$route.params.regionId
                      }
                    })
                  },500)
                  sessionStorage.removeItem('editId')
                }
              })
            }
          })
        },
        getNum (val) {
          // console.log(val)
          if (!val.value ) {
            this.policeNum = ''
            return
          }
          this.policeInfo.forEach(item => {
            if (item.name === val.label) {
              this.policeNum = item.userName
              this.policeN = item.name
            }
          })
        },
        getPerson () {
          findUserList({
            pageIndex: 1,
            pageSize: 1000000,
            regionId: this.regionId
          }).then(res => {
            // console.log(res.data.obj)
            if (res.data.success) {
              // this.presonShow = res.data.obj.length == 0 ? false : true
              if (res.data.obj.length == 0) {
                this.presonShow = false
                this.$refs.police.setQuery('')
              } else {
                this.presonShow = true
              }
              this.policeInfo = res.data.obj.map(item => {
                return {
                  name: item.policeName,
                  userName: item.userName,
                  id: item.id
                }
              })
              // console.log(this.policeInfo)
             
              // this.policeName = this.eForm.policeNum
            }
          })
        }, 
        onChangeArea (id) {
          // console.log(id)
          this.stationId = id
          this.regionId = id
          const childList = this.policeList.find(item => item.id === id)
          // console.log(childList)
          if (!childList) return
          this.policeStation = childList.children
          if (this.policeStation.length == 0) {
            this.filterShow = false
            this.$refs.secLevel.setQuery('')
          } else {
            this.filterShow = true
          }
          this.getPerson()
          // console.log(this.regionId)
        },
        onChangeId (id) {
          console.log(id)
          if (!id) {
            this.$refs.secLevel.setQuery('')
            id = this.stationId
            this.eForm.policeName = ''
            this.policeNum = ''
          }
          this.regionId = id
          this.getPerson()
          // console.log(this.regionId)
        },
        openChange(val) {
          console.log(val)
          if (!val) {
            this.policeInfo = null
            this.eForm.policeName = ''
          }
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
    @import 'edit-equipment.less';
    /*@import '../../styles/kc_select_style.less';*/
</style>
