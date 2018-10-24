<template>
    <div class="add-equipment">
      <div style="width: 100%;height: 1px;background-color:#5a98d5"></div>
      <p class="title">编辑机构</p>
      <!--工具条-->
      <div  class="add-equipment-form" style="left:0">
          <Form :model="organName" ref="formValidate" :rules="ruleValidate">
            <Form-item>
                  <label class="form-label">机构类型</label>
                  <input class="form-input" v-model="mechanism" disabled></input>
              </Form-item>
              <Form-item v-show="CompanyShow">
                  <label class="form-label">所属机构</label>
                      <Select v-model="parentId" style="width:200px" @on-change="getPoliceId">
                          <Option v-for="item in policeList" :value="item.id" :key="item.value">{{ item.name }}</Option>
                      </Select>
              </Form-item>
              <Form-item prop="searchTxt">
                  <label class="form-label">机构名称</label>
                  <Input placeholder="请输入机构名称" v-model="organName.searchTxt" icon=" "></Input>
              </Form-item>
              <Form-item>
                <label class="form-label">选择位置</label>
                <input  class="form-input" placeholder="在地图上选择位置" disabled v-model="address"></input>
              </Form-item>
          </Form>
          <div style="padding-left: 20px;margin-top: 40px">
              <Button  class="btn-cancel" @click="cancel">返回</Button>
              <Button  class="btn-confirm" @click="editDev" :loading="loadShow">确定</Button>
          </div>
      </div>
      <div class="mapWrap">
        <commonMap @editInfo="editInfo"></commonMap>
      </div>
    </div>
</template>

<script>
    import { getOrgList, updateOrg } from 'api'
    import commonMap from '../../map/map.vue'
    export default {
      data () {
        const organRule = ( rule, value, callback) => {
          let reg = /^[\u4e00-\u9fa5]+$/
          if (value === '') {
            callback(new Error('机构名称不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('请输入正确的机构名称(只允许输入中文)'))
          } else {
            callback()
          }
        }
        return {
          loadShow: false,
          parentId: '',
          policeList: [],
          policeStation: [],
          regionId: '',
          policeParent: [],
          address: '',
          latitude: '',
          longitude: '',
          mechanism: '',
          policeInfo: null,
          CompanyShow: true,
          organName: {
            searchTxt: ''
          },
          ruleValidate: {
            searchTxt: [
              {validator: organRule, trigger: 'blur'}
            ]
          }
        }
      },
      mounted () {
        this.getOrgLists()
        this.policeInfo = JSON.parse(sessionStorage.getItem('cityInfo') || [])
        if (this.policeInfo.organizeRemarks === '3') {
          this.mechanism = '派出所'
          this.parentId = this.policeInfo.parentId
          this.organName.searchTxt = this.policeInfo.name
          this.address = this.policeInfo.address
          this.regionId = this.policeInfo.parentId
        }
        if (this.policeInfo.organizeRemarks === '2') {
          this.mechanism = '分局'
          this.regionId = this.policeInfo.parentId
          this.organName.searchTxt = this.policeInfo.name
          this.address = this.policeInfo.address
          this.CompanyShow = false
        }
        if (JSON.parse(sessionStorage.getItem('user') || {}).userLevel === '2' || JSON.parse(sessionStorage.getItem('user') || {}).userLevel === '1') {
          this.CompanyShow = false
        }
      },
      methods: {
        getOrgLists () {
          getOrgList().then(res => {
            // console.log(res.data)
            this.policeList = res.data.obj[0].children
            this.policeParent = res.data.obj
          })
        },
        editDev () {
          this.$refs.formValidate.validate((vaild) => {
            if (vaild) {
              this.loadShow = true
              updateOrg({
                id: this.policeInfo.id,
                parentId: this.regionId,
                name: this.organName.searchTxt,
                latitude: this.latitude,
                longitude: this.longitude,
                address: this.address
              }).then(res => {
                // console.log(res.data)
                this.loadShow = false
                if (res.data.success) {
                  this.$Message.success('修改组织架构成功')
                  sessionStorage.removeItem('cityInfo')
                  this.$store.commit('delTag', this.$route.name)
                  this.$router.push({
                    name: 'organizations_index'
                  })
                } else {
                  this.$Message.warning(res.data.msg)
                }
              })
            }
          })
        },
        cancel () {
          sessionStorage.removeItem('cityInfo')
          this.$store.commit('delTag', this.$route.name)
          this.$router.push({
            name: 'organizations_index'
          })
        },
        getPoliceId (id) {
          if (!id) return
          this.regionId = id
        },
        editInfo (data) {
          // console.log(data)
          this.address = data.address
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
            that.editDev()
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
