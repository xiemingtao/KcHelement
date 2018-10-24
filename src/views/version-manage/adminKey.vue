<template>
  <div class="adminkey-index">
    <div style="width: 100%;height: 1px;background-color:#5a98d5"></div>
    <p class="title">key管理</p>
    <div class="user-infor-div">
      <Form>
        <FormItem>
            <label class="form-label">阿里APPkey</label>
            <Input v-model="ailiAppkey" class="into-edit" style="color: #e5e5e5"  icon=" " :disabled="disabled"></Input>
        </FormItem>
        <FormItem>
            <label class="form-label">阿里APPSecret</label>
            <Input v-model="ailiAppsecret" class="into-edit" style="color: #e5e5e5"  icon=" " :disabled="disabled"></Input>
        </FormItem>
        <FormItem>
            <label class="form-label">阿里APPCode</label>
            <Input v-model="ailiAppcode" class="into-edit" style="color: #e5e5e5"  icon=" " :disabled="disabled"></Input>
        </FormItem>
        <FormItem>
            <label class="form-label">科大讯飞APPkey</label>
            <Input v-model="iflytekAppkey" class="into-edit" style="color: #e5e5e5"  icon=" " :disabled="disabled"></Input>
        </FormItem>
        <FormItem>
            <label class="form-label">直播APPkey</label>
            <Input v-model="rtmpAppkey" class="into-edit" style="color: #e5e5e5" type="textarea" icon=" " :disabled="disabled" :autosize="{minRows: 2, maxRows: 4}"></Input>
        </FormItem>
        <FormItem style="padding-top:50px">
            <label class="form-label">备注：</label>
            <Input v-model="remark" class="into-edit" style="color: #e5e5e5" type="text" icon=" " :disabled="disabled" :autosize="{minRows: 2, maxRows: 4}" :maxsize="99"></Input>
        </FormItem>
    </Form>
    </div>
    <div style="padding-left: 180px;margin-top: 60px">
        <Button  class="btn-cancel" @click="back" v-show="backShow">返回</Button>
        <Button  class="btn-confirm" @click="editKey" v-show="editShow">编辑</Button>
        <Button  class="btn-cancel" @click="cancel" v-show="cancelShow">取消</Button>
        <Button  class="btn-confirm" @click="confirmKey" v-show="confirmShow">确定</Button>
    </div>
  </div>
</template>

<script>
  import { adminKey, editKey } from 'api'
export default {
  data () {
    return {
      disabled: true,
      confirmShow: false,
      cancelShow: false,
      ailiAppkey: '',
      ailiAppsecret: '',
      ailiAppcode: '',
      iflytekAppkey: '',
      rtmpAppkey: '',
      remark: '',
      editShow: true,
      backShow: true
    }
  },
  mounted () {
    this.getadminKey()
  },
  methods: {
    getadminKey () {
      adminKey().then(res => {
        if (res.data.success) {
          // console.log(res.data.obj)
          this.ailiAppkey = res.data.obj.ailiAppkey
          this.ailiAppsecret = res.data.obj.ailiAppsecret
          this.ailiAppcode = res.data.obj.ailiAppcode
          this.iflytekAppkey = res.data.obj.iflytekAppkey
          this.rtmpAppkey = res.data.obj.rtmpAppkey
          this.remark = res.data.obj.remark
        }
      })
    },
    editKey () {
      this.disabled = !this.disabled
      this.confirmShow = !this.confirmShow
      this.editShow = !this.editShow
      this.cancelShow = !this.cancelShow
      this.backShow = !this.backShow
    },
    confirmKey () {
      // console.log(!this.ailiAppkey,this.ailiAppsecret,this.ailiAppcode,this.iflytekAppkey,this.rtmpAppkey)
      if (!this.ailiAppkey || !this.ailiAppsecret || !this.ailiAppcode || !this.iflytekAppkey || !this.rtmpAppkey) {
        this.$Message.success('请填写完整数据')
        return
      }
      editKey ({
        ailiAppkey: this.ailiAppkey,
        ailiAppsecret: this.ailiAppsecret,
        ailiAppcode: this.ailiAppcode,
        iflytekAppkey: this.iflytekAppkey,
        rtmpAppkey: this.rtmpAppkey,
        remark: this.remark
      }).then(res => {
        // console.log(res.data)
        if (res.data.success) {
          this.$Message.success('修改成功')
          this.disabled = !this.disabled
          this.confirmShow = !this.confirmShow
          this.backShow = !this.backShow
          this.editShow = !this.editShow
          this.cancelShow = !this.cancelShow
        }
      })
    },
    cancel () {
      this.cancelShow = !this.cancelShow
      this.confirmShow = !this.confirmShow
      this.editShow = !this.editShow
      this.disabled = !this.disabled
      this.backShow = !this.backShow
    },
    back () {
      this.$router.push({
        name: 'version_index'
      })
    }
  }
}
</script>

<style lang="less">
  @import 'adminKey.less';
</style>

