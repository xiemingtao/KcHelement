<template>
    <div class="user-infor">
        <div style="width: 100%;height: 1px;background-color:#5a98d5"></div>
        <p class="title">新增用户</p>
        <div style="margin-top: 80px">
            <!-- <Avatar id="userInfo_toux" class="userInfo_toux" src="/static/images/userInfo_toux.png" />  -->
            <div ref="userInfo" class="user-infor-content">
                <Form :model="userForm" ref="formValidate" :rules="ruleValidate">
                    <Form-item prop="userName">
                        <label class="form-label">姓名</label>
                        <Input v-model="userForm.userName" placeholder="请输入警员姓名" class="into-edit" autofocus :maxlength ="6" icon=" "></Input>
                    </Form-item>
                    <Form-item prop="policeNum">
                        <label class="form-label">警号</label>
                        <Input v-model="userForm.policeNum" placeholder="请输入6位纯数字警员编号" class="into-edit" :maxlength ="6" icon=" "></Input>
                    </Form-item>
                    <FormItem prop="userPhone">
                        <label class="form-label">手机号码</label>
                        <Input v-model="userForm.userPhone" placeholder="请输入手机号码" class="into-edit" icon=" " :maxlength ="11"></Input>
                    </FormItem>
                    <FormItem prop="userCard">
                        <label class="form-label">身份证</label>
                        <Input v-model="userForm.userCard" placeholder="请输入身份证" class="into-edit" icon=" " :maxlength ="18"></Input>
                    </FormItem>
                    <Form-item v-show="hideCity">
                        <label class="form-label">人员所属组织</label>
                        <areaCommon :regionName="regionName" :userLevel = "userLevel" @getRegionId="getRegionId" v-model="resetData"></areaCommon>
                    </Form-item>
                </Form>
                <div style="padding-left: 100px;margin-top: 40px">
                    <Button @click="backPage" class="btn-cancel">返回</Button>
                    <Button @click="addPerson" class="btn-confirm" :loading="loadShow">确定</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { insertHelmetUser } from 'api'
    import areaCommon from '../areaList/areaList'
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
          regionName: JSON.parse(sessionStorage.getItem('user')).organizationName,
          userLevel: JSON.parse(sessionStorage.getItem('user')).userLevel,
          hideCity: true,
          userForm: {
            userCard: '',
            userPhone: '',
            policeNum: ''
          },
          resetData: '1',
          regionId: JSON.parse(sessionStorage.getItem('regionId')),
          ruleValidate: {
            userCard: [
              { validator: idCardPass, trigger: 'blur' }
            ],
            userPhone: [
              { validator: PhonePass, trigger: 'blur' }
            ],
            policeNum: [
              { validator: PoliceNum, trigger: 'blur' }
            ],
            userName: [
              // { required: true, message: '警员姓名不能为空', trigger: 'blur'},
               { validator: policeName, trigger: 'blur' }
            ]
          },
          loadShow: false
        }
      },
      created () {
        let that = this
        document.querySelector('body').onkeydown = (e) => {
          if (e.keyCode == 13) {
            that.addPerson()
            e.preventDefault()
          }
        }
      },
      mounted () {
        if (this.userLevel === '2') {
          this.hideCity = false
        }
      },
      methods: {
        backPage () {
          this.$router.go(-1)
          this.$store.commit('delTag', this.$route.name)
        },
        addPerson () {
          this.$refs.formValidate.validate((valid) => {
            if (valid) {
              if (this.regionId == '16') {
                this.$Message.warning('请输入人员所属组织')
                return
              }
              this.loadShow = true
              insertHelmetUser({
                userName: this.userForm.policeNum,
                telephone: this.userForm.userPhone,
                regionId: this.regionId,
                idCard: this.userForm.userCard,
                policeName: this.userForm.userName
              }).then(res => {
                this.loadShow = false
                if (res.data.success) {
                  this.$Message.success('添加警员信息成功')
                  this.$refs.formValidate.resetFields()
                  this.resetData = '2'
                  // setTimeout(() =>{
                    // this.$store.commit('delTag', this.$route.name)
                    // this.$router.push({
                    //   name: 'person-manage_index'
                    // })
                  // },1000)
                } else {
                  this.$Message.warning({
                    content: res.data.msg,
                    duration: 3
                  })
                }
              })
            }
          })
        },
        getRegionId (id) {
          this.regionId = id
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
    @import 'add-person.less';
    /*@import '../../styles/kc_select_style.less';*/
</style>
