<template>
    <div class="diary-details">
        <div style="width: 100%;height: 1px;background-color:#5a98d5" class="review-div" ></div>
        <p class="diary-title">日记详情
        <Button type="primary" @click="backPage" class="btn-cancel">返回</Button>
           
        </p>
        <Row class="diary-tb-bg">
            <Col span="4" class="diary-menu-bg">
                <div style="height: 100%;">
                <Menu :theme="theme3" active-name="2" width="auto" @on-select="menuSelected">
                    <MenuGroup v-model="data" >
                        <MenuItem name="2">
                            <Icon ></Icon>
                            识别人脸({{data.countYitu}})
														<!-- 2 -->
                        </MenuItem>
                        <MenuItem name="3">
                            <Icon ></Icon>
                            识别证件({{data.countYryd}})
														<!-- 3 -->
                        </MenuItem>
                        <MenuItem name="4">
                            <Icon ></Icon>
                            识别车牌({{data.countYcyd}})
														<!-- 4 -->
                        </MenuItem>
                        <MenuItem name="6" >
                            <Icon ></Icon>
                            上传视频({{data.videoCount}})
														<!-- 6 -->
                        </MenuItem>
                        <MenuItem name="5">
                            <Icon ></Icon>
                            上传图片({{data.picCount}})
														<!-- 5 -->
                        </MenuItem>
                        <MenuItem name="7">
                            <Icon ></Icon>
                            轨迹回放
                        </MenuItem> 
                        <MenuItem name="8">
                            <Icon ></Icon>
                            直播录像
                        </MenuItem> 
                        </MenuGroup>
                </Menu>
                </div>
            </Col>
            <Col span="20" >
            <div  v-show="videoShow" class="video_class">
              <DatePicker format="yyyy-MM-dd HH:mm:ss" type="date" class="review-dtatPocker" :clearable="false" v-model="dateTime"  @on-change="dateSelect"></DatePicker>
              <div class="video_title"></div>
              <div class="video_live">
                 <Menu style="width:200px" @on-select="liveUrl" :active-name="activeLive">
                   <!-- <Checkbox v-for="(item, index) in liveList" :key="index"> -->
                      <MenuItem :name="item.fileUrl" v-for="(item, index) in liveList" :key="index">{{item.title}}</MenuItem>
                   <!-- </Checkbox> -->
                </Menu>
                 <video-player
                  class="video-player vjs-custom-skin"
                  :options="playerOptions"
                  :playsinline ="true"
                  ref="videoPlayer"
                  @ended="onPlayEnded($event)"
                  >
                </video-player>
              </div>
            </div>
            <div v-show="tableShow">
                <div  style="margin-right: 10px" >
                    <Table :columns="diary_columns" :data="diary_data" @on-sort-change="sort" ></Table>
                </div>
                <div class="footer" style="float: right;">
                    <Page :total="total" :current="curPage" :page-size="10" size="small" @on-change="changePage" show-elevator ></Page>
                </div>
            </div>
            </Col>
            <div class="trackMap" v-show="showMap">
              <Col class="review-col">
                  <!-- <DatePicker format="yyyy-MM-dd" type="date" class="review-dtatPocker" :clearable="false" v-model="dateTime" @on-change="selectDate" :confirm="true" :options="option"></DatePicker> -->
                  <!-- <Calendar @choseDay="choseDay" @changeMonth="choseMonth"  :markDate=dateArr ></Calendar> -->
                  <!-- <Button type="primary" class="riview-btn" @click="trackBtn">显示轨迹</Button> -->
              </Col>
              <div id="map"  style="width:100%;height:100%; z-index:911"></div>
              <!-- <p class="close-icon" @click="hideMap">
                <img src="static/images/close_policeInfo.png">
              </p> -->
            </div>
        </Row>

        <Modal v-model="showVideo" :closable='true' :mask-closable=false :width="892" class="video_list" @on-visible-change="offVideo">
            <h3 slot="header" class="modal-header">{{urlName}}</h3>

            <!-- <video :src="videoUrl" autoplay controls loop ref="video"></video> -->
            <!-- <EasyPlayer :videoUrl="videoUrl" :autoplay="true"  class="video_style"  @ended="onplayerEnded" :live="true" loop></EasyPlayer> -->
            <video-player
            class="video-player vjs-custom-skin"
            :options="playerOptions"
            :playsinline ="true"
            ref="videoPlayer"
            @ended="onplayEnded($event)"
            @playing="onTimeupdate($event)"
            >
            </video-player>
            <!-- <div class="modalText">
                <label>视频名称： </label><span>{{urlName}}</span><br>
                <label>视频日期： </label><span>{{videoDate}}</span>
            </div> -->
            <p slot="footer"></p>
            <Menu :active-name="activeUrl" @on-select="videoName" style="width:200px">
              <MenuItem :name="item.url" v-for="(item, index) in videoList" :key="index">{{item.name}} <p class="video_time">{{item.time}}</p></MenuItem>
            </Menu>
        </Modal>
        <Modal v-model="showPic" :closable='true' :mask-closable=false :width="500" @on-visible-change="offVideo">
            <h3 slot="header" class="modal-header">上传图片</h3>

            <img :src="oldPic" :autoplay="true" preview="0"></img>
            <div class="modalText">
                <label>图片名称： </label><span>{{urlName}}</span><br>
                <label>图片日期： </label><span>{{imgDate}}</span>
            </div>
            <p slot="footer"></p>
        </Modal>
        <Modal v-model="showYcyd" :closable='true' :mask-closable=false :width="340" @on-visible-change="offVideo">
            <h3 slot="header" class="modal-header">识别车牌</h3>

            <div class="modal-photo">
                <img class="modal-photo-img" :src="oldPic" style="width:140px" preview="1"/>
            </div>

            <div style="color: #0e81e5;border-bottom: 1px solid #0e81e5;margin-top: 10px;">
                车主信息
            </div>
            <div class="modalText">
                <Row>
                    <Col span="8"><label>车牌号</label></Col>
                    <Col span="16"><span>{{ycyd.plateNum}}</span></Col>
                </Row>
                <Row>
                    <Col span="8"><label>姓名</label></Col>
                    <Col span="16"><span>{{ycyd.xm}}</span></Col>
                </Row>
                <Row>
                    <Col span="8"><label>住所地址</label></Col>
                    <Col span="16"><span>{{ycyd.zsxxdz}}</span></Col>
                </Row>
            </div>
            <div style="color: #0e81e5;border-bottom: 1px solid #0e81e5;margin-top: 10px;">
                违章信息
            </div>
            <div class="modalText">
                <Row>
                    <Col span="8"><label>违章处理机构</label></Col>
                    <Col span="16"><span>{{ycyd.wfCLJGMC ? ycyd.wfCLJGMC: '无'}}</span></Col>
                </Row>
                <Row>
                    <Col span="8"><label>违章地址</label></Col>
                    <Col span="16"><span>{{ycyd.wfWFDZ ? ycyd.wfWFDZ: '无'}}</span></Col>
                </Row>
                <Row>
                    <Col span="8"><label>违章时间</label></Col>
                    <Col span="16"><span>{{ycyd.wfWFSJ ? ycyd.wfWFSJ: '无'}}</span></Col>
                </Row>
                <Row>
                    <Col span="8"><label>处理时间</label></Col>
                    <Col span="16"><span>{{ycyd.wfCLSJ ? ycyd.wfCLSJ: '无'}}</span></Col>
                </Row>
            </div>
            <p slot="footer"></p>
        </Modal>
        <Modal v-model="showYryd" :closable='true' :mask-closable=false :width="340" @on-visible-change="offVideo">
            <h3 slot="header" class="modal-header">识别身份证</h3>

            <div class="modal-photo">
                <img class="modal-photo-img" :src="oldPic" style="width:150px" preview="2"/>
            </div>

            <div style="color: #0e81e5;border-bottom: 1px solid #0e81e5;margin-top: 10px;">
                人员信息
            </div>
            <div class="modalText">
                <Row>
                    <Col span="8"><label>姓名</label></Col>
                    <Col span="16"><span>{{yryd.xm}}</span></Col>
                </Row>
                <Row>
                    <Col span="8"><label>性别</label></Col>
                    <Col span="16"><span>{{yryd.xb}}</span></Col>
                </Row>
                <Row>
                    <Col span="8"><label>证件号码</label></Col>
                    <Col span="16"><span>{{yryd.zjhm}}</span></Col>
                </Row>
                <Row>
                    <Col span="8"><label>出生日期</label></Col>
                    <Col span="16"><span>{{yryd.csrq}}</span></Col>
                </Row>
            <!-- </div> -->
            <!-- <div style="color: #0e81e5;border-bottom: 1px solid #0e81e5;margin-top: 10px;">
                违章信息
            </div> -->
            <!-- <div class="modalText"> -->
                <Row>
                    <Col span="8"><label>上次来沪日期</label></Col>
                    <Col span="16"><span>{{yryd.sclhrq}}</span></Col>
                </Row>
                <!-- <Row>
                    <Col span="8"><label>人员身份标签</label></Col>
                    <Col span="16"><span>{{yryd.zdrysfbq ? yryd.zdrysfbq : "未知"}}</span></Col>
                </Row> -->
                <Row>
                    <Col span="8"><label>常用联系电话</label></Col>
                    <Col span="16"><span>{{yryd.cylxdh ? yryd.cylxdh : "未知"}}</span></Col>
                </Row>
                <Row>
                    <Col span="8"><label>国籍</label></Col>
                    <Col span="16"><span>{{yryd.gj}}</span></Col>
                </Row>
                <Row>
                    <Col span="8"><label>是否有在逃记录</label></Col>
                    <Col span="16"><span>{{yryd.sfyztkjl}}</span></Col>
                </Row>
                <!-- <Row>
                    <Col span="8"><label>是否有精神病史</label></Col>
                    <Col span="16"><span>{{yryd.sfyjsbs}}</span></Col>
                </Row> -->
                <Row>
                    <Col span="8"><label>联系地址</label></Col>
                    <Col span="16"><span>{{yryd.lxdz}}</span></Col>
                </Row>
            </div>
            <p slot="footer"></p>
        </Modal>
        <Modal v-model="showEtu" :closable='true' :mask-closable=false :width="340" :class="{EtuModal: isTrue}" @on-visible-change="offVideo">
            <h3 slot="header" class="modal-header">识别人脸</h3>
            <div class="modal-photo">

                <Row type="flex" align="middle" justify="center">
                    <Col span="7"><img class="modal-photo-img" preview="3" :src="newPics" style="width:75px; height:95px; border-radius:50%"/></Col>
                    <Col span="7">
                        <div class="similarity">
                            <span style="color: #2d8cf0;">{{etu.similarity_value ? Number(etu.similarity_value).toFixed(2) : 0}}%</span><br>
                            <span style="color: #DDDDDD;">相似度</span>
                        </div>
                    </Col>
                    <Col span="7"><img class="modal-photo-img" preview="3" :src="oldPic" style="width:75px; height:95px; border-radius:50%"/></Col>
                </Row>
            </div>

            <div class="modalText" style="margin-top: 20px;">
                <Row style="margin-top: 8px">
                    <Col span="8"><label>姓名</label></Col>
                    <Col span="16"><span>{{yryds.xm ? yryds.xm : '未知'}}</span></Col>
                </Row>
                <Row style="margin-top: 8px">
                    <Col span="8"><label>常用联系电话</label></Col>
                    <Col span="16"><span>{{yryds.cylxdh ? yryds.cylxdh : '未知'}}</span></Col>
                </Row>
                <Row style="margin-top: 8px">
                    <Col span="8"><label>上次来沪日期</label></Col>
                    <Col span="16"><span>{{yryds.sclhrq ? yryds.sclhrq : '未知'}}</span></Col>
                </Row>
                <Row style="margin-top: 8px">
                    <Col span="8"><label>身份标签</label></Col>
                    <Col span="16"><span>{{etu.repository_id ? etu.repository_id : "未知"}}</span></Col>
                </Row>
                <Row style="margin-top: 8px">
                    <Col span="8"><label>性别</label></Col>
                    <Col span="16"><span>{{yryds.xb ? yryds.xb : '未知'}}</span></Col>
                </Row>
                <Row style="margin-top: 8px">
                    <Col span="8"><label>出生日期</label></Col>
                    <Col span="16"><span>{{yryds.csrq ? yryds.csrq : '未知'}}</span></Col>
                </Row>
                <Row style="margin-top: 8px">
                    <Col span="8"><label>证件号码</label></Col>
                    <Col span="16"><span>{{yryds.zjhm ? yryds.zjhm : '未知'}}</span></Col>
                </Row>
                <Row style="margin-top: 8px">
                    <Col span="8"><label>国籍</label></Col>
                    <Col span="16"><span>{{yryds.gj ? yryds.gj : '未知'}}</span></Col>
                </Row>
                <Row style="margin-top: 8px">
                    <Col span="8"><label>联系地址</label></Col>
                    <Col span="16"><span>{{yryds.lxdz ? yryds.lxdz : '未知'}}</span></Col>
                </Row>

            </div>
            <p slot="footer"></p>
        </Modal>
        
        <Modal v-model="trackShow" :width="400" class="trackShow" @on-visible-change="offVideo">
          <p>{{trackText}}</p>
          <p slot="footer"></p>
        </Modal>

    </div>
