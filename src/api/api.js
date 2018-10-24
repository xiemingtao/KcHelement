import axios from 'axios'

let base = ''

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }
// 查询组织架构
export const findOrganize = params => { return axios.get(`${base}/basics/findOrganize.action`, { params: params }) }
// 新增组织架构
export const insertOrganize = params => { return axios.get(`${base}/basics/insertOrganize.action`, { params: params }) }
// 编辑组织架构
export const updateOrganize = params => { return axios.get(`${base}/basics/updateOrganize.action`, { params: params }) }
// 删除组织架构
export const deleteOrganize = params => { return axios.get(`${base}/basics/deleteOrganize.action`, { params: params }) }
// 条件查询设备列表
export const findDeviceList = params => { return axios.get(`${base}/basics/findDeviceList.action`, { params: params }) }
// 编辑设备
export const updateDeviceList = params => { return axios.get(`${base}/basics/updateDeviceList.action`, { params: params }) }
// 新增设备
export const insertDeviceList = params => { return axios.get(`${base}/basics/insertDeviceList.action`, { params: params }) }
// 删除设备
export const deleteDevice = params => { return axios.get(`${base}/basics/deleteDevice.action`, { params: params }) }
// id查询设备详情
export const findDeviceById = params => { return axios.get(`${base}/basics/findDeviceById.action`, { params: params }) }

// export const findDeviceById = params => { return axios.get(`${base}/basics/findDeviceById.action`, { params: params }) }
// 回看日志列表
// export const updateDeviceList = params => { return axios.get(`${base}/basics/findDeviceById.action`, { params: params }) }
