<template>
  <div class="exercise-detail">
    <div class="exercise-detail-header">
      <div class="nav" @click="back">
        <span class="el-icon-arrow-left"></span>
        <span>返回</span>
      </div>
      <span class="header">{{ title }}</span>
    </div>
    <div class="exercise-detail-content" v-for="(subject, index) in subjects" :key="index">
      <span class="icon"
            :class="[ subject.right === answers[index] ? 'el-icon-success' : 'el-icon-error' ]"
            v-if="showCheck"></span>
      <span>{{ index + 1}}.</span>
      <span>{{ subject.title }}</span>
      <div class="radio-container">
        <p><el-radio v-model="answers[index]" label="A">{{ subject.A }}</el-radio></p>
        <p><el-radio v-model="answers[index]" label="B">{{ subject.B }}</el-radio></p>
        <p><el-radio v-model="answers[index]" label="C">{{ subject.C }}</el-radio></p>
        <p><el-radio v-model="answers[index]" label="D">{{ subject.D }}</el-radio></p>
      </div>
      <div class="exercise-detail-desc" v-if="showDes">答案解析: {{ subject.des }}</div>
    </div>
    <div class="empty-view" v-if="subjects.length <= 0">暂无任何题目</div>
    <div class="exercise-detail-footer" v-if="subjects.length > 0">
      <el-button type="primary" @click="submitAnswer">提交答案</el-button>
      <el-button type="primary" @click="viewDes">查看解析</el-button>
    </div>
    <el-dialog
      v-if="showCheck"
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
        <span>{{ tooltipMsg }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
    import Request from '@/network/networkHelper'
    import Record from '@/util/record'
    import API from '@/const/dataApi'
    import Tooltip from '@/util/tooltip'
    export default {
      data () {
        return {
          title: this.$route.query.title,
          answers: [],
          subjects: [],
          showDes: false,
          submited: false,
          showCheck: false,
          dialogVisible: false,
          tooltipMsg: '',
          tooltip: new Tooltip(this)
        }
      },
      methods: {
        viewDes () {
          if (!this.submited) {
            this.tooltip.show('warning', '先提交答案才能查看解析哦')
            return
          }
          this.showDes = !this.showDes
          // 滚动到屏幕顶部
          $('html, body').animate({
            scrollTop: 0
          }, 'slow')
        },
        submitAnswer () {
          this.submited = true
          let answers = this.answers
          let errors = 0
          this.subjects.forEach(function (subject, index) {
            if (subject.right !== answers[index]) {
              errors += 1
            }
          });
          let url = window.location.href
          let content = `练习了 《${ this.title }》,`
          if (errors === 0) {
            this.tooltipMsg = '恭喜你答对了所有题目'
            content += '并且做对了所有的题目，真的很赞！'
          } else {
            this.tooltipMsg = `你一共答错了 ${errors} 道题目，赶紧去看看答案解析吧`
            content += `其中做错了 ${ errors } 道题目，要时常复习呀。`
          }
          Record.save({ url, content })
          this.dialogVisible = true
          this.showCheck = true
        },
        back () {
          this.$router.back()
        }
      },
      created () {
        let _this = this
        let param = {
          where: JSON.stringify({
            'pointer': {
              '__type': 'Pointer',
              className: 'Exercise',
              objectId: this.$route.params.id
            }
          })
        }
        Request.get(API.EXERCISEDETAIL, param)
          .then(function (res) {
            if (res.status === 200) {
              _this.subjects = res.data.results
            } else {
              this.tooltip.show('warning', '网络貌似出现了点问题')
            }
          })
          .catch(function () {
            this.tooltip.show('warning', '一个未知的问题出现了')
          })
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../styles/main/exercise/dexercisedetail";
</style>
