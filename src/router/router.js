import Main from '@/views/Main'
// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('@/views/login.vue')
}

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: () =>
    import ('@/views/error-page/404.vue')
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: () =>
    import ('@//views/error-page/403.vue')
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: () =>
    import ('@/views/error-page/500.vue')
}

export const preview = {
  path: '/preview',
  name: 'preview',
  component: () =>
    import ('@/views/form/article-publish/preview.vue')
}

export const locking = {
  path: '/locking',
  name: 'locking',
  component: () =>
    import ('@/views/main-components/lockscreen/components/locking-page.vue')
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: Main,
  children: [{
      path: 'home',
      title: {
        i18n: 'home'
      },
      name: 'home_index',
      component: () =>
        import ('@/views/home/home.vue')
    },
    {
      path: 'ownspace',
      title: '个人信息',
      name: 'ownspace_index',
      component: () =>
         //import ('@/views/own-space/own-space.vue')
        import ('@/views/own-space/user-info.vue')
    },
    {
      path: 'addperson',
      title: '新增用户',
      name: 'addperson_index',
      component: () =>
        import ('@/views/person-manage/add-person.vue')
    },
    {
       path: 'edituser',
       title: '编辑用户',
       name: 'edit_user_index',
       component: () =>
          import ('@/views/person-manage/edit-person.vue')
    },
    {
      path: 'diarydetails',
      title: '日记详情',
      name: 'diarydetails_index',
      component: () =>
        import ('@/views/review/diary-details/diary-details.vue')
    },
    {
      path: 'order/:order_id',
      title: '订单详情',
      name: 'order-info',
      component: () =>
        import ('@/views/advanced-router/component/order-info.vue')
    }, // 用于展示动态路由
    {
      path: 'shopping',
      title: '购物详情',
      name: 'shopping',
      component: () =>
        import ('@/views/advanced-router/component/shopping-info.vue')
    }, // 用于展示带参路由
    {
      path: 'message',
      title: '消息中心',
      name: 'message_index',
      component: () =>
        import ('@/views/message/message.vue')
    },
    {
       path: 'add_equipment',
       title: '新增设备',
       name: 'add_equipment',
       component: () =>
          import ('@/views/add-equipment/add-equipment.vue')
    },
    {
        path: 'edit_equipment',
        title: '编辑设备',
        name: 'edit_equipment',
        component: () =>
        import ('@/views/equipment-control/edit-equipment.vue')
    },
    {
      path: 'add-arganman',
      title: '新增机构',
      name: 'add-arganman_index',
      component: () =>
         import ('@/views/organization/components/add-arganman.vue')
    },{
      path: 'edit-arganman',
      title: '编辑机构',
      name: 'edit-arganman_index',
      component: () =>
         import ('@/views/organization/components/edit-arganman.vue')
    },
    {
      path: 'adminKey',
      title: 'Key管理',
      name: 'adminKey_index',
      component: () =>
         import ('@/views/version-manage/adminKey.vue')
    },
    {
      path: 'addUser',
      title: '新增账户',
      name: 'addUser_index',
      component: () =>
         import ('@/views/userInfo/addUser.vue')
    },
  ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
// 超级管理员路由
export const appRouter = [
  // {
  //   path: '/home',
  //   icon: 'ios-home',
  //   name: 'home',
  //   title: '首页',
  //   component: Main,
  //   children: [{
  //     path: '/home',
  //     title: '首页',
  //     name: 'home',
  //     component: () => import ('@/views/home/home.vue')
  //   }]
  // },
  {
    path: '/breadcast',
    icon: 'ios-videocam',
    image: './static/images/menuIcon_video.png',
    images: './static/images/menuIcon_video_focus.png',
    name: 'breadcast',
    title: '执法实况',
    component: Main,
    children: [{
      path: 'index',
      title: '执法实况',
      name: 'breadcast_index',
      component: () => import ('@/views/breadcast/breadcast.vue')
    }]
  },
  {
    path: '/push-message',
    icon: 'ios-email',
    image: './static/images/menuIcon_info.png',
    images: './static/images/menuIcon_info_focus.png',
    name: 'push-message',
    title: '推送消息',
    component: Main,
    children: [{
      path: 'index',
      title: '推送消息',
      name: 'push-message_index',
      component: () => import ('@/views/push-message/push-message.vue')
    }]
  },
  {
    path: '/review',
    icon: 'videocamera',
    image: './static/images/menuIcon_log.png',
    images: './static/images/menuIcon_log_focus.png',
    name: 'review',
    title: '执勤记录',
    component: Main,
    children: [{
      path: 'index',
      title: '执勤记录',
      name: 'review_index',
      component: () => import ('@/views/review/review.vue')
    }]
  },
  {
    path: '/organization',
    icon: 'cube',
    name: 'organization',
    image: './static/images/menuIcon_org.png',
    images: './static/images/menuIcon_org_focus.png',
    title: '机构管理',
    access: [0, 1],
    component: Main,
    children: [{
      path: 'index',
      title: '机构管理',
      name: 'organizations_index',
      access: [0, 1],
      component: () => import ('@/views/organization/organization.vue')
    }]
  },
  {
    path: '/equipment-control',
    icon: 'iphone',
    image: './static/images/menuIcon_helment.png',
    images: './static/images/menuIcon_helment_focus.png',
    name: 'equipment-control',
    title: '设备管理',
    component: Main,
    children: [{
      path: 'index',
      title: '设备管理',
      name: 'equipment-control_index',
      component: () => import ('@/views/equipment-control/equipment-control.vue')
    }]
  },
  {
    path: '/person-manage',
    icon: 'ios-people',
    image: './static/images/menuIcon_peopleList.png',
    images: './static/images/menuIcon_peopleList_focus.png',
    name: 'person-manage',
    title: '人员管理',
    component: Main,
    children: [{
      path: 'index',
      title: '人员管理',
      name: 'person-manage_index',
      component: () => import ('@/views/person-manage/person-manage.vue')
    }]
  },
  {
    path: '/version-manage',
    icon: 'videocamera',
    image: './static/images/menuIcon_version.png',
    images: './static/images/menuIcon_version_focus.png',
    name: 'version_manage',
    title: '版本管理',
    access: 0,
    component: Main,
    children: [{
            path: 'index',
            title: '版本管理',
            name: 'version_index',
            access: 0,
            component: () => import ('@/views/version-manage/versionManage.vue')
        }]
  },
  {
    path: '/userInfo',
    icon: 'videocamera',
    image: './static/images/user.png',
    images: './static/images/user_focus.png',
    name: 'userInfo',
    title: '账户管理',
    access: 0,
    component: Main,
    children: [{
            path: 'index',
            title: '账户管理',
            name: 'userInfo_index',
            access: 0,
            component: () => import ('@/views/userInfo/userInfo.vue')
        }]
  },
  // {
  //   path: '/component',
  //   icon: 'social-buffer',
  //   name: 'component',
  //   title: '组件',
  //   component: Main,
  //   children: [{
  //       path: 'text-editor',
  //       icon: 'compose',
  //       name: 'text-editor',
  //       title: '富文本编辑器',
  //       component: () =>
  //         import ('@/views/my-components/text-editor/text-editor.vue')
  //     },
  //     {
  //       path: 'md-editor',
  //       icon: 'pound',
  //       name: 'md-editor',
  //       title: 'Markdown编辑器',
  //       component: () =>
  //         import ('@/views/my-components/markdown-editor/markdown-editor.vue')
  //     },
  //     {
  //       path: 'draggable-list',
  //       icon: 'arrow-move',
  //       name: 'draggable-list',
  //       title: '可拖拽列表',
  //       component: () =>
  //         import ('@/views/my-components/draggable-list/draggable-list.vue')
  //     },
  //     {
  //       path: 'area-linkage',
  //       icon: 'ios-more',
  //       name: 'area-linkage',
  //       title: '城市级联',
  //       component: () =>
  //         import ('@/views/my-components/area-linkage/area-linkage.vue')
  //     },
  //     {
  //       path: 'file-upload',
  //       icon: 'android-upload',
  //       name: 'file-upload',
  //       title: '文件上传',
  //       component: () =>
  //         import ('@/views/my-components/file-upload/file-upload.vue')
  //     },
  //     {
  //       path: 'scroll-bar',
  //       icon: 'android-upload',
  //       name: 'scroll-bar',
  //       title: '滚动条',
  //       component: () =>
  //         import ('@/views/my-components/scroll-bar/scroll-bar-page.vue')
  //     },
  //     {
  //       path: 'count-to',
  //       icon: 'arrow-graph-up-right',
  //       name: 'count-to',
  //       title: '数字渐变',
  //       component: () =>
  //         import ('@/views/my-components/count-to/count-to.vue')
  //     },
  //     {
  //       path: 'split-pane-page',
  //       icon: 'ios-pause',
  //       name: 'split-pane-page',
  //       title: 'split-pane',
  //       component: () =>
  //         import ('@/views/my-components/split-pane/split-pane-page.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/form',
  //   icon: 'android-checkbox',
  //   name: 'form',
  //   title: '表单编辑',
  //   component: Main,
  //   children: [{
  //       path: 'artical-publish',
  //       title: '文章发布',
  //       name: 'artical-publish',
  //       icon: 'compose',
  //       component: () =>
  //         import ('@/views/form/article-publish/article-publish.vue')
  //     },
  //     {
  //       path: 'workflow',
  //       title: '工作流',
  //       name: 'workflow',
  //       icon: 'arrow-swap',
  //       component: () =>
  //         import ('@/views/form/work-flow/work-flow.vue')
  //     }
  //
  //   ]
  // },
  // {
  //   path: '/charts',
  //   icon: 'ios-analytics',
  //   name: 'charts',
  //   title: '图表',
  //   component: Main,
  //   children: [{
  //       path: 'pie',
  //       title: '饼状图',
  //       name: 'pie',
  //       icon: 'ios-pie',
  //       component: resolve => {
  //         require('@/views/access/access.vue')
  //       }
  //     },
  //     {
  //       path: 'histogram',
  //       title: '柱状图',
  //       name: 'histogram',
  //       icon: 'stats-bars',
  //       component: resolve => {
  //         require('@/views/access/access.vue')
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/tables',
  //   icon: 'ios-grid-view',
  //   name: 'tables',
  //   title: '表格',
  //   component: Main,
  //   children: [{
  //       path: 'dragableTable',
  //       title: '可拖拽排序',
  //       name: 'dragable-table',
  //       icon: 'arrow-move',
  //       component: () =>
  //         import ('@/views/tables/dragable-table.vue')
  //     },
  //     {
  //       path: 'editableTable',
  //       title: '可编辑表格',
  //       name: 'editable-table',
  //       icon: 'edit',
  //       component: () =>
  //         import ('@/views/tables/editable-table.vue')
  //     },
  //     {
  //       path: 'searchableTable',
  //       title: '可搜索表格',
  //       name: 'searchable-table',
  //       icon: 'search',
  //       component: () =>
  //         import ('@/views/tables/searchable-table.vue')
  //     },
  //     {
  //       path: 'exportableTable',
  //       title: '表格导出数据',
  //       name: 'exportable-table',
  //       icon: 'code-download',
  //       component: () =>
  //         import ('@/views/tables/exportable-table.vue')
  //     },
  //     {
  //       path: 'table2image',
  //       title: '表格转图片',
  //       name: 'table-to-image',
  //       icon: 'images',
  //       component: () =>
  //         import ('@/views/tables/table-to-image.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/advanced-router',
  //   icon: 'ios-infinite',
  //   name: 'advanced-router',
  //   title: '高级路由',
  //   component: Main,
  //   children: [{
  //       path: 'mutative-router',
  //       title: '动态路由',
  //       name: 'mutative-router',
  //       icon: 'link',
  //       component: () =>
  //         import ('@/views/advanced-router/mutative-router.vue')
  //     },
  //     {
  //       path: 'argument-page',
  //       title: '带参页面',
  //       name: 'argument-page',
  //       icon: 'android-send',
  //       component: () =>
  //         import ('@/views/advanced-router/argument-page.vue')
  //     }
  //   ]
  // },
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  preview,
  locking,
  ...appRouter,
  page500,
  page403,
  page404
]