import axios from 'axios'
import { parse } from 'path';
// axios.defaults.baseURL = 'http://15.75.4.37'
// axios.defaults.baseURL = 'http://15.75.2.160'
axios.defaults.baseURL = 'http://192.168.0.104:8080/'
// axios.defaults.timeout = 30000
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
const config = { 'Content-Type': 'application/json;charset=UTF-8' }
const configHeaders = {'Content-Type': 'multipart/form-data'}
axios.defaults.withCredentials = true

const transParam = params => {
  const resParam = new URLSearchParams()
  for (const key in params) resParam.append(key, params[key])
  return resParam
}

// name查询组织架构
export const getOrgName = params => axios.post('basics/findOrganizeByName.action', transParam(params))
// 组织架构
export const getOrgList = params => axios.post('/basics/findOrganize.action', transParam(params))

// export const insertOrg = params => axios.post('/basics/insertOrganize.action', JSON.stringify(params))
export const insertOrg = params => axios({
  method: 'POST',
  url: '/basics/insertOrganize.action',
  data: params,
  headers: config
})
export const updateOrg = params => axios({
  url: '/basics/updateOrganize.action',
  data: params,
  headers: config,
  method: 'POST'
})

export const deleteOrg = params => axios.post('/basics/deleteOrganize.action', transParam(params))

export const findOrgById = params => axios.post('/basics/findOrganizeById.action', transParam(params))

// 设备管理
export const findDvcList = params => axios.post('/basics/findDeviceList.action', transParam(params))

export const updateDvcList = params => axios({
  url: '/basics/updateDeviceList.action',
  method: 'POST',
  data: params,
  headers: config
})

export const insertDvcList = params => axios({
  url: '/basics/insertDeviceList.action',
  method: 'POST',
  data: params,
  headers: config
})
export const deleteDvcList = params => axios.post('/basics/deleteDevice.action', transParam(params))

export const findDvcById = params => axios.post('/basics/findDeviceById.action', transParam(params))

// 回看日志
export const findRecordList = params => axios.post('/basics/findRecordList.action', transParam(params))
// export const findRecordList = params => axios({
//   url: '/basics/findRecordList.action',
//   method: 'POST',
//   data: params,
//   headers: config
// })
// 日志详情
export const findRecordById = params => axios.post('/basics/findRecordById.action', transParam(params))

export const findRecordByLogId = params => axios.post('/basics/findDataByLogId.action', transParam(params))

export const findRecordCounts = params => axios.post('/basics/findRecordCounts.action', transParam(params))

export const getFileUrl = params => axios.post('filePlay/getFileUrl.action', transParam(params))
// POI搜索
export const POISearch = params => axios.post('/table/searchMapByConditions.action', params)

// 获取经纬度
export const getLocationList = params => axios.get('/table/getLocation.action', transParam(params))

export const getEDInfoList = () => axios.get('/table/getEDInfo.action')

export const getHelmatList = params => axios.get('/table/getInfo.action', transParam(params))
// 用户登陆
export const requestLogin = params => axios.post('/basics/login.action', transParam(params))
// 注销登陆
export const requestLogout = params => axios.post('/basics/logout.action', params)

// 人员管理
export const findUserList = params => axios.post('/basics/findUserList.action', transParam(params))

export const insertHelmetUser = params => axios.post('/basics/insertHelmetUser.action', transParam(params))

export const updateHelmetUser = params => axios.post('/basics/updateHelmetUser.action', transParam(params))

export const delHelmetUser = params => axios.post('/basics/delHelmetUser.action', transParam(params))

export const findUserById = params => axios.post('/basics/findUserById.action', transParam(params))
// 重置密码
export const resetPsd = params => axios.post('/basics/resetPassword.action', transParam(params))
// 导入excel表格
// export const importExcel = params => axios.post('/testExcl/importExcel.action', params)
// 推送指令import config from './../../build/config';

// export const pushTJL = params => new Promise((resolve, reject) => axios({
//   url: '/push/push.action',
//   data: params,
//   headers: config,
//   method:  'POST'
// }).then(res => resolve(res)).catch(err => reject(err)))
export const pushTJL = params => new Promise((resolve, reject) => axios.post('/basics/push.action', params, configHeaders).then(res => resolve(res)).catch(err => reject(err)))
// 查询在线设备
export const findDevOnline = params => axios.post('/basics/findOnline.action', transParam(params))
// 查询轨迹坐标
export const trackReplay = params => axios.post('/basics/findTrajectory.action', transParam(params))
// 查询有轨迹的日期
export const monthExist = params => axios.post('basics/existTrajectory.action', transParam(params))
// 上传excel表格
export const importExcel = params => axios({
  url: '/testExcl/importExcel.action',
  method: 'POST',
  data: params,
  headers: {'Content-Type': 'multipart/from-data'}
})
// 推送指令
export const pushCommand = params => axios.post('basics/pushCmd.action', transParam(params))
// 版本列表
export const getVersionList = params => axios.post('/basics/findAppVersion.action', transParam(params))
// 推送版本
export const insertAppVersion = params => new Promise((resolve, reject) => axios.post('/basics/insertAppVersion.action', params, configHeaders).then(res => resolve(res)).catch(err => reject(err)))
// 查询Key
export const adminKey = params => axios.post('basics/getNewOtherKey.action')
// 编辑Key
export const editKey = params => axios.post('basics/saveNewOtherKey.action', transParam(params))
// 删除版本管理
export const delVersion = params => axios.post('basics/deleteVersion.action', transParam(params))
// 添加管理员
export const insertAdmin = params => axios.post('basics/insertAdminUser.action', transParam(params))
// 删除管理员
export const deleteAdmin = params => axios.post('basics/deleteAdminUser.action', transParam(params))
// 查询管理员
export const selectAdmin = params => axios.post('basics/selectAdminUser.action', transParam(params))
// 重置管理员密码
export const resetAdmin = params => axios.post('basics/resetAdminUserPas.action', transParam(params))
// 修改管理员信息
export const updateUser = params => axios.post('/basics/updateAdminUser.action', transParam(params))
// 直播录像
export const findLive = params => axios.post('basics/findLiveVideosByDates.action', transParam(params))

export const findMessage = params => axios.post('basics/findMessage.action', transParam(params))
