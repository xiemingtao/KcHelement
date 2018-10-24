<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <!-- 左边菜单 -->
    <div class="sidebar-menu-con" :style="{width: shrink ? '65px' : '150px', overflow: shrink ? 'visible' : 'auto'}">
      <scroll-bar ref="scrollBar">
        <shrinkable-menu
          :shrink="shrink"
          @on-change="handleSubmenuChange"
          :theme="menuTheme"
          :before-push="beforePush"
          :open-names="openedSubmenuArr"
          :menu-list="menuList">
        </shrinkable-menu>
      </scroll-bar>
    </div>

    <div class="main-header-con">
      <div class="main-header">
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            警用智能头盔管理系统
          </div>
        </div>
        <div class="header-avator-con">
          <!-- <full-screen v-model="isFullScreen" @on-change="fullscreenChange" ></full-screen>   -->
          <!-- <lock-screen></lock-screen> -->
          <!-- <message-tip v-model="mesCount"></message-tip> -->
          
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <!-- <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userName }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace">个人中心</DropdownItem>
                  <DropdownItem name="loginout">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown> -->
              <Tooltip content="个人信息">
                <!-- <Avatar :src="avatorPath" style="background: #619fe7; margin-left: 10px;" @click.native="ownSpace"></Avatar> -->
                <div @click="ownSpace" class="person">
                  <img src="./../../static/images/top_police.png" alt="">
                  当前用户: &nbsp&nbsp{{userName}}
                </div>
               </Tooltip>
              <div class="login_out">
                <div class="loginout" @click="loginout">
                  <img src="./../../static/images/top_quit.png" alt="">
                    <!-- <Icon type="android-exit" size="24" /> -->
                  退出登录
                </div>
              </div>
            </Row>
          </div>
        </div>
      </div>

      <div class="tags-con" :style="{marginLeft: shrink ? '70px' : '150px'}">
        <div class="navicon-con">
          <!-- <Tooltip content="">

          </Tooltip> -->
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'150px'}">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
    <Modal title="退出登录" :mask-closable="false" v-model="userShow" :width="400" class="userModal">
      <p>确定要退出当前用户返回登陆页面吗？</p>
      <div slot="footer">
        <Button type="success" class="btn-cancel" @click="cancel">取消</Button>
        <Button type="primary" class="btn-edit" @click="confirmLogout">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu'
import tagsPageOpened from './main-components/tags-page-opened'
import fullScreen from './main-components/fullscreen'
// import lockScreen from './main-components/lockscreen/lockscreen'
// import messageTip from './main-components/message-tip'
import Cookies from 'js-cookie'
import util from '@/libs/util'
import scrollBar from '@/views/my-components/scroll-bar/vue-scroller-bars'
import { requestLogout, findMessage } from 'api'

export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    fullScreen,
    // lockScreen,
    // messageTip,
    scrollBar
  },
  data () {
    return {
      shrink: false,
      userShow: false,
      userName: '',
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr
    }
  },
  computed: {
    menuList () {
      return this.$store.state.app.menuList
    },
    pageTagsList () {
      return this.$store.state.app.pageOpenedList // 打开的页面的页面对象
    },
    currentPath () {
      return this.$store.state.app.currentPath // 当前面包屑数组
    },
    avatorPath () {
      return localStorage.avatorImgPath
    },
    cachePage () {
      return this.$store.state.app.cachePage
    },
    lang () {
      return this.$store.state.app.lang
    },
    menuTheme () {
      return this.$store.state.app.menuTheme
    },
    mesCount () {
      return this.$store.state.app.messageCount
    }
  },
  methods: {
    init () {
      let pathArr = util.setCurrentPath(this, this.$route.name)
      this.$store.commit('updateMenulist')
      if (pathArr.length >= 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name)
      }
      this.userName = Cookies.get('user')
      let messageCount = 3
      this.messageCount = messageCount.toString()
      this.checkTag(this.$route.name)
      this.$store.commit('setMessageCount', 3)
    },
    toggleClick () {
      this.shrink = !this.shrink
    },
    ownSpace () {
      util.openNewPage(this, 'ownspace_index')
      this.$router.push({
        name: 'ownspace_index'
      })
    },
    loginout () {
      this.userShow = true
    },
    confirmLogout () {
      requestLogout().then(res => {
        if (res.data.success) {
          console.log(res.data)
          this.userShow = false
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('regionId')
          // 退出登录
          this.$store.commit('logout', this)
          this.$store.commit('clearAllTags')
          // this.$store.commit('clearOpenedSubmenu')
          this.$Message.warning('退出登录成功，返回登陆页')
          setTimeout(() => {
            this.$router.push({
            name: 'login'
          })
          },1000)
        }
      })
    },
    cancel () {
      this.userShow = false
    },
    handleClickUserDropdown (name) {
      if (name === 'ownSpace') {
        util.openNewPage(this, 'ownspace_index')
        this.$router.push({
          name: 'ownspace_index'
        })
      } else if (name === 'loginout') {
        
      }
    },
    checkTag (name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true
        }
      })
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        )
      }
    },
    handleSubmenuChange (val) {
      // console.log(val)
      // util.openNewPage(this, val)
    },
    beforePush (name) {
      // if (name === 'accesstest_index') {
      //     return false
      // } else {
      //     return true
      // }
      return true
    },
    fullscreenChange (isFullScreen) {
      console.log(isFullScreen)
    },
    scrollBarResize () {
      this.$refs.scrollBar.resize()
    }
  },
  watch: {
    $route (to) {
      this.$store.commit('setCurrentPageName', to.name)
      let pathArr = util.setCurrentPath(this, to.name)
      if (pathArr.length > 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name)
      }
      this.checkTag(to.name)
      localStorage.currentPageName = to.name
    },
    lang () {
      util.setCurrentPath(this, this.$route.name) // 在切换语言时用于刷新面包屑
    },
    openedSubmenuArr () {
      setTimeout(() => {
        this.scrollBarResize()
      }, 300)
    }
  },
  mounted () {
    findMessage().then(res =>{
      console.log(res.data)
    })
    // console.log(JSON.parse(localStorage.getItem('pageOpenedList')).splice(0, 1))
    this.init()
    window.addEventListener('resize', this.scrollBarResize)
  },
  created () {
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList')
  },
  dispatch () {
    window.removeEventListener('resize', this.scrollBarResize)
  }
}
</script>

<style lang="less">
@import "./main.less";
@import "../styles/kc_table_style.less";
@import "../styles/kc_select_style.less";
//@import "../styles/kc_page_style.less";
</style>
