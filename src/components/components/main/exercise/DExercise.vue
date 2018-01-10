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
    <div class="pagination" v-if="total / limit >= 1">
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
    import Helper from '@/util/helper'
    import API from '@/const/dataApi'
    import Cache from '@/util/cache'
    import Request from '@/network/networkHelper'
    const KEY = 'EXERCISE'
    export default {
      data () {
        return {
          exercises: [],
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
          this.getExercises(KEY, API.EXERCISE, { skip: realIndex * this.limit, limit: this.limit })
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
              Cache.save(key, data)
              _this.exercises = data

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
        this.getExercises(KEY, API.EXERCISE, { limit: this.limit, skip: 0, count: 1 })
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/exercise/dexercise";
</style>
