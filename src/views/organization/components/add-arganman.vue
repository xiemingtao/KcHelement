<template>
    <div class="add-equipment">
      <div style="width: 100%;height: 1px;background-color:#5a98d5"></div>
      <p class="title">新增机构</p>
      <!--工具条-->
      <div  class="add-equipment-form" style="left:0">
          <Form :model="organName" ref="formValidate" :rules="ruleValidate">
            <Form-item v-show="delShow" prop="sStationId">
                  <label class="form-label">机构类型</label>
                      <Select v-model="organName.sStationId" style="width:200px" @on-change="getParentId">
                          <Option v-for="item in policeParent" :value="item.id" :key="item.id">{{ item.name }}</Option>
                      </Select>
              </Form-item>
              <Form-item prop="sPoliceId">
                  <label class="form-label">所属机构</label>
                      <Select v-model="organName.sPoliceId" style="width:200px" @on-change="getPoliceId">
                          <Option v-for="item in policeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                      </Select>
              </Form-item>
              <Form-item prop="searchTxt">
                  <label class="form-label">机构名称</label>
                  <Input  placeholder="请输入机构名称" v-model="organName.searchTxt" icon=" "></Input>
              </Form-item>
              <Form-item prop="address">
                <label class="form-label">选择位置</label>
                <Input  placeholder="在地图上选择位置" disabled v-model="organName.address" icon=" "></Input>
              </Form-item>
          </Form>
          <div style="padding-left: 20px;margin-top: 40px">
              <Button  class="btn-cancel" @click="cancel">返回</Button>
              <Button  class="btn-confirm" @click="insertDev" :loading="loadShow">确定</Button>
          </div>
      </div>
      <div class="mapWrap">
        <commonMap @editInfo="editInfo"></commonMap>
      </div>
    </div>
</template>

<script>
    import { getOrgList, insertOrg, getOrgName } from 'api'
    import commonMap from '../../map/map.vue'
    export default {
      data () {
        const organRule = ( rule, value, callback) => {
          let reg = /[\u4e00-\u9fa5]/
          if (value === '') {
            callback(new Error('机构名称不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('请输入正确的机构名称'))
          } else {
            callback()
          }
        }
        const addressRule = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请在右侧地图选择机构地址'))
          } else {
            callback()
          }
        }
        const organType = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请选择需要添加的机构类型'))
          } else {
            callback()
          }
        }
        const organ = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请选择所属机构'))
          } else {
            callback()
          }
        }
        return {
          policeList: [],
          loadShow: false,
          regionId: '',
          organName: {
            searchTxt: '',
            address: '',
            sPoliceId: '',
            sStationId: ''
          },
          policeParent: [
            {id: 1, name: '分局'},
            {id: 2, name: '派出所'}
          ],
          PoliceId: '',
          latitude: '',
          longitude: '',
          name: '',
          delShow: true,
          ruleValidate: {
            searchTxt: [
              {validator: organRule, trigger: 'blur'}
            ],
            address: [
              {validator: addressRule, trigger: 'blur'}
            ],
            sPoliceId: [
              {validator: organ, trigger: 'blur'}
            ],
            sStationId: [
              {validator: organType, trigger: 'blur'}
            ]
          },
        }
      },
      mounted () {
        this.name = JSON.parse(sessionStorage.getItem('user') || {}).organizationName
        this.userLevel = JSON.parse(sessionStorage.getItem('user') || {}).userLevel
        if (this.name === '超级管理员') {
          this.name = '上海市公安局'
        }
        if (JSON.parse(sessionStorage.getItem('user') || {}).userLevel === '1') {
          this.getOrgLists()
          this.delShow = false
        }
      },
      methods: {
        getOrgLists () {
          getOrgName({
            name: this.name
          }).then(res => {
            // console.log(res.data.obj)
            if (res.data.success) {
              if (this.userLevel === '1') {
                this.policeList = res.data.obj
              } else if (this.userLevel === '0' || this.userLevel === '9') {
                if (this.PoliceId === 1) {
                  this.policeList = res.data.obj
                } else {
                  this.policeList = res.data.obj[0].children
                  }
              }
            }
          })
        },
        // 确定并发送数据
        insertDev () {
          // console.log(this.regionId , this.searchTxt , this.latitude, this.longitude, this.address)
          // if (!this.regionId || !this.searchTxt || !this.latitude || !this.longitude || !this.address) {
          //   this.$Message.error('请填写数据！！！')
          //   return
          // }
          this.$refs.formValidate.validate((valid) => {
            if (valid) {
              this.loadShow = true
              insertOrg({
                parentId: this.regionId,
                name: this.organName.searchTxt,
                latitude: this.latitude,
                longitude: this.longitude,
                address: this.organName.address
              }).then(res => {
                this.loadShow = false
                if (res.data.success) {
                  this.$Message.success('添加组织架构成功')
                  // this.$router.push({
                  //   name: 'organizations_index'
                  // })
                  this.$refs.formValidate.resetFields()()
                } else {
                  this.$Message.warning(res.data.msg)
                }
              })
            }
          })
        },
        cancel () {
          this.$store.commit('delTag', this.$route.name)
          this.$router.push({
            name: 'organizations_index'
          })
        },
        getParentId (id) {
          this.PoliceId = id
          this.getOrgLists()
        },
        getPoliceId (id) {
          if (!id) return
          // console.log(id)
          this.regionId = id
        },
        editInfo (data) {
          // console.log(data)
          this.organName.address = data.address
          this.latitude = data.location.lat
          this.longitude = data.location.lng
        }
      },
      components: {
        commonMap
      },
      created () {
        let that = this
        document.querySelector('body').onkeydown = (e) => {
          if (e.keyCode == 13) {
            that.insertDev()
            e.preventDefault()
          }
        }
      },
      beforeDestroy () {
        document.querySelector('body').onkeydown = null
      }
    }
</script>

<style lang='less'>
    @import 'add-arganman.less';
</style>
