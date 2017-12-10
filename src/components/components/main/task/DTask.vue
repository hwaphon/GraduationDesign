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
    <div class="pagination">
      <el-pagination
        @current-change="pageChange"
        background
        layout="prev, pager, next"
        :page-size="12"
        :total="100">
      </el-pagination>
    </div>
  </div>
</template>

<script>
    import { Tasks } from '@/const/CourseData'
    export default {
      data () {
        return {
          activeName: 0,
          tasks: Tasks
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/task/dtask";
</style>
