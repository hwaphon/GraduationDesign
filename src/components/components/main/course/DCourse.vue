<template>
  <div class="dcourse">
    <el-row :gutter="20">
      <el-col :span="6"
              v-for="(course, index) in courses"
              :key="index"
              class="col-content">
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
    import API from '@/const/Api'
    import { request } from '@/network/network'
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
          this.getCourse(this.key, API.GETCOURSE, { page: realIndex, limit: this.limit })
        },
        router (id) {
          this.$router.push(`/course/detail/${id}`)
        },
        setCourse (result) {
          this.courses = result.data
        },
        getCourse (key, url, ops) {
          let _this = this
          let isExist = Cache.exsit(key, ops.page, ops.limit)
          if (isExist) {
            this.courses = Cache.get(key, ops.page, ops.limit)
          } else {
            request(url, ops, function (result) {
              let data = result.data
              Cache.save(key, data)
              _this.courses = data
            })
          }
        }
      },
      async created () {
        await this.getCourse(this.key, API.GETCOURSE, { limit: 12, page: 0 })
        let _this = this
        let count = JSON.parse(sessionStorage.getItem(COUNT))
        if (count === null) {
          request(API.GETCOURSECOUNT, {}, function (res) {
            if (res.status === 200) {
              _this.total = res.data.length
              sessionStorage.setItem(COUNT, JSON.stringify(_this.total))
            }
          })
        } else {
          _this.total = count
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/course/dcourse";
</style>
