<template>
    <div class="user-infor">
        <div style="width: 100%;height: 1px;background-color:#2d8cea"></div>
        <p class="title">编辑人员信息 </p>
        <div style="margin-top: 40px">
            <!-- <Avatar id="userInfo_toux" class="userInfo_toux" src="/static/images/userInfo_toux.png" /> -->
            <div ref="userInfo" class="user-infor-content">
                <Form :model="userForm" ref="formValidate" :rules="ruleValidate">
                    <Form-item prop="policeName">
                        <label class="form-label">姓名</label>
                        <Input v-model="userForm.policeName"  class="into-edit" icon=" "></Input>
                    </Form-item>
                    <Form-item prop="userName">
                        <label class="form-label">警号</label>
                        <Input v-model="userForm.userName" class="into-edit" placeholder="请输入警员警号" icon=" " :maxlength ="6" :readonly='true'></Input>
                    </Form-item>
                    <FormItem prop="telephone">
                        <label class="form-label">手机号码</label>
                        <Input v-model="userForm.telephone" placeholder="请输入手机号码" class="into-edit" icon=" "></Input>
                    </FormItem>
                    <FormItem prop="idCard">
                        <label class="form-label">身份证</label>
                        <Input v-model="userForm.idCard" placeholder="请输入身份证号码" class="into-edit" icon=" "></Input>
                    </FormItem>
                    <Form-item  v-if="hideDev">
                        <label class="form-label">警员所属组织</label>
                        <!-- <areaCommon  @getRegionId="getRegionId" :regionId="regionId" :parentId="parentId"></areaCommon> -->
                        <Select v-model="policeNames" class="select-item" @on-change="onChangeArea" v-show="hideRegion"  filterable style="margin-right:0px;" placeholder="请选择分局">
                          <Option v-for="item in policeList" :value="item.id" :key="item.id" >{{item.name}}</Option>
                        </Select>
                        <Select v-model="stations" class="select-item" @on-change="onChangeId" v-show="hideRegionChild" :filterable="filterShow" clearable style="margin-left:10px; margin-right:10px;" placeholder="请选择派出所" ref="secLevel">
                          <Option v-for="item in policeStation" :value="item.id" :key="item.id">{{item.name}}</Option>
                        </Select>
                    </Form-item>
                    <FormItem>
                        <label class="form-label">创建时间</label>
                        <input v-model="userForm.createDate" readonly="true" class="into-edit-1"></input>
                    </FormItem>
                    <FormItem>
                        <label class="form-label">上次登录时间</label>
                        <input v-model="userForm.lastDate" readonly="true" class="into-edit-1"></input>
                    </FormItem>
                </Form>
                <div style="padding-left: 100px;margin-top: 40px">
                    <Button @click="backPage" class="btn-cancel">返回</Button>
                    <Button @click="editPerson" class="btn-confirm" :loading="loadShow">确定</Button>
                </div>
            </div>
        </div>
        <Modal v-model="personShow" :mask-closable="false" class="outDevice" :width="350">
          <div slot="header"></div>
          <p>该人员已绑定设备,请先解绑当前设备</p>
          <p>需要跳转到设备管理页面解绑该设备吗?</p>
          <div slot="footer">
            <button  class="btn-cancel" @click="canelClick">取消</button>
            <button  @click="targetDev" class="btn-confirm">确定</button>
          </div>
        </Modal>
    </div>
</template>

