<template>
  <div style="width: 100%;height: 100%;border-radius: 5px;">
     <div id="map" style="width: 100%;height: 100%;border-radius: 5px;"></div>
      <div class="searchWrap">
        <input class="searchTxt" type="text" placeholder="请输入地址" v-model="textSearch" @input="searchBtn">
        <input class="searchBtn" type="button" value="搜索" @click="searchBtn"/>
        <div id="suggestId" style="position: absolute;background-color: #ffffff;border: 1px solid #d1d1d1;visibility: visible; min-width: 151px; display: none;"></div>
      </div>
  </div>
</template>

<script>
  import IMAP from 'IMAP'
  import {addRoadNetLayer} from '../../libs/common'
  export default {
    data () {
      return {
        textSearch: '',
        map: null,
        marker: null,
        markers: null,
        poiSearch: null,
        latitude: '',
        longitude: '',
        address: '',
        geocoder: null
      }
    },
    props: ['value'],
    mounted () {
      this.$emit('input', this.marker)
      this.initMap()
      addRoadNetLayer(this.map)
    },
    methods: {
      initMap () {
        this.map = new IMAP.Map('map', {
          minZoom: 3,
          maxZoom: 20,
          zoom: 14,
          center: new IMAP.LngLat(121.11242, 31.15434),
          animation: true
        })
        this.map.addEventListener(IMAP.Constants.CLICK, this.clickEvent, this.map)
      },
      searchBtn () {
        this.doSuggest()
      },
      doSuggest (obj) {
        let suggestId = document.getElementById('suggestId')
        let city = '上海'
        while (suggestId.hasChildNodes()) {
          suggestId.removeChild(suggestId.firstChild)
        }
        if (!this.textSearch) {
          return
        }
        this.map.plugin(['IMAP.Suggest'], () => {
          const suggest = new IMAP.Suggest()
          suggest.search(this.textSearch, city, (status, results) => {
            if (status === '0') {
              let records = results.results
              let record
              let li
              suggestId.style.display = 'block'
              let ul = document.createElement('ul')
              ul.style.backgroundColor = '#054173'
              for (let i = 0, l = records.length; i < l; ++i) {
                record = records[i]
                li = document.createElement('li')
                li.innerHTML = record.name
                li.style.height = '40px'
                li.style.lineHeight = '40px'
                li.style.color = '#fff'
                li.style.textIndent = '10px'
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
          this.textSearch = name
          this.doSearch(1)
        }
        obj.onmouseover = () => {
          obj.style.backgroundColor = '#2d8cf0'
        }
        obj.onmouseout = () => {
          obj.style.backgroundColor = '#054173'
        }
      },
      doSearch (pageNo) {
        if (this.map) {
          this.clearReaults()
          let city = '上海'
          if (!this.textSearch) {
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
            this.poiSearch.setPageNumber(parseInt(pageNo - 1))
            this.poiSearch.search(this.textSearch, city, (status, result) => {
              if (status === '0') {
                const datas = result.results
                let data
                let icon
                const iconUrl = IMAP.MapConfig.API_REALM_NAME + IMAP.MapConfig._MAP_POINT_URL
                for (let i = 0, l = datas.length; i < l; ++i) {
                  data = datas[i]
                  icon = icons[i]
                  if (!icon) {
                    icon = icons[0]
                  }
                  this.marker = new IMAP.Marker(new IMAP.LngLat(data.location.lng,data.location.lat), {icon: new IMAP.Icon(iconUrl, icon.size, icon.offset)})
                  this.marker._data = data
                  this.addEvent(this.marker)
                  this.markers.push(this.marker)
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
          let lnglat = m._data.location
          this.address = m._data.address
          this.$emit('getLnglat', lnglat, this.address)
        }, m)
      },
      displayInfoWindow (m, data) {
        this.$emit('editInfo', data)
        let content = '<div style=\'font-family:\'微软雅黑\',Arial, Helvetica, sans-seriffont-size:12px\' color="#fff">地址：' + data.address
        if (data.telephone) {
          content += ('<br />电话：' + data.telephone)
        }
        content += '</div></div>'
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
      clickEvent (event) {
        if (this.marker) {
          this.map.getOverlayLayer().removeOverlay(this.marker)
        }
        let lnglat = event.lnglat
        this.map.plugin(['IMAP.Geocoder'], () => {
          this.geocoder = new IMAP.Geocoder({city: 'shanghai', pois: true})
          this.geocoder.getAddress(lnglat, (status, result) => {
            if (status === '0') {
              let opts = new IMAP.MarkerOptions()
              opts.anchor = IMAP.Constants.BOTTOM_CENTER
				      opts.icon = new IMAP.Icon(IMAP.MapConfig.API_REALM_NAME + "images/point_1.png",{"size":new IMAP.Size(35, 30),"offset":new IMAP.Pixel(1, 0)});
              this.marker = new IMAP.Marker(lnglat, opts)
              this.map.getOverlayLayer().addOverlay(this.marker, true);
              this.address = result.result[0].formatted_address
              this.$emit('getLnglat', lnglat, this.address)
              this.$emit('editInfo', {location: lnglat, address: this.address})
            }
          })
        })
      },
    },
    watch: {
      value (val) {
        if (val === '1') {
          this.map.getOverlayLayer().removeOverlay(this.marker);
          this.marker = null
          this.$emit('input', '2')
        }
      }
    }
  }
</script>

<style lang="less">
  .leador-popup-content-wrapper {
    background-color: rgb(8, 41, 70);
  .leador-popup-content {
    .leadormap-window {
      color: #fff;
      background-color: rgb(8, 41, 70);
    }
  }
}
#suggestId {
  top: 38px;
  width: 100%;
  border: 1px solid #028DE8
}
</style>
