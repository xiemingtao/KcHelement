<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>

<template>
  <div class="home-main">
    <div style="width: 100%;height: 1px;background-color:#5a98d5;position:absolute;top:0px"></div>
    <div id="map" style="width: 100%; height: 100%;">
       <!-- <div class="infoCtr">
          <div class="topCtr">  
            <div class="infoContainer">
              <div><p class="infoType">设备ID</p><p class="infoDetail">${item.userName}</p></div>
              <div><p class="infoType">警员姓名</p><p class="infoDetail">${item.policeName || '未知'}</p></div>
              <div><p class="infoType">所属派出所</p><p class="infoDetail">${item.regionName}</p></div>
              <div><p class="infoType">当前位置</p><p class="infoDetail">${results[0].formatted_address}</p></div>
            </div>
          </div>
          <div class="butBtn">
            <button  class="btnLook">观看直播</button>
            <button  class="btnInfo">推送消息</button>
          </div>
        </div> -->
    </div>
    <div class="menuList">
      <orgChart @latlng="latlng"></orgChart>
    </div>
    <div class="deviceStatistics">
      <deviceCount :value="this.helmatList.length" :liveNum="this.liveNum.length"></deviceCount>
    </div>
    <div class="playerWrap" v-show="isShow">
      <div class="ivu-icon ivu-icon-ios-close-empty videoClose" style="width: 24px; height: 24px;" @click="closeBtn"></div>
      <div class="videoPlayer">

      <EasyPlayer :videoUrl="rtmpUrl" live :autoplay="true"></EasyPlayer>
      </div>
    </div>
  </div>
</template>

<script>
import cityData from "./map-data/get-city-value";
import countUp from "./components/countUp";
import IMAP from "IMAP";
import orgChart from "./components/organizationChart";
import deviceCount from "./components/deviceCount";
// import videoPlayer from "./components/videoPlayer";
import EasyPlayer from 'easy-player'
import { addRoadNetLayer } from "../../libs/common";

import {
  getLocationList,
  getEDInfoList,
  findDvcList,
  findDevOnline,
  pushCommand
} from "api";

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
      oriArr.splice(i, 1)
      i--
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

