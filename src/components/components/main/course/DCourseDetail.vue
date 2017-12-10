<template>
  <div class="dcourse-detail">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/course'}">视频课程</el-breadcrumb-item>
      <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="dcourse-detail-content">
      <div class="dcourse-detail-video">
        <div id="video"></div>
      </div>
      <div class="dcourse-detail-info">
        <el-card>
          <div class="card-info">
            <div class="box">作者<span class="author">{{ author }}</span></div>
            <div class="box">课程简介<p class="intro">{{ intro }}</p></div>
            <div class="box">课程讲义<p class="intro">{{ detail }}</p></div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
    import ChimeePlayer from 'chimee-player';
    export default {
      data () {
        return {
          title: 'Elastic Stack入门',
          author: 'hwaphon',
          intro: '操作系统（Operating System，简称OS）是管理和控制计算机硬件与软件资源的计算机程序.',
          detail: '操作系统（Operating System，简称OS）是管理和控制计算机硬件与软件资源的计算机程序.',
          src: 'http://cdn.toxicjohann.com/lostStar.mp4'
        }
      },
      mounted () {
        const chimee = new ChimeePlayer({
          wrapper: '#video',
          src: this.src,
          controls: true,
          autoplay: false
        });
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/course/dcoursedetail";
</style>
