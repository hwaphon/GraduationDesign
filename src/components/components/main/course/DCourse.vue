<template>
  <div class="dcourse">
    <el-row :gutter="20" class="custom-container"
            :style="{ 'padding-top': userinfo.isTeacher ? '64px' : '0px' }">
      <i v-if="userinfo.isTeacher" class="fa fa-plus add-video"
         aria-hidden="true" title="点击发布新视屏" @click="dialogVisible = true"></i>
      <el-col :span="6"
              v-for="(course, index) in courses"
              :key="index"
              class="col-content">
        <el-card :body-style="{ padding: '0px' }" class="card">
          <span class="tag" v-if="course.pc">实验录像</span>
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
    <el-dialog
      v-if="userinfo.isTeacher"
      title="发布新视频"
      :visible.sync="dialogVisible"
      width="30%">
      <p class="input-label"><el-input v-model="newCourse.title" placeholder="课程标题"></el-input></p>
      <p class="input-label"><el-input v-model="newCourse.intro"
                                       placeholder="课程简介" type="textarea" :rows="3"></el-input></p>
      <p class="input-label"><el-input v-model="newCourse.des"
                                       placeholder="课程讲义" type="textarea" :rows="3"></el-input></p>
      <p class="input-label"><el-input v-model="newCourse.vurl" placeholder="视频地址(url)"></el-input></p>
      <p class="input-label"><el-input v-model="newCourse.picUrl" placeholder="封面图片地址(url, 可选)"></el-input></p>
      <p class="input-label"><el-input v-model="newCourse.ppt"
                                       placeholder="ppt地址（可选，如果指定则设置视频为实验录像）"></el-input></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourse">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import API from '@/const/dataApi'
    import Request from '@/network/networkHelper'
    import Cache from '@/util/cache'
    import Tooltip from '@/util/tooltip'
    const COUNT = 'COURSECOUNT'
    export default {
      data () {
        return {
          courses: [],
          total: 0,
          limit: 12,
          key: 'COURSE',
          tooltip: new Tooltip(this),
          userinfo: {},
          dialogVisible: false,
          newCourse: {
            title: '',
            picUrl: '',
            ppt: '',
            intro: '',
            des: '',
            vurl: ''
          }
        }
      },
      methods: {
        addCourse () {
          if (this.checkAll()) {
            let userinfo = JSON.parse(localStorage.getItem('USERINFO'))
            if (userinfo) {
              let _this = this
              let param = {
                title: this.newCourse.title,
              }
              if (this.newCourse.picUrl) {
                param.picUrl = this.newCourse.picUrl
              }
              if (this.newCourse.ppt) {
                param.pc = true
              } else {
                param.pc = false
              }

              Request.post(API.COURSE + '?fetchWhenSave=true', param)
                .then(function (res) {
                  if (res.status === 200 || res.status === 201) {
                    let course = res.data
                    course['local'] = true
                    _this.courses.unshift(course)
                    _this.total += 1
                    sessionStorage.setItem(COUNT, JSON.stringify(_this.total))
                    Cache.save(_this.key, course, true)
                    param = {
                      title: _this.newCourse.title,
                      author: userinfo.username,
                      vurl: _this.newCourse.vurl,
                      intro: _this.newCourse.intro,
                      des: _this.newCourse.des,
                      courseid: course.objectId
                    }
                    if (_this.newCourse.ppt) {
                      param.ppt = _this.newCourse.ppt
                    }

                    Request.post(API.COURSEDETAIL, param)
                      .then(function (res) {
                        if (res.status === 200 || res.status === 201) {
                          _this.tooltip.show('success', '添加成功')
                          _this.newCourse.title = ''
                          _this.newCourse.des = ''
                          _this.newCourse.vurl = ''
                          _this.newCourse.ppt = ''
                          _this.newCourse.picUrl = ''
                          _this.newCourse.intro = ''
                          _this.dialogVisible = false
                        } else {
                          _this.tooltip.show('warning', '添加失败，请稍后重试')
                        }
                      })
                  }
                })
            }
          } else {
          }
        },
        checkAll () {
          if (
              !this.newCourse.title ||
              !this.newCourse.intro ||
              !this.newCourse.des ||
              !this.newCourse.vurl
          ) {
            this.tooltip.show('warning', '有必选项未填写')
            return false
          }

          if (!this.isValidUrl(this.newCourse.vurl)) {
            this.tooltip.show('warning', '视频地址不是合法的 url 地址')
            return false
          }
          return true
        },
        isValidUrl(url) {
          let urlRegExp = /^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
          if (urlRegExp.test(url)) {
            return true;
          }
          return false
        },
        pageChange (index) {
          let realIndex = index - 1
          this.getCourse(this.key, API.COURSE, { skip: realIndex * this.limit, limit: this.limit })
        },
        router (id) {
          this.$router.push(`/course/detail/${id}`)
        },
        setCourse (result) {
          this.courses = result.data
        },
        getCourse (key, url, ops) {
          let _this = this
          let page = Math.floor(ops.skip / ops.limit)
          let isExist = Cache.exsit(key, page, ops.limit, COUNT)
          if (isExist) {
            this.courses = Cache.get(key, page, ops.limit)
            this.total = JSON.parse(sessionStorage.getItem(COUNT))
          } else {
            Request.get(url, ops).then(function (result) {
              let data = result.data.results
              Cache.save(key, data)
              _this.courses = data

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
        this.getCourse(this.key, API.COURSE, { limit: 12, skip: 0, count: 1 })
        let userinfo = JSON.parse(localStorage.getItem('USERINFO'))
        if (userinfo) {
          this.userinfo = userinfo
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/course/dcourse";
</style>
