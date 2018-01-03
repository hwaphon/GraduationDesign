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
    <div class="dcourse-comments">
      <DComments></DComments>
    </div>
  </div>
</template>

<script>
    import ChimeePlayer from 'chimee-player';
    import DComments from '../../global/DComments.vue'
    import { request, post } from '@/network/network'
    import API from '@/const/Api'
    export default {
      data () {
        return {
          title: '',
          author: '',
          intro: '',
          detail: '',
          src: ''
        }
      },
      mounted () {
        const chimee = new ChimeePlayer({
          wrapper: '#video',
          controls: true,
          autoplay: false,
          autoload: false
        });

        let _this = this
        let id = this.$route.params.id
        let result = request(API.GETCOURSEDETAIL, { id: id }, function (result) {
          _this.setInfo(result)
          _this.record()
          if (_this.src) {
            chimee.load(_this.src)
          }
        })

      },
      methods: {
        setInfo (result) {
          let data = result.data[0]
          if (data) {
            this.title = data.title
            this.author = data.author
            this.src = data.vurl
            this.intro = data.intro
            this.detail = data.des
          }
        },
        record () {
          let date = new Date()
          let content = `您于${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}访问过 《${this.title}》`
          post(API.RECORD, { url: window.location.href, content: content }, function (res) {
            if (res.status === 200 && res.data.status === 'success') {
              // 如果失败怎么办
            }
          })
        }
      },
      components: {
        DComments
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/course/dcoursedetail";
</style>
