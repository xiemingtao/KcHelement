<template> 
  <div class="breadcast">
        <div class="videoLoading demo-spin-col" v-show="loadingShow">
          <Spin>
            <Icon type="load-a" class="demo-spin-icon-load" size="50" color="#fff"></Icon>
            <div>视频加载中</div>
          </Spin>
        </div>
    <div class="breadcastWrap">
      <div class="videoWrap" v-for="item in videoPlayer" :key="item.id">
        <EasyPlayer :videoUrl="`rtmp://121.43.163.20:10085/hls/${item.liveId}`" live :autoplay="true" :muted="true" :videoTitle="item.policeName"></EasyPlayer>
      </div>
    </div>
    <div class="mapWrap">
      <div id="map"></div>
      <div class="searchWrap">
        <input class="searchTxt" type="text" placeholder="请输入地点位置" @keydown.enter="searchBtn" @input="searchBtn" v-model="searchTxt">
        <input class="searchBtn" type="button" value="搜索" @click="searchBtn" />
        <div id="suggestId" style="position: absolute;background-color: #fff;border: 1px solid #028de8;visibility: visible; min-width: 151px; display: none;"></div>
      </div>
    </div>
    <!-- <template> -->
      <div class="menuLists" v-show="menuListsShow">
        <Menu theme="light" width="180" @on-select="change" @on-open-change="changes" icon=" ">
            
          <Submenu :name="item.id" v-for="item in policeList" :key="item.id" icon=" ">
            <template slot="title">{{item.name}} <p class="number">{{item.devNumber}}</p></template>
            <MenuItem :name="dates.deviceNum" v-for="dates in item.childrenDevlist" :key="dates.id">{{dates.policeName}}
            <img src="../../../static/images/top_police.png" />
              <p class="btns">
                <button @click.stop="endBtn(dates)" v-show="dates.liveStatus !== '0'">关闭直播</button>
                <button @click.stop="startBtn(dates)" v-show="dates.liveStatus === '0'">开启直播</button>
              </p>
            </MenuItem>
            <Submenu :name="ele.id" v-for="ele in item.children" :key="ele.id" icon=" ">
              <template slot="title">{{ele.name}} <p class="number">{{ele.devNumber}}</p></template>
              <MenuItem :name="date.deviceNum" v-for="date in ele.childrenDevlist" :key="date.id">{{date.policeName}}
              <img src="../../../static/images/top_police.png" />
                <p class="btns">
                  <button @click.stop="endBtn(date)" v-show="date.liveStatus !== '0'">关闭直播</button>
                  <button @click.stop="startBtn(date)" v-show="date.liveStatus === '0'">开启直播</button>
                </p>
              </MenuItem>
            </Submenu>
          </Submenu>
        </Menu>
      </div>
        <Button class="switch" :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
          <Icon type="navicon" size="32"></Icon>
        </Button>
      <!-- <devOnline ></devOnline> -->
      <!-- </template> -->
      <!-- <button class="switch" v-show="switchShow" @click="onMeunList">
        打开面板
      </button> -->
  </div>
</template>

<script>
import IMAP from 'IMAP'
import EasyPlayer from 'easy-player'
import { addRoadNetLayer } from '../../libs/common'
import { findDevOnline, pushCommand, getOrgList, getOrgName } from 'api'
import devOnline from './component/devOnline.vue'
function spliceFromOri (oriArr, tarArr) {
  const resArr = []
  for (let i = 0; i < oriArr.length; i++) {
    let flag = true
    for (let j = 0; j < tarArr.length; j++) {
      if (oriArr[i].id === tarArr[j].id) {
        flag = false
      }
    }
    if (flag) {
      resArr.push(oriArr[i])
      oriArr.splice(i--, 1)
    }
  }
  return resArr
}

function splice (oriArr, tarArr) {
  const resArr = []
  for (let i = 0; i < oriArr.length; i++) {
    let flag = true
    for (let j = 0; j < tarArr.length; j++) {
      if (oriArr[i].id === tarArr[j].id) {
        flag = false  
      }
    }
    if (flag) {
      resArr.push(oriArr[i])
    }
  }
  return resArr
}

function addToOri (oriArr, tarArr) {
  for (let i = 0; i < tarArr.length; i++) {
    let flag = true
    for (let j = 0; j < oriArr.length; j++) {
      if (tarArr[i].id === oriArr[j].id) {
        flag = false
      }
    }
    if (flag) {
      oriArr.push(tarArr[i])
    }
  }
}

function updateOri (oriArr, tarArr) {
  for (let i = 0; i < oriArr.length; i++) {
    for (let j = 0; j < tarArr.length; j++) {
      if (oriArr[i].id === tarArr[j].id) {
        oriArr[i].latitude = tarArr[j].latitude
        oriArr[i].longitude = tarArr[j].longitude
        oriArr[i].liveStatus = tarArr[j].liveStatus
      }
    }
  }
}

