<template>
  <div class="dexercise">
    <el-row :gutter="20" class="custom-container"
            :style="{ 'padding-top': userinfo.isTeacher ? '64px' : '0px' }">
      <i v-if="userinfo.isTeacher" class="fa fa-plus add-exercise"
         aria-hidden="true" title="点击发布新练习" @click="dialogVisible = true"></i>
      <el-col :span="18" :offset="3" v-for="(exercise, index) in exercises" :key="index">
        <div class="dexercise-item">
          <span>{{ index + 1 }}</span>
          <div class="dexercise-item-content">
            <span>{{ exercise.title }}</span>
            <p>{{ splitText(exercise.des, 60) }}</p>
          </div>
          <el-rate disabled :max="5" class="dexercise-item-stars" :value="exercise.stars"></el-rate>
          <div class="dexercise-item-start"  @click="doExercise(exercise.objectId, exercise.title)">开始答题</div>
        </div>
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
    <el-dialog
      v-if="userinfo.isTeacher"
      title="发布新练习"
      :visible.sync="dialogVisible"
      width="30%">
      <p class="input-label"><el-input v-model="newExercise.title" placeholder="标题"></el-input></p>
      <p class="input-label"><el-input v-model="newExercise.des" type="textarea"
                                       :rows="3" placeholder="详细介绍"></el-input></p>

      <p class="input-label"><span class="stars-input">推荐指数</span><el-rate v-model="newExercise.stars" :max="5"></el-rate></p>
      <p class="input-label"><input type="file" @change="fileChange" ref="files" class="file-upload"></p>
      <p><el-button type="primary" round @click="uploadClick">上传题目</el-button>
        <span v-if="fileName">已上传 {{ fileName }}</span>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addExercise">发布</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import Helper from '@/util/helper'
    import API from '@/const/dataApi'
    import Cache from '@/util/cache'
    import Request from '@/network/networkHelper'
    import Tooltip from '@/util/tooltip'
    const KEY = 'EXERCISE'
    const COUNT = 'EXERCISECOUNT'
    const ADDED = 'EXERCISEADDED'
    export default {
      data () {
        return {
          exercises: [],
          total: 0,
          limit: 16,
          userinfo: {},
          dialogVisible: false,
          fileName: '',
          tooltip: new Tooltip(this),
          newExercise: {
            title: '',
            des: '',
            stars: 1,
            subjects: []
          },
          tableData:  [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
        }
      },
      methods: {
        addExercise () {
          if (this.checkAll()) {
            let _this = this
            let param = {
              title: this.newExercise.title,
              des: this.newExercise.des,
              stars: this.newExercise.stars
            }
            Request.post(API.EXERCISE, param)
              .then(function (res) {
                if (res.status === 200 || res.status === 201) {
                  param.objectId = res.data.objectId
                  let exercise = param
                  exercise['local'] = true
                  _this.exercises.unshift(exercise)
                  _this.total += 1
                  sessionStorage.setItem(COUNT, JSON.stringify(_this.total))
                  Cache.save(KEY, exercise, true)
                  param = {
                    requests: _this.getBodyData(res.data.objectId)
                  }
                  Request.post(API.BATCH, param)
                    .then(function (res) {
                      if (res.status === 200 || res.status === 201) {
                        _this.tooltip.show('success', '上传成功')
                        _this.end()
                      } else {
                        _this.tooltip.show('warning', '上传失败')
                      }
                    })
                } else {
                  _this.tooltip.show('warning', '上传失败')
                }
              })
          }
        },
        end () {
          this.newExercise.title = ''
          this.newExercise.des = ''
          this.newExercise.subjects = []
          this.fileName = ''
          this.dialogVisible = false
        },
        getBodyData (id) {
          let body = []
          let data = this.newExercise.subjects
          data.forEach(function (item) {
            item.pointer = {
              '__type': 'Pointer',
              className: 'Exercise',
              objectId: id
            }
            body.push({
              method: 'POST',
              path: '/1.1/classes/Subjects',
              body: item
            })
          })
          return body
        },
        checkAll () {
          if (!this.newExercise.title) {
            this.tooltip.show('warning', '标题未填写')
            return false
          }

          if (!this.newExercise.des) {
            this.tooltip.show('warning', '详细介绍未填写')
            return false
          }

          if (!this.fileName) {
            this.tooltip.show('warning', '未上传题目')
            return false
          }
          return true
        },
        uploadClick () {
          if (this.fileName) {
            this.tooltip.show('error', '不可重复上传')
            return
          }
          $(this.$refs.files).click()
        },
        // 读取本地文件
        fileChange (e) {
          let _this = this
          let files = this.$refs.files.files[0]
          if (files) {
            this.fileName = files.name
          }
          let reader = new FileReader()
          reader.addEventListener('load', function (e) {
            _this.newExercise.subjects = eval("(" + e.target.result + ")")
          })
          reader.readAsText(files, 'utf-8')
        },
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
          let isExist = Cache.exsit(key, page, ops.limit, COUNT)
          if (isExist) {
            this.exercises = Cache.get(key, page, ops.limit)
            this.total = JSON.parse(sessionStorage.getItem(COUNT))
          } else {
            Request.get(url, ops).then(function (result) {
              let data = result.data.results
              console.log(data)
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
        let userinfo = JSON.parse(localStorage.getItem('USERINFO'))
        if (userinfo) {
          this.userinfo = userinfo
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/exercise/dexercise";
</style>
