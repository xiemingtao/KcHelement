
import config from './../../../build/config'
const station = {
  state: {
    orgList: [],
    equInfo: {},
    recordInfo: [],
    reviewInfo: JSON.parse(localStorage.getItem('recordInfo')) || {}
  },
  mutations: {
    initCitySelect (state, name) {
    },
    addEquInfo (state, payload) {
      state.equInfo = payload
    },
    addAreaList (state, payload) {
      state.areaList = payload
    },
    updateOrgList (state, loadlist) {
      state.orgList = loadlist
    },
    getRecordInfo (state, loadload) {
      for (const key in loadload) {
        state.recordInfo[key] = loadload[key]
      }
    },
    getReviewInfo(state, loadload) {
      // console.log(loadload)
      for(let i in loadload) {
        state.reviewInfo[i] = loadload[i]
      }
      localStorage.setItem('recordInfo', JSON.stringify(state.reviewInfo))
    }
  }
}

export default station