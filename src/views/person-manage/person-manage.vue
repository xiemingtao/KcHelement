<template>
  <div class="person-table">
    <p style="margin: 20px 10px;color: white;font-size: 14px;">人员管理</p>
    <!--工具条-->
    <Row class="toolbar" style="align-items: center; margin-bottom: 10px">
      <Col span="2" style="padding: 5px 10px;" v-show="hideDev">
        <Button type="primary" @click="handleAdd" >新增用户</Button>
      </Col>
      <Col span="6" style="padding: 5px 10px;">
        <!-- <div style="float:left; margin-right:10px">
          <Upload
          :before-upload="getFile"
          action="">
          <Button type="primary" icon="ios-cloud-upload-outline">上传</Button>
          </Upload>
        </div>
        <div style="float:left">
          <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
          <Button type="primary" @click="exportExcel" icon="ios-cloud-download-outline">下载表格数据</Button>
        </div> -->
      </Col>
      <!-- <Col span="16"> -->
        <div style="float: right;">
          <!-- <areaCommon @getRegionId="getRegionId" v-model="resetData"></areaCommon> -->
          <Select v-model="policeNames" class="select-item" @on-change="onChangeArea" v-show="hideRegion" clearable filterable style="margin-right:0px;" placeholder="请选择分局">
            <Option v-for="item in policeList" :value="item.id" :key="item.id" >{{item.name}}</Option>
          </Select>
          <Select v-model="stations" class="select-item" @on-change="onChangeId" v-show="hideRegionChild" :filterable="filterShow" clearable style="margin-left:10px; margin-right:10px;" placeholder="请选择派出所" ref="secLevel">
            <Option v-for="item in policeStation" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
          <Button type="primary" style="margin-left: 10px;margin-right: 20px;" @click="resetList" v-show="resetShow">重置</Button>
          <input v-model="searchTxt" placeholder="请输入警号" class="searchClass" @keyup.enter.stop="searchAction"></input>
          <Button type="primary" style="margin-left: 10px;margin-right: 20px;" @click="searchAction">查询</Button>
        </div>
      <!-- </Col> -->
    </Row>


    <Table border :columns="t_columns" :data="kc_data" style="margin: 0px 10px;" ref="tableCsv" ></Table>

    <div class="footer">
      <Page :total='total' :current="curPage" :page-size="10" size="small" @on-change="changePage" show-elevator ></Page>
    </div>
    <Modal v-model="modeShow" :width="400" class="modelShow" :mask-closable="false">
        <p>人员姓名：{{policeName}}</p>
        <p>确定要执行此操作吗?</p>
        <p>请输入管理员密码</p>
        <input type="password" icon=" " autofocus v-model="confirmPWD" @keyup.enter="passConfirm" class="input" v-focus> </input>
         <div slot="footer">
           <Button  class="btn-cancel" @click="delcancel">取消</Button>
           <Button  class="btn-confirm" @click="delOk">确定</Button>
        </div>
    </Modal>
    <Modal v-model="modelReset" :width="400" class="modelShow" :mask-closable="false">
        <p>人员姓名：{{policeName}}</p>
        <p>确定要重置密码吗?</p>
        <p>请输入管理员密码</p>
        <input type="password" icon=" " autofocus v-model="confirmPWD" @keyup.enter="passConReset" class="input" v-focus>
         <div slot="footer">
           <Button  class="btn-cancel" @click="cancel">取消</Button>
           <Button  class="btn-confirm" @click="resetOk">确定</Button>
        </div>
    </Modal>
    <Modal v-model="targetShow" :width="400" class="modelShow" :mask-closable="false">
        <p>{{targetText}}</p>
        <p>需要跳转到设备管理页面解绑该设备吗?</p>
         <div slot="footer">
           <Button  class="btn-cancel" @click="targetCancel">取消</Button>
           <Button  class="btn-confirm" @click="targetOk">确定</Button>
        </div>
    </Modal>
    <Spin fix v-show="loading">
      <Icon type="load-a" class="demo-spin-icon-load"></Icon>
      <div>数据加载中</div>
    </Spin>
  </div>
</template>

