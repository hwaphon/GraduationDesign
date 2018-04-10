<template>
  <div class="index">
    <div class="block" :style="{ 'background': carouselBg }">
      <el-carousel trigger="click" height="320px" type="card" @change="carouselChange">
        <el-carousel-item v-for="(item, index) in banners" :key="index">
          <img :src="item.picUrl" alt="carousel" class="carousel-img">
        </el-carousel-item>
      </el-carousel>
    </div>

    <GSection title="推荐课程">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(course, index) in courses" :key="index" class="col-content">
          <el-card :body-style="{ padding: '0px' }" class="card">
            <span class="tag" v-if="course.pc">实验录像</span>
            <img :src="course.picUrl" class="image">
            <div style="padding: 14px;">
              <span class="title">{{ course.title }}</span>
              <div class="bottom clearfix">
                <el-button type="text" class="button" @click="router(course.objectId)">查看详情</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </GSection>

    <GSection title="推荐习题" bgcolor="#FFF">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(exercise, index) in exercises" :key="index" class="col-content">
          <el-card>
            <div slot="header" class="clearfix">
              <span class="dexercise-title">{{ exercise.title }}</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="doExercise(exercise.objectId, exercise.title)">我要做题</el-button>
            </div>
            <div class="text item">
              {{ splitText(exercise.des, 60) }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </GSection>

  </div>
</template>

<script>
    import Icon from '@/const/Icon'
    import Request from '@/network/networkHelper'
    import API from '@/const/dataApi'
    import Cache from '@/util/cache'
    import Helper from '@/util/helper'
    import GSection from './index/DSection.vue'
    const BANNERKEY = 'INDEXBANNER'
    const EXERCISEKEY = 'INDEXEXERCISE'
    const COURSEKEY = 'INDEXCOURSE'
    export default {
      components: {
        GSection
      },
      data () {
        return {
          banners: [],
          currentSwiper: 0,
          courses: [],
          exercises: [],
          carouselBg: '#FFF'
        }
      },
      methods: {
        splitText (text, length) {
          if (text.length <= length) {
            return text
          }
          return Helper.split(text, length) + '...'
        },
        carouselChange (index) {
          let imgs = $('.carousel-img')
          let _this = this
          RGBaster.colors(imgs[index], {
            success: (payload) => {
              let reg = /\d+/g
              let cnum = payload.dominant.match(reg)
              let color = `rgba(${cnum[0]}, ${cnum[1]}, ${cnum[2]}, .3)`
              _this.carouselBg = `linear-gradient(to bottom, ${color} 0%, rgb(249, 250, 252))`
            },
            exclude: [ 'rgb(0,0,0)' ]
          })
        },
        router (id) {
          this.$router.push(`/course/detail/${id}`)
        },
        doExercise (id, title) {
          this.$router.push({ path: `/exercise/detail/${ id }`, query: { title: title }})
        },
        getCourse (key, url, ops) {
          let _this = this
          let page = Math.floor(ops.skip / ops.limit)
          let isExist = Cache.exsit(key, page, ops.limit)
          if (isExist) {
            this.courses = Cache.get(key, page, ops.limit)
          } else {
            Request.get(url, ops).then(function (result) {
              let data = result.data.results
              Cache.save(key, data)
              _this.courses = data
            })
          }
        },
        getExercises (key, url, ops) {
          let _this = this
          let page = Math.floor(ops.skip / ops.limit)
          let isExist = Cache.exsit(key, page, ops.limit)
          if (isExist) {
            this.exercises = Cache.get(key, page, ops.limit)
          } else {
            Request.get(url, ops).then(function (result) {
              let data = result.data.results
              _this.exercises = data
              Cache.save(key, data)
            })
          }
        },
        getBanner () {
          let _this = this
          let result = window.sessionStorage.getItem(BANNERKEY)
          if (result) {
            this.banners = JSON.parse(result)
          } else {
            Request.get(API.BANNER, {}).then(function (result) {
              let data = result.data.results
              _this.banners = data
              window.sessionStorage.setItem(BANNERKEY, JSON.stringify(data))
            })
          }
        }
      },
      created () {
        this.getCourse(COURSEKEY, API.COURSE, { skip: 0, limit: 8 })
        this.getExercises(EXERCISEKEY, API.EXERCISE, { skip: 0, limit: 12 })
        this.getBanner()
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/main/index";
</style>
