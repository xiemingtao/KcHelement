<template>
  <div class="equipment-control">
    <h3 style="margin: 20px 10px; color: white; font-size: 14px;">设备管理</h3>
    <Row class="toolbar" style="align-items: center; margin-bottom: 10px;">
      <Col span="4" style="padding: 5px 10px;">
        <Button type="primary" @click="handleAdd" v-show="hideDev">新增设备</Button>
      </Col>
      <Col span="20">
        <div style="float: right;align-items: center;">
          <!-- <areaCommon @getRegionId="getRegionId" v-model="resetData" :regionId="regionId" :parentId ="parentId"></areaCommon> -->
           <Select v-model="policeNames" class="select-item" @on-change="onChangeArea" v-show="hideRegion" placeholder="请选择分局" filterable >
              <Option v-for="item in policeList" :value="item.id" :key="item.id" >{{item.name}}</Option>
            </Select>
            <Select v-model="stations" class="select-item" @on-change="onChangeId" v-show="hideRegionChild" clearable style="margin-left:10px; margin-right:10px;" placeholder="请选择派出所" :filterable="filterShow" ref="secLevel">
              <Option v-for="item in policeStation" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          <Button type="primary" style="margin-left: 10px;margin-right: 20px;" @click="resetList" v-show="resetShow">重置</Button>
          <input placeholder="请输入警号" class="searchClass" v-model="searchTxt" @keyup.enter.stop="queryEqu">
          <input placeholder="请输入设备号" class="searchClass" v-model="deviceTxt" style="margin-left:10px;" @keyup.enter.stop="queryEqu">
          <Button type="primary" style="margin-left: 10px;margin-right: 20px;" @click="queryEqu">查询</Button>
        </div>
      </Col>
    </Row>

    <Table :columns="t_columns" :data="kc_data" style="margin: 0px 10px;"></Table>

    <!-- <Modal v-model="showModel" :closable='false' :mask-closable=false :width="400" title="注销设备" class="equipmentModal"  @on-ok="uninstallDev">
        <p>设备编号：{{deviceNum}}</p>
        <p>设备冻结后将会清理设备中的缓存和卸载App</p>
        <h1>请输入管理员密码</h1>
        <Input type="text" icon=" "> </Input>
    </Modal> -->

    <div class="footer">
      <Page :total="total" :current="curPage" size="small" show-elevator @on-change="change" >
        <input type="text" style="background-color: #ddd">
      </Page>
    </div>
     <Modal v-model="modeShow" :width="400" class="equipmentModal" :closable="false" :mask-closable="false">
        <p>设备编号：{{deviceNum}}</p>
        <p>确定要执行此操作吗?</p>
        <p>请输入管理员密码</p>
        <input type="password" icon=" " autofocus v-model="confirmPWD" @keyup.enter="passConfirm" class="input" v-focus>
        <div slot="footer">
           <Button  class="btn-cancel" @click="delcancel">取消</Button>
           <Button  class="btn-confirm" @click="delOk">确定</Button>
        </div>
    </Modal>
     <Modal v-model="showModel" :width="400" class="equipmentModal" :closable="false" :mask-closable="false">
        <p>设备编号：{{deviceNum}}</p>
        <!-- <p>设备冻结后将会清理设备中的缓存和卸载App</p> -->
         <p>确定要执行此操作吗?</p>
        <p>请输入管理员密码</p>
        <!-- <p>该操作不可撤销</p> -->
        <input type="password" icon=" " autofocus v-model="confirmPWD" @keyup.enter="uninstallPass" class="input" v-focus>
        <div slot="footer">
           <button  class="btn-cancel" @click="cancel">取消</button>
           <button  class="btn-confirm"  @click="uninstallOk">确定</button>
        </div>
    </Modal>
    <Spin fix v-show="loading">
      <Icon type="load-a" class="demo-spin-icon-load"></Icon>
      <div>数据加载中</div>
    </Spin>
  </div>
</template>

