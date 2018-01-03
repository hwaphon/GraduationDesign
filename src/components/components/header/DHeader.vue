<template>
  <div class="dheader">
    <header @click="logoClick">
      <img :src="logo" alt="os logo">
      <h1 id="dheader-logo-font">在线学习平台</h1>
    </header>
    <section>
      <ul class="dheader-menulist">
        <li v-for="item in items"
            :key="item.index"
            @click="router(item.path, item.index)"
            :class="[ item.index === currentIndex ? 'active': '' ]">
          {{ item.name }}
        </li>
      </ul>
      <DSearch></DSearch>
      <div class="dheader-enter" v-if="!logined">
        <span @click="login">登录</span>
        <span @click="register">注册</span>
      </div>
      <div class="dheader-userinfo" v-else title="点击查看个人中心" @click="goUserCenter">
        <img :src="userAvatar" alt="头像">
        <span>{{ userName }}</span>
      </div>
    </section>
    <DLogin v-model="showModel" :activeName="activeName" @onSuccess="loginSuccess"></DLogin>
  </div>
</template>

<script>
    import Icon from '../../../const/Icon'
    import DSearch from './DSearch.vue'
    import DLogin from '../global/DLoginAndRegister.vue'
    import { request } from '@/network/network'
    import API from '@/const/Api'
    import { mapState } from 'vuex'
    export default {
      data () {
        return {
          logo: Icon.oslogo,
          items: [
            { name: '视频课程', index: 0, path: '/course' },
            { name: '习题练习', index: 1, path: '/exercise' },
            { name: '作业发布', index: 2, path: '/task' },
            { name: '留言讨论', index: 3, path: '/message' },
            { name: '实验指导', index: 4, path: '/practice' }
          ],
          showModel: false,
          activeName: 'login',
          logined: false,
          userAvatar: '',
          userName: ''
        }
      },
      methods: {
        logoClick () {
          this.router('/', -1)
        },
        router (path, index) {
          this.$router.push(path)
          this.$store.dispatch('updateCurrentIndex', index)
        },
        login () {
          this.activeName = 'login'
          this.showModel = true
        },
        register () {
          this.activeName = 'register'
          this.showModel = true
        },
        loginSuccess (data) {
          this.logined = true
          console.log(data)
          this.userName = data.username
          this.userAvatar = data.avatar
        },
        goUserCenter () {
          this.$router.push('/usercenter')
        }
      },
      components: {
        DSearch,
        DLogin
      },
      computed: {
        ...mapState(
          ['currentIndex']
        )
      },
      created () {
        var _this = this
        request(API.CURRENT, {}, function (result) {
          if (result.data.avatar) {
            _this.logined = true
            _this.userAvatar = result.data.avatar
            _this.userName = result.data.username
          }
        })
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/header/dheader";
</style>
