import axios from 'axios'
// axios.defaults.baseURL = 'https:zntk.police.sh.cn'
// axios.defaults.baseURL = 'http://192.168.0.107:8080'
// axios.defaults.baseURL = 'http://172.19.60.80'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true

const config = { 'Content-Type': 'multipart/form-data' }

const transParam = params => {
  const resParam = new URLSearchParams()
  for (const key in params) {
    resParam.append(key, params[key])
  }
  return resParam
}

const post = url => params => new Promise((resolve, reject) => axios.post(url, transParam(params)).then(res => resolve(res)).catch(err => reject(err)))

const get = url => params => new Promise((resolve, reject) => axios.get(url, transParam(params)).then(res => resolve(res)).catch(err => reject(err)))

export const publishWanted = post('/table/push.action')

export const getHelmatList = get('/table/getInfo.action')

export const getLocationList = get('/table/getLocation.action') // 获取经纬度

export const getEDInfoList = get('/table/getEDInfo.action') // 获取经纬度包装

export const getKeySearchList = params => new Promise((resolve, reject) => axios({
  methods: 'POST',
  url: 'http://172.19.60.6:25001/as/search/poi',
  data: params
}).then(res => resolve(res)
  .catch(err => reject(err))))

export const uploadWordPDF = params => new Promise((resolve, reject) => axios.post('/table/push.action', params, config).then(res => resolve(res)).catch(err => reject(err)))
