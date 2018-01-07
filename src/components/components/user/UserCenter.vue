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
    import API from '@/const/Api'
    import { request } from '@/network/network'
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
        request(API.USERINFO, {}, function (result) {
          if (result.status === 200) {
            _this.avatar = result.data.avatar
            _this.username = result.data.username
            _this.email = result.data.email
            _this.date = result.data.createdAt
          }
        })
        Record.get().then(function (data) {
          _this.messages = data
        })
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/user/usercenter";
</style>
