<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">

        <div class="login-con">
            <div style="text-align: center;">
                <img src="../../static/images/policeLogo.png" class="login-img"></img>
                <p class="title">警用智能头盔管理系统</p>

                <div class="form-con">
                    <Form ref="loginForm" :model="loginForm" :rules="rules">
                        <FormItem prop="userName" >
                            <div class="login-item">
                                <img src="/static/images/loginIcon_user.png" class="iconClass"></img>
                                <div class="lineClass"></div>
                                <input v-model="loginForm.userName" placeholder="请输入用户名"  class="login-edit" :autofocus="true"></input>
                            </div>
                        </FormItem>
                        <FormItem prop="password">
                            <div class="login-item">
                                <img src="/static/images/loginIcon_password.png" class="iconClass"></img>
                                <div class="lineClass"></div>
                                <input type="password" v-model="loginForm.password" placeholder="请输入密码" class="login-edit" @keyup.enter.native="handleSubmit"></input>
                            </div>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" :loading="logining" style="height: 38px;font-size: 14px;" long >登 录</Button>
                        </FormItem>
                    </Form>
                    <!--<p class="login-tip">输入任意用户名和密码即可</p>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import { requestLogin, getOrgList, getOrgName } from 'api'
import md5 from 'js-md5'
export default {
  data () {
    const username = ( rule, value, callback) => {
      let reg = /^[a-zA-Z0-9]{4,16}$/
      if (value === '') {
        // callback(new Error('警号姓名不能为空'))
      } else if (!reg.test(value)) {
        // callback(this.$Message.error('wewewe'))
        this.$Message.warning('请输入4-16位字母或数字')
        // callback(this.$Message.warning('wewewe'))
      } else {
        callback()
      }
    }
    return {
      logining: false,
      loginForm: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          {validator: username, trigger: 'blur '}
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      organList: []
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        // console.log(valid)
        if (valid) {
          // this.$router.push({ name: 'home_index' })
          // Cookies.set('user', this.loginForm.userName)
          let pwd = md5(this.loginForm.password)
          requestLogin({
            userName: this.loginForm.userName,
            password: pwd
          }).then(res => {
            if (res.data.success) {
              this.$store.commit('clearAllTags')
              const userInfo = res.data.obj
              if (userInfo.accountType === 'read-all') {
                Cookies.set('access', 0)
              } else if (userInfo.accountType === 'read-only') {
                Cookies.set('access', 2)
              } else if (userInfo.accountType === 'read-write') {
                Cookies.set('access', 1)
              }
              Cookies.set('user', this.loginForm.userName)
              this.$store.commit('setAvator', userInfo.icon || '/static/images/userInfo_toux.png')
              sessionStorage.setItem('user', JSON.stringify(userInfo))
              getOrgList().then(res => {
                // console.log(res.data.obj)
                if (res.data.success) {
                  userInfo.organizationName = userInfo.organizationName == '超级管理员' ? '上海市公安局' : userInfo.organizationName
                  this.organList = res.data.obj
                  const userList =  this.organList.filter(item => item.name == userInfo.organizationName)
                  console.log(userList)
                  sessionStorage.setItem('regionId', userList[0].id)
                  this.$router.push({ name: 'home_index' })
                }
              })
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    }
  },
}
</script>

<style>

</style>