export default {
  name: "home",
  components: {
    countUp,
    orgChart,
    deviceCount,
    // videoPlayer,
    EasyPlayer
  },
  data () {
    return {
      host: 'rtmp://121.43.163.20:10085/hls/',
      cityData: cityData,
      map: null,
      a: 121.455536,
      b: 31.249452,
      infowindow: null,
      helmatList: [],
      isShow: false,
      rtmpUrl: 'rtmp://15.75.2.160:10554/hls/0713719',
      marker: null,
      devInfo: null,
      devLiveStatus: false,
      deviceNum: '',
      geocoder: null,
      organizeIdList: [JSON.parse(sessionStorage.getItem('regionId'))],
      markers: [],
      dataCluster: null,
      liveNum: [],
      timer: '',
      infowindowShow: false
    };
  },
  methods: {
    // 关闭直播
    closeBtn () {
      // console.log(this.deviceNum)
      this.rtmpUrl = ''
      this.devLiveStatus = false
      this.offLive()
    },
    addMarker(item) {
      let results = null
      if (item) {
        if (this.map) {
          const opts = new IMAP.MarkerOptions()
          opts.anchor = IMAP.Constants.BOTTOM_CENTER
          opts.icon = new IMAP.Icon(item.liveStatus === '1' ? '../../../static/images/helment_focus.png' : item.liveStatus === '0' ? '../../../static/images/helment.png' : '', {
            'size': new IMAP.Size(48, 56)
          });
          const lnglat = new IMAP.LngLat(item.longitude, item.latitude)
          this.map.plugin(['IMAP.Geocoder'], () =>{
            const geocoder = new IMAP.Geocoder({city: '上海', pois :true})
            geocoder.getAddress(lnglat, (status, result) => {
              if (status === '0') {
                results = result.result
              }
            })
          })
          if (lnglat) {
            item.marker = new IMAP.Marker(lnglat, opts)
            this.map.getOverlayLayer().addOverlay(item.marker, true)
            item.marker.editable(true)
            item.marker.setLabel(`<p class="lableStyle"
            style="background: #003558; padding: 0px 10px; color: #ddd;
            height:22px; line-height:22px;
            z-index:200;
            position:relative;"
            >${item.policeName}
              <p style="position:absolute;border:5px solid #003558; transform:rotate(60deg); top:15px; left:50%;"></p>
            </p>`, {
              'type': IMAP.Constants.OVERLAY_LABEL_HTML,
              'offset': new IMAP.Pixel(-28, -80),
              'anchor': IMAP.Constants.BOTTOM_CENTER,
              'position': lnglat
            })
            // const label = item.marker.getLabel()
            // console.log(label)
            item.marker.addEventListener('click', () => {
              if (this.infowindowShow) {
                item.marker.closeInfoWindow()
                // this.map.getOverlayLayer().removeOverlay(infowindow)
                this.infowindowShow = !this.infowindowShow
              } else {
                this.toggleInfowindow(item, results)
                this.infowindowShow = !this.infowindowShow
              }
                const icon = new IMAP.Icon(item.liveStatus === '1' ? '../../../static/images/helment_focus.png' : item.liveStatus === '0' ? '../../../static/images/helment.png' : '',
                {'size': new IMAP.Size(48, 56)})
                item.marker.setIcon(icon)
                this.devInfo = item
              }, false)
          }
        }
      }
    },
    updateMarker(item) {
      item.marker.editable(true)
      item.marker.setPosition(new IMAP.LngLat(item.longitude, item.latitude))
      const icon = new IMAP.Icon(item.liveStatus === '1' ? '../../../static/images/helment_focus.png' : item.liveStatus === '0' ? '../../../static/images/helment.png' : '',
        {'size': new IMAP.Size(48, 56)})
      item.marker.setIcon(icon)
    },
    removeMarker(item) {
      this.map.getOverlayLayer().removeOverlay(item.marker)
    },
    latlng (latlng, address, name, organizeIdList) {
      // console.log(latlng, address, name)
      // this.organizeIdList = [organizeIdList] 
      this.map.getOverlayLayer().removeOverlay(this.marker)
      const ll = new IMAP.LngLat(latlng.lng, latlng.lat)
      this.map.setCenter(ll)
      const opts = new IMAP.MarkerOptions()
        opts.anchor = IMAP.Constants.BOTTOM_CENTER;
        opts.icon = new IMAP.Icon("/static/images/icon_org30.png", {
          size: new IMAP.Size(28, 28)
        })
        this.marker = new IMAP.Marker(ll, opts)
        this.marker.addEventListener('click', () => {
        this.marker.openInfoWindow(
              ` 
                <div class="infoCtr">
                  <div class="topCtr">  
                    <div class="infoContainer">
                      <div><p class="infoType">机构名称</p><p class="infoDetail">${name}</p></div>
                      <div><p class="infoType">当前位置</p><p class="infoDetail">${address ? address : '未知'}</p></div>
                    </div>
                  </div>
                </div>
              `,
              {
                size: new IMAP.Size(220, 80),
                offset: new IMAP.Pixel(-10, -66),
                visible: true
              }
            )
        })
        this.map.getOverlayLayer().addOverlay(this.marker, true)
    },
    onLive (liveId, deviceNum) {
      pushCommand({
        deviceNum: deviceNum,
        cmd: 3
      }).then(res => {
        if (res.data.success) {
          this.deviceNum = deviceNum
          this.isShow = true
          // this.rtmpUrl = `rtmp://15.75.2.160:10554/hls/${liveId}`
          this.rtmpUrl = this.host + `${liveId}`
        } else {
          if (!res.data.msg) {
            this.$Message.warning({
              content: '网络异常',
              duration: 3
            })
          } else {
              // this.isShow = false 
              this.$Message.warning({
              content: res.data.msg,
              duration: 3
            })
          }
        }
      })
    },
    offLive () {
      pushCommand({
        deviceNum: this.deviceNum,
        cmd: 4
      }).then(res => {
        // console.log(res.data)
        this.isShow = false
        if (res.data.success) {
          this.$Message.warning('直播关闭')
        } else {
          this.$Message.warning('直播关闭失败，请稍后重试')
        }
      })
    },
    toggleInfowindow (item, results) {
      const content = ` 
        <div class="infoCtr">
          <div class="topCtr">  
            <div class="infoContainer">
              <div><p class="infoType">警员编号</p><p class="infoDetail">${item.userName}</p></div>
              <div><p class="infoType">警员姓名</p><p class="infoDetail">${item.policeName || '未知'}</p></div>
              <div><p class="infoType">所属机构</p><p class="infoDetail">${item.regionName}</p></div>
              <div><p class="infoType">当前位置</p><p class="infoDetail">${results[0].formatted_address}</p></div>
            </div>
          </div>
          <div class="butBtn">
            <button  class="btnLook">观看直播</button>
            <button  class="btnInfo">推送消息</button>
          </div>
        </div>
      `
      item.marker.openInfoWindow( content,
      { "size": new IMAP.Size(300,200),
        "offset": new IMAP.Pixel(-5,-56),
        'type': IMAP.Constants.OVERLAY_INFOWINDOW_DEFAULT,
        visible:true});
      const infowindow = item.marker.getInfoWindow()
      infowindow.addEventListener(IMAP.Constants.TIP_CLICK, (evt) =>{
        // this.infowindowShow = !this.infowindowShow
      }, infowindow)
          document.querySelector('.btnLook').onclick = () => {
            if (item.liveStatus === '0') {
              this.onLive(item.liveId, item.deviceNum)
            } else if (item.liveStatus === '1') {
              this.isShow = true
              this.deviceNum = item.deviceNum
              console.log(this.deviceNum)
              this.rtmpUrl = this.host + `${item.liveId}`
            }
          }
          document.querySelector('.btnInfo').onclick = () => {
            this.$router.push({
              name: 'push-message_index',
              params: {
                policeNum: item.userName
              }
            })
          }
    },
    click() {
      console.log('21321')
    }
  },
  mounted() {
    this.map = new IMAP.Map("map", {
      minZoom: 3,
      zoom: 16,
      center: new IMAP.LngLat(this.a, this.b),
      animation: true
    })
    findDevOnline({
      organizeIdList: this.organizeIdList
      }).then(res => {
        // console.log(res.data)
        this.helmatList.splice(0)
        const helList = res.data.obj || []
        helList.forEach(item => this.helmatList.push(item))
        setTimeout(() => this.helmatList.forEach(item => this.addMarker(item)), 50)
      })
    this.timer = setInterval(() => {
      // this.organizeIdList = [JSON.parse(sessionStorage.getItem('regionId'))]
      findDevOnline({
        organizeIdList: this.organizeIdList
      }).then(res => {
        // console.log(res.data)
        const helList = res.data.obj || []
        addToOri(this.helmatList, helList)
        const resArr = spliceFromOri(this.helmatList, helList)
        updateOri(this.helmatList, helList)
        resArr.forEach(item => this.removeMarker(item))
        this.helmatList.forEach(item => {
          if (item.marker) {
            this.markers.push(item.marker)
            this.markers = Array.from(new Set(this.markers))
            this.updateMarker(item)
          } else {
            this.addMarker(item)
          }
        })
        this.liveNum = this.helmatList.filter(item => {
          return item.liveStatus !== '0'
        })
      })
    }, 4000)
    setTimeout(() => {
      addRoadNetLayer(this.map)
    }, 600)
    // toggleCluster() {
      if (this.map) {
        // if (this.dataCluster) {
        //     //清空所有的marker及点聚合对象
        //   this.dataCluster.setMap(null)
        //   }
          //创建聚合管理对象 并将各参数设置到其中
          this.map.plugin(['IMAP.DataCluster'], () => {
            // console.log(this.markers)
            this.dataCluster = new IMAP.DataCluster(this.map, this.markers, {
              maxZoom: 0,
              gridSize: 100,
              zoomOnClick: true,
              minimumClusterSize: 2
            })
          })
        }
  },
  destroyed() {
    clearInterval(this.timer)
  }
};
</script>
