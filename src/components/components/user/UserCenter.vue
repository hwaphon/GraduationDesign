<template>
  <div class="usercenter">
    <div class="basic-info">
      <img :src="avatar" alt="头像" class="avatar" title="点击可更改头像">
      <span class="nickname">{{ username }}</span>
      <span class="email" v-if="email">{{ email }}</span>
      <span class="bind-email" @click="emailVerify = true" v-else>你还没有绑定邮箱，点击绑定</span>
      <span class="date">{{ createdAt }}加入在线学习平台</span>
      <el-button type="primary" class="exit-btn" @click="dialogVisible = true">退出登录</el-button>
    </div>
    <div class="msg-info">
      <span class="tooltips">我的动态</span>
      <div class="msg" v-for="msg in messages">
        <a :href="msg.url">{{ msg.content }} <span class="msg-date">{{ formateDate(msg.updatedAt) }}</span></a>
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
  </div>
</template>

<script>
    import Record from '@/util/record'
    import Helper from '@/util/helper'
    import Tooltip from '@/util/tooltip'
    import API from '@/const/dataApi'
    import Request from '@/network/networkHelper'
    export default {
      data () {
        return {
          avatar: '',
          username: '',
          email: '',
          date: '',
          messages: [],
          dialogVisible: false,
          emailVerify: false,
          bemail: '',
          tooltip: new Tooltip(this)
        }
      },
      computed: {
        createdAt () {
          let date = new Date(this.date)
          return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
        }
      },
      methods: {
        formateDate (date) {
          return Helper.formateDate(date)
        },
        loginout () {
          this.dialogVisible = false
          this.$router.push('/')
          window.location.reload()
          sessionStorage.removeItem('USERINFO')
        },
        isEmail (email) {
          let emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/g
          return emailReg.test(email)
        },
        verifyEmail () {
          if (!this.isEmail(this.bemail)) {
            this.tooltip.show('warning', '请输入合法的邮箱地址')
            return false
          }
          return true
        },
        bindEmail () {
          if (this.verifyEmail()) {
            let _this = this
            let userinfo = JSON.parse(sessionStorage.getItem('USERINFO'))
            Request.updateUser(API.USERS + userinfo.objectId, { email: this.bemail})
              .then(function (res) {
                if (res.status === 200 || res.status === 201) {
                  Request.post(API.EMAIL, { email: _this.bemail})
                    .then(function (res) {
                      if (res.status === 200 || res.status === 201) {
                        _this.tooltip.show('success', '发送验证邮件成功，快去邮箱确认吧')
                        _this.email = _this.bemail
                        let userinfo = JSON.parse(sessionStorage.getItem('USERINFO'))
                        if (userinfo) {
                          userinfo.email = _this.bemail
                          sessionStorage.setItem('USERINFO', JSON.stringify(userinfo))
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
      created () {
        let _this = this
        this.$store.dispatch('updateCurrentIndex', -1)
        let userinfo = JSON.parse(sessionStorage.getItem('USERINFO'))
        if (userinfo) {
          this.avatar = userinfo.avatar
          this.username = userinfo.username
          this.email = userinfo.email
          this.date = userinfo.createdAt
        }
        Record.get().then(function (res) {
          if (res.status === 200) {
            _this.messages = res.data.results
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
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/user/usercenter";
</style>
