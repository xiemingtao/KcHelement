<template>
  <div class="user_info">
		<div class="title">账户管理</div>
    <div class="listWrap">
    	<div class="titleCnt">账户管理</div>
        <Menu theme="light" width="220px"  @on-select="change" @on-open-change="changes" :active-name="activeName" :accordion="true">
          <Submenu :name="item.id" v-for="item in orgStructure" :key="item.id">
            <template slot="title">{{item.name}}</template>
            <MenuItem :name="itm.id" v-for="itm in item.children" :key="itm.id">{{itm.name}}</MenuItem>
            <!-- <Submenu :name="itm.name" v-for="itm in item.children" :key="itm.id">
               <template slot="title">{{itm.name}}</template>
              <MenuItem :name="ele.name" v-for="ele in itm.children" :key="ele.id">{{ele.name}}</MenuItem>
            </Submenu> -->
          </Submenu>
        </Menu>
    </div>
		<div class="policeSelect">
        <Row class="toolbar" style="align-items: center; margin-bottom: 10px;">
          <Col span="4" style="padding: 5px 10px;">
            <Button type="primary" @click="addUser">新增账户</Button>
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
      <Modal :mask-closable="false" v-model="deleteShow" :width="360" class="reset_password">
        <p slot="header">删除用户</p>
        <div>确定要删除用户名:{{removeText}}吗?</div>
        <div slot="footer">
          <button class="btn-cancel" @click="cancelClick"  @keyup.enter.native="cancelClick">取消</button>
          <button class="btn-confirm" @click="confirmClick" >确定</button>
        </div>
      </Modal>
      <Modal :mask-closable="false" v-model="reserShow" :width="360" class="reset_password">
        <p slot="header">重置用户</p>
        <div>确定要重置用户名:{{removeText}}密码吗?</div>
        <div slot="footer">
          <button class="btn-cancel" @click="cancelClick"  @keyup.enter.native="cancelClick">取消</button>
          <button class="btn-confirm" @click="confirmReset" >确定</button>
        </div>
      </Modal>
  </div>
</template>

