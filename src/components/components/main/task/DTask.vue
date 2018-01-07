<template>
  <div class="dtask">
    <div class="dtask-list">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item v-for="(task, index) in tasks" :title="task.title" :name="index" :key="index">
          <div class="dtask-detail">
            <span class="dtask-author">发布人 : {{ task.author }}</span>
            <span class="dtask-date">发布日期 : {{ task.date }}</span>
            <p>{{ task.des }}</p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
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
    import { request } from '@/network/network'
    import Cache from '@/util/cache'
    import API from '@/const/Api'
    const KEY = 'TASK'
    const COUNT = 'TASKCOUNT'
    export default {
      data () {
        return {
          activeName: 0,
          tasks: [],
          limit: 12,
          total: 0
        }
      },
      methods: {
        pageChange (index) {
          let realIndex = index - 1
          this.getTasks(KEY, API.TASK, { page: realIndex, limit: this.limit })
        },
        getTasks (key, url, ops) {
          let _this = this
          let isExist = Cache.exsit(key, ops.page, ops.limit)
          if (isExist) {
            this.tasks = Cache.get(key, ops.page, ops.limit)
          } else {
            request(url, ops, function (result) {
              let data = result.data
              _this.tasks = data
              Cache.save(key, data)
            })
          }
        }
      },
      created () {
        let _this = this
        let count = JSON.parse(sessionStorage.getItem(COUNT))
        if (count === null) {
          request(API.TASKCOUNT, {}, function (res) {
            if (res.status === 200) {
              _this.total = res.data.length
              sessionStorage.setItem(COUNT, JSON.stringify(_this.total))
            }
          })
        } else {
          _this.total = count
        }
        this.getTasks(KEY, API.TASK, { page: 0, limit: this.limit })
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/task/dtask";
</style>
