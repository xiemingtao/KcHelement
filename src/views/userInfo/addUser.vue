<template>
    <div class="add_user" ref="confirm">
        <div style="width: 100%;height: 1px;background-color:#5a98d5"></div>
        <p class="title">新增账户</p>
        <div style="margin-top: 80px">
            <!-- <Avatar id="userInfo_toux" class="userInfo_toux" src="/static/images/userInfo_toux.png" />  -->
            <div ref="userInfo" class="user-infor-content">
                <Form  ref="formValidate" :model="userInfo" :rules="ruleValidate">
                    <Form-item >
                        <label class="form-label">选择级别</label>
                        <Select style="width:200px" v-model="userInfo.userLevel" @on-change="editLevel">
                          <Option v-for="item in levels" :key="item.id" :value="item.id">{{item.name}}</Option>
                        </Select>
                    </Form-item>
                    <Form-item >
                        <label class="form-label">账户类型</label>
                        <Select style="width:200px" v-model="userInfo.type" @on-change="editType">
                          <Option v-for="item in typeList" :key="item.id" :value="item.id">{{item.name}}</Option>
                        </Select>
                    </Form-item>
                    <FormItem >
                        <label class="form-label">选择机构</label>
                         <Select style="width:200px" v-model="userInfo.organOne" v-show="oneShow" @on-change="onChangeArea" label-in-value>
                          <Option v-for="item in policeList" :key="item.id" :value="item.id">{{item.name}}</Option>
                        </Select>
                         <Select style="width:200px" v-model="userInfo.organTwo" v-show="twoShow" @on-change="onChangePosition" label-in-value >
                          <Option v-for="item in policeStation" :key="item.id" :value="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="userText">
                        <label class="form-label">用户账号</label>
                        <Input  placeholder="请输入4-16字母或数字" class="into-edit" icon=" " v-model="userInfo.userText"></Input>
                    </FormItem>
                </Form>
                <div style="padding-left: 100px;margin-top: 40px">
                    <Button class="btn-cancel" @click="cancelClick">返回</Button>
                    <Button class="btn-confirm" @click.stop="confirmClick" :loading="loadShow">确定</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getOrgList, insertAdmin, getOrgName } from 'api'
export default {
  data() {
    const username = ( rule, value, callback) => {
      let reg = /^[a-zA-Z0-9]{4,16}$/
      if (value === '') {
        // this.$Message.warning('请输入用户账号')
        callback(new Error('用户账号不能为空'))
      } else if (!reg.test(value)) {
        // this.$Message.warning('请输入4-16位字母或数字')
        callback(new Error('请输入4-16位字母或数字'))
      } else {
        callback()
      }
    }
    return {
      organizeId: '',
      loadShow: false,
      twoShow: false,
      oneShow: true,
      userInfo: {
        userLevel: '',
        type: '',
        organ: '',
        organOne: '',
        organTwo: '',
        organThree: '',
        userText: ''
      },
      levels: [
        {id: 1, name: '总局'},
        {id: 2, name: '分局'},
        {id: 3, name: '派出所'}
      ],
      typeList: [
        {id: 1, name: '普通账户'},
        {id: 2, name: '管理账户'}
      ],
      getOrganizationName: '',
      getUserLevel: '',
      getAccountType: '',
      policeList: [],
      policeStation: [],
      ruleValidate: {
        userText: [
           {validator: username, trigger: 'blur '}
        ]
      },
    }
  },
  methods: {
    insertAdminUser () {
      this.loadShow = true
      insertAdmin({
        loginName: this.userInfo.userText,
        organizationName: this.getOrganizationName,
        userLevel: this.getUserLevel == 1 ? 0 : this.getUserLevel == 2 ? 1 : this.getUserLevel == 3 ? 2 : '' ,
        accountType: this.getAccountType,
        organizeId : this.organizeld
      }).then(res => {
        if (res.data.success) {
          // console.log(this.getUserLevel)
          this.$Message.success('账号添加成功')
          this.loadShow = false
          // setTimeout(() =>{
          //   this.$router.push({
          //   name: 'userInfo_index'
          //   })
          // },1000)
          this.userInfo.userLevel = ''
          this.userInfo.type = ''
          this.userInfo.organOne = ''
          this.userInfo.organTwo = ''
          this.$refs.formValidate.resetFields()
        } else {
          this.$Message.warning(res.data.msg)
          this.loadShow = false
        }
      })
    },
    confirmClick () {
        this.$refs.formValidate.validate((valid) => {
          // console.log(valid)
          if (valid) {
            if (!this.getUserLevel) {
                this.$Message.warning('请选择机构级别')
              } else if (!this.getAccountType) {
                this.$Message.warning('请选择机构类型')
              } else if (!this.getOrganizationName) {
                this.$Message.warning('请选择机构名称')
              } else {
                this.insertAdminUser()
              }
          }
        })
    },
    editLevel(val) {
      this.getUserLevel = val
      this.userInfo.organOne = ''
      this.userInfo.organTwo = ''
      this.getOrgLists()
    },
    editType (val) {
      console.log(val)
      this.getAccountType = val == 1 ? 'read-only' : val == 2 ?　'read-write' : ''
    },
    getOrgLists () {
      getOrgName({name: '上海市公安局'}).then(res => {
        // console.log(res.data.obj)
        if (this.getUserLevel == 1) {
          this.twoShow = false
          this.policeList = res.data.obj
        } else if (this.getUserLevel == 2){
          this.twoShow = false
          this.policeList = res.data.obj[0].children
        } else if (this.getUserLevel == 3) {
          this.twoShow = true
          this.policeList = res.data.obj[0].children
        }
      })
    },
    onChangeArea (val) {
      console.log(val)
      this.organizeld = val.value
      if (this.getUserLevel != 3) {
        this.getOrganizationName = val.label
      } else {
        this.getOrganizationName = ''
      }
      // this.getOrganizationName = val.label
      // console.log(this.getOrganizationName)
      const childList = this.policeList.find(item => item.id == val.value)
      if (!childList) return
      this.policeStation = childList.children
    },
    onChangePosition (val) {
      console.log(val)
      this.organizeld = val.value
      if (this.getUserLevel == 3) {
        this.getOrganizationName = val.label
      } else {
        this.getOrganizationName = ''
      }
    },
    cancelClick () {
      this.$router.push({
        name: 'userInfo_index'
      })
    },
    openChange (val){
      console.log(val)
    }
  },
  created () {
    let that = this
    document.querySelector('body').onkeydown = (e) => {
      if (e.keyCode == 13) {
        that.confirmClick()
        e.preventDefault()
      }
    }
  },
  beforeDestroy () {
    document.querySelector('body').onkeydown = null
  }
}
</script>

<style lang="less">
   @import "./addUser.less";
</style>

