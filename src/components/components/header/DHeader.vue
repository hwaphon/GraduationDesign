<template>
  <div class="dheader">
    <header @click="logoClick">
      <img :src="logo" alt="os logo">
      <h1 id="dheader-logo-font">操作系统学习平台</h1>
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
      <div class="dheader-enter" v-if="!logined">
        <span @click="login">登录</span>
        <span @click="register">注册</span>
      </div>
      <div class="dheader-userinfo" v-else title="点击查看个人中心" @click="goUserCenter">
        <img :src="userAvatar" alt="头像">
        <span>{{ userName }}<em v-if="isTeacher" class="teacher">(教师)</em></span>
      </div>
    </section>
    <DLogin v-model="showModel" :activeName="activeName" @onSuccess="loginSuccess"></DLogin>
  </div>
</template>

<script>
    import Icon from '../../../const/Icon'
    import DLogin from '../global/DLoginAndRegister.vue'
    import { mapState } from 'vuex'
    export default {
      data () {
        return {
          logo: Icon.oslogo,
          items: [
            { name: '教学大纲', index: 0, path: '/point' },
            { name: '视频课程', index: 1, path: '/course' },
            { name: '习题练习', index: 2, path: '/exercise' },
            { name: '作业发布', index: 3, path: '/task' },
            { name: '留言讨论', index: 4, path: '/message' }
          ],
          showModel: false,
          activeName: 'login',
          logined: false,
          userAvatar: '',
          userName: '',
          isTeacher: false
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
          this.userName = data.username
          this.userAvatar = data.avatar
          this.isTeacher = data.isTeacher
        },
        goUserCenter () {
          this.$router.push('/usercenter')
        }
      },
      components: {
        DLogin
      },
      computed: {
        ...mapState(
          ['currentIndex']
        )
      },
      created () {
        let userinfo = JSON.parse(localStorage.getItem('USERINFO'));
        if (userinfo) {
          this.loginSuccess(userinfo)
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/header/dheader";
</style>
