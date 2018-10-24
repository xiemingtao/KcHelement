<template>
  <div class="pushTongjiling">

    <!--:rules="formRule"-->
    <Form ref="formData" :label-width="100" style="float:left; display:inline-block; width:560px">
      <FormItem label="推送内容" prop="fileName">
        <Upload
          ref="fileUpload"
          :before-upload="handleBeforeUpload"
          action="POST"
          accept=".doc,.docx,.pdf">
          <Button class="btn-cancel" style="font-size:12px">选择文件</Button>
        </Upload>
        <span style="color: #fff; margin-left:10px">{{fileName}}</span>
      </FormItem>
      <cityCommon @getDevId="getDevId" v-model="resetDatal" ></cityCommon>
      <FormItem>
        <Button  @click="handleReset" class="btn-cancel">重置</Button>
        <Button  @click="handleSubmit" class="btn-confirm" :loading="loadingShow">推送</Button>
      </FormItem>
    </Form>
    <div style="overflow:hidden; height:100%;padding-left:20px; min-width:550px">
      <embed :src="imgUrl" type="application/pdf"  height="100%" width="550px" v-show="hide">
    </div>
  </div>
</template>

<script>
    import { pushTJL } from 'api'
    import cityCommon from './cityCommon.vue'
    export default {
      data () {
        return {
          uploadList: [],
          file: null,
          userList: [],
          fileType: 1,
          msgType: 1,
          fileName: '',
          imgUrl: '',
          hide: false,
          resetDatal: '1',
          loadingShow: false
        }
      },
      props: ['orgOptions'],
      mounted () {
        // console.log(this.$route.params.policeNum)
      },
      methods: {
        // 点击推送
        handleSubmit (name) {
          // console.log(this.userList)
          this.loadingShow = true
          let fd = new FormData()
          fd.append('file', this.file)
          fd.append('userList', this.userList)
          fd.append('fileType', this.fileType)
          fd.append('msgType', 1)
          pushTJL(fd).then(res => {
            // console.log(res.data)
            if (res.data.success) {
              this.loadingShow = false
              this.fileName =''
              this.file = null
              this.resetDatal = '2'
              this.userList = []
              this.imgUrl = ''
              this.hide = false
              this.$Message.success({
                content: '通缉令推送成功',
                duration: 3
              })
            } else {
              this.loadingShow = false
              this.$Message.warning({
                content: res.data.msg,
                duration: 3
              })
            }
          })
        },
        // 重置
        handleReset () {
          this.fileName =''
          this.file = null
          this.resetDatal = '2'
          this.userList = []
          this.imgUrl = '',
          this.hide = false
        },
        // 获取文件的文件域和文件名字
        handleBeforeUpload (file) {
          console.log(file)
          this.fileType = file.name.endsWith('.pdf') ? 2 : 1
          // console.log(file.name.subscribe(0,-4))
          // file.name.splice(0,-4)
          this.file = file
          this.fileName = file.name
          const fr = new FileReader()
          fr.readAsDataURL(file)
          fr.onload = () => {
            let r = fr.result
            this.imgUrl = r
            file.name.endsWith('.pdf') ? this.hide = true : this.hide = false
            // this.hide = true
          }
        },
        // 获取推送设备信息列表
        getDevId (userList) {
          // console.log(userList)
          this.userList = userList
        }
      },
      components: {
        cityCommon
      }
    }
</script>

<style lang="less">
  @import './pushTongjiling.less';
</style>
