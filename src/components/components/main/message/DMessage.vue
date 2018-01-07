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
      <p><el-input type="textarea" v-model="des" placeholder="详细描述"></el-input></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMessageRequest">发布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import ElInput from "../../../../../node_modules/element-ui/packages/input/src/input.vue";
    import { request, post } from '@/network/network'
    import API from '@/const/Api'
    import Cache from '@/util/cache'
    import Record from '@/util/record'
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
          des: ''
        }
      },
      methods: {
        pageChange (index) {
          let realIndex = index - 1
          this.getMessages(KEY, API.MESSAGES, { page: realIndex, limit: 12 })
        },
        routerMessage (id, topic) {
            this.$router.push({ path: `/message/detail/${ id }`, query: { topic: topic }})
        },
        addMessage () {
          this.dialogVisible = !this.dialogVisible
        },
        getMessages (key, url, ops) {
          let _this = this
          let isExist = Cache.exsit(key, ops.page, ops.limit)
          if (isExist) {
            this.messages = Cache.get(key, ops.page, ops.limit)
          } else {
            request(url, ops, function (result) {
              let data = result.data
              _this.messages = data
              Cache.save(key, data)
            })
          }
        },
        addMessageRequest () {
          if (this.topic.length <= 0 || this.des.length <= 0) {
            this.$message({
              message: '信息输入不完整',
              type: 'warning',
              duration: 2000,
              center: true
            })
            return
          }
          let _this = this
          post(API.MESSAGES, { topic: _this.topic, des: _this.des }, function (res) {
            if (res.status === 200) {
              let data = res.data
              if (data.status === 'ok') {
                let message = { avatar: data.avatar, topic: data.topic, objectId: data.objectId }
                _this.messages.unshift(message)
                Cache.save(KEY, message)
                _this.total += 1
                sessionStorage.setItem(COUNT, JSON.stringify(_this.total))
                _this.dialogVisible = false
                _this.topic = ''
                _this.des = ''
                _this.$message({
                  message: '发送成功',
                  type: 'success',
                  center: true,
                  duration: 2000,
                })
              } else {
                _this.$message({
                  message: data.msg,
                  type: 'warning',
                  center: true,
                  duration: 2000
                })
              }
            } else {
              _this.$message({
                message: '发布失败',
                type: 'warning',
                center: true,
                duration: 2000
              })
            }
          })
        }
      },
      created () {
        let _this = this
        this.getMessages(KEY, API.MESSAGES, { page: 0, limit: 12 })
        let count = JSON.parse(sessionStorage.getItem(COUNT))
        if (count === null) {
          request(API.MESSAGESCOUNT, {}, function (result) {
            if (result.status === 200) {
              _this.total = result.data.length
              sessionStorage.setItem(COUNT, JSON.stringify(_this.total))
            }
          })
        } else {
          _this.total = count
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/message/dmessage";
</style>
