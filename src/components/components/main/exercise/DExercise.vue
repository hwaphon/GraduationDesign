<template>
  <div class="dexercise">
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
    <div class="pagination">
      <el-pagination
        @current-change="pageChange"
        background
        layout="prev, pager, next"
        :page-size="16"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    import { Exercises } from '@/const/CourseData'
    import Helper from '@/util/helper'
    import API from '@/const/Api'
    import Cache from '@/util/cache'
    import { request } from '@/network/network'
    const KEY = 'EXERCISE'
    export default {
      data () {
        return {
          exercises: Exercises,
          total: 0,
          limit: 16
        }
      },
      methods: {
        doExercise (id, title) {
          this.$router.push({ path: `/exercise/detail/${ id }`, query: { title: title }})
        },
        splitText (text, length) {
          if (text.length <= length) {
            return text
          }
          return Helper.split(text, length) + '...'
        },
        pageChange (index) {
          let realIndex = index - 1
          this.getExercises(KEY, API.GETEXERCISE, { page: realIndex, limit: this.limit })
        },
        setLength (result) {
          this.total = result.data.length
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
      },
      created () {
        this.getExercises(KEY, API.GETEXERCISE, { limit: this.limit, page: 0 })
        request(API.GETEXERCISECOUNT, {}, this.setLength)
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/exercise/dexercise";
</style>