<script>
    import { updateHelmetUser, findUserById, getOrgList, getOrgName } from 'api'
    import areaCommon from '../areaList/areaList'
    import { dateFmt } from '../../libs/common';
    export default {
      data () {
        const idCardPass = (rule, value, callback) => {
          let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/
          if (value === '') {
            callback(new Error('身份证号不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('请输入正确的身份证号'))
          } else {
            callback()
          }
        }
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
        const PoliceNum = (rule, value, callback) => {
          let reg = /^\d{6}$/
          if (value === '') {
            callback(new Error('警号不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('请输入正确的警员编号'))
          } else {
            callback()
          }
        }
        const policeName = ( rule, value, callback) => {
          let reg = /^[\u4e00-\u9fa5]{2,6}$/
          if (value === '') {
            callback(new Error('警号姓名不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('请输入正确的警员姓名'))
          } else {
            callback()
          }
        }
        return {
          loadShow: false,
          personShow: false,
          hideDev: true,
          filterShow:false,
          hideRegion: true,
          hideRegionChild: true,
          policeNames: '',
          stations: '',
          editId: '',
          policeList: [],
          policeStation: [],
          stationId: '',
          userForm: {
            policeName: '',
            idCard: '',
            userName: '',
            telephone: '',
            userEmail: '',
            createDate: '2018-06-05',
            lastDate: '2018-06-11'
            // password: ''
          },
          regionId: JSON.parse(sessionStorage.getItem('regionId')),
          parentId: '',
          ruleValidate: {
            idCard: [
              {validator: idCardPass, trigger: 'blur'}
            ],
            telephone: [
              {validator: PhonePass, trigger: 'blur'}
            ],
             userName: [
              {validator: PoliceNum, trigger: 'blur'}
            ],
            policeName: [
              {validator: policeName, trigger: 'blur'}
            ]
          },
          userLevel: JSON.parse(sessionStorage.getItem('user')).userLevel,
          name: JSON.parse(sessionStorage.getItem('user')).organizationName
        }
      },
      created() {
        document.querySelector('body').onkeydown = (e) => {
          if (e.keyCode == 13) {
            this.editPerson()
          }
        }
        this.editId = JSON.parse(sessionStorage.getItem('editId') || 0)
        if (this.name === '超级管理员') {
          this.name = '上海市公安局'
        }
        findUserById({id: this.editId}).then(res => {
          // console.log(res.data.obj) 
          this.userForm = res.data.obj
          this.userForm.createDate = dateFmt(res.data.obj.createDate)
          this.userForm.lastDate = res.data.obj.lastDate === null ? '' : dateFmt(res.data.obj.lastDate)
          this.stations = this.userForm.organizeRemarks === '2' ?  '' : this.userForm.regionId
          this.policeNames = this.userForm.organizeRemarks === '2' ? this.userForm.regionId : this.userForm.organizeRemarks === '3' ? this.userForm.parentId : ''
        })
         getOrgName({name: this.name}).then(res => {
          //  console.log(res.data.obj)
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
            const childList = this.policeList.find(item => item.id === this.policeNames)
            if (!childList) return
            this.policeStation = childList.children
          }
        })
      },
      mounted () {
        // this.userForm = JSON.parse(sessionStorage.getItem('Info') || {})
        if (JSON.parse(sessionStorage.getItem('user') || {}).userLevel === '2') {
          this.hideDev = false
        }
      },
      methods: {
        backPage () {
          this.$store.commit('delTag', this.$route.name)
          sessionStorage.removeItem('editId')
          this.$router.push({
            name: 'person-manage_index',
            params: {
              searchTxt: this.$route.params.searchTxt,
              pageIndex: this.$route.params.pageIndex,
              curPage: this.$route.params.curPage,
              policeNames: this.$route.params.policeNames,
              stations: this.$route.params.stations,
              regionId: this.$route.params.regionId
            }
          })
        },
        editPerson () {
          // console.log(this.regionId)
          if (!this.regionId || this.regionId == 16) {
            this.$Message.warning({
              content: '请选择警员所在组织'
            })
            return
          }
          this.$refs.formValidate.validate((valid) => {
            if (valid) {
              this.loadShow = true
              updateHelmetUser({
                policeName: this.userForm.policeName,
                telephone: this.userForm.telephone,
                regionId: this.regionId,
                id: this.userForm.id,
                idCard: this.userForm.idCard
              }).then(res => {
                this.loadShow = false
                if (res.data.success) {
                  this.$Message.success('警员信息编辑成功')
                  setTimeout(() => {
                    this.$store.commit('delTag', this.$route.name)
                    sessionStorage.removeItem('editId')
                    this.$router.push({
                      name: 'person-manage_index',
                      params: {
                        searchTxt: this.$route.params.searchTxt,
                        pageIndex: this.$route.params.pageIndex,
                        curPage: this.$route.params.curPage,
                        policeNames: this.$route.params.policeNames,
                        stations: this.$route.params.stations,
                        regionId: this.$route.params.regionId
                      }
                    })
                  },500)
                } else {
                  if (res.data.msg == 'bind') {
                    this.personShow = true
                  } else {
                    this.$Message.warning(res.data.msg)
                  }
                }
              })
            }
          })
        },
        onChangeArea (id) {
          // console.log(id)
          if (!id) {
            this.policeStation = []
            this.regionId = 16
            this.stationId = 16
            this.$refs.secLevel.clearSingleSelect()
          } else {
            this.stationId = id
            this.regionId = id
            const childList = this.policeList.find(item => item.id === id)
            if (!childList) return
            this.policeStation = childList.children
             if (this.policeStation.length == 0) {
              this.filterShow = false
              this.$refs.secLevel.setQuery('')
            } else {
              this.filterShow = true
            }
          }
        },
        onChangeId (id) {
          if (!id) {
            id = this.stationId
          }
          this.regionId = id
        },
        targetDev () {
          this.$router.push({
            name: 'equipment-control_index',
            params: {
              searchTxt : this.userForm.userName
            }
          })
        },
        canelClick () {
          this.personShow = false
        }
      },
      components: {areaCommon},
      beforeDestroy () {
        document.querySelector('body').onkeydown = null
      }
    }
</script>

<style lang="less">
    @import 'add-person.less';
    @import '../../styles/kc_select_style.less';
</style>
<style lang="less">
  .outDevice {
    .ivu-modal-wrap {
      .ivu-modal {
        border: none;
        box-shadow: none;
        top: 200px;
        .ivu-modal-content {
          background-color: #041A2F;
          .ivu-modal-header {
            border: none;
          }
          .ivu-modal-footer {
            border: none;
            text-align: center;
            overflow: hidden;
            padding: 24px 50px;
            button {
              width: 90px;
              height: 32px;
              font-size: 14px;
              text-align: center;
              color: #fff;
              text-shadow: 1px 1px 1px #333;
              border-radius: 5px;
              outline: none;
              cursor: pointer;
              &.btn-confirm {
                float: right;
                border: 1px solid rgb(0, 141, 255);
                // box-shadow: 0 1px 2px #8fcaee inset, 0 -1px 0 #497897 inset, 0 -2px 3px #8fcaee inset;
                background-color: rgb(0, 141, 255);
                &:hover {
                  background-color: rgba(0, 141, 255,.8);
                }
                &:active {
                  top: 1px;
                  background-color: rgba(0, 141, 255,.5);
                }
              }
              &.btn-cancel {
                float: left;
                border: 1px solid rgb(10, 51, 90);
                background-color: rgb(10, 51, 90);
                &:hover {
                   background-color: rgba(10, 51, 90,.8);
                }
                &:active {
                  top: 1px;
                   background-color: rgba(10, 51, 90, .5);
                }
              }
            }
          }
          .ivu-modal-body {
            padding: 0;
            p{
              font-size: 14px;
              text-align: center;
              height: 32px;
              line-height: 32px;
              color: #fff;
            }
          }
        }
      }
    }
  }
</style>
