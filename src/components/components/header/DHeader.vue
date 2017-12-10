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
      <div class="dheader-enter">
        <span>登录</span>
        <span>注册</span>
      </div>
    </section>
  </div>
</template>

<script>
    import Icon from '../../../const/Icon'
    import DSearch from './DSearch.vue'
    import { mapState } from 'vuex'
    export default {
      data () {
        return {
          logo: Icon.oslogo,
          items: [
            { name: '视频课程', index: 0, path: '/course' },
            { name: '习题练习', index: 1, path: '/exercise' },
            { name: '作业发布', index: 2, path: '/task' },
            { name: '留言讨论', index: 3, path: '/message' }
          ]
        }
      },
      methods: {
        logoClick () {
          this.router('/', -1)
        },
        router (path, index) {
          this.$router.push(path)
          this.$store.dispatch('updateCurrentIndex', index)
        }
      },
      components: {
        DSearch
      },
      computed: {
        ...mapState(
          ['currentIndex']
        )
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/header/dheader";
</style>
