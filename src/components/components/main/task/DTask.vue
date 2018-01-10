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
    import Request from '@/network/networkHelper'
    import Cache from '@/util/cache'
    import API from '@/const/dataApi'
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
          this.getTasks(KEY, API.TASK, { skip: realIndex * this.limit, limit: this.limit })
        },
        getTasks (key, url, ops) {
          let _this = this
          let page = Math.floor(ops.skip / ops.limit)
          let isExist = Cache.exsit(key, page, ops.limit)
          if (isExist) {
            this.tasks = Cache.get(key, page, ops.limit)
            this.total = JSON.parse(sessionStorage.getItem(COUNT))
          } else {
            Request.get(url, ops).then(function (result) {
              let data = result.data.results
              Cache.save(key, data)
              _this.tasks = data

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
        this.getTasks(KEY, API.TASK, { skip: 0, limit: this.limit, count: 1 })
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/task/dtask";
</style>
