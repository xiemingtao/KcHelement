<template>
  <div class="organization">
    <div class="title">机构管理</div>
    <div class="organ-info">
      <div class="policeList" v-show="cityHide">
        <div class="polTitle">分局列表<div class="editT" @click="showEdit" v-show="hideDev">
          <Tooltip content="编辑机构" placement="top">
            <Icon type="grid" size="24" color='#8ca0b3' v-show="colorshow"/>
            <Icon type="grid" size="24" color='#117ece' v-show="colorshows"/>
          </Tooltip>
        </div></div>
        <div class="listWrap">
        <template>
          <Menu theme="light" width="220px" @on-select="showStation" :activeName="itemId">
            <MenuGroup>
              <MenuItem :name="item.id" v-for="item in policeList" :key="item.id" >{{item.name}}
                <div class="icon" v-show="showIcon">
                  <Tooltip content="编辑" placement="left">
                    <i class="edit" @click="editPolice(item.id)"></i>
                  </Tooltip>
                  <Tooltip content="删除" placement="left">
                    <i class="del" @click="delPolcie(item)" v-show="delShow"></i>
                  </Tooltip>
                </div>
              </MenuItem>
            </MenuGroup>
          </Menu>
        </template>
    </div>
      </div>
      <div class="policeSelect">
        <Row class="toolbar" style="align-items: center; margin-bottom: 10px;">
          <Col span="4" style="padding: 5px 10px;">
            <Button type="primary" @click="handleAdd" v-show="hideDev">新增机构</Button>
          </Col>
          <!-- <Col span="20">
            <div style="float: right;align-items: center;">
              <input placeholder="请输入派出所名称" class="searchClass" v-model="searchTxt">
              <Button type="primary" style="margin-left: 10px;margin-right: 20px;" @click="queryKC">查询</Button>
            </div>
          </Col> -->
        </Row>
         <Table :columns="t_columns" :data="kc_data" style="margin: 0px 10px;"></Table>

        <div class="footer">
          <Page :total="total" :current="curPage" size="small" show-elevator :page-size="10" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <!-- <Modal
        class="organizationModal"
        v-model="showModel"
        @on-ok="Determine"
        width="450px">
        <p>确定要删除 "{{delName}}" 吗?</p>
        <p v-show="showText">删除分局时,该分局下的派出所将一起被删除</p>
        <p>该操作不可恢复</p>
    </Modal> -->
     <Modal v-model="showModel" :width="400" class="organizationModal" :closable="false"  :mask-closable="false">
        <p>机构名称：{{delName}}</p>
        <!-- <p v-show="showText">删除分局时,该分局下的派出所将一起被删除</p> -->
        <p>确定要执行此操作吗?</p>
        <p>请输入管理员密码</p>
        <input type="password" icon=" " autofocus v-model="confirmPWD" @keyup.enter="keydowedit" class="input" v-focus>
        <div slot="footer">
           <Button  class="btn-cancel" @click="cancel">取消</Button>
           <Button  class="btn-Determine" @click="Determine">确定</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import { getOrgList, deleteOrg, getOrgName } from 'api'