function updateLive (oriArr, tarArr) {
  for (let i = 0; i < oriArr.length; i++) {
    for (let j = 0; j < tarArr.length; j++) {
      if (oriArr[i].id === tarArr[j].id) {
        if (oriArr[i].liveId === tarArr[j].liveId) {
          if (oriArr[i].liveStatus !== '0') {
            // console.log(tarArr[j].liveStatus)
            // tarArr[j].liveStatus = '3'
            oriArr[i].liveStatus = tarArr[j].liveStatus
          }
        }
      }
    }
  }
}

function delvideo (oriArr, tarArr) {
  for (let i = 0; i < oriArr.length; i++) {
    for (let j = 0; j < tarArr.length; j++) {
      if (oriArr[i].id === tarArr[j].id) {
        if (oriArr[j].liveStatus === '0') {
          tarArr.push({
            id: '',
            liveId: ''
          })
          tarArr.splice(i, 1)
        }
      }
    }
  }
}


export default {
  name: 'breadcast',
  data () {
    return {
      shrink: false,
      loadingShow: false,
      menuListsShow: true,
      switchShow: true,
      map: null,
      btnshow: false,
      startshow: false,
      rtmpUrl: 'rtmp://15.75.2.160:10554/hls/123456',
      searchTxt: null,
      poiSearch: null,
      markers: [],
      marker: null,
      helmatList: [],
      videoPlayer: [
        {
          liveId: '',
          id: 1,
          liveStatus: ''
        },
        {
          liveId: '',
          id: 2,
          liveStatus: ''
        },
        {
          liveId: '',
          id: 3,
          liveStatus: ''
        },
        {
          liveId: '',
          id: 4,
          liveStatus: ''
        },
        {
          liveId: '',
          id: 5,
          liveStatus: ''
        },
        {
          liveId: '',
          id: 6,
          liveStatus: ''
        }
      ],
      deviceNum: '',
      devInfo: null,
      organizeIdList: [JSON.parse(sessionStorage.getItem('regionId'))],
      policeList: [],
      devList: [],
      name: '',
      regionId: '',
      devOnListId: [JSON.parse(sessionStorage.getItem('regionId'))],
      timer: '',
      spliceName: ''
    }
  },
  mounted () {
    this.userInfo = JSON.parse(sessionStorage.getItem('user'))
    this.name = this.userInfo.organizationName
    if (this.name === '超级管理员') {
      this.name = '上海市公安局'
    }
    findDevOnline({organizeIdList: this.organizeIdList}).then(res => {
      this.helmatList.splice(0)
      const helList = res.data.obj || []
      if (localStorage.devInfoLive) {
        this.videoPlayer = JSON.parse(localStorage.getItem('devInfoLive'))
      } else {
        let liveList = []
        for (let i = 0; i < helList.length; i++) {
          let flag = false
          if (helList[i].liveStatus != '0') {
            flag = true
            this.$set(helList[i], 'liveStatus', '3')
          }
          if (flag) {
            liveList.push(helList[i])
          }
        }
        for (let i = 0; i < liveList.length; i++) {
          this.videoPlayer.splice(i, 1, liveList[i])
          if (this.videoPlayer.length > 6) {
            break
          }
        }
        this.videoPlayer = this.videoPlayer.map(item => {
          return {
            liveId: item.liveId,
            id: item.id,
            liveStatus: item.liveStatus,
            policeName: item.policeName,
            deviceNum: item.deviceNum
          }
        })
        localStorage.setItem('devInfoLive', JSON.stringify(this.videoPlayer))
      }
      helList.forEach(item => {
        this.helmatList.push(item)
      })
      setTimeout(() => {
        this.helmatList.forEach(item => this.addMarker(item))
        this.getDevNumber()
      }, 10)
    })
    this.timer = setInterval(() => {
      findDevOnline({organizeIdList: this.organizeIdList}).then(res => {
        this.videoPlayer = JSON.parse(localStorage.getItem('devInfoLive'))
        const helList = res.data.obj || []
        let liveList = []
        for (let i = 0; i < helList.length; i++) {
          let flag = false
          if (helList[i].liveStatus != '0') {
            flag = true
            helList[i].liveStatus = '3'
          }
          if (flag) {
            liveList.push(helList[i])
          }
        }
        addToOri(this.helmatList, helList)
        const resArr = spliceFromOri(this.helmatList, helList)
        updateOri(this.helmatList, helList)
        resArr.forEach(item => this.removeMarker(item))
        updateLive(this.helmatList, this.videoPlayer)
        this.helmatList.forEach(item => {
          if (item.marker) {
            this.updateMarker(item)
          } else {
            this.addMarker(item)
          }
        })
        this.getOnline()
        const newArr = splice(this.videoPlayer, liveList)
        for(let i = 0;  i < newArr.length; i++) {
          for(let j = 0; j < this.videoPlayer.length; j++) {
            if (newArr[i].liveId === this.videoPlayer[j].liveId) {
                this.videoPlayer.splice(j, 1, {
                  id: j,
                  liveId: '',
                  liveStatus: '',
                  deviceNum: ''
                })
            }
          }
        }
        for(let j = 0; j < this.videoPlayer.length; j++) {
          for (let i = 0; i < liveList.length; i++) {
            if (liveList[i].id == this.videoPlayer[j].id) {
             liveList.splice(i, 1)
            }
          }
        }
        let count = 0;
        for(let j = 0; j < this.videoPlayer.length; j++) {
         if (this.videoPlayer[j].liveId == '') {
            if(liveList.length > count){
             this.videoPlayer.splice(j, 1 , liveList[count])
             count++
            }
         }
        }
        this.videoPlayer = this.videoPlayer.map(item => {
          return {
            liveId: item.liveId,
            id: item.id,
            liveStatus: item.liveStatus,
            policeName: item.policeName,
            deviceNum: item.deviceNum
          }
        })
        localStorage.setItem('devInfoLive', JSON.stringify(this.videoPlayer))
      })
    }, 4000)
    setTimeout(() => { addRoadNetLayer(this.map) }, 50)
    this.initMap()
  },
  methods: {
    toggleClick () {
      this.shrink = !this.shrink
      this.menuListsShow = !this.menuListsShow
    },
    onMeunList () {
      this.menuListsShow = true
      this.switchShow = false
    },
    // 获取在线数量
    getDevNumber() {
      getOrgName({name:this.name}).then(res => {
        if (this.userInfo.userLevel === '1' || this.userInfo.userLevel === '2') {
          this.policeList = res.data.obj
        } else if (this.userInfo.userLevel === '0' || this.userInfo.userLevel === '9') {
          this.policeList = res.data.obj[0].children
        }
        // findDevOnline({organizeIdList: this.organizeIdList}).then(res => {
          // if (res.data.success) {
            let childrenDevlist
            let stationList
            this.policeList.forEach(item => {
              if (this.userInfo.userLevel === '2') {
                childrenDevlist = this.helmatList.filter(ite => ite.regionId === item.id)
                } else {
                childrenDevlist = this.helmatList.filter(ite => (ite.parentId === 16 ? ite.regionId : ite.parentId) === item.id)
              }
              stationList = this.helmatList.filter(ite => ite.regionId === item.id)
              this.$set(item, 'childrenDevlist', stationList)
              this.$set(item, 'devNumber', childrenDevlist.length)
              item.children.forEach(ele => {
                childrenDevlist = this.helmatList.filter(data => data.regionId === ele.id)
                this.$set(ele, 'childrenDevlist', childrenDevlist)
                this.$set(ele, 'devNumber', childrenDevlist.length)
              })
            })
        //   }
        // })
      })
    },
    // 更改点击后的状态
    getfindDevOnline () {
      findDevOnline({
        organizeIdList: this.organizeIdList
      }).then(res => {
        console.log(res.data.obj[0].liveStatus)
      })
    },
    // 定时器刷新在线设备
    getOnline () {
          let childrenDevlist
          let stationList
          this.policeList.forEach(item => {
            if (this.userInfo.userLevel === '2') {
              childrenDevlist = this.helmatList.filter(ite => ite.regionId === item.id)
              } else {
              childrenDevlist = this.helmatList.filter(ite => (ite.parentId === 16 ? ite.regionId : ite.parentId) === item.id)
            }
              stationList = this.helmatList.filter(ite => ite.regionId === item.id)
            
            this.$set(item, 'childrenDevlist', stationList)
            this.$set(item, 'devNumber', childrenDevlist.length)
            item.children.forEach(ele => {
              childrenDevlist = this.helmatList.filter(data => data.regionId === ele.id)
              this.$set(ele, 'childrenDevlist', childrenDevlist)
              this.$set(ele, 'devNumber', childrenDevlist.length)
            })
          })
    },
    change (name) {
      // console.log(name)
      this.deviceNum = name
      const deviceInfo = this.helmatList.find(item => {
        return item.deviceNum === name
      })
      // console.log(deviceInfo)
      this.map.setCenter(new IMAP.LngLat(deviceInfo.longitude, deviceInfo.latitude)) 
      // if (deviceInfo.liveStatus === '0') {
      //   this.onLive(deviceInfo)
      // } else if (deviceInfo.liveStatus !== '0') {
      //   this.$set(deviceInfo, 'liveStatus', '3')
      //   let index = this.videoPlayer.findIndex(ele => {
      //     return ele.id === deviceInfo.id
      //   })
      //   if (index > -1) {
      //     this.videoPlayer.splice(index, 1, deviceInfo)
      //     // this.videoPlayer.unshift(item)
      //   } else {
      //     for (let i = 0; i< this.videoPlayer.length; i++) {
      //       if (this.videoPlayer[i].liveStatus !== '3') {
      //         this.videoPlayer.splice(i, 1, deviceInfo)
      //         break
      //       } else {
      //         this.videoPlayer.splice(i+1, 1, deviceInfo)
      //         break
      //       }
      //     }
      //     // this.videoPlayer.unshift(item)
      //     // this.videoPlayer.splice(-1, 1)
      //   }
      //   this.videoPlayer = this.videoPlayer.map(item => {
      //     return {
      //       liveId: item.liveId,
      //       id: item.id,
      //       liveStatus: item.liveStatus,
      //       policeName: item.policeName,
      //       deviceNum: item.deviceNum
      //     }
      //   })
      //   localStorage.setItem('devInfoLive', JSON.stringify(this.videoPlayer))
      // }
    },
    changes (name) {},
    initMap () {
      this.map = new IMAP.Map('map', {
        minZoom: 3,
        maxZoom: 18,
        zoom: 14,
        center: new IMAP.LngLat(121.455536, 31.249452),
        animation: true
      })
    },
    searchBtn () {
      this.doSuggest()
    },
    doSuggest () {
      let suggestId = document.getElementById('suggestId')
      let city = '上海'
      while (suggestId.hasChildNodes()) {
        suggestId.removeChild(suggestId.firstChild)
      }
      if (!this.searchTxt) {
        return
      }
      this.map.plugin(['IMAP.Suggest'], () => {
        const suggest = new IMAP.Suggest()
        // console.log(suggest, this.searchTxt, city)
        suggest.search(this.searchTxt, city, (status, results) => {
          if (status === '0') {
            let records = results.results
            let record
            let li
            suggestId.style.display = 'block'
            let ul = document.createElement('ul')
            ul.style.backgroundColor = 'rgb(5, 65, 115)'
            for (let i = 0, l = records.length; i < l; ++i) {
              record = records[i]
              console.log(record)
              li = document.createElement('li')
              li.innerHTML = record.name
              this.addSuggestEvt(record.name, li)
              ul.appendChild(li)
            }
            suggestId.appendChild(ul)
          }
        })
      })
    },
    addSuggestEvt (name, obj) {
      obj.onclick = () => {
        let suggestId = document.getElementById('suggestId')
        while (suggestId.hasChildNodes()) {
          suggestId.removeChild(suggestId.firstChild)
        }
        suggestId.style.display = 'none'
        this.searchTxt = name
        this.doSearch(1)
      }
      obj.onmouseover = () => {
        obj.style.backgroundColor = 'rgba(3,25,41,0.5)'
      }
      obj.onmouseout = () => {
        obj.style.backgroundColor = 'rgb(5, 65, 115)'
      }
    },
    doSearch (pageNo) {
      if (this.map) {
        this.clearReaults()
        let city ='上海'
        if (!this.searchTxt) {
          return
        }
        const icons = {
          '0': {size: {'width': 33, 'height': 30}, offset: {x: -34, y: 0}},
          '1': {size: {'width': 33, 'height': 30}, offset: {x: -68, y: 0}},
          '2': {size: {'width': 33, 'height': 30}, offset: {x: -102, y: 0}},
          '3': {size: {'width': 33, 'height': 30}, offset: {x: -136, y: 0}},
          '4': {size: {'width': 33, 'height': 30}, offset: {x: -170, y: 0}},
          '5': {size: {'width': 33, 'height': 30}, offset: {x: -204, y: 0}},
          '6': {size: {'width': 33, 'height': 30}, offset: {x: -238, y: 0}},
          '7': {size: {'width': 33, 'height': 30}, offset: {x: -272, y: 0}},
          '8': {size: {'width': 33, 'height': 30}, offset: {x: -306, y: 0}},
          '9': {size: {'width': 33, 'height': 30}, offset: {x: -340, y: 0}}
        }
        const toFunc = (markers) => {
          this.poiSearch.setPageNumber(parseInt(pageNo))
          this.poiSearch.search(this.searchTxt, city, (status, result) => {
            if (status === '0') {
              const datas = result.results
              let data
              let iconUrl = IMAP.MapConfig.API_REALM_NAME + IMAP.MapConfig._MAP_POINT_URL
              let icon
              for (let i = 0, l = datas.length; i < l; ++i) {
                data = datas[i]
                icon = icons[i]
                if (!icon) {
                  icon = icons[0]
                }
                this.marker = new IMAP.Marker(new IMAP.LngLat(data.location.lng, data.location.lat), {icon: new IMAP.Icon(iconUrl, icon.size, icon.offset)})
                console.log(this.marker)
                this.marker._data = data
                this.addEvent(this.marker)
                markers.push(this.marker)
              }
              this.map.getOverlayLayer().addOverlays(markers, true)
            }
          })
        }
        this.map.plugin(['IMAP.PoiSearch'], () => {
          this.poiSearch = new IMAP.PoiSearch({pageSize: 5})
          toFunc(this.markers)
        })
      }
    },
    addEvent (m) {
      m.addEventListener(IMAP.Constants.CLICK, (cObj) => {
        this.displayInfoWindow(m, m._data)
      }, m)
    },
    displayInfoWindow (m, data) {
      console.log(data)
      const content = `
        <div style='color: #fff;'>
          地址: ${data.address}
          <br />电话: ${data.telephone ? data.telephone : ''}
        </div>
      `
      m.openInfoWindow(content, {
        title: data.name,
        offset: new IMAP.Pixel(-5, -30),
        size: new IMAP.Size(250, 100)
      })
    },
    clearReaults () {
      this.map.getOverlayLayer().clear(this.markers)
      this.markers = []
    },
    addMarker (item) {
      let results = null
      if (item) {
        if (this.map) {
          const opts = new IMAP.MarkerOptions()
          opts.anchor = IMAP.Constants.BOTTOM_CENTER
          if (item.liveStatus === '1' ) {
            opts.icon = new IMAP.Icon('../../../static/images/directYellow.png',
            {size: new IMAP.Size(70, 104)})
          } else if (item.liveStatus === '0') {
            this.rtmpUrl =''
            opts.icon = new IMAP.Icon('../../../static/images/helment.png',
            {size: new IMAP.Size(70, 104), offset: new IMAP.Pixel(8, 48)})
          } else if (item.liveStatus === '3') {
            opts.icon = new IMAP.Icon('../../../static/images/directRed.png',
            {size: new IMAP.Size(70, 104)})
          }
          const lnglat = new IMAP.LngLat(item.longitude, item.latitude)
          this.map.plugin(['IMAP.Geocoder'], () => {
            const geocoder = new IMAP.Geocoder({city: '上海', pois: true})
            geocoder.getAddress(lnglat, (status, result) => {
              if (status === '0') {
                this.$set(item, 'results', result.result[0])
              }
            })
          })
          if (lnglat) {
            item.marker = new IMAP.Marker(lnglat, opts)
            item.marker.editable(true)
            this.map.getOverlayLayer().addOverlay(item.marker, true)
            item.marker.setLabel(`<p class="lableStyle"
              style="background: #003558; padding: 0px 10px; color: #ddd;
              height:22px; line-height:22px;
              z-index:200;
              position:relative;"
              >${item.policeName}
                <p style="position:absolute;border:5px solid #003558; transform:rotate(60deg); top:15px; left:50%;"></p>
              </p>`, {
              'offset': new IMAP.Pixel(-28, -80),
              'anchor': IMAP.Constants.BOTTOM_CENTER,
              'type': IMAP.Constants.OVERLAY_LABEL_HTML,
              'position': lnglat
            })
            if (item.liveStatus === '0') {
              this.rtmpUrl = ''
            } else if (item.liveStatus === '1' || item.liveStatus === '3') {
              item.marker.setLabel(`<p class="lableStyle"
                style="background: #003558; padding: 0px 10px; color: #ddd;
                height:22px; line-height:22px;
                z-index:200;
                position:relative;"
                >${item.policeName}
                  <p style="position:absolute;border:5px solid #003558; transform:rotate(60deg); top:15px; left:50%;"></p>
                </p>`, {
                'offset': new IMAP.Pixel(-28, -126),
                'anchor': IMAP.Constants.BOTTOM_CENTER,
                'type': IMAP.Constants.OVERLAY_LABEL_HTML,
                'position': lnglat
              })
            }
            item.marker.addEventListener('dblclick', () => {
              if (item.liveStatus === '3') {
                return
              }
              if (item.liveStatus === '0') {
                this.deviceNum = item.deviceNum
                this.onLive(item)
              } else if (item.liveStatus === '1') {
                this.$set(item, 'liveStatus', '3')
                let index = this.videoPlayer.findIndex(ele => {
                  return ele.id === item.id
                })
                if (index > -1) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                  this.videoPlayer.splice(index, 1, item)
                  // this.videoPlayer.unshift(item)
                } else {
                  let flag = true
                  for (let i = 0; i< this.videoPlayer.length; i++) {
                    if (this.videoPlayer[i].liveStatus != '3') {
                      this.videoPlayer.splice(i, 1, item)
                      flag = false
                      break
                    }
                  }
                  if (flag) {
                    this.videoPlayer.splice(0, 1, item)
                    // this.videoPlayer.push(item)
                  }
                }
                this.videoPlayer = this.videoPlayer.map(item => {
                  return {
                    liveId: item.liveId,
                    id: item.id,
                    liveStatus: item.liveStatus,
                    policeName: item.policeName,
                    deviceNum: item.deviceNum
                  }
                })
                localStorage.setItem('devInfoLive', JSON.stringify(this.videoPlayer))
              }
            })
          }
        }
      }
    },
    updateMarker (item) {
      item.marker.setPosition(new IMAP.LngLat(item.longitude, item.latitude))
      if (item.liveStatus === '0') {
        this.rtmpUrl =''
        item.marker.setLabel(`<p class="lableStyle"
          style="background: #003558; padding: 0px 10px; color: #ddd;
          height:22px; line-height:22px;
          z-index:200;
          position:relative;"
          >${item.policeName}
            <p style="position:absolute;border:5px solid #003558; transform:rotate(60deg); top:15px; left:50%;"></p>
          </p>`, {
          'offset': new IMAP.Pixel(-28, -80),
          'anchor': IMAP.Constants.BOTTOM_CENTER,
          'type': IMAP.Constants.OVERLAY_LABEL_HTML
        })
      } else if (item.liveStatus === '1' || item.liveStatus === '3') {
        item.marker.setLabel(`<p class="lableStyle"
          style="background: #003558; padding: 0px 10px; color: #ddd;
          height:22px; line-height:22px;
          z-index:200;
          position:relative;"
          >${item.policeName}
            <p style="position:absolute;border:5px solid #003558; transform:rotate(60deg); top:15px; left:50%;"></p>
          </p>`, {
          'offset': new IMAP.Pixel(-28, -126),
          'anchor': IMAP.Constants.BOTTOM_CENTER,
          'type': IMAP.Constants.OVERLAY_LABEL_HTML
        })
      }
      // const lnglat = new IMAP.LngLat(item.longitude, item.latitude)
      if (item.liveStatus === '1') {
        const icon = new IMAP.Icon('../../../static/images/directYellow.png',
        {'size': new IMAP.Size(70, 104)})
        item.marker.setIcon(icon)
      } else if (item.liveStatus === '0') {
        const icon = new IMAP.Icon('../../../static/images/helment.png',
        {'size': new IMAP.Size(70, 104), offset: new IMAP.Pixel(8, 48)})
        item.marker.setIcon(icon)
      } else if (item.liveStatus === '3') {
        const icon = new IMAP.Icon('../../../static/images/directRed.png',
        {'size': new IMAP.Size(70, 104)})
        item.marker.setIcon(icon)
      }
      // const icon = new IMAP.Icon(item.liveStatus === '1' ? '../../../static/images/directYellow.png' : item.liveStatus === '0' ? '../../../static/images/helment.png' : item.liveStatus === '3' ? '../../../static/images/directRed.png' : '../../../static/images/helment.png',
      // {'size': new IMAP.Size(70, 104)})
      // item.marker.setIcon(icon)
    },
    removeMarker (item) {
      this.map.getOverlayLayer().removeOverlay(item.marker)
    },
    // 开始直播方法
    onLive (item) {
      pushCommand({
        deviceNum: this.deviceNum,
        cmd: 3
      }).then(res => {
        if (res.data.success) {
          this.$set(item, 'liveStatus', '3')
          let index = this.videoPlayer.findIndex(ele => {
            return ele.id === item.id
          })
            if (index > -1) {
              this.videoPlayer.splice(index, 1, item)
            } else {
              let flag = true
              for (let i = 0; i< this.videoPlayer.length; i++) {
                if (this.videoPlayer[i].liveStatus != '3') {
                  this.videoPlayer.splice(i, 1, item)
                  flag = false
                  break
                } 
                // else {
                //   this.videoPlayer.splice(i+1, 1, item)
                //   break
                // }
              }
              if (flag) {
                this.videoPlayer.splice(0, 1, item)
                // this.videoPlayer.push(item)
              }
            }
        } else {
          if (res.data.msg) {
            this.spliceName = this.videoPlayer[0].policeName
            this.$Modal.confirm({
              content: `${res.data.msg}，是否替换${this.spliceName}`,
              width: '300',
              onOk: () => {
                pushCommand({
                  deviceNum: this.videoPlayer[0].deviceNum,
                  cmd: 4
                }).then(res => {
                  if (res.data.success) {
                    this.loadingShow = true 
                    setTimeout(() => {
                      pushCommand({
                      deviceNum: item.deviceNum,
                      cmd: 3
                    }).then(res => {
                        this.loadingShow = false
                      if (res.data.success) {
                        this.videoPlayer.splice(0, 1, item)
                      } else {
                        this.$Message.warning('直播开启失败')
                      }
                    })
                    },10000)
                  } else{
                    this.$Message.warning('直播关闭失败')
                  }
                })
              }
            })
          } else {
            this.$Message.warning({
              content: '网络异常',
              duration: 3
            })
          }
        }
         this.videoPlayer = this.videoPlayer.map(item => {
            return {
            liveId: item.liveId,
            id: item.id,
            liveStatus: item.liveStatus,
            policeName: item.policeName,
            time: +new Date(),
            deviceNum: item.deviceNum
            }
          })
          localStorage.setItem('devInfoLive', JSON.stringify(this.videoPlayer))
      })
    },
    // 关闭直播
    endBtn (date) {
      console.log(date)
      this.deviceNum = date.deviceNum
      pushCommand({
        deviceNum: this.deviceNum,
        cmd: 4
      }).then(res => {
        console.log(res.data)
        if (res.data.success) {
          this.getfindDevOnline ()
          this.$Message.warning('直播关闭')
        }
      })
    },
    // 开启直播
    startBtn (date) {
      this.deviceNum = date.deviceNum
      pushCommand({
        deviceNum: this.deviceNum,
        cmd: 3
      }).then(res => {
        console.log(res.data)
        if (res.data.success) {
          this.getfindDevOnline ()
          this.$Message.success('开始直播')
          this.$set(date, 'liveStatus', '3')
          let index = this.videoPlayer.findIndex(ele => {
            return ele.deviceNum === date.deviceNum
          })
          console.log(index)
          if (index > 0) {
            this.videoPlayer.splice(index, 1, date)
          } else {
            let flag = true
            for (let i = 0; i< this.videoPlayer.length; i++) {
                if (this.videoPlayer[i].liveStatus != '3') {
                  this.videoPlayer.splice(i, 1, date)
                  flag = false
                  break;
                } 
                // else {
                //   console.log('22222222222222222222222222222222')
                //   this.videoPlayer.splice(i + 1, 1, date)
                // }
              }
              if (flag) {
                this.videoPlayer.splice(0, 1, date)
                // this.videoPlayer.push(date)
              }
          }
          this.videoPlayer = this.videoPlayer.map(item => {
            return {
            liveId: item.liveId,
            id: item.id,
            liveStatus: item.liveStatus,
            policeName: item.policeName,
            time: +new Date(),
            deviceNum: item.deviceNum
            }
          })
          console.log(this.videoPlayer)
          localStorage.setItem('devInfoLive', JSON.stringify(this.videoPlayer))
        } else {
          if (res.data.msg) {
            this.$Message.warning(res.data.msg)
            this.spliceName = this.videoPlayer[0].policeName
            this.$Modal.confirm({
              content: `${res.data.msg}，是否替换${this.spliceName}`,
              width: '300',
              onOk: () => {
                pushCommand({
                  deviceNum: this.videoPlayer[0].deviceNum,
                  cmd: 4
                }).then(res => {
                  if (res.data.success) {
                    this.loadingShow = true
                    setTimeout(() => {
                      pushCommand({
                      deviceNum: date.deviceNum,
                      cmd: 3
                    }).then(res => {
                       this.loadingShow = false
                      if (res.data.success) {
                        this.videoPlayer.splice(0, 1, date)
                      } else {
                        this.$Message.warning('开启直播失败')
                      }
                    })
                    },10000)
                  } else {
                    this.loadingShow = false
                    this.$Message.warning('直播关闭失败')
                  }
                })
              }
            })
          } else {
            this.$Message.warning('网络异常')
          }
        }
      })
    },
    confirm () {

    },
    cancel() {}
  },
  components: {
    EasyPlayer,
    devOnline
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.breadcast {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 20000;
  .ivu-menu-item {
    position: relative;
    img {
      position: absolute;
      left: 0;
    }
    .btns {
      position: absolute;
      right: 5px;
      top: 6px;
      button {
        cursor: pointer;
        font-size: 10px;
        outline: none;
        border: none;
        color: #fff;
        background-color: transparent;
        color: #ccc;
      }
    }
  }
  // .ivu-menu.ivu-menu-light.ivu-menu-vertical {
  //   position: absolute;
  //   right: 0;
  //   width: 220px;
  //   background: rgba(0, 12, 24, .8);
  //   overflow: scroll;
  //   .ivu-menu-submenu {
  //     .ivu-menu-submenu-title {
  //         padding: 6px 24px;
  //         .ivu-menu-submenu-title-icon {
  //           opacity: 0;
  //       }
  //     }
  //   }
  // }
  // .ivu-menu-vertical .ivu-menu-item,
  // .ivu-menu-vertical .ivu-menu-submenu-title {
  //   padding: 10px 24px;
  //   line-height: 20px;
  // }
  // .ivu-menu-light {
  //   background: transparent;
  //   position: absolute;
  //   right: 0;
  //   top: .447059rem
  // }
  .ivu-menu-vertical .ivu-menu-item:hover,
  .ivu-menu-vertical .ivu-menu-submenu-title:hover {
    color: #fff;
    background: linear-gradient(180deg, #024d9e, #0079ce);
    // background-color: #6d9dc6;
  }
  .ivu-menu {
    color: #6d9dc6;
  }
  .titleCnt {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    font-size: 16px;
    color: #92ccff;
    background: url("/static/images/structureBg.png") ~"0 0 / 100% 100%" no-repeat;
  }
  .listWrap {
    height: calc(~"100% - 40px");
    background: rgba(0, 12, 24, .8);
    overflow: scroll;
  }
  // .ivu-menu-vertical .ivu-menu-submenu-title {
  //   padding: 6px 24px;
  // }
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    color: #fff;
    background: linear-gradient(180deg, #024d9e, #0079ce);
    border-right: none;
  }
  .ivu-menu-vertical.ivu-menu-light:after {
    width: 0;
  }
}
.mapWrap {
  width: 100%;
  // float: right;
  position: absolute;
  // width: 3.764706rem; // 640px
  min-width: 480px;
  height: 100%;
  #map {
    height: 100%;
  }
  .searchWrap {
    box-sizing: border-box;
    position: absolute;
    width: 240px; // 282px;
    height: 40px; //40px;
    top: .058824rem; //10px;
    right: .058824rem; //10px;
    border: 1px solid #028DE8; //1px;
    box-shadow: 0 0 6px #054173; //6px;
    z-index: 1000;
    .searchTxt {
      float: left;
      width: 176px; //218px;
      padding-left: 10px; //10px;
      height: 38px; //38px;
      line-height: 38px; //38px;
      background: #054173;
      border: none;
      border-right: 1px solid #028DE8; //1px;
      font-size: 14px; //14px;
      color: #fff;
    }
    .searchBtn {
      float: right;
      width: 62px; //62px;
      height: 38px; //38px;
      line-height: 40px; //40px;
      text-align: center;
      color: #fff;
      background: #054173;
      font-size: 14px; //14px;
      border: none;
      cursor: pointer;
      &:active {
        background: rgba(5, 65, 115, .6)
      }
    }
  }
}
.breadcastWrap {
  position: relative;
  float: left;
  width: 5.294118rem; // 900px;
  min-width: 810px;
  height: 100%;
  z-index: 666;
  .videoWrap {
    float: left;
    width: 2.294118rem; // 520px
    min-width: 400px;
    // height: 1.717647rem; // 292px;
    min-height: 225px;
    margin-right: .058824rem; // 10px;
    margin-top: 10px; // 10px;
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
}
.leador-popup-content-wrapper {
  .leador-popup-content {
    .leadormap-window {
      color: #fff;
    }
  }
}
.video-wrapper {
  width: 2.294118rem; // 520px;
  min-width: 400px ;
  // height: 1.717647rem; // 292px;
  min-height: 225px;
}
</style>
<style lang="less">
.leador-pane.leador-map-pane {
    .leador-pane.leador-marker-pane {
      .leadormap-clickable.leadormap-label-left {
        .leadormap-zoom-animated {
          padding: 2px 5px !important;
        }
      }
    }
  }
.video-wrapper {
  width: 2.294118rem; // 520px;
  min-width: 400px;
  // height: 1.470588rem; // 292px;
  min-height: 225px;
}
#suggestId {
  top: .223529rem; // 38px;
  width: 100%;
  ul {
    li {
      height: 40px; // 40px;
      line-height: 40px; // 40px;
      padding-left: 10px; // 10px;
      color: #fff;
    }
  }
}
.breadcast {
  .leadormap-window-title {
    color: #fff;
  }
}
.leador-popup-content-wrapper {
  box-sizing: border-box;
  border: .017647rem solid rgba(0, 128, 214, .7);
  border-radius: 0;
  background: #003558;
  padding: 0;
  .leador-popup-content{
    .leadormap-window{
      background-color: transparent;
      overflow: visible;
      .leadormap-window-content {
        overflow: visible;
      }
    }
  }
}
.breadcast {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 20000;
  .videoLoading {
    position: absolute;
    left: 1.294118rem;
    z-index: 666;
    top: 100px;
  }
    .switch {
      padding: 0;
      outline: none;
      position: absolute;
      right: 0;
      top: .447059rem;
      color: #fff;
      z-index: 999;
      font-weight: 700;
      border-radius: 5px;
      font-size: 20px;
      // width: 30px;
      // height: 120px;
      text-align: center;
      cursor: pointer;
      border: none;
      z-index: 1999;
    }
  .btns {
      position: absolute;
      right: 5px;
      top: 6px;
      button {
        cursor: pointer;
        font-size: 10px;
        outline: none;
        border: none;
        color: #fff;
        background-color: transparent;
      }
    }
    .menuLists {
      height: 600px;
      overflow-y: scroll;
      position: absolute;
      right: 20px;
      width: 220px;
      top: .447059rem;
      transition: all 1s;
      background: rgba(0, 12, 24, .8);
      .ivu-menu.ivu-menu-light.ivu-menu-vertical {
        // display:none;
        width: 220px;
        background: rgba(0, 12, 24, .8);
        // overflow: hidden;
        .ivu-menu-submenu {
          .ivu-menu-submenu-title {
              padding: 6px 16px;
              .number {
                position: absolute;
                top: 5px;
                right: 10px;
              }
              .ivu-menu-submenu-title-icon {
                opacity: 0;
              
            }
          }
          .ivu-menu {
            .ivu-menu-item {
              font-size: 12px;
              padding: 6px 46px;
              img {
                width: 16px;
                height: 16px;
                position: absolute;
                left: 28px;
                top: 6px;
              }
            }
            .ivu-menu-submenu {
              .ivu-menu-submenu-title {
                padding: 6px 30px;
              }
              .ivu-menu {
                .ivu-menu-item {
                  padding: 6px 48px;
                }
              }
            }
          }
        }
      }
    }
  .ivu-menu-light {
    background: transparent;
    position: absolute;
    right: 0;
    // top: .447059rem
  }
  .ivu-menu-vertical .ivu-menu-item:hover,
  .ivu-menu-vertical .ivu-menu-submenu-title:hover {
    color: #fff;
    background: linear-gradient(180deg, #024d9e, #0079ce);
    //  background-color: #6d9dc6;
  }
  .ivu-menu {
    color: #6d9dc6;
  }
  .titleCnt {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    font-size: 16px;
    color: #92ccff;
    background: url("/static/images/structureBg.png") ~"0 0 / 100% 100%" no-repeat;
  }
  .listWrap {
    height: calc(~"100% - 40px");
    background: rgba(0, 12, 24, .8);
    overflow: scroll;
  }
  // .ivu-menu-vertical .ivu-menu-submenu-title {
  //   padding: 6px 24px;
  // }
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    color: #fff;
    background: linear-gradient(180deg, #024d9e, #0079ce);
    border-right: none;
  }
  .ivu-menu-vertical.ivu-menu-light:after {
    width: 0;
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  // .demo-spin-col {
  //   height: 100px;
  //   position: relative;
  //   border: 1px solid #eee;
  // }
  @keyframes ani-demo-spin {
    0% {transform: rotate(0deg)}
    50% {transform: rotate(180deg)}
    100% {transform: rotate(360deg)}
  }
}
</style>
