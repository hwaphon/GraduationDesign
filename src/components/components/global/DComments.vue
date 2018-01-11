<template>
  <div class="dcomments">
    <span class="dcomments-title">少年，请留下你的评论~</span>
    <div class="send-comment">
      <textarea name="comment" v-model="comment" placeholder="评论不能少于6个字"></textarea>
      <div class="send-comment-footer">
        <button @click="postComment">发表评论</button>
      </div>
    </div>
    <div class="dcomments-container">
      <div class="dcomment" v-for="comment in comments">
        <div class="dcomment-user">
          <div class="basic">
            <span class="username">{{ comment.username }}</span>
            <span class="time">{{ dateFormate(comment.updatedAt)}}</span>
          </div>
          <img :src="comment.avatar" alt="头像">
        </div>
        <div class="dcomment-content">{{ comment.content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
    import API from '@/const/dataApi'
    import Request from '@/network/networkHelper'
    import Record from '@/util/record'
    export default {
      props: {
        id: {
          type: String | Number
        },
        title: {
          type: String
        }
      },
      data () {
        return {
          comment: '',
          comments: []
        }
      },
      methods: {
        postComment () {
          if (this.comment.length < 6) {
            this.$message({
              type: 'warning',
              message: '请输入最少6字的评论',
              center: true
            })
            return
          }
          let _this = this
          post(API.COMMENTS, { id: this.id, content: this.comment }, function (results) {
            if (results.status === 200) {
              let data = results.data
              if (data.status == 'ok') {
                _this.comments.unshift({
                  avatar: data.avatar,
                  username: data.username,
                  updatedAt: new Date(),
                  content: _this.comment
                })
                _this.$message({ message: data.msg, center: true, type: 'success', duration: 2000 })
                let url = window.location.href
                let content = `您在 《${ _this.title }》 主题下发表了一条留言，具体内容可点击查看`
                Record.save({ url, content })
                _this.comment = ''
              } else {
                _this.$message({ message: data.msg, center: true, type: 'warning', duration: 2000 })
              }
            } else {
              _this.$message({ type: 'warning', message: '网络错误', center: true, duration: 2000 })
            }
          })
        },
        dateFormate (d) {
          let date = new Date(d)
          return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
        }
      },
      created () {
        let _this = this
        let param = {
          where: JSON.stringify({
            targetId: this.id
          })
        }
        Request.get(API.COMMENTS, param)
          .then(function (res) {
            if (res.status === 200) {
              _this.comments = res.data.results
            }
          })
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/global/dcomments";
</style>
