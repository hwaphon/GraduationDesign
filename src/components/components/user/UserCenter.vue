<template>
  <div class="usercenter">
    <div class="basic-info">
      <img :src="avatar" alt="头像" class="avatar" title="点击可更改头像" @click="avatarChange = true">
      <span class="nickname">{{ username }}<em v-if="isTeacher" class="teacher">(教师)</em></span>
      <span class="email" v-if="email">{{ email }}</span>
      <span class="bind-email" @click="emailVerify = true" v-else>你还没有绑定邮箱，点击绑定</span>
      <span class="date">{{ createdAt }}加入在线学习平台</span>
      <el-button type="primary" class="exit-btn" @click="dialogVisible = true">退出登录</el-button>
    </div>
    <div class="msg-info">
      <span class="tooltips">我的动态</span>
      <div class="msg" v-for="msg in currentMessage">
        <a :href="msg.url">{{ msg.content }} <span class="msg-date">{{ formateDate(msg.updatedAt) }}</span></a>
      </div>
      <div class="msg-info-pagination" v-if="messages.length > pageSize">
        <el-pagination
          background
          :page-size="pageSize"
          :current-page.sync="page"
          :total="messages.length"
          layout="prev, pager, next">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定退出吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="loginout">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="emailVerify"
      width="30%">
      <el-input v-model="bemail"
                placeholder="请输入你的邮箱"
                prefix-icon="el-icon-message"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="emailVerify = false">取 消</el-button>
        <el-button type="primary" @click="bindEmail">绑定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="avatarChange"
      width="30%">
      <el-input v-model="bavatar"
                placeholder="请输入头像的url地址(请携带 http 或 https 头)"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="avatarChange = false">取 消</el-button>
        <el-button type="primary" @click="updateAvatar">绑定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Record from '@/util/record'
  import Helper from '@/util/helper'
  import Tooltip from '@/util/tooltip'
  import API from '@/const/dataApi'
  import Request from '@/network/networkHelper'

  export default {
    data() {
      return {
        avatar: '',
        username: '',
        email: '',
        date: '',
        messages: [],
        dialogVisible: false,
        emailVerify: false,
        bemail: '',
        tooltip: new Tooltip(this),
        avatarChange: false,
        bavatar: '',
        isTeacher: false,
        page: 1,
        pageSize: 12,
        currentMessage: []
      }
    },
    computed: {
      createdAt() {
        let date = new Date(this.date)
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
      }
    },
    watch: {
      page (cp) {
        let start = (cp - 1) * this.pageSize
        let end = start + this.pageSize
        this.currentMessage = this.messages.slice(start, end)
      }
    },
    methods: {
      formateDate(date) {
        return Helper.formateDate(date)
      },
      isValidUrl(url) {
        if (!!~url.indexOf('.png') || !!~url.indexOf('.jpg') || !!~url.indexOf('.jpeg')) {
          let urlRegExp = /^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
          if (urlRegExp.test(url)) {
            return true;
          }
        }
        return false
      },
      updateAvatar() {
        if (this.isValidUrl(this.bavatar)) {
          let userinfo = JSON.parse(localStorage.getItem('USERINFO'))
          if (userinfo) {
            let _this = this
            let param = {
              avatar: this.bavatar
            }
            Request.put(API.USERS + userinfo.objectId, param)
              .then(function (res) {
                if (res.status === 200) {
                  _this.avatarChange = false
                  _this.avatar = _this.bavatar
                  _this.bavatar = ''
                  userinfo.avatar = _this.avatar
                  localStorage.setItem('USERINFO', JSON.stringify(userinfo))
                  window.location.reload()
                } else {
                }
              })
          } else {
            this.tooltip.show('warning', '请先登录')
          }
        } else {
          this.tooltip.show('warning', '请输入合法的 url 地址')
        }
      },
      loginout() {
        this.dialogVisible = false
        this.$router.push('/')
        window.location.reload()
        localStorage.removeItem('USERINFO')
      },
      isEmail(email) {
        let emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/g
        return emailReg.test(email)
      },
      verifyEmail() {
        if (!this.isEmail(this.bemail)) {
          this.tooltip.show('warning', '请输入合法的邮箱地址')
          return false
        }
        return true
      },
      bindEmail() {
        if (this.verifyEmail()) {
          let _this = this
          let userinfo = JSON.parse(localStorage.getItem('USERINFO'))
          Request.updateUser(API.USERS + userinfo.objectId, {email: this.bemail})
            .then(function (res) {
              if (res.status === 200 || res.status === 201) {
                Request.post(API.EMAIL, {email: _this.bemail})
                  .then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                      _this.tooltip.show('success', '发送验证邮件成功，快去邮箱确认吧')
                      _this.email = _this.bemail
                      let userinfo = JSON.parse(localStorage.getItem('USERINFO'))
                      if (userinfo) {
                        userinfo.email = _this.bemail
                        localStorage.setItem('USERINFO', JSON.stringify(userinfo))
                      }
                      _this.emailVerify = false
                    }
                  })
                  .catch(function () {
                    _this.tooltip.show('warning', '发送验证邮件失败')
                  })
              } else {
                _this.tooltip.show('warning', '绑定邮箱失败')
              }
            }).catch(function () {
            _this.tooltip.show('warning', '绑定邮箱失败')
          })
        }
      }
    },
    created() {
      let _this = this
      this.$store.dispatch('updateCurrentIndex', -1)
      let userinfo = JSON.parse(localStorage.getItem('USERINFO'))
      if (userinfo) {
        this.avatar = userinfo.avatar
        this.username = userinfo.username
        this.email = userinfo.email
        this.date = userinfo.createdAt
        this.isTeacher = userinfo.isTeacher
        Record.get().then(function (res) {
          if (res.status === 200) {
            _this.messages = res.data.results
            _this.currentMessage = _this.messages.slice(0, _this.pageSize)
          } else {
            this.$message({
              type: 'warning',
              duration: 2000,
              message: '获取动态失败',
              center: true
            })
          }
        }).catch(function () {
          this.$message({
            type: 'warning',
            duration: 2000,
            message: '获取动态失败',
            center: true
          })
        })
      } else {
        this.tooltip.show('warning', '请先登录')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../styles/user/usercenter";
</style>