<script>
import { getOrgList, selectAdmin, resetAdmin, deleteAdmin, getOrgName } from 'api'
export default {
  data () {
    return {
      activeName: '',
      removeText: '',
      deleteShow: false,
      reserShow: false,
      orgStructure: [],
      latlng: null,
      policeStation: null,
      name: '',
      userInfo: null,
      organizeIdList: '',
      address: '',
      regionId: '',
			timer: '',
			curPage: 1,
			total: 1,
			pageIndex: 1,
			pageSize: 10,
			organizedName: '',
			t_columns: [
				{
          title: '序号',
          width: 80,
          align: 'center',
          render: (h, params) => h('span', params.index + (this.pageIndex - 1) * this.pageSize + 1)
				},
				{
          title: '用户名',
          key: 'userName',
          // width: 200,
          align: 'center'
        },
				{
          title: '机构名称',
          key: 'organName',
          // width: 200,
          align: 'center'
				},
				{
          title: '账户类型',
          key: 'organLevel',
          // width: 200,
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
                      this.resetPass(params.index, params.row)
                    }
                  }
                },
                '重置密码'
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
			kc_data: [
				
      ],
      removeId: ''
    }
  },
  methods: {
    getOrgLists () {
      getOrgName({
        name: this.name
      }).then(res => {
        // console.log(res.data.obj)
        if (res.data.success) {
          // sessionStorage.setItem('regionId', JSON.stringify(res.data.obj[0].id))
          if (this.userInfo.userLevel === '1' || this.userInfo.userLevel === '2') {
            this.orgStructure = res.data.obj
          } else if (this.userInfo.userLevel === '0' || this.userInfo.userLevel === '9') {
            this.orgStructure = res.data.obj[0].children.map(item => {
              return {
                id: item.id,
                name: item.name,
                children: item.children
              }
            })
            this.orgStructure.unshift({
              id: 16,
              name: '上海市公安局',
              children:  []
            })
          }
        }
      })
    },
    change (val) {
      // console.log(val)
      this.activeName = val
			this.organizedName = val
			this.pageIndex = 1
			this.curPage = 1
			this.getselectAdmin()
    },
    changes (val) {
			console.log(val)
			if (!val[0]) return
			this.pageIndex = 1
			this.curPage = 1
			this.organizedName = val[val.length-1]
			this.getselectAdmin()
		},
		addUser() {
			this.$router.push({
				name: 'addUser_index'
			})
		},
		getselectAdmin () {
			selectAdmin({
				organizeId: this.organizedName,
				pageIndex: this.pageIndex,
				pageSize: this.pageSize
			}).then(res => {
        if (res.data.success) {
          // console.log(res.data.obj)
          const userInfoList = res.data.obj.list
          if (!userInfoList) return
          if (res.data.success) {
            this.total = res.data.obj.total
            this.kc_data = userInfoList.map(item => {
              return {
                userName: item.loginName,
                organName: item.organizationName,
                id: item.id,
                organLevel: item.accountType == 'read-only' ? '普通账户' : item.accountType == 'read-write' ? '管理账户' : item.accountType == 'read-all' ? '超级管理员' : ''
              }
            })
          }
        }
			})
		},
		resetPass (index, row) {
      this.removeId = row.id
      this.reserShow = true
      this.removeText = row.userName
		},
		removeRow (index,row) {
      this.deleteShow = true
      this.removeId = row.id
      this.removeText = row.userName
		},
		changePage (page) {
			this.pageIndex = page
      this.curPage = page
      this.getselectAdmin()
    },
    cancelClick () {
      this.deleteShow = false
      this.reserShow = false
    },
    confirmClick () {
      this.deleteAdmins(this.removeId)
    },
    deleteAdmins (id) {
      deleteAdmin({id: id}).then(res => {
        this.deleteShow = false
				if (res.data.success) {
					this.$Message.success('用户删除成功')
          this.getselectAdmin()
				} else {
          this.$Message.warning(res.data.msg)
        }
			})
    },
    resetAdmins (id) {
      resetAdmin({id: id}).then(res => {
				if (res.data.success) {
          this.$Message.success('密码重置成功')
           this.reserShow = false
				} else {
          this.$Message.warning('密码重置失败')
        }
			})
    },
    confirmReset () {
      this.resetAdmins(this.removeId)
    }
  },
  mounted () {
    this.userInfo = JSON.parse(sessionStorage.getItem('user'))
    this.name = this.userInfo.organizationName
    if (this.name === '超级管理员') {
      this.name = '上海市公安局'
		}
		this.getOrgLists()
		this.getselectAdmin()
  }
}
</script>

<style lang="less" scoped>
	@import "./userInfo.less";
</style>
<style lang="less">
	.user_info {
		.title {
			color: white;
			font-size: 14px;
			margin-left: 10px;
			margin-top: 15px;
		}
    .ivu-menu-vertical .ivu-menu-item,
    .ivu-menu-vertical .ivu-menu-submenu-title {
      padding: 10px 24px;
      line-height: 20px;
    }
    .ivu-menu-light {
      background: transparent;
    }
    .ivu-menu-vertical .ivu-menu-item:hover,
    .ivu-menu-vertical .ivu-menu-submenu-title:hover {
      color: #fff;
      background: linear-gradient(180deg, #024d9e, #0079ce);
    }
    .ivu-menu {
      color: #6d9dc6;
    }
    .ivu-menu.ivu-menu-light.ivu-menu-vertical {
      .ivu-menu-submenu {
        .ivu-menu-submenu-title {
          .ivu-icon.ivu-icon-ios-arrow-down.ivu-menu-submenu-title-icon {
            opacity: 0;
          }
          .devOnNum {
            position: absolute;
            right: 20px;
            top: 10px;
          }
        }
      }
    }
  }
  .reset_password {
    .ivu-modal-wrap {
      .ivu-modal {
        top: 300px;
        .ivu-modal-content {
          background-color: #041A2F;
          .ivu-modal-header {
            border: none;
            p {
              color:#fff;
              font-size: 16px;
              text-align: center;
            }
          }
          .ivu-modal-footer {
            border: none;
            padding: 24px 60px;
            overflow: hidden;
            button {
              width: 90px;
              height: 32px;
              font-size: 14px;
              text-align: center;
              color: #fff;
              text-shadow: 1px 1px 1px #333;
              border-radius: 5px;
              outline: none;
              cursor: pointer;
              &.btn-confirm {
                float: right;
                // margin-left: 80px;
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
          .ivu-modal-body {
            div {
              text-align: center;
              font-size: 14px;
              color: #fff;
            }
          }
        }
      }
    }
  }
</style>

