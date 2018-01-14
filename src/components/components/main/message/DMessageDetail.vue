<template>
  <div class="dmessage-detail">
    <div class="dmessage-detail-header">
      <div class="nav" @click="back">
        <span class="el-icon-arrow-left"></span>
        <span>返回</span>
      </div>
      <span class="header">{{ topic }}</span>
    </div>

    <div class="dmessage-detail-content">
      <div class="user">
        <img :src="avatar" alt="">
        <span class="name">{{ username }}</span>
      </div>
      <p class="des">详细描述: {{ des }}</p>
    </div>
    <div class="comments">
      <DComments :id="$route.params.id" :title="topic"></DComments>
    </div>
  </div>
</template>

<script>
    import API from '@/const/dataApi'
    import Request from '@/network/networkHelper'
    import DComments from '../../global/DComments.vue'
    export default {
      methods: {
        back () {
          this.$router.back()
        }
      },
      components: {
        DComments
      },
      data () {
        return {
          topic: this.$route.query.topic,
          avatar: '',
          username: '',
          des: ''
        }
      },
      created () {
        let _this = this
        let param = {
          include: 'user'
        }
        Request.get(API.MESSAGES + `/${ this.$route.params.id }`, param)
          .then(function (res) {
            if (res.status === 200) {
              let data = res.data
              _this.avatar = data.user.avatar
              _this.username = data.user.username
              _this.des= data.des
            }
          })
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/message/dmessagedetail";
</style>
