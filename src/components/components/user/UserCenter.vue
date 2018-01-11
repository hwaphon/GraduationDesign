<template>
  <div class="usercenter">
    <div class="basic-info">
      <img :src="avatar" alt="头像" class="avatar">
      <span class="nickname">{{ username }}</span>
      <span class="email">{{ email }}</span>
      <span class="date">{{ createdAt }}加入在线学习平台</span>
    </div>
    <div class="msg-info">
      <span class="tooltips">我的动态</span>
      <div class="msg" v-for="msg in messages">
        <a :href="msg.url">{{ msg.content }} <span class="msg-date">{{ formateDate(msg.updatedAt) }}</span></a>
      </div>
    </div>
  </div>
</template>

<script>
    import Record from '@/util/record'
    import Helper from '@/util/helper'
    export default {
      data () {
        return {
          avatar: '',
          username: '',
          email: '',
          date: '',
          messages: []
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
