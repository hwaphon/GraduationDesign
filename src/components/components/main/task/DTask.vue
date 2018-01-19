<template>
  <div class="dtask"
       :style="{ 'padding-top': userinfo.isTeacher ? '96px' : '32px' }">
    <div class="dtask-list">
      <i v-if="userinfo.isTeacher" class="fa fa-plus add-task"
         aria-hidden="true" title="点击发布作业" @click="dialogVisible = true"></i>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item v-for="(task, index) in tasks" :title="task.title" :name="index" :key="index">
          <div class="dtask-detail">
            <span class="dtask-author">发布人 : {{ task.owername }}</span>
            <span class="dtask-date">发布日期 : {{ formateDate(task.createdAt) }}</span>
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
    <el-dialog
      v-if="userinfo.isTeacher"
      title="发布作业"
      :visible.sync="dialogVisible"
      width="30%">
      <p class="input-label"><el-input v-model="newTask.title" placeholder="摘要"></el-input></p>
      <p class="input-label"><el-input v-model="newTask.des" placeholder="主要内容"
                                       type="textarea" :rows="3"></el-input></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTask">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import Request from '@/network/networkHelper'
    import Cache from '@/util/cache'
    import Record from '@/util/record'
    import API from '@/const/dataApi'
    import Tooltip from '@/util/tooltip'
    import helper from '@/util/helper'
    const KEY = 'TASK'
    const COUNT = 'TASKCOUNT'
    export default {
      data () {
        return {
          activeName: 0,
          userinfo: {},
          tasks: [],
          limit: 12,
          total: 0,
          dialogVisible: false,
          tooltip: new Tooltip(this),
          newTask: {
            des: '',
            title: ''
          }
        }
      },
      methods: {
        formateDate (date) {
          return helper.formateDate(date)
        },
        addTask () {
          if (this.userinfo && this.userinfo.isTeacher) {
            if (!this.newTask.title) {
              this.tooltip.show('warning', '摘要不能为空')
              return
            }
            if (!this.newTask.des) {
              this.tooltip.show('warning', '主要内容不能为空')
              return
            }
            let _this = this
            let param = {
              title: this.newTask.title,
              des: this.newTask.des,
              owername: this.userinfo.username
            }
            Request.post(API.TASK, param)
              .then(function (res) {
                if (res.status === 200 || res.status === 201) {
                  let task = { ...param, objectId: res.data.objectId, createdAt: res.data.createdAt }
                  _this.tasks.unshift(task)
                  _this.dialogVisible = false
                  _this.tooltip.show('success', '发布成功')
                  _this.newTask.title = ''
                  _this.newTask.des = ''
                  Record.save({
                    url: window.location.href,
                    content: '您发布了一条作业信息'
                  })
                } else {
                  _this.tooltip.show('warning', '发布失败，请稍后重试')
                }
              })
          } else {
            this.tooltip.show('warning', '你没有权限执行此操作')
          }
        },
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
        let userinfo = JSON.parse(localStorage.getItem('USERINFO'))
        if (userinfo) {
          this.userinfo = userinfo
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/task/dtask";
</style>
