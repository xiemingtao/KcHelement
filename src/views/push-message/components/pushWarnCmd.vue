<template>
  <div class="push-police-msg">
    <!--:rules="formRule"-->
    <Form ref="pushForm" :model="formData" :label-width="100" style="width: 640px;">
      <FormItem label="推送内容" prop="pushContent">
        <div class="push_content">
          <Input v-model="formData.pushContent" type="textarea" :rows="4" placeholder="请输入警情信息(文字最长不超过100字)" :maxlength="100" style="resize:none" @on-change="textChange"></Input>
          <span class="change_text" :class="{red: isRed}">({{formData.pushContent.length}} / 100)</span>
          <div style="height: 1px;background-color:#5a98d5;margin: 10px 0px;"></div>

          <div class="uploadStyle">
            <!-- <div class="demo-upload-list" v-for="item in formData.uploadList" :key="item.index"> -->
              <!-- <template v-if="item.status === 'finished'">
                <img :src="item.name">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
              </template> -->
              <!-- <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template> -->
            <!-- </div> -->
            <!--:default-file-list="defaultList"-->
            <Tooltip content="请添加警情图片">
              <Upload
                      ref="upload"
                      :show-upload-list="false"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      accept='.jpg, .jpeg, .png'
                      :before-upload="handleBeforeUpload"
                      type="drag"
                      action=""
                      style="display: inline-block;width:50px;">
                <div>
                  <Icon type="plus" size="30"></Icon>
                </div>
              </Upload>
            </Tooltip>
            <img :src="fileUrl" class="imgStyle" ref="imgStyle" preview="1">
            <!-- <Icon type="ios-eye"  size="25" v-show="eleShow" color="#000"/> -->
          </div>
        </div>
        <!-- <img :src="fileUrl" class="imgStyle" ref="imgStyle"> -->
        <!-- <Icon type="ios-eye"  size="30" v-show="eleShow"/> -->
      </FormItem>
      <FormItem label="推送目的地">
         <input v-model="address" type="text"  placeholder="请选择警情目的地" icon= "" style="background-color: #003558; width:100%; outline:none; border:none;color:#ddd;padding-left:10px;" disabled></input>
      </FormItem>
      <cityCommon @getDevId="getDevId" v-model="resetDatal"></cityCommon>
      <FormItem>
        <Button  @click="handleReset('pushForm')" class="btn-cancel" type="primary">重置</Button>
        <Button  @click="handleSubmit('pushForm')" class="btn-confirm" type="primary" :loading="loadingShow">推送</Button>
      </FormItem>
    </Form>
    <div class="mapWrap">
      <commonMap @getLnglat="getLnglat" v-model="markerIcon"></commonMap>
    </div>
  </div>
</template>

<script>
    import { pushTJL } from 'api'
    import cityCommon from './cityCommon.vue'
    import commonMap from '../../map/map'
    import Cookies from 'js-cookie'
    export default {
      data () {
        return {
          resetDatal: '1',
          eleShow: true,
          formData: {
            pushContent: '',
            defaultList: [],
            imgName: '',
            visible: false,
            uploadList: []
          },
          markerIcon: '1',
          file: '',
          fileName: '',
          latitude: '',
          longitude: '',
          address: '',
          userList: [],
          policeStation: '',
          imgUrl: '',
          fileUrl: '',
          isRed: false,
          loadingShow: false
        }
      },
      methods: {
        handleSubmit (name) {
          if (!this.formData.pushContent && !this.address && !this.imgUrl) {
            this.$Message.warning('警情消息不能为空！')
            return
          }
          if (this.userList.length === 0) {
            this.$Message.warning('设备不能为空！')
            return
          }
          // if (!this.formData.pushContent || !this.address || this.userList.length === 0) {

          // }
          this.loadingShow = true
          let fd = new FormData()
          fd.append('imgUrl', this.imgUrl)
          fd.append('detailMsg', this.formData.pushContent)
          fd.append('policeStation', this.policeStation)
          fd.append('latitude', this.latitude)
          fd.append('longitude', this.longitude)
          fd.append('userList', this.userList)
          fd.append('remark', ('目的地'+ this.address))
          fd.append('msgType', 2)
          pushTJL(fd).then(res => {
            // console.log(res.data)
            if (res.data.success) {
              this.file = null
              this.$refs[name].resetFields()
              this.fileUrl = ''
              this.address = ''
              this.markerIcon = '1'
              this.resetDatal = '2'
              this.imgUrl = ''
              this.userList = [],
              this.latitude = ''
              this.longitude = ''
              this.$Message.success('推送成功')
              this.loadingShow = false
            } else {
              this.loadingShow = false
              this.$Message.warning({
                content: res.data.msg,
                duration: 3
              })
            }
          })
        },
        handleReset (name) {
          this.$refs[name].resetFields()
          this.file = null,
          this.userList = []
          this.fileUrl = ''
          this.address = ''
          this.markerIcon = '1'
          this.resetDatal = '2'
          this.latitude = ''
          this.longitude = ''
          this.isRed = false
        },
        // handleView (name) {
        //   this.formData.imgName = name
        //   this.formData.visible = true
        // },
        // handleRemove (file) {
        //   this.formData.uploadList.splice(this.formData.uploadList.indexOf(file), 1)
        // },
        handleFormatError (file) {
          this.$Message.warning({
            content: file.name + '文件格式不正确,请选择正确的文件格式'
          })
        },
        handleMaxSize (file) {
          this.$Message.warning({
            content: file.name + '文件大小超出限制!!!'
          })
        },
        handleBeforeUpload (file) {
          // console.log(file)
          this.file = file
          this.fileName = file.name
          const fr = new FileReader()
          fr.readAsDataURL(file)
          fr.onload = () => {
            let r = fr.result
            this.fileUrl = r
            // console.log(r)
            let indexOf = r.indexOf(',')
            r = r.substring(indexOf + 1)
            this.imgUrl = r
          }
        },
        getLnglat (lnglat, address) {
          this.latitude = lnglat.lat
          this.longitude = lnglat.lng
          this.address = address
        },
        getDevId (userList) {
          this.userList = userList
          // console.log(this.userList.length)
        },
        textChange () {
          // console.log(this.formData.pushContent.length)
          if (this.formData.pushContent.length == 100) {
            this.isRed = true
          } else {
            this.isRed = false
          }
        }
      },
      mounted () {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.policeStation = user.organizationName
      },
      components: {
        cityCommon,
        commonMap
      }
    }
</script>

<style lang="less">
  @import './pushWarnCmd.less';
  .red{
    color: #f40;
  }
</style>
