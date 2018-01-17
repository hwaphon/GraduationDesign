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
        <el-card class="card-info">
          <div>
            <div class="box">作者<span class="author">{{ author }}</span></div>
            <div class="box">课程简介<p class="intro">{{ intro }}</p></div>
            <div class="box">课程讲义<p class="intro">{{ detail }}</p></div>
          </div>
        </el-card>
        <el-card v-if="ppt">
          <div>
            <a href="http://p0q1vpjvw.bkt.clouddn.com/%E5%AE%9E%E9%AA%8Cppt.pptx" class="download">点击下载课件</a>
          </div>
        </el-card>
      </div>
    </div>
    <div class="dcourse-comments">
      <DComments :id="id" :title="title"></DComments>
    </div>
  </div>
</template>

<script>
    import ChimeePlayer from 'chimee-player';
    import DComments from '../../global/DComments.vue'
    import Request from '@/network/networkHelper'
    import Record from '@/util/record'
    import API from '@/const/dataApi'
    export default {
      data () {
        return {
          title: '',
          author: '',
          intro: '',
          detail: '',
          src: '',
          id: this.$route.params.id,
          ppt: ''
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
        let param = {
          where: JSON.stringify({ "courseid": this.id })
        }
        Request.get(API.COURSEDETAIL, param)
          .then(function (res) {
            _this.setInfo(res.data.results[0])
            if (_this.src) {
              chimee.load(_this.src)
            }
            _this.record()

          })

      },
      methods: {
        setInfo (result) {
          if (result) {
            this.title = result.title
            this.author = result.author
            this.src = result.vurl
            this.intro = result.intro
            this.detail = result.des
            this.ppt = result.ppt
          }
        },
        record () {
          let content = `学习了课程 《${this.title}》`
          let url = window.location.href
          Record.save({ url, content })
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
