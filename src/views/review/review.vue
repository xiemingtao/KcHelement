<template>
    <div class="review">
        <div style="width: 100%;height: 1px;background-color:#5a98d5" ></div>
        <p class="review-title">执勤记录</p>
        <!--工具条-->
         <div class="review-header" style="margin-bottom: 20px">
              <Button type="primary" class="riview-btn" @click="resetBtn" v-show="resetShow">重置</Button>
              <Button type="primary" style="margin-left: 10px;margin-right: 10px; float:right" @click="searchAction">查询</Button>
              <input v-model="searchTxt" placeholder="请输入警号" class="searchClass" style="float:right;margin-left:10px" @keyup.enter="searchAction"></input>
              <!-- <Button type="primary" class="riview-btn" @click="search">搜索</Button> -->
             <Row style="float: right;child-align: right" class="iconDate">
                 <Col class="review-col">
                     <DatePicker v-model="eDate" format="yyyy-MM-dd HH:mm:ss" type="datetime" class="review-dtatPocker" @on-change="changeEnd" :clearable="false"></DatePicker>
                 </Col>
                 <Col style="float: right" >
                     <p style="margin-right: 6px;text-align: center;line-height:32px;color: #DDDDDD">至</p>
                 </Col>
                 <Col style="float: right" >
                     <DatePicker v-model="sDate" format="yyyy-MM-dd HH:mm:ss" type="datetime" class="review-dtatPocker" @on-change="changeStart" :clearable="false"></DatePicker>
                 </Col>
             </Row>
             
             <div style="float:right">
                <!-- <areaCommon @getRegionId="getRegionId"  v-model="resetData" ></areaCommon> -->
                 <Select v-model="policeName" class="select-item" @on-change="onChangeArea" v-show="hideRegion" style="margin-right:0px;" clearable placeholder="请选择分局" filterable >
                  <Option v-for="item in policeList" :value="item.id" :key="item.id" >{{item.name}}</Option>
                </Select>
                <Select v-model="stations" placeholder="请选择派出所" class="select-item" @on-change="onChangeId" v-show="hideRegionChild"  clearable :filterable="filterShow" style="margin-left:10px; margin-right:10px;" ref="secLevel" >
                  <Option v-for="item in policeStation" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select>
             </div>
         </div>

        <Table :columns="t_columns" :data="kc_data">
        </Table>
           <Spin fix v-show="loading">
            <Icon type="load-a" class="demo-spin-icon-load"></Icon>
            <div>数据加载中</div>
          </Spin>
        <div class="footer" style="float: right;">
            <Page :total="total" :current="curPage" :page-size="10" size="small" @on-change="changePage" show-elevator></Page>
        </div>

    </div>
</template>

