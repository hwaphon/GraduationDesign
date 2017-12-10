<template>
  <div class="dsearch">
    <input type="text" v-model="value" placeholder="请输入关键词" @keyup.enter="search">
    <HIcon type="search" class="dsearch-icon" size="16" @onClick="search"></HIcon>
  </div>
</template>

<script>
    import { HIcon } from 'vuecomponent'
    export default {
      data () {
        return {
          value: ''
        }
      },
      components: {
        HIcon
      },
      methods: {
        search () {
          console.log('search')
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/header/dsearch";
</style>
