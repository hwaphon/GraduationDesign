<template>
  <div class="dfooter">
    <ul class="dfooter-nav">
      <li v-for="(item, index) in items" :key="index">
        <a :href="item.src" target="_blank">{{ item.title }}</a>
      </li>
    </ul>
    <div class="copyright">
      &copy;14级软件工程-高华峰
    </div>
  </div>
</template>

<script>
    export default {
      data () {
        return {
          items: [
            { title: '关于我们', src: '' },
            { title: '我的博客', src: 'http://hwaphon.top/' },
            { title: '我的 Github', src: 'https://github.com/hwaphon'},
            { title: '友情链接', src: '' }
          ]
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/footer/dfooter";
</style>
