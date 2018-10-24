<template>
  <div class="push-msg">

    <!--:rules="formRule"-->
    <Form ref="pushForm" :model="formData" :label-width="100" style="width: 640px;">
      <FormItem label="推送指令" prop="fileName">
        <Select v-model="formData.pushCmd"   class="select-item" >
          <Option v-for="cmdItem in cmdList" :value="cmdItem.value" :key="cmdItem.value">{{ cmdItem.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="推送设备" prop="dept">
        <Select v-model="formData.sPoliceName"  class="select-item" style="margin-left: 6px" @on-change="onChangeArea" >
          <Option v-for="item in orgOptions" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <Select v-model="formData.sStationName"  class="select-item" style="margin-left: 6px" >
          <Option v-for="item in policeStation" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>

      <FormItem>
        <div style="background-color: #003558; border: 1px solid #003558; border-radius: 5px;padding: 10px;">
          <div style="border-bottom: 1px solid #5a98d5;padding-bottom:6px;margin-bottom:6px;">
            <Checkbox
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll">全选</Checkbox>
          </div>
          <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <Checkbox label="设备编号01" style="margin-right: 40px;"></Checkbox>
            <Checkbox label="设备编号02" style="margin-right: 40px;"></Checkbox>
            <Checkbox label="设备编号03" style="margin-right: 40px;"></Checkbox>
            <Checkbox label="设备编号04" style="margin-right: 40px;"></Checkbox>
            <Checkbox label="设备编号05" style="margin-right: 40px;"></Checkbox>
            <Checkbox label="设备编号06" style="margin-right: 40px;"></Checkbox>
            <Checkbox label="设备编号07" style="margin-right: 40px;"></Checkbox>
            <Checkbox label="设备编号08" style="margin-right: 40px;"></Checkbox>
            <Checkbox label="设备编号09" style="margin-right: 40px;"></Checkbox>
            <Checkbox label="设备编号10" style="margin-right: 40px;"></Checkbox>
            <Checkbox label="设备编号11" style="margin-right: 40px;"></Checkbox>
            <Checkbox label="设备编号12" style="margin-right: 40px;"></Checkbox>
          </CheckboxGroup>
        </div>

      </FormItem>
      <FormItem>
        <Button  @click="handleReset('pushForm')" class="btn-cancel">取消</Button>
        <Button  @click="handleSubmit('pushForm')" class="btn-confirm">推送</Button>
      </FormItem>
    </Form>


  </div>
</template>

<script>
    export default {
      data () {
        return {
          indeterminate: true,
          checkAll: false,
          checkAllGroup: ['设备编号01', '设备编号02'],

          formData: {
            pushCmd: '',
            sPoliceName: '',
            sStationName: ''
          },
          cmdList: [
            {
              value: '11',
              label: '人脸识别'
            },
            {
              value: '12',
              label: '身份证识别'
            },
            {
              value: '13',
              label: '车牌识别'
            },
            {
              value: '14',
              label: '打开直播'
            },
            {
              value: '15',
              label: '关闭直播'
            },
            {
              value: '16',
              label: '卸载'
            }
          ],
          // policeList: [],
          policeStation: []
        }
      },
      props: ['orgOptions'],
      mounted () {
        // this.policeStation = this.$store.state.station.stations
        // this.cityList = this.$store.state.station.citys
        // this.policeList = this.$store.state.station.orgList
        // console.log('this.policeList.length----------' + this.policeList.length)
      },
      methods: {
        //  区域变更
        onChangeArea (id) {
          var len = this.orgOptions.length
          // console.log('onChangeArea----------' + id)
          if (len !== 0) {
            this.orgOptions.forEach((item, index) => {
              if (id === item.id) {
                this.policeStation = item.children
                // console.log('id----------' + item.id)
              }
            })
          }
          this.formData.sStationName = ''
        },
        handleSubmit (name) {
          // console.log('---------' + this.formData.pushCmd)
          // console.log('---------' + this.formData.sPoliceName)
          // console.log('---------' + this.formData.sStationName)
          // console.log('---------' + this.checkAllGroup)
          this.$refs[name].validate((valid) => {
            if (valid) {
              this.$Message.success('Success!')
            } else {
              this.$Message.error('Fail!')
            }
          })
        },
        handleReset (name) {
          this.$refs[name].resetFields()
        },
        handleCheckAll () {
          if (this.indeterminate) {
            this.checkAll = false
          } else {
            this.checkAll = !this.checkAll
          }
          this.indeterminate = false

          if (this.checkAll) {
            this.checkAllGroup = [
              '设备编号01', '设备编号02', '设备编号03', '设备编号04', '设备编号05',
              '设备编号06', '设备编号07', '设备编号08', '设备编号09', '设备编号10',
              '设备编号11', '设备编号12'
            ]
          } else {
            this.checkAllGroup = []
          }
        },
        checkAllGroupChange (data) {
          if (data.length === 12) {
            this.indeterminate = false
            this.checkAll = true
          } else if (data.length > 0) {
            this.indeterminate = true
            this.checkAll = false
          } else {
            this.indeterminate = false
            this.checkAll = false
          }
        }
      }
    }
</script>

<style lang="less">
  @import './pushMsgCmd.less';
</style>
