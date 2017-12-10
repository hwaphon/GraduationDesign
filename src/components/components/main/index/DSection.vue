<template>
  <div class="gsection" :style="{ backgroundColor: bgcolor }">
    <header>
      <i class="el-icon-star-on"></i>
      <h3 class="gsection-header">{{ title }}</h3>
      <i class="el-icon-star-on"></i>
    </header>
    <div class="gsection-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
    export default {
      props: {
        bgcolor: {
          type: String,
          default: '#f9fafc'
        },
        title: {
          type: String,
          default: ''
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/index/dsection";
</style>