<script>
    import { findUserList, delHelmetUser, resetPsd, getFile, findOrgById, getOrgName } from 'api'
    import areaCommon from '../areaList/areaList'
    import table2excel from '../../libs/table2excel'
    import { dateFmt } from '../../libs/common'
    import md5 from 'js-md5'
    export default {
      data () {
        return {
          userName: '',
          targetText: '',
          targetShow: false,
          policeNames: this.$route.params.policeNames ? this.$route.params.policeNames : '',
          stations: this.$route.params.stations ? this.$route.params.stations : '',
          policeList: [],
          policeStation: [],
          filterShow: true,
          hideRegion: true,
          hideRegionChild: true,
          loading: true,
          hideDev: true,
          resetShow: true,
          curPage: this.$route.params.curPage ? this.$route.params.curPage : 1,
          total: 0,
          regionId: '',
          pageIndex: this.$route.params.pageIndex ? this.$route.params.pageIndex : 1,
          pageSize: 10,
          resetData: '1',
          modeShow : false,
          modelReset: false,
          excelFileName: '下载数据',
          policeName: '',
          userPassword: '',
          confirmPWD: '',
          t_columns: [
            {
              title: '序号',
              width: 60,
              render: (h, params) => h('span', params.index + (this.pageIndex - 1) * this.pageSize + 1),
              align: 'center'
            },
            {
              title: '姓名',
              key: 'policeName',
              width: 90,
              align: 'center'
            },
            {
              title: '警号',
              key: 'userName',
              width: 80,
              align: 'center'
            },
            {
              title: '手机号',
              key: 'telephone',
              width: 120,
              align: 'center'
            },
            {
              title: '身份证',
              key: 'idCard',
              align: 'center'
            },
            {
              title: '所属组织',
              key: 'deptName',
              align: 'center'
            },
            {
              title: '创建时间',
              key: 'createDate',
              align: 'center'
            },
            {
              title: '上次登陆时间',
              key: 'lastDate',
              align: 'center'
            },
            {
              title: '操作',
              key: 'handle',
              align: 'center',
              width: 200,
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    style: {
                      margin: '0 5px',
                      color: '#9ac6e3'
                    },
                    props: {
                      type: 'text',
                      placement: 'top'
                    },
                    on: {
                      click: () => {
                        this.editRow(params.index, params.row)
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    style: {
                      margin: '0 5px',
                      color: 'red'
                    },
                    props: {
                      type: 'text',
                      placement: 'top'
                    },
                    on: {
                      click: () => {
                        this.removeRow(params.index, params.row)
                      }
                    }
                  }, '删除'),
                  h('Button', {
                    style: {
                      margin: '0 5px',
                      color: 'skyblue'
                    },
                    props: {
                      type: 'text',
                      placement: 'top'
                    },
                    on: {
                      click: () => {
                        this.resetRow(params.index, params.row)
                      }
                    }
                  }, '重置密码')
                ])
              }

            }
          ],
          kc_data: [],
          searchTxt: this.$route.params.searchTxt ? this.$route.params.searchTxt : '',
          resetId: '',
          regionName: JSON.parse(sessionStorage.getItem('user')).organizationName,
          userLevel: JSON.parse(sessionStorage.getItem('user')).userLevel,
          stationId: this.$route.params.policeNames ? this.$route.params.policeNames : JSON.parse(sessionStorage.getItem('regionId'))
        }
      },
      mounted () {
        this.userPassword = JSON.parse(sessionStorage.getItem('user')).password
        this.regionId = this.$route.params.regionId ? this.$route.params.regionId : JSON.parse(sessionStorage.getItem('regionId'))
        if (JSON.parse(sessionStorage.getItem('user') || {}).accountType === 'read-only') {
          this.hideDev = false
          this.t_columns.splice(-1, 1)
        }
        if (JSON.parse(sessionStorage.getItem('user') || {}).userLevel === '2') {
          this.resetShow = false
        }
        if (this.regionName === '超级管理员') {
          this.regionName = '上海市公安局'
        }
        getOrgName({name: this.regionName}).then(res => {
          // console.log(res.data.obj)
          if (this.userLevel == 0 || this.userLevel == 9) {
            this.policeList = res.data.obj[0].children
            const childList = this.policeList.find(item => item.id === this.policeNames)
            if (!childList) return
            this.policeStation = childList.children
          } else if (this.userLevel == 1) {
            this.policeList = res.data.obj
            this.policeStation = res.data.obj[0].children
          } else if (this.userLevel == 2) {
            this.policeStation = res.data.obj
            this.hideRegion = false
            this.hideRegionChild =false
          }
        })
        this.findUserLists()
      },
      methods: {
        // 用户信息列表
        findUserLists () {
          findUserList({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            regionId: this.regionId,
            userName: this.searchTxt.trim()
          }).then(res => {
            if (res.data.success) {
              this.loading = false
              this.total = res.data.total
              const staList = res.data.obj
              // console.log(staList)
              if (!staList) return
              this.kc_data = staList.map(item => {
                return {
                  policeName: item.policeName,
                  telephone: item.telephone,
                  idCard: item.idCard,
                  createDate: dateFmt(item.createDate),
                  lastDate: item.lastDate === null ? '' : dateFmt(item.lastDate),
                  id: item.id,
                  regionId: item.regionId,
                  userName: item.userName,
                  deptName: (item.parentName ? item.parentName : '') + (item.regionName ? item.regionName : ''),
                  parentId: item.organizeRemarks === '2' ? item.regionId : item.parentId
                }
              })
            }
          })
        },
        // 跳转到新增用户页面
        handleAdd () {
          this.$router.push({
            name: 'addperson_index'
          })
        },
        // 模糊查询
        searchAction () {
          this.pageIndex = 1
          this.curPage = 1
          if (!this.searchTxt) return
          this.findUserLists()
          // this.kc_data = this.kc_data.filter(item => item.userName.indexOf(this.searchTxt) > -1)
          // this.total = this.kc_data.length
        },
        // 翻页
        changePage (page) {
          this.curPage = page
          this.pageIndex = page
          this.findUserLists()
        },
        // 数据重置
        resetList () {
          this.regionId = Number(sessionStorage.getItem('regionId'))
          this.searchTxt = ''
          this.resetData = '2'
          this.pageIndex = 1
          this.curPage = 1,
          this.policeNames = ''
          this.stations = ''
          this.findUserLists()
        },
        // 跳转到编辑页面
        editRow (index, row) {
          this.$router.push({
            name: 'edit_user_index',
            params: {
              searchTxt: this.searchTxt,
              pageIndex: this.pageIndex,
              curPage: this.curPage,
              policeNames: this.policeNames,
              stations: this.stations,
              regionId: this.regionId
            }
          })
          sessionStorage.setItem('editId', JSON.stringify(row.id))
        },
        // 点击删除弹出模态框
        removeRow (index, row) {
          this.id = row.userName
          // this.id = row.id
          this.index = index
          this.policeName = row.policeName
          this.modeShow = true
        },
        // 确定删除
        delOk () {
          if (this.userPassword === md5(this.confirmPWD)) {
            delHelmetUser({id: this.id}).then(res => {
              if (res.data.success) {
                this.findUserLists()
                this.confirmPWD = ''
                this.modeShow = false
                this.$Message.success({
                  content: '人员删除成功',
                  top: 100
                })
              } else {
                  this.modeShow = false
                  this.confirmPWD = ''
                  this.targetText = res.data.msg
                  this.targetShow = true
              }
            })
          } else {
            this.$Message.error({
              content: '密码错误,请重新输入',
              top: 100
            })
          }
        },
        passConfirm() {
          this.delOk()
        },
        // 密码重置
        resetRow (index, row) {
          this.resetId = row.id
          this.policeName = row.policeName
          this.modelReset = true
        },
        // 密码重置
        resetOk () {
          if (this.userPassword === md5(this.confirmPWD)) {
            resetPsd({userId: this.resetId}).then(res => {
              if (res.data.success) {
                this.findUserLists()
                this.confirmPWD = ''
                this.modelReset = false
                this.$Message.success({
                  content: '密码重置成功',
                  top: 100,
                  duration: 2
                })
              } else {
                 this.confirmPWD = ''
                 this.$Message.error({
                  content: '密码重置失败',
                  top: 100,
                  duration: 2
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
        passConReset () {
          this.resetOk()
        },
        // getRegionId (id) {
        //   this.pageIndex = 1
        //   this.curPage = 1
        //   this.regionId = id
        //   this.findUserLists()
        // },
        // 上传文件
        getFile (file) {
          // const thif = this
          const fr = new FileReader()
          fr.readAsDataURL(file)
          fr.onload = () => {
            let str = fr.result
            let config = {'Content-Type': 'multipart/form-data'}
            getFile({file: str}, config).then(res => {
              // console.log(res.data)
            })
          }
        },
        exportExcel () {
          table2excel.transform(this.$refs.tableCsv, 'hrefToExportTable', this.excelFileName)
        },
        delcancel () {
          this.modeShow = false
          this.confirmPWD = ''
        },
        cancel () {
          this.modelReset = false
          this.confirmPWD = ''
        },
        onChangeArea (id) {
          this.pageIndex = 1
          this.curPage = 1
          if (!id) {
            this.regionId = JSON.parse(sessionStorage.getItem('regionId'))
          }
          this.regionId = id
          this.stationId = id
          this.findUserLists()
          const childList = this.policeList.find(item => item.id == id)
          // console.log(childList)
          if (!childList) return
          this.policeStation = childList.children
          if (this.policeStation.length == 0) {
            this.filterShow = false
            this.$refs.secLevel.setQuery('')
          } else {
            this.filterShow = true
          }
        },
        onChangeId (id) {
          console.log(id)
          this.pageIndex = 1
          this.curPage = 1
          if (!id) {
            this.regionId = this.stationId
          } else {
            this.regionId = id
          }
          this.findUserLists()
        },
        targetCancel () {
          this.targetShow = false
        },
        targetOk () {
          this.$router.push({
            name: 'equipment-control_index',
            params: {
              searchTxt : this.id
            }
          })
        }
      },
      components: {
        areaCommon
      },
      directives: {
        focus: (el) => {
          el.focus()
        }
      },
      watch: {
        searchTxt (val) {
          if (!val) {
            this.findUserLists()
          }
        }
      }
    }
</script>

<style lang="less">
  @import './person-manage.less';
  @import '../../styles/kc_table_style.less';
  @import '../../styles/kc_select_style.less';
</style>
<style lang="less">
  .modelShow {
    .ivu-modal-wrap {
      .ivu-modal {
        top: 200px;
        box-shadow: none;
        border: none;
        .ivu-modal-content {
          // box-shadow: 0px 0px 5px 2px #0E4174;
          overflow: hidden;
          // height: 220px;
          background-color: #041A2F;
          .ivu-modal-header {
              border: none;
              .ivu-modal-header-inner {
                text-align: center;
                color: #ddd;
                font-size: 16px;
              }
            }
          .ivu-modal-body {
            margin-top: 10px;
            text-align: center;
            color: #345B81;
            p{
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
            .input {
              width: 60%;
              text-align: center;
              font-size: 25px;
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
          }
          .ivu-modal-footer {
            padding:18px 60px;
            border: none;
            width: 100%;
            display: inline-block;
            text-align: center;
            button {
              width: 100px;
              height: 35px;
              font-size: 14px;
              text-align: center;
              color: #fff;
              text-shadow: 1px 1px 1px #333;
              border-radius: 5px;
              outline: none;
              cursor: pointer;
              &.btn-confirm {
                float: right;
                border: 1px solid rgb(0, 141, 255);
                // box-shadow: 0 1px 2px #8fcaee inset, 0 -1px 0 #497897 inset, 0 -2px 3px #8fcaee inset;
                background-color: rgb(0, 141, 255);
                &:hover {
                  background-color: rgba(0, 141, 255,.8);
                }
                &:active {
                  top: 1px;
                  background-color: rgba(0, 141, 255,.5);
                }
              }
              &.btn-cancel {
                float: left;
                border: 1px solid rgb(10, 51, 90);
                background-color: rgb(10, 51, 90);
                &:hover {
                   background-color: rgba(10, 51, 90,.8);
                }
                &:active {
                  top: 1px;
                   background-color: rgba(10, 51, 90, .5);
                }
              }
            }
          }
        }
      }
    }
  }
  .modelReset {
    .ivu-modal-wrap {
      .ivu-modal {
        top: 200px;
        .ivu-modal-content {
          // box-shadow: 0px 0px 5px 2px #0E4174;
          overflow: hidden;
          // height: 220px;
          background-color: #041A2F;
          .ivu-modal-header {
              border: none;
              .ivu-modal-header-inner {
                text-align: center;
                color: #ddd;
                font-size: 16px;
              }
            }
          .ivu-modal-body {
            margin-top: 10px;
            text-align: center;
            color: #345B81;
            
            .input {
              margin-top: 10px;
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
            p{
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
            display: inline-block;
            text-align: center;
            .btn-cancel.ivu-btn {
              width: 100px;
              border: none;
              float: left;
              color: #345B81;
              height: 35px;
              background-color: #0A335A;
            }
            .btn-Determine.ivu-btn {
              border: none;
              width: 100px;
              float: right;
              color: #fff;
              height: 35px;
              background-image: linear-gradient(180deg, #024d9e, #0079ce);
            }
          }
        }
      }
    }
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes  ani-demo-spin{
    from { transform: rotate(0deg)}
    50% { transform: rotate(180deg)}
    to { transform: rotate(360deg)}
  }
  .person-table {
    .ivu-spin.ivu-spin-fix.ivu-spin-show-text {
      top: 143px;
      height: 48px;
      background-color: rgba(6, 46, 82, 1);
      width: 96.6%;
      left: 20px;
      color: #fff;
    }
  }
</style>

