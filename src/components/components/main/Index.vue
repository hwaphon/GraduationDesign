<template>
  <div class="index">
    <div class="block">
      <el-carousel trigger="click" height="380px">
        <el-carousel-item v-for="(item, index) in banners" :key="index">
          <img :src="item.picUrl" alt="carousel" class="carousel-img">
        </el-carousel-item>
      </el-carousel>
    </div>

    <GSection title="推荐课程">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(course, index) in courses" :key="index" class="col-content">
          <el-card :body-style="{ padding: '0px' }">
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
              <el-button style="float: right; padding: 3px 0" type="text">我要做题</el-button>
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
    import request from '@/network/network'
    import API from '@/const/Api'
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
          exercises: []
        }
      },
      methods: {
        splitText (text, length) {
          if (text.length <= length) {
            return text
          }
          return Helper.split(text, length) + '...'
        },
        router (id) {
          this.$router.push(`/course/detail/${id}`)
        },
        getCourse (key, url, ops) {
          let _this = this
          let isExist = Cache.exsit(key, ops.page, ops.limit)
          if (isExist) {
            this.courses = Cache.get(key, ops.page, ops.limit)
          } else {
            request(url, ops, function (result) {
              let data = result.data
              _this.courses = data
              Cache.save(key, data)
            })
          }
        },
        getExercises (key, url, ops) {
          let _this = this
          let isExist = Cache.exsit(key, ops.page, ops.limit)
          if (isExist) {
            this.exercises = Cache.get(key, ops.page, ops.limit)
          } else {
            request(url, ops, function (result) {
              let data = result.data
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
            request(API.GETBANNER, {}, function (result) {
              let data = result.data
              _this.banners = data
              window.sessionStorage.setItem(BANNERKEY, JSON.stringify(data))
            })
          }
        }
      },
      created () {
        this.getCourse(COURSEKEY, API.GETCOURSE, { page: 0, limit: 8 })
        this.getExercises(EXERCISEKEY, API.GETEXERCISE, { page: 0, limit: 12 })
        this.getBanner()
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/main/index";
</style>
