<template>
  <div class="dexercise">
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
    import { Exercises } from '@/const/CourseData'
    import Helper from '@/util/helper'
    export default {
      data () {
        return {
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
  @import "../../../styles/main/exercise/dexercise";
</style>