<script>
import { findDvcList, deleteDvcList, pushCommand, findOrgById, getOrgList, getOrgName } from 'api'
import areaCommon from '../areaList/areaList'
import md5 from 'js-md5'
export default {
  data () {
    return {
      name: JSON.parse(sessionStorage.getItem('user')).organizationName,
      userLevel: JSON.parse(sessionStorage.getItem('user')).userLevel,
      hideDev: true,
      modeShow: false,
      resetShow: true,
      regionId: this.$route.params.regionId ? this.$route.params.regionId : JSON.parse(sessionStorage.getItem('regionId')),
      searchTxt: this.$route.params.searchTxt ? this.$route.params.searchTxt : '',
      deviceTxt: this.$route.params.deviceTxt ? this.$route.params.deviceTxt : '',
      resetData : '1',
      curPage: this.$route.params.curPage ? this.$route.params.curPage : 1,
      pageIndex: this.$route.params.pageIndex ? this.$route.params.pageIndex : 1,
      pageSize: 10,
      total: 0,
      id: 0,
      index: '',
      showModel: false,
      deviceNum: '',
      userPassword: '',
      confirmPWD: '',
      stateNum: '',
      kc_data: [],
      loading: true,
      t_columns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '序号',
          width: 80,
          align: 'center',
          render: (h, params) => h('span', params.index + (this.pageIndex - 1) * this.pageSize + 1)
        },
        {
          title: '设备编号',
          key: 'deviceNo',
          align: 'center'
        },
        {
          title: '手机号码',
          key: 'moblie',
          align: 'center'
        },
        {
          title: '设备管理员',
          key: 'person',
          editable: true,
          align: 'center'
        },
        {
          title: '警号',
          key: 'account',
          editable: true,
          align: 'center'
        },
        {
          title: '所属部门',
          key: 'deptName',
          editable: true,
          align: 'center'
        },
        {
          title: '设备状态',
          key: 'state',
          width: 100,
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          width: 200,
          render: (h, params) => {
            let stateText = this.kc_data[params.index].state
            return h('div', [
              h(
                'Button',
                {
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
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  style: {
                    margin: '0 5px',
                    color: '#E13E42'
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
                },
                '删除'
              ),
              h(
                'Button',
                {
                  style: {
                    margin: '0 5px',
                    color: '#ff9900'
                  },
                  props: {
                    type: 'text',
                    placement: 'top'
                  },
                  on: {
                    click: () => {
                      this.uninstallRow(params.index, params.row)
                    }
                  }
                },
                stateText === '正常' ? '冻结' : '解冻'
              )
            ])
          }
        }
      ],
      policeList: [],
      policeStation: [],
      row: null,
      hideRegion: true,
      hideRegionChild: true,
      policeNames: this.$route.params.parentId ? this.$route.params.parentId : '',
      stations: this.$route.params.stationsId ? this.$route.params.stationsId : '',
      filterShow:false,
      stationId: this.$route.params.parentId ? this.$route.params.parentId : ''
    }
  },
  components: {
    areaCommon
  },
  mounted () {
    // document.onkeydown = (e) => {
    //   if (e.keyCode == 13) {
    //     this.queryEqu()
    //   }
    // }
    // console.log(this.$route.params)
    this.userPassword = JSON.parse(sessionStorage.getItem('user')).password
    // this.regionId = JSON.parse(sessionStorage.getItem('regionId'))
    this.getDeviceList()
    if (JSON.parse(sessionStorage.getItem('user') || {}).accountType === 'read-only') {
      this.hideDev = false
      this.t_columns.splice(-1, 1)
    }
    if (JSON.parse(sessionStorage.getItem('user') || {}).userLevel === '2') {
          this.resetShow = false
        }
    // this.regionName = JSON.parse(sessionStorage.getItem('user')).organizationName
    if (this.name === '超级管理员') {
      this.name = '上海市公安局'
    }
    getOrgName({name: this.name}).then(res => {
      if (this.userLevel === '2') {
        this.policeStation = res.data.obj
        this.hideRegion = false
        this.hideRegionChild = false
      } else if (this.userLevel === '1') {
        // this.hideRegion = false
        this.policeList = res.data.obj
        this.policeStation = res.data.obj[0].children
      } else if (this.userLevel === '0' || this.userLevel === '9') {
        // console.log(res.data.obj[0])
        this.policeList = res.data.obj[0].children
        const childList = this.policeList.find(item => item.id === this.policeNames)
        if (!childList) return
        this.policeStation = childList.children
      }
    })
  },
  methods: {
    // 跳转新增设备
    handleAdd () {
      this.$router.push({
        name: 'add_equipment'// add_equipment
      })
    },
    // 跳转到编辑页面
    editRow (index, row) {
      // console.log(row)
      this.$router.push({
        name: 'edit_equipment',
        params: {
          searchTxt: this.searchTxt,
          deviceTxt: this.deviceTxt,
          policeId: this.policeNames,
          stationsId: this.stations,
          pageIndex: this.pageIndex,
          curPage: this.curPage,
          regionId: this.regionId
        }
      })
      sessionStorage.setItem('editId', JSON.stringify(row.id))
    },
    // 弹出模态框
    removeRow (index, row) {
      this.deviceNum = row.deviceNo
      this.id = row.id
      this.index = index
      this.modeShow = true
    },
    // 确认删除
    delOk () {
      if (this.userPassword === md5(this.confirmPWD)) {
        this.deleteDev()
      } else {
        // this.modeShow = true
        this.$Message.error({
          content: '密码错误,请重新输入',
          top: 100
        })
      }
    },
    passConfirm () {
      this.delOk()
    },
    // 删除接口
    deleteDev() {
      deleteDvcList({
        id: this.id
      }).then(res => {
        if (res.data.success) {
          this.pageIndex = 1
          this.curPage = 1
          this.getDeviceList()
          this.confirmPWD = ''
          this.$Message.success('密码正确,设备删除成功')
          this.modeShow = false
        } else {
          this.$Message.error('设备删除失败')
        }
      })
    },
    //  注销设备
    uninstallRow (index, row) {
      this.stateNum = row.state === '正常' ? 1 : row.state === '已冻结' ? 5 : ''
      this.index= index
      this.row = row
      this.deviceNum = row.deviceNo
      this.showModel = true
    },
    uninstallPass () {
      this.uninstallOk()
    },
    // 确认冻结
    uninstallOk () {
      if (this.userPassword === md5(this.confirmPWD)) {
        this.uninstallDev()
        this.confirmPWD = ''
      } else {
        // this.modeShow = true
        this.$Message.error({
          content: '密码错误,请重新输入',
          top: 100
        })
      }
    },
    // 冻结设备
    uninstallDev () {
      pushCommand({
        deviceNum: this.deviceNum,
        cmd: this.stateNum
      }).then(res => {
        if (res.data.success) {
         this.$Message.success('密码正确,操作成功')
          this.getDeviceList()
          this.showModel = false
        } else {
          this.$Message.error('操作失败')
        }
      })
    },
    // 获取分局的警员设备信息
    getDeviceList () {
      findDvcList({
        regionId: this.regionId,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        userName: this.searchTxt.trim(),
        deviceNum: this.deviceTxt.trim()
      }).then(res => {
        // console.log(res.data.obj)
        if (res.data.success) {
          this.loading = false
          this.total = res.data.total
          const DeviceList = res.data.obj
          // DeviceList.forEach(item => {
            // findOrgById ({id: item.parentId}).then(res => {
              // this.$set(item, 'parentName', res.data.obj.name)
              this.kc_data = DeviceList.map(item => {
                return {
                  deviceNo: item.deviceNum,
                  person: item.policeName,
                  account: item.policeNum,
                  password: item.password,
                  deptName: item.regionName === null ? item.parentName : (item.parentName === null ? '' : item.parentName ) + item.regionName,
                  state: (item.state === '1' ? '正常' : item.state === '2' ? '保修' : item.state === '3' ? '已冻结' : ''),
                  id: item.id,
                  parentId: item.parentId,
                  regionName: item.regionName,
                  regionId: item.regionId,
                  moblie: item.telephone
                }
              })
        }
          // })
        // })
      })
    },
    // 翻页
    change (page) {
      // console.log(this.regionId)
      this.pageIndex = page
      this.curPage = page
      this.getDeviceList()
    },
    // 查询
    queryEqu () {
      this.pageIndex = 1
      this.curPage = 1
      // this.regionId = 16
      // if (this.searchTxt === '' && this.deviceTxt === '') return
      this.getDeviceList()
      // this.kc_data = this.kc_data.filter(item => item.account.indexOf(this.searchTxt) > -1)
      // this.total = this.kc_data.length
    },
    // 重置
    resetList () {
      this.regionId = JSON.parse(sessionStorage.getItem('regionId'))
      this.pageIndex = 1
      this.curPage = 1
      this.policeNames = ''
      this.stations = ''
      this.policeStation = []
      this.searchTxt = ''
      this.deviceTxt = ''
      this.getDeviceList()
    },
    delcancel () {
      this.modeShow = false
      this.confirmPWD = ''
    },
    cancel () {
      this.showModel = false
      this.confirmPWD = ''
    },
     onChangeArea (id) {
       this.pageIndex = 1
       this.curPage = 1
      // console.log(id)
      if (!id) {
        this.regionId =  JSON.parse(sessionStorage.getItem('regionId'))
        this.stationId = JSON.parse(sessionStorage.getItem('regionId'))
        return
      }
      this.stationId = id
      this.regionId = id
      const childList = this.policeList.find(item => item.id === id)
      if (!childList) return
      this.policeStation = childList.children
      if (this.policeStation.length == 0) {
        this.filterShow = false
        this.$refs.secLevel.setQuery('')
      } else {
        this.filterShow = true
      }
      this.getDeviceList()
      // console.log(this.regionId)
    },
    onChangeId (id) {
      this.pageIndex = 1
      this.curPage = 1 
      if (!id) {
        id = this.stationId
      }
      this.regionId = id
      this.getDeviceList()
      // console.log(this.regionId)
    }
  },
  watch: {
    searchTxt (val) {
      if (!val) {
        this.getDeviceList()
      }
    },
    deviceTxt (val) {
      if (!val) {
        this.getDeviceList()
      }
    }
  },
  directives: {
    focus: (el) => {
      el.focus()
    }
  }
}
</script>
<style lang="less">
  .equipmentModal.v-transfer-dom {
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
            text-align: center;
            color: #345B81;
            p {
              color: #fff;
              text-align: center;
              padding-bottom: 20px;
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
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes  ani-demo-spin{
    from { transform: rotate(0deg)}
    50% { transform: rotate(180deg)}
    to { transform: rotate(360deg)}
  }
  .ivu-spin.ivu-spin-fix.ivu-spin-show-text {
    top: 153px;
    height: 48px;
    background-color: rgba(6, 46, 82, 1);
    width: 96.6%;
    left: 20px;
    color: #fff;
  }
</style>
<style lang="less">
@import "./equipment-control.less";
</style>

