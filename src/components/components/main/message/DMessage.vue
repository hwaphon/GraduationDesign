<template>
  <div class="dmessages-container">
    <el-row :gutter="20" class="custom-container">
      <i class="fa fa-plus add-message" aria-hidden="true" title="点击发布新留言" @click="addMessage"></i>
      <el-col :span="6"
              v-for="(message, index) in messages"
              :key="index"
              class="col-content">
        <div class="message" @click="routerMessage(message.objectId, message.topic)">
          <img :src="message.avatar" alt="头像">
          <p>{{ message.topic }}</p>
        </div>
      </el-col>
    </el-row>
    <div class="pagination">
      <el-pagination
        @current-change="pageChange"
        background
        layout="prev, pager, next"
        :page-size="limit"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="发布新留言"
      :visible.sync="dialogVisible"
      width="30%">
      <p :style="{ 'margin-bottom': '16px' }"><el-input type="text" v-model="topic" placeholder="主题"></el-input></p>
      <p><el-input type="textarea" v-model="des" placeholder="详细描述" :rows="3"></el-input></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMessageRequest">发布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import ElInput from "../../../../../node_modules/element-ui/packages/input/src/input.vue";
    import Request from '@/network/networkHelper'
    import API from '@/const/dataApi'
    import Cache from '@/util/cache'
    import Record from '@/util/record'
    import Tooltip from '@/util/tooltip'
    const KEY = 'MESSAGES'
    const COUNT = 'MESSAGECOUNT'
    export default {
      components: {ElInput},
      data () {
        return {
          messages: [],
          total: 0,
          limit: 12,
          dialogVisible: false,
          topic: '',
          des: '',
          tooltip: new Tooltip(this)
        }
      },
      methods: {
        pageChange (index) {
          let realIndex = index - 1
          this.getMessages(KEY, API.MESSAGES, { skip: realIndex * this.limit, limit: this.limit })
        },
        routerMessage (id, topic) {
            this.$router.push({ path: `/message/detail/${ id }`, query: { topic: topic }})
        },
        addMessage () {
          this.dialogVisible = !this.dialogVisible
        },
        getMessages (key, url, ops) {
          let _this = this
          let page = Math.floor(ops.skip / ops.limit)
          let isExist = Cache.exsit(key, page, ops.limit)
          if (isExist) {
            this.messages = Cache.get(key, page, ops.limit)
            this.total = JSON.parse(sessionStorage.getItem(COUNT))
          } else {
            Request.get(url, ops).then(function (result) {
              let data = result.data.results
              Cache.save(key, data)
              _this.messages = data

              let count = JSON.parse(sessionStorage.getItem(COUNT))
              if (count === null && result.data.count) {
                _this.total = result.data.count
                sessionStorage.setItem(COUNT, JSON.stringify(_this.total))
              }
            })
          }
        },
        addMessageRequest () {
          if (this.topic.length <= 0 || this.des.length <= 0) {
            this.tooltip.show('warning', '信息输入不完整')
            return
          }
          let _this = this
          let userinfo = JSON.parse(sessionStorage.getItem('USERINFO'))
          if (userinfo) {
            let param = {
              topic: this.topic,
              des: this.des,
              avatar: userinfo.avatar,
              user: {
                '__type': 'Pointer',
                className: '_User',
                objectId: userinfo.objectId
              }
            }
            Request.post(API.MESSAGES, param)
              .then(function (res) {
                if (res.status === 200 || res.status === 201) {
                    let message = { avatar: userinfo.avatar, topic: _this.topic, objectId: res.data.objectId }
                    _this.messages.unshift(message)
                    Cache.save(KEY, message)
                    _this.total += 1
                    sessionStorage.setItem(COUNT, JSON.stringify(_this.total))
                    _this.dialogVisible = false
                    _this.topic = ''
                    _this.des = ''
                    _this.tooltip.show('success', '发布成功')
                } else {
                  _this.tooltip.show('warning', '发布失败')
                }
              })
          } else {
            this.tooltip.show('warning', '请先登录')
          }
        }
      },
      created () {
        this.getMessages(KEY, API.MESSAGES, { skip: 0, limit: 12, count: 1 })
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/message/dmessage";
</style>
