<template>
  <div class="dcomments">
    <span class="dcomments-title">少年，请留下你的评论~</span>
    <div class="send-comment">
      <textarea name="comment" v-model="comment" placeholder="分享一下你的看法吧（不少于6字）"></textarea>
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
    import API from '@/const/dataApi'
    import Request from '@/network/networkHelper'
    import Record from '@/util/record'
    import Tooltip from '@/util/tooltip'
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
          comments: [],
          tooltip: new Tooltip(this),
          total: 0,
          limit: 8
        }
      },
      methods: {
        pageChange (index) {
          let realIndex = index - 1
          this.getComments(realIndex * this.limit)
        },
        postComment () {
          if (this.comment.length < 6) {
            this.tooltip.show('warning', '请输入最少6字的评论')
            return
          }
          let _this = this
          let userinfo = JSON.parse(sessionStorage.getItem('USERINFO'))
          if (userinfo) {
            Request.post(API.COMMENTS, {
              targetId: this.id,
              content: this.comment,
              avatar: userinfo.avatar,
              username: userinfo.username,
              user: {
                '__type': 'Pointer',
                className: '_User',
                objectId: userinfo.objectId
              }
            }).then(function (res) {
              if (res.status === 200 || res.status === 201) {
                _this.comments.unshift({
                  avatar: userinfo.avatar,
                  username: userinfo.username,
                  updatedAt: new Date(),
                  content: _this.comment
                })
                _this.tooltip.show('success', '评论成功')
                let content = `您在 《${ _this.title }》 主题下发表了一条留言，具体内容可点击查看`
                Record.save({ url: window.location.href, content })
                _this.comment = ''
              } else {
                _this.tooltip.show('warning', '评论失败，稍后重试')
              }
            })
          } else {
            this.tooltip.show('warning', '请先登录')
          }
        },
        dateFormate (d) {
          let date = new Date(d)
          return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
        },
        getComments (skip) {
          let _this = this
          let param = {
            where: JSON.stringify({
              targetId: this.id
            }),
            limit: this.limit,
            skip: skip,
            count: 1
          }
          Request.get(API.COMMENTS, param)
            .then(function (res) {
              if (res.status === 200) {
                _this.comments = res.data.results
                console.log(_this.comments)
                _this.total = res.data.count
              }
            })
        }
      },
      created () {
        this.getComments(0)
      }
    }
</script>

<style scoped lang="scss">
  @import "../../styles/global/dcomments";
</style>
