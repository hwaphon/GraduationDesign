<template>
  <div class="dcourse">
    <el-row :gutter="20">
      <el-col :span="6"
              v-for="(course, index) in courses"
              :key="index"
              class="col-content">
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
    <div class="pagination" v-if="total / limit >= 1">
      <el-pagination
        @current-change="pageChange"
        background
        layout="prev, pager, next"
        :page-size="limit"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    import { Course } from '@/const/CourseData'
    import API from '@/const/dataApi'
    import Request from '@/network/networkHelper'
    import Cache from '@/util/cache'
    const COUNT = 'COURSECOUNT'
    export default {
      data () {
        return {
          courses: [],
          total: 0,
          limit: 12,
          key: 'COURSE'
        }
      },
      methods: {
        pageChange (index) {
          let realIndex = index - 1
          this.getCourse(this.key, API.COURSE, { skip: realIndex * this.limit, limit: this.limit })
        },
        router (id) {
          this.$router.push(`/course/detail/${id}`)
        },
        setCourse (result) {
          this.courses = result.data
        },
        getCourse (key, url, ops) {
          let _this = this
          let page = Math.floor(ops.skip / ops.limit)
          let isExist = Cache.exsit(key, page, ops.limit)
          if (isExist) {
            this.courses = Cache.get(key, page, ops.limit)
            this.total = JSON.parse(sessionStorage.getItem(COUNT))
          } else {
            Request.get(url, ops).then(function (result) {
              let data = result.data.results
              Cache.save(key, data)
              _this.courses = data

              let count = JSON.parse(sessionStorage.getItem(COUNT))
              if (count === null && result.data.count) {
                _this.total = result.data.count
                sessionStorage.setItem(COUNT, JSON.stringify(_this.total))
              }
            })
          }
        }
      },
      created () {
        this.getCourse(this.key, API.COURSE, { limit: 12, skip: 0, count: 1 })
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/course/dcourse";
</style>
