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
              <el-button type="text" class="button" @click="router(course.id)">查看详情</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="pagination">
      <el-pagination
        @current-change="pageChange"
        background
        layout="prev, pager, next"
        :page-size="12"
        :total="10">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    import { Course } from '@/const/CourseData'
    export default {
      data () {
        return {
          courses: Course
        }
      },
      methods: {
        pageChange (index) {
          console.log(index)
        },
        router (id) {
          this.$router.push(`/course/detail/${id}`)
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/course/dcourse";
</style>