</template>

<script>
    import { findRecordById, findRecordByLogId, trackReplay, getFileUrl, findRecordCounts, monthExist, findLive } from 'api'
    import { dateFmt, addRoadNetLayer } from '../../../libs/common'
    import Calendar from 'vue-calendar-component'
    import IMAP from "IMAP"
    export default {
      data () {
        return {
          dateArr: [],
          activeUrl: '',
          isTrue: false,
          map: null,
          line: null,
          tableShow: true,
          videoShow: false,
          activeLive: '',
          rtmpUrl: '',
          num: '2',
          curPage: 1,
          total: 0,
          id: '',
          pageIndex: 1,
          pageSize: 10,
          showVideo: false,
          showPic: false,
          showEtu: false,
          showYryd: false,
          showYcyd: false,
          showMap: false,
          oldUrl: '',
          userPic: '',
          oldPic: '',
          newPic: '',
          newPics : '',
          trackShow: false,
          trackText: '',
          theme3: 'dark',
          marker: null,
          videoUrl: '',
          data: {
            videoCount: '0',
            picCount: '0',
            countYitu: '0',
            countYryd: '0',
            countYcyd: '0',
            countLogin: '0'
          },
          dateTime:dateFmt(new Date),
          status: '0',
          ycyd: {},
          yryd: {},
          yryds: {},
          etu: {},
          pic: null,
          video: null,
          imgData: null,
          statusNum: '0',
          diary_columns: [
            {
              title: '序号',
              type: 'index',
              width: 80,
              align: 'center',
              render: (h, params) => h('span', params.index + (this.pageIndex - 1) * this.pageSize + 1)
            },
            {
              title: '设备号',
              key: 'deviceNum',
              align: 'center',
              ellipsis: true,
              width: 120,
              render: (h, params) => {
                return h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                },
                [
                  params.row.deviceNum,
                  h('span', {slot: 'content', style: {whiteSpace: 'nomal', wordBreak: 'break-all'}}, params.row.deviceNum)
                ])
              }
            },
            {
              title: '警号',
              key: 'policeNum',
              align: 'center',
              width: 120
            },
            {
              title: '警员姓名',
              key: 'policeName',
              align: 'center',
              width: 100
            },
            {
              title: '地址',
              key: 'address',
              align: 'center',
              ellipsis: true,
              render: (h, params) => {
                return h('Tooltip', {
                  props: {
                    placement: 'top',
                    transfer: true
                  }
                },
                [
                  params.row.address,
                  h('span', {slot: 'content', style: {whiteSpace: 'nomal', wordBreak: 'break-all'}}, params.row.address)
                ])
              }
              // tooltip: true,
            },
            {
              title: '操作时间',
              key: 'createDate',
              align: 'center',
              sortable: 'custom',
            },
            // {
            //   title: '状态',
            //   key: 'status',
            //   align: 'center',
            //   width: 100,
            //   renderHeader: (h, params) => {
            //     return h('Select', {
            //       props: {
            //         type: '',
            //         value: '2'
            //       },
            //       on: {
            //         'on-change': (num) => {
            //           this.pageIndex = 1
            //           this.statusNum = num === '2' ? '' : num === '0' ? '0' : num === '1' ? '1': ''
            //           this.getRecordId()
            //           this.getCount()
            //           this.curPage = 1
            //         }
            //       }
            //     },
            //     [
            //       h('Option', {
            //         props: {
            //           value: '2'
            //         }
            //       },'全部'),
            //       h('Option', {
            //         props: {
            //           value: '0'
            //         }
            //       },'成功'),
            //       h('Option', {
            //         props: {
            //           value: '1'
            //         }
            //       }, '失败')
            //     ])
            //   }
            // },
            {
              title: '结果',
              key: 'result',
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
                        this.showDetail(params.index, params.row)
                      }
                    }
                  }, '查看')
                ])
              }
            }
          ],
          diary_data: [],
          logId: '',
          recordInfo: null,
          lngLatArr: [],
          lng: '121.455536',
          lat: '31.249452',
          index: '',
          videoDate: '',
          imgDate: '',
          orderBy: 'desc',
          urlName: '',
          videoList: [],
          playerOptions: {
            playbackRates: [0.7, 1.0, 1.5, 2.0],
            autoplay: true,
            muted: false,
            preload: 'auto',
            language: 'zh-CN',
            fluid: true,
            sources: [{
              type: 'video/mp4',
              src: ''
            }],
            poster: '',
            width: document.documentElement.clientWidth,
            notSupportedMessage: '视频损坏,无法播放', //允许覆盖video.js无法播放视频时显示的默认信息
            controlBar: {
              timeDivider: true,
              durationDisplay: true,
              fullscreenToggle: true,
              remainingTimeDisplay: false
            }
          },
          videoTime: '',
          videoIndex: '',
          date:new Date().getFullYear() + '-' + (new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)),
          zoom: 16,
          liveList: [{
            title:'暂无视频',
            fileUrl: ''
          }],
          timeId: ''
        }
      },
      
      created () {
        // console.log(this.date)
        this.recordInfo = JSON.parse(localStorage.getItem('recordInfo'))
        // console.log(this.recordInfo)
        this.id = this.recordInfo.id
        this.getRecordId()
        this.getCount()
        this.timeId =  setInterval(() => {
            this.getRecordId()
            this.getCount()

          },2500)
        this.getmonthExist()
        // this.dateTime = 
      },
      mounted () {
        // console.log(this.dateTime)
        // this.initMap()
      },
      methods: {
        choseDay(val) {
          // console.log(val)
          const arr = val.split('/')
           arr[1] = arr[1] > 9 ? arr[1] : '0' + arr[1]
           arr[2] = arr[2] > 9 ? arr[2] : '0' + arr[2]
           this.dateTime = arr[0] + '-' + arr[1] + '-' + arr[2]
           console.log(this.dateArr)
          console.log(this.dateTime)
          if (this.dateArr.length == 0) {
            this.trackShow = true
            this.trackText = '暂无轨迹查询'
            this.map.getOverlayLayer().removeOverlay(this.line);
            this.map.getOverlayLayer().removeOverlay(this.marker);
            this.line = null
            this.marker = null
            this.map.setCenter(new IMAP.LngLat(121.455536, 31.249452))
          } else {
            // console.log(this.dateArr.indexOf(this.dateTime))
            let index = this.dateArr.indexOf(this.dateTime)
            if (index > -1) {
              this.trackBtn()
            } else {
              this.trackShow = true
              this.trackText = '暂无轨迹查询'
              this.map.getOverlayLayer().removeOverlay(this.line);
              this.map.getOverlayLayer().removeOverlay(this.marker);
              this.line = null
              this.marker = null
              this.map.setCenter(new IMAP.LngLat(121.455536, 31.249452))
            }
          }
        },
        choseMonth(val) {
          const arr = val.split('/')
          arr[1] = arr[1] > 9 ? arr[1] : '0' + arr[1]
          this.date = arr[0] + '-' + arr[1]
          this.getmonthExist()
        },
        getmonthExist () {
          monthExist({
            policeNum: this.id,
            month: this.date
          }).then(res => {
            if( res.data.success) {
              this.dateArr = res.data.obj
              // console.log(this.dateArr)
            }
          })
        },
        sort (val) {
          console.log(val)
          this.orderBy = val.order == 'normal' ? '' : val.order
          // this.orderBy = this.orderBy === 'asc' ? '' : this.orderBy
          this.getRecordId()
          this.getCount()
        },
        // 地图初始化
        initMap () {
          this.map = new IMAP.Map("map", {
            minZoom: 3,
            maxZoom: 20,
            zoom: this.zoom,
            center: new IMAP.LngLat(this.lng, this.lat),
            animation: true
          })
        },
        // 根据警号获取该人员所有日志信息
        getRecordId () {
          findRecordById({
            id: this.id,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            type: this.num,
            status: this.statusNum,
            // regionId: this.recordInfo.regionId,
            startDate: this.recordInfo.startDate,
            endDate: dateFmt(new Date()),
            orderBy: this.orderBy
          }).then(res => {
            // console.log(res.data.obj)
            if (res.data.success) {
              this.total = res.data.total
              this.diary_data = res.data.obj.map(item => {
                return {
                  deviceNum: item.helmetId,
                  policeNum: item.policeNum,
                  address: item.address,
                  createDate: dateFmt(item.date),
                  status: item.status === '0' ? '成功' : item.status === '1' ? '失败' : '',
                  id: item.id,
                  policeName: this.recordInfo.policeNames,
                  operation: item.operation
                }
              })
              this.diary_data = this.diary_data.filter(item => {
                return item.status == '成功'
              })
              // console.log(this.diary_data)
              // res.data.obj.forEach(item => {
              //   for (let key in this.data) {
              //     this.data[key] = item[key]
              //   }
              // })
            }
          })
        },
        getCount() {
          findRecordCounts({
            policeNum: this.id,
            startDate: this.recordInfo.startDate,
            endDate: dateFmt(new Date()),
            status: this.statusNum,
            type: '3'
          }).then(res => {
            // console.log(res.data.obj)
            res.data.obj.forEach(item => {
              // console.log(item.operation, item.countNum)
              if (item.operation == '2') {
                this.data.countYitu =  item.countNum ? item.countNum : 0
              } else if (item.operation == '3') {
                this.data.countYryd =  item.countNum ? item.countNum : 0
              } else if (item.operation == '4') {
                this.data.countYcyd =  item.countNum ? item.countNum : 0
              } else if (item.operation == '5') {
                this.data.picCount =  item.countNum ? item.countNum : 0
              } else if (item.operation == '6') {
                this.data.videoCount =  item.countNum ? item.countNum : 0
              }
            })
          })
        },
        // 根据日志类型选择
        findRecordLogIds () {
          findRecordByLogId({
            type: this.num, //this.num
            logId: this.logId //this.logId
          }).then(res => {
            // console.log(res.data.obj)
              if (this.num === '4') {
                this.oldPic = ''
                this.ycyd = ''
                if (!res.data.obj.ycydData) return
                this.ycyd = res.data.obj.ycydData
                this.userPic = this.ycyd.urlPath
              } else if (this.num === '3') {
                this.oldPic = ''
                this.yryd = ''
                if (!res.data.obj.yrydData) return
                this.yryd = res.data.obj.yrydData
                this.userPic = this.yryd.urlPath
              } else if (this.num === '2') {
                this.oldPic = ''
                this.newPics = ''
                this.etu = ''
                this.yryds = ''
                if (!res.data.obj.etuMessage) return
                
                this.etu = res.data.obj.etuMessage
                // console.log(this.etu.repository_id)
                if (this.etu.repository_id == '追逃人员' || this.etu.repository_id == "在逃人员" ) {
                  this.isTrue = true
                } else {
                  this.isTrue = false
                }
                this.userPic = this.etu.primaryPic
                this.getFileUrls(this.userPic)
                this.newPic = this.etu.user_image
                getFileUrl({
                  fileName: this.newPic
                }).then(res => {
                  this.newPics = res.data.obj
                })
                if (!res.data.obj.etuMessage.yrydData) return
                this.yryds = this.etu.yrydData
                // console.log(this.etu.yrydData)
              } else if (this.num === '5') {
                this.imgData = res.data.obj.helmetDataRecord
                this.imgDate = dateFmt(this.imgData.createDate)
                this.userPic = this.imgData.dataUri
                this.urlName = this.imgData.title ? this.imgData.title : this.imgData.dataUri
              } else if (this.num === '6') {
                this.video = res.data.obj.helmetDataRecord
                this.videoDate = dateFmt(this.video.createDate)
                this.userPic = this.video.dataUri + '.mp4'
                this.urlName = this.video.title ? this.video.title : this.video.dataUri
              }
              this.getFileUrls(this.userPic)
            // }
          })
        },
        // 点击菜单选择
        menuSelected (name) {
          this.oldPic = ''
          this.newPics = ''
          if (name == '7') {
            this.playerOptions.sources[0].src = ''
            this.showMap = true
            this.videoShow = false
            this.tableShow = false
            if (this.map) {

            } else {
              setTimeout(() => {
                this.initMap()
                addRoadNetLayer(this.map)
              },200)
            }
          } else if (name == '8') {
            this.videoShow = true
            this.tableShow = false
            this.pageShow = false
            this.showMap = false
            this.getFindLive()
          } 
          else {
            this.playerOptions.sources[0].src = ''
            this.videoShow = false
            this.pageShow = true
            this.tableShow = true
            this.showMap = false
            this.pageIndex = 1
            this.num = name
            this.curPage = 1
            this.getRecordId()
          }
        },
        // 翻页
        changePage (page) {
          this.curPage = page
          this.pageIndex = page
          this.getRecordId()
          this.getCount()
          // console.log(page)
          // console.log(this.curPage)
        },
        // 查看选项
        showDetail (index, row) {
          this.logId = row.id
          this.num = row.operation
          // console.log(row)
          this.status = row.status == '成功' ? '0' : row.status == '失败' ? '1' : ''
          if (this.status == '1') {
            return
          }
          this.findRecordLogIds()
          if (this.num === '6') {
            this.showVideo = true
          } else if (this.num === '5') {
            this.showPic = true
          } else if (this.num === '2') {
            this.showEtu = true
          } else if (this.num === '3') {
            this.showYryd = true
          } else if (this.num === '4') {
            this.showYcyd = true
          }
        },
        // 获取图片
        getFileUrls (userPic) {
          // console.log(userPic)
          getFileUrl({
            fileName: userPic
          }).then(res => {
            if (res.data.success) {
              if (this.num == 6) {
                this.videoList = res.data.obj
                this.videoList = this.videoList.map(item => {
                  return {
                    url: item.url,
                    name: item.name.substring(item.name.lastIndexOf('_') + 1, item.name.length )
                  }
                })
                this.playerOptions.sources[0].src = res.data.obj[0].url
                this.$nextTick(() => {
                  this.activeUrl = res.data.obj[0].url
                })
              } else {
                this.oldPic = res.data.obj
              }
            }
          })
        },
        // 关闭地图
        hideMap () {
          this.showMap= false
          this.toggleStopMove()
        },
        // 轨迹划线
        togglePlayback () {
          if (this.map) {
            if (!this.marker) {
              var opts = new IMAP.MarkerOptions()
              opts.anchor = IMAP['Constants']['BOTTOM_CENTER']
              opts.icon = new IMAP.Icon('../../../../static/images/menuIcon_helment_focus.png', {'size':new IMAP.Size(28,28)})
              const lnglat = new IMAP.LngLat(this.lng, this.lat)
              if (lnglat) {
                this.marker = new IMAP.Marker(lnglat, opts)
                this.map.getOverlayLayer().addOverlay(this.marker, true)
                // this.marker.setAngleOffsetX(52 / 2)
                // this.marker.setAnchor(IMAP.Constants.TOP_CENTER)
                this.marker.setOffset(new IMAP.Pixel(-5, 0))
              }
            }
            let path = []
            let lnglat
            for (var i = 0,l= this.lngLatArr.length; i < l; ++i) {
              lnglat = this.lngLatArr[i].split(',')
              if (lnglat.length == 2) {
                path.push(new IMAP.LngLat(lnglat[0], lnglat[1]))
              } else {
                path = []
                break
              }
            }
            this.map.setBestMap(path)
            if (this.line) {
              this.line.setPath(path)
            }else{
              this.line = new IMAP.Polyline(path, {strokeColor:'#ff0000', arrow: true})
              this.map.getOverlayLayer().addOverlay(this.line)
            }
            this.marker.moveAlong(path, 1, false, true)
          }
        },
        // 轨迹停止运动
        toggleStopMove() {
          if(this.marker){
            this.marker.stopMove()
          }
        },
        // 查询轨迹
        trackBtn () {
          trackReplay({
            userName: this.id,
            findDate: this.dateTime,
          }).then(res => {
            // console.log(res.data)
            if (res.data.success) {
              this.lngLatArr = res.data.obj
              // console.log(this.lngLatArr[0])
              this.lng = this.lngLatArr[0].split(',')[0]
              this.lat = this.lngLatArr[0].split(',')[1]
              this.togglePlayback()
            } else {
              this.trackShow = true
              this.trackText = res.data.msg
            }
          })
        },
        // 返回按钮
        backPage () {
          this.$router.push({
            name: 'review_index',
            params: {
              stations: this.$store.state.station.reviewInfo.stations,
              policeName: this.$store.state.station.reviewInfo.policeName,
              startDate: this.$store.state.station.reviewInfo.startDate,
              userName: this.$store.state.station.reviewInfo.userName,
              endDate: this.$store.state.station.reviewInfo.endDate,
              regionId: this.$store.state.station.reviewInfo.regionId,
              pageIndex: this.$store.state.station.reviewInfo.pageIndex,
              curPage: this.$store.state.station.reviewInfo.curPage
            }
          })
        },
        offVideo (val) {
          if (!val) {
            this.playerOptions.sources[0].src = ''
            this.videoList = []
            this.newPics = ''
            this.oldPic = ''
          }
        },
        onplayEnded () {
          this.videoIndex = this.videoList.findIndex(item =>item.url == this.playerOptions.sources[0].src)
          if (this.videoIndex == this.videoList.length - 1) {
            // this.playerOptions.sources[0].src = this.videoList[0].url
            // this.activeUrl = this.videoList[0].url
            // this.$refs.videoPlayer.pause()
          } else {
            this.playerOptions.sources[0].src = this.videoList[this.videoIndex + 1].url
            this.activeUrl = this.videoList[this.videoIndex + 1].url
          }
        },
        videoName (name) {
          // console.log(this.playerOptions.sources[0].src)
          this.playerOptions.sources[0].src = name
        },
        onTimeupdate (e) {
          let str = e.cache_.duration.toString()
          str = str.indexOf('.') > 0 ? str.substring(0, str.indexOf('.') ) : str
          let m = parseInt((parseInt(str) / 60)) > 9 ? parseInt((parseInt(str) / 60)) : '0' + parseInt((parseInt(str) / 60))
          let s = (parseInt(str) % 60) > 9 ? (parseInt(str) % 60) : '0' + (parseInt(str) % 60)
          str = m + ':' + s
          this.videoTime = str
          let index = this.videoList.findIndex(item => item.url == e.cache_.src)
          if (index < 0 ) return
          this.$nextTick(() => {
            this.$set(this.videoList[index], 'time', this.videoTime)
          })
        },
        getFindLive() {
          findLive({
            policeNum: this.id,
            platDate: dateFmt(this.dateTime)
          }).then(res => {
            // console.log(res.data.obj)
            if (res.data.success) {
              this.liveList = res.data.obj
              this.playerOptions.sources[0].src = this.liveList[0].fileUrl
              this.$nextTick(() => {
                this.activeLive = this.liveList[0].fileUrl
              })
            }
          })
        },
        dateSelect (val) {
          this.playerOptions.sources[0].src = ''
          this.liveList = [{
            title: '暂无视频',
            fileUrl: ''
          }]
          this.dateTime = val
          this.getFindLive()
        },
        liveUrl (val) {
          this.playerOptions.sources[0].src = val
        },
        onPlayEnded (e) {
          let index = this.liveList.findIndex(item => item.fileUrl == this.playerOptions.sources[0].src)
          this.playerOptions.sources[0].src = this.liveList[index + 1].fileUrl
          this.activeLive = this.playerOptions.sources[0].src
        }
      },
      components: {
        // EasyPlayer,
        Calendar,
      },
      destroyed() {
        clearInterval(this.timeId)
      }
    }
</script>
<style lang="less">
    @import 'diary-details.less';
</style>
<style lang="less">
  .trackShow.v-transfer-dom {
    .ivu-modal-wrap {
      .ivu-modal {
        background-color: #041A2F;
        top: 200px;
        box-shadow: 0px 0px 5px 2px #0E4174;
        .ivu-modal-content {
          overflow: hidden;
          // height: 220px;
          // background-color: #041A2F;
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
            p {
              padding-bottom: 20px;
              color: #fff;
              text-align: center;
              font-size: 16px;
            }
          }
          .ivu-modal-footer {
            padding:0;
            border: none;
            width: 100%;
            margin-top: 40px;
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
</style>


