<template>
  <div class="dpointarticle">
    <el-row>
      <el-col :offset="2" :span="20">
        <h2 class="article-header">{{ title }}</h2>
        <div class="article-content" v-for="(item, index) in article" :key="index">
          <h3>{{ item.title }}</h3>
          <p v-for="(ps, index) in item.contents" :key="index" class="article-p">{{ ps }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    article: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/main/point/dpointarticle.scss';
</style>