import md5 from 'js-md5'
export default {
  data () {
    return {
      cityHide: true,
      hideDev: true,
      delShow: true,
      showIcon: false,
      showModel: false,
      pageIndex: 1,
      pageSize: 10,
      colorshow: true,
      colorshows: false,
      policeName: '',
      t_columns: [
        {
          title: '序号',
          width: 80,
          align: 'center',
          render: (h, params) => h('span', params.index + (this.pageIndex - 1) * this.pageSize + 1)
        },
        {
          title: '派出所名称',
          key: 'name',
          width: 200,
          align: 'center'
        },
        {
          title: '地址',
          key: 'address',
          editable: true,
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          width: 220,
          render: (h, params) => {
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
              )
            ])
          }
        }
      ],
      kc_data: [],
      curPage: 1,
      total: 0,
      policeList: [],
      itemId: '71',
      delId: '',
      delName: '',
      index: '',
      searchTxt: '',
      childList: null,
      showText: true,
      name: '',
      userLevel: '',
      userPassword: '',
      confirmPWD: '',
      parentId: '',
      level: ''
    }
  },
  created () {
    this.userPassword = JSON.parse(sessionStorage.getItem('user')).password
    if (JSON.parse(sessionStorage.getItem('user') || {}).accountType === 'read-only') {
      this.hideDev = false
      this.t_columns.splice(-1, 1)
    }
    if (JSON.parse(sessionStorage.getItem('user') || {}).userLevel === '2') {
      this.hideDev = false
      this.cityHide =false
    }
    if (JSON.parse(sessionStorage.getItem('user') || {}).userLevel === '1') {
      this.delShow = false
    }
    this.name = JSON.parse(sessionStorage.getItem('user') || {}).organizationName
    this.userLevel = JSON.parse(sessionStorage.getItem('user') || {}).userLevel
    if (this.name === '超级管理员') {
      this.name = '上海市公安局'
    }
  },
  mounted () {
    this.getOrgLists()
  },
  methods: {
    // 获取机构列表
    getOrgLists () {
      getOrgName({
        name: this.name
      }).then(res => {
        // console.log(res.data.obj)
        // console.log(res.data.obj[0].children[0].id)
        if (this.userLevel === '0' || this.userLevel === '9') {
          this.policeList = res.data.obj[0].children
          this.total = this.policeList[0].children.length
        } else if (this.userLevel === '1') {
          this.policeList = res.data.obj
          this.total = this.policeList[0].children.length
        } else if (this.userLevel === '2') {
          this.cityHide = false
          this.kc_data = res.data.obj
          this.total = this.kc_data.length
        }
        this.childList = this.policeList[0]
        if (!this.childList) return
        this.kc_data = this.childList.children.slice(0, this.pageSize)
        this.$nextTick(() => {
          this.itemId = this.policeList[0].id
        })
      })
    },
    // 获取派出所列表
    getPolLists () {
      // this.pageIndex =1
      getOrgList({parentId: this.parentId, pageIndex: this.pageIndex, pageSize: this.pageSize}).then(res => {
        this.kc_data = res.data.obj
        this.total = res.data.total
      })
    },
    cancel () {
      this.showModel = false,
      this.confirmPWD = ''
    },
    // 删除操作
    Determine () {
      if (this.userPassword === md5(this.confirmPWD)) {
        deleteOrg({id: this.delId}).then(res => {
          if (res.data.success) {
            // console.log(this.level)
            if (this.level === '2') {
              this.getOrgLists()
            } else if (this.level === '3'){
              this.parentId = this.kc_data[0].parentId
              this.pageIndex = 1
              this.curPage = 1
              this.getPolLists()
            }
            this.confirmPWD = ''
            this.showModel = false
            this.$Message.success({
              content: '删除成功',
              top: 100
            })
          } else {
            this.$Message.error({
              content: res.data.msg,
              top: 100
            })
             this.confirmPWD = ''
          }
        })
      } else {
        this.$Message.error({
          content: '密码错误,请重新输入',
          top: 100
        })
      }
    },
    keydowedit () {
      this.Determine()
    },
    // 查询
    queryKC () {
      this.kc_data = this.kc_data.filter(item => item.name.indexOf(this.searchTxt) > -1)
    },
    // 删除派出所
    removeRow (index, row) {
      this.level = row.organizeRemarks
      this.parentId = row.parentId
      this.delId = row.id
      this.delName = row.name
      this.showText = false
      this.index = index
      this.showModel = true
    },
    // 编辑派出所
    editRow (index, row) {
      sessionStorage.setItem('cityInfo', JSON.stringify(row))
      this.$router.push({
        name: 'edit-arganman_index'
      })
    },
    // 编辑分局
    editPolice (id) {
      sessionStorage.setItem('cityInfo', JSON.stringify(this.policeList.find(item => item.id === id)))
      this.$router.push({
        name: 'edit-arganman_index'
      })
    },
    // 显示编辑
    showEdit () {
      if (this.colorshow) {
        this.colorshows = true
        this.colorshow = false
      } else {
        this.colorshows = false
        this.colorshow = true
      }
      if (this.showIcon) {
        this.showIcon = false
      } else {
        this.showIcon = true
      }
    },
    // 派出所列表
    showStation (val) {
      // console.log(val)
      this.parentId = val
      this.pageIndex = 1
      this.curPage = 1
      this.getPolLists()
    },
    // 删除分局
    delPolcie (date) {
      this.level = date.organizeRemarks
      this.showModel = true
      this.delId = date.id
      const polieL = this.policeList.find(item => item.id === date.id)
      this.index = this.policeList.findIndex(item => item.id === date.id)
      this.delName = polieL.name
      this.showText = true
    },
    // 新增机构
    handleAdd () {
      this.$router.push({
        name: 'add-arganman_index'
      })
    },
    // 翻页
    changePage (page) {
      this.parentId = this.kc_data[0].parentId
      this.curPage = page
      this.pageIndex = page
      this.getPolLists()
      // this.kc_data = this.childList.children.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
    }
  },
  watch: {
    searchTxt (val) {
      if (!val) {
        this.kc_data = this.childList.children
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
    .organizationModal {
      .ivu-modal-wrap {
        .ivu-modal {
          top: 200px;
          .ivu-modal-content {
            box-shadow: 0px 0px 5px 2px #0E4174;
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
              text-align: center;
              color: #345B81;
                .input {
                margin-top: 10px;
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
                border: none;
                width: 100px;
                float: left;
                color: #345B81;
                background-color: #0A335A;
                height: 35px;
              }
              .btn-Determine.ivu-btn {
                height: 35px;
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
 
    
</style>
<style lang="less">
  @import 'organization.less';
</style>

