<template>
  <div class="index">
    <div class="block">
      <el-carousel trigger="click" height="380px">
        <el-carousel-item v-for="(item, index) in items" :key="index">
          <img :src="item.src" alt="carousel" class="carousel-img">
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
                <el-button type="text" class="button">查看详情</el-button>
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
              <span>{{ exercise.title }}</span>
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
    import Helper from '@/util/helper'
    import { Course, Exercises } from '@/const/CourseData'
    import GSection from './index/DSection.vue'
    export default {
      components: {
        GSection
      },
      data () {
        return {
          items: Icon.swipers,
          currentSwiper: 0,
          courses: Course,
          exercises: Exercises
        }
      },
      methods: {
        splitText (text, length) {
          if (text.length <= length) {
            return text
          }
          return Helper.split(text, length) + '...'
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/main/index";
</style>
