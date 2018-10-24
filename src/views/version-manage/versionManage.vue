<style>
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    form {transform: rotate(0deg)}
    50%  {transform: rotate(180deg)}
    to   {transform: rotate(360deg)}
  }
  .demo-spin-col {
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
</style>

<template>
  <div class="version-main">
    <!-- :rules="ruleValidate" -->
    <Form ref="verForm" :model="verForm" :label-width="80" style="margin-top: 30px;" inline :rules="ruleValidate">
      <div>
        <FormItem label="应用名称" prop="appName">
          <Input v-model="verForm.appName" placeholder="请输入应用名称" class="input-content" ></Input>
        </FormItem>
        <FormItem label="版本名称" prop="version">
          <Input v-model="verForm.version" placeholder="请输入版本名称" class="input-content" ></Input>
        </FormItem>
        <FormItem label="版本号" prop="versionCode">
          <Input v-model="verForm.versionCode" placeholder="请输入版本号" class="input-content" ></Input>
        </FormItem>
        <FormItem label="版本说明" prop="mark">
          <Input v-model="verForm.mark" placeholder="请输入版本说明" class="input-content"></Input>
        </FormItem>
        <FormItem label="App类型" prop="dept">
          <Select v-model="verForm.appType"   class="select-item" @on-change="typeClick">
            <Option v-for="typeItem in appTypeList" :value="typeItem.value" :key="typeItem.value">{{ typeItem.label }}</Option>
          </Select>
        </FormItem>
      </div>
      <div>

      
      <FormItem align="center">
        <Button  @click="adminKey" class="btn-upload" type="primary" >Key管理</Button>
      </FormItem>

      <FormItem align="center">
        <Button  @click="httpSubmit('verForm')" class="btn-upload" type="primary" :loading="loadShow">上传</Button>
        <Button  @click="handleReset('verForm')" class="btn-upload" style="margin-left:80px">重置</Button>
      </FormItem>
      <FormItem >
        <Upload
                ref="upload"
                :before-upload="handleBeforeUpload"
                :show-upload-list="false"
                accept='.apk'
                action="">
          <Button class="btn-upload">选择文件</Button>
          <span style="color: #9d9d9d;">{{uploadFile!=null?uploadFile.name:''}}</span>
        </Upload>
      </FormItem>
      </div>
    </Form>
    <Table :columns="t_columns" :data="kc_data"></Table>
    <div class="footer" style="float: right;">
      <Page :total="total" :current="pageIndex" :page-size="pageSize" size="small" @on-change="changePage" show-elevator></Page>
    </div>
    <Modal v-model="modeShow" @on-ok="delOk" :width="400" class="versionModal":mask-closable="false" >
      <p>确定要执行此操作吗?</p>
      <p>该操作不可撤销</p>
      <p>请输入管理员密码</p>
      <input type="password" icon=" " :autofocus=true v-model="confirmPWD" @keyup.enter="passConfirm" class="input" v-focus>
    </Modal>
    <!-- <Spin fix v-show="loading">
      <Icon type="load-a" class="demo-spin-icon-load"></Icon>
      <div>数据加载中</div>
    </Spin> -->
  </div>
</template>

<script>
    import { getVersionList, insertAppVersion, delVersion } from 'api'
    import md5 from 'js-md5'
    import { dateFmt } from '../../libs/common'
    export default {
      data () {
        const versioncode = (rule, value, callback) => {
          let reg = /^[0-9]{1,5}$/
          if (value === '') {
            callback(new Error('版本号不能为空'))
          } else if (!reg.test(value)) {
            callback(new Error('请输入正确的版本号'))
          } else {
            callback()
          }
        }
        return {
          versionName: '',
          loadShow: false,
          pageIndex: 1,
          pageSize: 10,
          total: 10,
          modeShow: false,
          delId: '',
          delIndex: '',
          userPassword: '',
          confirmPWD: '',
          progress: '',
          verForm: {
            appName: '',
            version: '',
            versionCode: '',
            appType: '',
            mark: ''
          },
          className: 'proType',
          appTypeList: [
            {
              value: '0',
              label: '智能头盔'
            },
            {
              value: '1',
              label: '智能手表'
            }
          ],
          uploadFile: null,
          t_columns: [
            {
              title: '序号',
              type: 'index',
              width: 60
            },
            {
              title: '应用名称',
              align: 'center',
              key: 'appName'
            },
            {
              title: '版本名称',
              align: 'center',
              key: 'version'
            },
            {
              title: '版本号',
              align: 'center',
              key: 'versionCode'
            },
            {
              title: '下载次数',
              align: 'center',
              key: 'loadNum'
            },
            {
              title: '版本说明',
              align: 'center',
              key: 'mark'
            },
            {
              title: '更新时间',
              align: 'center',
              key: 'updateTime'
            },
            {
              title: '操作',
              key: 'operation',
              width: 100,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: 'red',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.goDiary(params.index,params.row)
                      }
                    }
                  }, '删除')
                ])
              }
            }
          ],
          kc_data: [
            // {
            //   appName: '光启智能头盔',
            //   version: 'v1.1',
            //   loadNum: '2',
            //   mark: '添加中英翻译，英中翻译,添加中英翻译，英中翻译添加中英翻译，英中翻译添加中英翻译，英中翻译',
            //   updateTime: '2018-07-17 20:05'
            // },
            // {
            //   appName: '光启智能头盔',
            //   version: 'v1.0',
            //   loadNum: '12',
            //   mark: '添加中英翻译，英中翻译,添加中英翻译，英中翻译,添加中英翻译，英中翻译,添加中英翻译，英中翻译',
            //   updateTime: '2018-07-01 19:13'
            // }
          ],
          ruleValidate: {
            appName: [
              { required: true, message: '请描述应用名称', trigger: 'blur' }
            ],
            version: [
              { required: true, message: '请描述版本名称', trigger: 'blur' }
            ],
            versionCode: [
              { required: true, message: '请描述版本号', trigger: 'blur' },
              {required: true, validator: versioncode, trigger: 'change' }
            ]
          }
        }
      },
      mounted () {
        this.getVersionLists()
        this.userPassword = JSON.parse(sessionStorage.getItem('user')).password
      },
      methods: {
        getVersionLists () {
          // console.log('index=' + this.pageIndex + ',size=' + this.pageSize + ',appType=' + this.verForm.appType)
          getVersionList({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            type: this.verForm.appType
          }).then(res => {
            // console.log(JSON.stringify(res.data))
            // console.log(res.data.obj)
            if (res.data.success) {
              this.loading = false
              this.total = res.data.obj.total
              this.pageIndex = res.data.obj.pageNum
              // console.log('total=' + res.data.obj.total + ',pageNum=' + res.data.obj.pageNum)
              this.kc_data = res.data.obj.list.map(item => {
                return {
                  appName: item.appName,
                  version: item.version,
                  loadNum: item.loadNum,
                  mark: item.mark,
                  updateTime: dateFmt(item.updateTime),
                  versionCode: item.versionCode,
                  id: item.id
                }
              })
            }
          })
        },
        httpSubmit (name) {
          if (!this.uploadFile) {
              this.$Message.warning({
                content: '请添加需要上传的文件'
              })
            } 
            else if (!this.verForm.appType) {
              this.$Message.warning({
                content: '请选择APP类型'
              })
            } else {
              this.$refs.verForm.validate((valid) => {
                if (valid) {
                  this.className = 'proType'
                  const form = new FormData()
                  form.append('file', this.uploadFile)
                  form.append('appName', this.verForm.appName)
                  form.append('versionCode', this.verForm.versionCode)
                  form.append('version', this.verForm.version)
                  form.append('mark', this.verForm.mark)
                  form.append('type', this.verForm.appType)
        
                  var url = 'http://111.230.254.131/basics/insertAppVersion.action' // 服务器上传地址
                  var xhr = new XMLHttpRequest()
                  console.log(xhr.readyState)
                 
                    // this.$Message.error('网络异常')
                  
                    xhr.open('post', url, true)
                    // 上传进度事件
                    xhr.upload.addEventListener('progress', (result) => {
                      // console.log(result)
                      if (result.lengthComputable) {
                        this.loadShow = true
                        this.$Spin.show({
                          render: (h) => {
                            return h('div', [
                              h('div', {
                              'class': this.className
                              }),
                              h('div', {
  
                              }, this.progress)
                            ])
                          }
                        })
                        // 上传进度
                        let percent = (result.loaded / result.total * 100).toFixed(0) + '%'
                        // console.log('percent----' + percent)
                        this.progress = percent
                        // console.log(this.progress)
                        // if (this.progress == '99%') {
                        //   this.progress = '99%'
                        // }
                        if (this.progress == '100%') {
                          this.loadShow = false
                        }
                      }
                    }, false)
  
                    xhr.addEventListener('readystatechange',  () =>{
                      console.log(xhr.readyState)
                      // var result = xhr
                      // if (result.status !== 200) { // error
                      //   // console.log('上传失败', result.status, result.statusText, result.response)
                      // } else if (result.readyState === 4) { // finished
                      //   // console.log('上传成功' + JSON.stringify(result.data))
                      //   if (result.data.success) {
                      //     this.$Message.success('上传成功')
                      //   }
                      // }
                      if (xhr.status == 200 && xhr.readyState == 4) {
                        // this.loadShow = true
                        if (JSON.parse(xhr.responseText).success) {
                          this.className = 'successType'
                          this.getVersionLists()
                          this.$refs[name].resetFields()
                          this.$refs.upload.clearFiles()
                          this.uploadFile = null
                          this.verForm.appType = ''
                          setTimeout(() => {
                            this.$Spin.hide()
                          },1000)
                        } else {
                          this.progress = JSON.parse(xhr.responseText).msg
                          this.className = 'errType'
                          
                          // this.getVersionLists()
                          setTimeout(() => {
                            this.$Spin.hide()
                          },1000)
                        }
                      }
                    })
                    xhr.send(form, true) // 开始上传
                  
                }
              })
            }
        },
        handleSubmit (name) {
          this.className = 'proType'
            if (!this.uploadFile) {
              this.$Message.warning({
                content: '请添加需要上传的文件'
              })
            } 
            else if (!this.verForm.appType) {
              this.$Message.warning({
                content: '请选择APP类型'
              })
            } else {
              this.$refs.verForm.validate((valid) => {
                if (valid) {
                this.$Spin.show({
                  render: (h) => {
                    return h('div', {
                      'class': this.className
                    })
                  }
                })
                const form = new FormData()
                form.append('file', this.uploadFile)
                form.append('appName', this.verForm.appName)
                form.append('versionCode', this.verForm.versionCode)
                form.append('version', this.verForm.version)
                form.append('mark', this.verForm.mark)
                form.append('type', this.verForm.appType)
                // console.log(form)
                insertAppVersion(form).then( res => {
                  // console.log(res.data)
                  if (res.data.success) {
                    this.className = 'successType'
                    this.getVersionLists()
                    this.$refs[name].resetFields()
                    this.$refs.upload.clearFiles()
                    this.uploadFile = null
                    setTimeout(() => {
                      this.$Spin.hide()
                    },1000)
                  } else {
                    this.className = 'errType'
                    this.getVersionLists()
                    setTimeout(() => {
                      this.$Spin.hide()
                    },1000)
                  }
                })
              }
            })
          }
        },
        handleReset (name) {
          // console.log('handleReset---------' + name)
          this.$refs[name].resetFields()
          this.verForm.appType = ''
          this.uploadFile = null
        },
        handleBeforeUpload (file) {
          this.versionName = file.name
          if (!this.verForm.appType) {
            this.$Message.warning('请先选择app类型')
            return
          }
          if (this.versionName.indexOf('KcHelmet') > -1) {
            if(this.verForm.appType != '0') {
              this.$Message.warning('请选择正确的apk安装包')
              this.uploadFile = null
              this.$refs.upload.clearFiles()
            } else {
              this.uploadFile = file
            }
          }
          if (this.versionName.indexOf('watch') > -1) {
            if(this.verForm.appType != '1') {
              this.$Message.warning('请选择正确的apk安装包')
              this.uploadFile = null
              this.$refs.upload.clearFiles()
            } else {
              this.uploadFile = file
            }
          }
          return false
        },
        changePage (page) {
          // console.log('page==============' + page)
          // console.log('pageIndex==============' + this.pageIndex)
          this.pageIndex = page
          this.getVersionLists()
        },
        goDiary (index,row) {
          // console.log(row)
          this.delId = row.id
          this.delIndex = index
          this.modeShow = true
        },
        delOk () {
          if (this.userPassword === md5(this.confirmPWD)) {
            delVersion({ids: this.delId}).then(res => {
              if (res.data.success) {
                this.getVersionLists()
                this.confirmPWD = ''
                this.modeShow = false
                this.$Message.success({
                  content: '版本信息删除成功。',
                  duration: 1
                })
              } else {
                this.$Message.error({
                  content: '版本信息删除失败。',
                  duration: 1
                })
              }
            })
          } else {
            this.$Message.error({
              content: '密码错误,请重新输入',
              top: 100
            })
          }
        },
        passConfirm () {
          this.delOk()
        },
        adminKey () {
          this.$router.push({
            name: 'adminKey_index'
          })
        },
        typeClick (val) {
          // console.log(val)
          this.verForm.appType = val
          this.uploadFile = null
          this.$refs.upload.clearFiles()
          this.getVersionLists()
        }
      },
      directives: {
        focus: (el) => {
          el.focus()
        }
      },
    }
