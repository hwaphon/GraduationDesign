<template>
  <div class="dheader">
    <header @click="logoClick">
      <img :src="logo" alt="os logo">
      <h1 id="dheader-logo-font">在线学习平台</h1>
    </header>
    <section>
      <ul class="dheader-menulist">
        <li v-for="(item, index) in items"
            :key="index">
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
    export default {
      data () {
        return {
          logo: Icon.oslogo,
          items: [
            { name: '视频课程' },
            { name: '习题练习' },
            { name: '作业发布' },
            { name: '留言讨论' }
          ]
        }
      },
      methods: {
        logoClick () {
          this.$router.push('/')
        }
      },
      components: {
        DSearch
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/header/dheader";
</style>