<script>
    import { findRecordList, findRecordCounts, getOrgList, getOrgName } from 'api'
    import { dateFmt } from '../../libs/common'
    import areaCommon from '../areaList/areaList'
    export default {
      data () {
        return {
          filterShow: false,
          pageIndex: this.$route.params.pageIndex ? this.$route.params.pageIndex : 1,
          loading: true,
          curPage: this.$route.params.curPage ? this.$route.params.curPage : 1,
          pageSize: 10,
          total: 0,
          resetData: '1',
          sDate: this.$route.params.startDate ? this.$route.params.startDate :  dateFmt(new Date().getTime() - 31 * 24 * 3600 * 1000),
          eDate: this.$route.params.endDate ? this.$route.params.endDate : dateFmt(new Date()),
          regionId: this.$route.params.regionId ? this.$route.params.regionId : JSON.parse(sessionStorage.getItem('regionId')),
          t_columns: [
            {
              title: '序号',
              width: 80,
              align: 'center',
              render: (h, params) => h('span', params.index + (this.pageIndex - 1) * this.pageSize + 1)
            },
            // {
            //   title: '设备号',
            //   key: 'deviceNum',
            //   align: 'center'
            // },
            {
              title: '警号',
              key: 'policeNum',
              align: 'center'
            },
            {
              title: '警员姓名',
              key: 'policeName',
              align: 'center'
            },
            {
              title: '所属组织',
              key: 'regionName',
               align: 'center'
            },
            {
              title: '上传视频',
              key: 'videoCount',
              width: 100,
              align: 'center'
            },
            {
              title: '上传图片',
              key: 'picCount',
              width: 100,
              align: 'center'
            },
            {
              title: '识别人脸',
              key: 'countYitu',
              width: 100,
              align: 'center'
            },
            {
              title: '识别证件',
              key: 'countYryd',
              width: 120,
              align: 'center'
            },
            {
              title: '识别车牌',
              key: 'countYcyd',
              width: 100,
              align: 'center'
            },
            // {
            //   title: '其他',
            //   key: 'countLogin',
            //   width: 80,
            //   align: 'center'
            // },
            {
              title: '操作',
              key: 'operation',
              align: 'center',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color: '#9ac6e3',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.goDiary(params.row)
                      }
                    }
                  }, '查看详情')
                ])
              }
            }
          ],
          kc_data: [],
          searchTxt: this.$route.params.userName ? this.$route.params.userName : '',
          resetShow: true,
          policeNums: [],
          policeList: [],
          policeStation: [],
          name: JSON.parse(sessionStorage.getItem('user')).organizationName,
          userLevel: JSON.parse(sessionStorage.getItem('user')).userLevel,
          hideRegion: true,
          hideRegionChild: true,
          policeName: this.$route.params.policeName ? this.$route.params.policeName : '',
          stations: this.$route.params.stations ? this.$route.params.stations : '',
          stationId: ''
        }
      },
      created () {
        // this.regionId = JSON.parse(sessionStorage.getItem('regionId'))
        this.findDeviceRecord()
        if (JSON.parse(sessionStorage.getItem('user') || {}).userLevel === '2') {
          this.resetShow = false
        }
        if (this.name === '超级管理员') {
          this.name = '上海市公安局'
        }
        this.getOrgLists()
      },
      methods: {
        // 查询设备列表
        findDeviceRecord () {
          let param = {
            startDate: dateFmt(this.sDate),
            endDate: dateFmt(this.eDate),
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            regionId: this.regionId,
            userName: this.searchTxt.trim()
          }
          findRecordList(param).then(res => {
            let deviceInfo
            if (res.data.success) {
              this.policeNums = []
              this.loading = false
              this.total = res.data.total
              deviceInfo = res.data.obj
              deviceInfo.forEach(item => {
                this.policeNums.push(item.policeNum)
              })
              this.policeNums = this.policeNums.join(',')
              this.getCounts(deviceInfo)
            }
          })
        },
        // 获取数量
        getCounts(deviceInfo) {
          let deviceCount
          findRecordCounts({
            startDate: dateFmt(this.sDate),
            endDate: dateFmt(this.eDate),
            policeNum: this.policeNums,
            status: 0
          }).then(res => {
            deviceCount = res.data.obj
            deviceInfo.forEach(item => {
              deviceCount.forEach(ele => {
                if (item.policeNum === ele.policeNum) {
                  if (ele.operation === '2') {
                    this.$set(item, 'countYitu', ele.countNum)
                  }
                  if (ele.operation === '3') {
                    this.$set(item, 'countYryd', ele.countNum)
                  }
                  if (ele.operation === '4') {
                    this.$set(item, 'countYcyd', ele.countNum)
                  }
                  if (ele.operation === '5') {
                    this.$set(item, 'picCount', ele.countNum)
                  }
                  if (ele.operation === '6') {
                    this.$set(item, 'videoCount', ele.countNum)
                  }
                }
              })
            })
            this.kc_data = deviceInfo.map(item => {
              return {
              countYcyd: item.countYcyd ? item.countYcyd : 0,
              countYitu: item.countYitu ? item.countYitu : 0,
              countYryd: item.countYryd ? item.countYryd : 0,
              policeNum: item.policeNum,
              parentId: item.parentId,
              regionId: item.regionId,
              policeName: item.policeName,
              regionName: (item.parentName ? item.parentName : '') + (item.regionName ? item.regionName : ''),
              videoCount: item.videoCount ? item.videoCount : 0,
              picCount: item.picCount ? item.picCount : 0
              }
            })
          })
        },
        // 翻页
        changePage (page) {
          this.curPage = page
          this.pageIndex = page
          this.findDeviceRecord()
          // console.log('page==============' + page)
        },
        search  () {
          this.loading = true
          this.curPage = 1
          this.pageIndex = 1
          this.findDeviceRecord()
        },
        // 查看详情
        goDiary (row) {
          // console.log(row)
          this.$store.commit('getReviewInfo', {
            stations: this.stations,
            policeName: this.policeName,
            startDate: dateFmt(this.sDate),
            userName: this.searchTxt.trim(),
            endDate: dateFmt(this.eDate),
            regionId: this.regionId,
            pageIndex: this.pageIndex,
            curPage: this.curPage,
            id: row.policeNum,
            policeNames: row.policeName
          })
          // localStorage.setItem('recordInfo', JSON.stringify({
          //   id: row.policeNum,
          //   startDate: dateFmt(this.sDate),
          //   endDate: dateFmt(this.eDate), 
          //   policeName: row.policeName,
          //   regionId: this.regionId
          // }))
          this.$router.push({
            name: 'diarydetails_index'
          })
        },
        // 开始时间
        changeStart (v) {
          this.sDate = v
        },
        // 结束时间
        changeEnd (v) {
          this.eDate = v
        },
        // 重置
        resetBtn () {
          this.pageIndex = 1
          this.curPage = 1
          this.loading = true
          this.regionId = JSON.parse(sessionStorage.getItem('regionId'))
          this.sDate = dateFmt(new Date().getTime() - 31 * 24 * 3600 * 1000)
          this.eDate = dateFmt(new Date())
          this.policeName = ''
          this.policeStation = []
          this.searchTxt = ''
          this.findDeviceRecord()
        },
        // 动态修改regionId
        // getRegionId (id) {
        //   this.regionId = id
        // },
        // 模糊查询
        searchAction () {
          this.curPage = 1
          this.pageIndex = 1
          this.findDeviceRecord()
        },
         getOrgLists () {
          getOrgName({
            name: this.name
          }).then(res => {
            this.id = res.data.obj[0].id
            // console.log(this.id)
            // this.$emit('getRegionId', this.id)
            sessionStorage.setItem('regionId', JSON.stringify(this.id))
            if (this.userLevel === '2') {
              this.policeStation = res.data.obj
              this.hideRegion = false
              this.hideRegionChild = false
            } else if (this.userLevel === '1') {
              // this.hideRegion = false
              this.policeList = res.data.obj
              this.policeStation = res.data.obj[0].children
            } else if (this.userLevel === '0' || this.userLevel === '9') {
              this.policeList = res.data.obj[0].children
              const childList = this.policeList.find(item => item.id === this.policeName)
              if (!childList) return
              this.policeStation = childList.children
            }
          })
        },
        onChangeArea (id) {
          this.policeName = id
          if (!id) {
            this.policeStation = []
            this.stationId = 16
            this.regionId = 16
            this.$refs.secLevel.clearSingleSelect()
            return
          }
          this.stationId = id
          this.regionId = id
          const childList = this.policeList.find(item => item.id == id)
          if (!childList) return
          this.policeStation = childList.children
          if (this.policeStation.length == 0) {
            this.$refs.secLevel.setQuery('')
            this.filterShow = false
          } else {
            this.filterShow = true
          }
        },
        onChangeId (id) {
          this.stations = id
          if (!id) {
            id = this.stationId
          }
          this.regionId = id
        }
      },
      watch: {
        searchTxt (val) {
          if (!val) {
            this.findDeviceRecord()
          }
        }
      },
      components: {
        areaCommon
        }
    }
</script>

<style lang="less">
    @import 'review.less';
</style>
<style lang="less">
  .review {
    .review-header {
      .iconDate {
        .dtatPocker {
          .ivu-date-picker-rel {
            .ivu-input-wrapper {
              .ivu-icon {
                line-height: 0;
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
</style>