</script>

<style lang="less">
  @import 'versionManage.less';
</style>
<style lang="less">
  .versionModal.v-transfer-dom {
    .ivu-modal-wrap {
      .ivu-modal {
        top: 200px;
        .ivu-modal-content {
          box-shadow: 0px 0px 5px 2px #0E4174;
          overflow: hidden;
          // height: 220px;
          background-color: #041A2F;
          .ivu-modal-header {
            border-bottom: 0px solid #e9eaec;
            padding: 14px 16px;
            line-height: 1;
            .ivu-modal-header-inner {
              color: #fff;
              text-align: center;
            }
          }
          .ivu-modal-body {
            padding-top: 20px;
            margin-top: 20px;
            text-align: center;
            color: #345B81;
            .input {
              width: 60%;
              text-align: center;
              font-size: 30px;
              background-color: transparent;
              border: 1px solid #084b84;
              text-align: center;
              color: #666;
              outline: none;
              height: 35px;
              border-radius: 25px;
              line-height: 35px;
              &:focus {
                box-shadow: none;
                outline: none;
              }
            }
            p {
              padding-bottom: 20px;
              color: #fff;
              text-align: center;
              font-size: 16px;
              &:first-of-type {
                padding-bottom: 20px;
                color: #fff;
                text-align: center;
                font-size: 16px;
              }
              &:last-of-type {
                text-align: center;
                color: #345B81;
                font-size: 14px;
              }
            }
          }
          .ivu-modal-footer {
            padding:18px 60px;
            border: none;
            width: 100%;
            // margin-top: 40px;
            display: inline-block;
            text-align: center;
            .ivu-btn.ivu-btn-text.ivu-btn-large {
              width: 100px;
              float: left;
              color: #345B81;
              background-color: #0A335A;
            }
            .ivu-btn.ivu-btn-primary.ivu-btn-large {
              border: none;
              width: 100px;
              float: right;
              color: #fff;
              background-image: linear-gradient(180deg, #024d9e, #0079ce);
            }
          }
        }
      }
    }
  }
  .ivu-spin-fullscreen.ivu-spin-fullscreen-wrapper {
    .ivu-spin.ivu-spin-fix.ivu-spin-show-text.ivu-spin-fullscreen {
      background-color: rgba(0, 24, 25, 0.6);
      top: 0;
      height: 100%;
      left: 0;
      width: 100%;
    }
  }
  .proType {
    width: 180px;
    height: 200px;
    background: url('/static/images/正在上传GIF（含文字）.gif') center center no-repeat;
    background-color: transparent;
    border: 1px solid transparent;
  }
  .errType {
    width: 180px;
    height: 200px;
    background: url('/static/images/fail_03.png') center center no-repeat;
    background-color: transparent;
    border: 1px solid transparent;
  }
  .successType {
    width: 180px;
    height: 200px;
    background: url('/static/images/sucess_03.png') center center no-repeat;
    background-color: transparent;
    border: 1px solid transparent;
  }
  .ivu-spin.ivu-spin-large.ivu-spin-fix {
    position: fixed;
    // width: 2000px;
    height: 100%;
    background-color: rgba(3, 25, 41, 0.6);
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes  ani-demo-spin{
    from { transform: rotate(0deg)}
    50% { transform: rotate(180deg)}
    to { transform: rotate(360deg)}
  }
  .ivu-spin.ivu-spin-fix.ivu-spin-show-text {
    top: 183px;
    height: 48px;
    background-color: rgba(6, 46, 82, 1);
    width: 98%;
    left: 10px;
    color: #fff;
  }
</style>

