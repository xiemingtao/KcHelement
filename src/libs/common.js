// 路网
import IMAP from 'IMAP'
export const addRoadNetLayer = map => {
  let ROADNET_URL = 'http://15.75.0.255:25001/v3/tile?x={x}&y={y}&z={z}'
  const getRoadTileUrl = (x, y, z) => ROADNET_URL.replace('{x}', x).replace('{y}', y).replace('{z}', z)
  const RoadLayer = new IMAP.TileLayer({
    maxZoom: 20,
    minZoom: 1,
    tileSize: 256
  })
  RoadLayer.setTileUrlFunc(getRoadTileUrl)
  RoadLayer.setOpacity(0.9)
  map.addLayer(RoadLayer)
  return RoadLayer
}
export const dateFmt = (str) => {
  const year = String(new Date(str).getFullYear())
  const month = String(new Date(str).getMonth() + 1 < 10 ? '0' + (new Date(str).getMonth() + 1) : new Date(str).getMonth() + 1)
  const day = String(new Date(str).getDate() < 10 ? '0' + new Date(str).getDate() : new Date(str).getDate())
  const hour = String(new Date(str).getHours() < 10 ? '0' + new Date(str).getHours() : new Date(str).getHours())
  const minute = String(new Date(str).getMinutes() < 10 ? '0' + new Date(str).getMinutes() : new Date(str).getMinutes())
  const second = String(new Date(str).getSeconds() < 10 ? '0' + new Date(str).getSeconds() : new Date(str).getSeconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
// .padStart(2, 0)
