<template>
    <div class="user-infor">
        <div style="width: 100%;height: 1px;background-color:#5a98d5"></div>
        <p class="title">个人信息</p>
        <div style="margin-top: 80px">
        <!-- <Upload style="float:left" :before-upload="getImgName" action="">
          <Avatar id="userInfo_toux" class="userInfo_toux" :src="icon" />
        </Upload> -->
        <div ref="userInfo" class="user-infor-div">
            <Form :model="form" ref="formValidate" :rules="ruleValidate">
                <Form-item prop="userName">
                    <label class="form-label">用户名</label>
                    <Input v-model="form.userName"  icon=" " placeholder="请输入用户名" ></Input>
                </Form-item>
                  <!-- <FormItem>
                      <label class="form-label">手机号码</label>
                      <input v-model="form.userPhone" placeholder="手机号码" class="into-edit"></input>
                  </FormItem> -->
                <!-- <FormItem>
                    <label class="form-label">邮箱</label>
                    <input v-model="form.userEmail" placeholder="设置邮箱" class="into-edit"></input>
                </FormItem> -->
                <FormItem>
                    <label class="form-label">密码</label>
                    <!--<input v-model="form.userPassword" readonly="true" class="into-edit-1"></input>-->
                    <Button type="text" size="small" class="modifyClass" @click="showEditPassword">修改密码</Button>
                </FormItem>
                <FormItem>
                    <label class="form-label">创建时间</label>
                    <input readonly="true" class="into-edit-1" v-model="form.userCreateTime"></input>
                </FormItem>
                <FormItem>
                    <label class="form-label">上次登录时间</label>
                    <input v-model="form.userLastTime" readonly="true" class="into-edit-1"></input>
                </FormItem>
            </Form>
            <div style="padding-left: 120px;margin-top: 40px">
                <Button @click="backPage" class="btn-cancel">取消</Button>
                <Button @click="confirmPage" class="btn-confirm">确定</Button>
            </div>
        </div>
        </div>
        <!-- 修改密码-->
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#DDDDDD">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate" >
                <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" class="modalInput" icon=" " type="password"></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" class="modalInput" icon=" " type="password"></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" class="modalInput" icon=" " type="password"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEditPass">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass" >保存</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import { dateFmt } from '../../libs/common'
    import { updateUser } from 'api'
    import md5 from 'js-md5'
    import Cookies from 'js-cookie'
    export default {
      data () {
        const valideRePassword = (rule, value, callback) => {
          if (value !== this.editPasswordForm.newPass) {
            callback(new Error('两次输入密码不一致'))
          } else if (value === '') {
            callback(new Error('密码不能为空'))
          }  else {
            callback()
          }
        }
        const valideOldPassword = (rule, value, callback) => {
          // console.log(value)
          if (md5(value) !== this.userInfo.password) {
            callback(new Error('密码不正确'))
          } else if (value === '') {
            callback(new Error('密码不能为空'))
          }  else {
            callback()
          }
        }
        const valideNewPassword = (rule, value, callback) => {
          // console.log(value)
          if (value === this.editPasswordForm.oldPass) {
            callback(new Error('不能使用原密码'))
          } else if (value === '') {
            callback(new Error('密码不能为空'))
          } 
          else {
            callback()
          }
        }
        const username = ( rule, value, callback) => {
          // console.log(value)
          let reg = /^[0-9a-zA-Z]+$/
          if (value === '') {
            callback(new Error('用户名不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('用户名格式不正确'))
          } else {
            callback()
          }
        }
        return {
          editPasswordModal: false,
          savePassLoading: false,
          oldPassError: '',
          password: '',
          icon: '/static/images/userInfo_toux.png',
          form: {
            userName: '',
            userPhone: '',
            // userEmail: '',
            userPassword: '修改密码',
            userCreateTime: '',
            userLastTime: '2018-06-11'
          },
          editPasswordForm: {
            oldPass: '',
            newPass: '',
            rePass: ''
          },
          userInfo: '',
          passwordValidate: {
            oldPass: [
              { required: true, message: '请输入原密码', trigger: 'blur' },
              { validator: valideOldPassword, trigger: 'blur' }
            ],
            newPass: [
              { required: true, message: '请输入新密码', trigger: 'blur' },
              { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
              { max: 32, message: '最多输入32个字符', trigger: 'blur' },
              { validator: valideNewPassword, trigger: 'blur' }
            ],
            rePass: [
              { required: true, message: '请再次输入新密码', trigger: 'blur' },
              { validator: valideRePassword, trigger: 'blur' }
            ]
          },
          ruleValidate: {
            userName: [
              {validator: username, trigger: 'blur'}
            ]
          }
        }
      },
      mounted () {
        this.userInfo = JSON.parse(sessionStorage.getItem('user'))
        // console.log(this.userInfo)
        this.getUserInfo()
        this.password = this.userInfo.password
      },
      methods: {
        getUserInfo () {
          this.form = {
            userName: this.userInfo.loginName,
            userPhone: this.userInfo.telephone,
            // userEmail: this.userInfo.email,
            userPassword: '修改密码',
            userCreateTime: dateFmt(this.userInfo.createDate),
            userLastTime: dateFmt(this.userInfo.lastDate)
          }
        },
        backPage () {
          this.$store.commit('delTag', this.$route.name)
          this.$router.go(-1)
        },
        confirmPage () {
          if (this.form.userName === this.userInfo.loginName && this.userInfo.password === this.password) {
            this.$Message.warning('页面无操作，返回上一页')
            setTimeout(() => {
              this.$router.go(-1)
              this.$store.commit('delTag', this.$route.name)
            },1000)
            return
          }
          this.$refs.formValidate.validate((valid) => {
            if (valid) {
              updateUser({
                // telephone: this.form.userPhone,
                password: this.password,
                id: this.userInfo.id,
                // icon: this.icon,
                loginName: this.form.userName
              }).then(res => {
                if (res.data.success) {
                  sessionStorage.setItem('user', JSON.stringify(res.data.obj))
                  Cookies.set('user', res.data.obj.loginName)
                  let index = 5
                  let time = setInterval(() => {
                    this.$Message.success('修改成功，' + index + 's后返回登陆页')
                    index--
                    if (index <= 0) {
                      clearInterval(time)
                    }
                  },1000)
                  setTimeout(() => {
                    this.$store.commit('logout', this)
                    this.$store.commit('clearAllTags')
                    this.$store.commit('delTag', this.$route.name)
                    this.$router.push({
                      path: '/login'
                    })
                  },6000)
                } else {
                  this.$Message.warning(res.data.msg)
                }
              })
            }
          })
        },
        showEditPassword () {
          this.editPasswordModal = true
        },
        cancelEditPass () {
          this.editPasswordModal = false
        },
        saveEditPass () {
          this.$refs['editPasswordForm'].validate((valid) => {
            if (valid) {
              this.password = md5(this.editPasswordForm.rePass)
              this.editPasswordModal = false
              // you can write ajax request here
              this.$refs['editPasswordForm'].resetFields()
            }
          })
        },
        getImgName (file) {
          // console.log(file)
          const fr = new FileReader()
          fr.readAsDataURL(file)
          // console.log(fr)
          fr.onload = () => {
            let r = fr.result
            this.icon = r
          }
        }
      },
      created () {
        window.onkeydown = (e) => {
          if (e.keyCode == 13) {
            if (!this.editPasswordModal) {
              this.confirmPage()
            }
          }
        }
      },
      beforeDestroy () {
        window.onkeydown = null
      }
    }
</script>

<style lang="less">
    @import 'user-info.less';
</style>
