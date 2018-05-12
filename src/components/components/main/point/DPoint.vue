<template>
  <div class="dpoint">
    <el-row class="dpoint-menu">
      <el-col :span="4">
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          @select="selectMenu">
          <el-menu-item v-for="item in menus" :key="item.index" :index="item.index">
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div class="dpoint-content">
          <DPointMain v-if="index == 0"></DPointMain>
          <DPointArticle :title="data.title" :article="data.article" v-if="index > 0 && index < 9"></DPointArticle>
          <el-row v-if="index > 8">
            <el-col :offset="2" :span="20">
              <p v-if="index == 9">
                本课程考试采取“闭卷”(占60%)与“作业、提问”(占40%)相结合的方式进行。其中，“闭卷”主要考查操作系统的基本概念、基本理论和经典算法，测评学生的理解、判断、分析、综合等能力。
              </p>
              <div class="dpoint-book" v-if="index == 10">
                <h3>使用教材</h3>
                <p>《计算机操作系统》(第4版)，汤小丹、梁红兵等，西安电子科技大学出版社，2007.5</p>
                <h3>教学参考书目</h3>
                <p>1. 计算机操作系统教程（第4版），张尧学等，清华大学出版社</p>
                <p>2. 操作系统：精髓与设计原理（第6版)，William Stallings，电子工业出版社</p>
                <p>3. 操作系统设计与实现(上/下册），Andrew S. Tanenbaum 陈渝 译，电子工业出版社</p>
                <p>4. Operating System:A Modern Perspective(第2版)，Gray Nutt著，孟祥山等译，机械工业出版社</p>
                <p>5. Windows操作系统原理，尤晋元、史美林，机械工业出版社</p>
                <p>6. 深入理解计算机系统，Randal E Bryant，David O‘Hallaron，龚奕利 雷迎春 译, 中国电力出版社</p>
                <p>7. 计算机的心智操作系统之哲学原理，邹恒明，机械工业出版社</p>
              </div>
              <div class="dpoint-download" v-if="index == 11">
                <p>为了方便在本地查看教学大纲，特提供 Word 版本，
                  <a href="http://p0q1vpjvw.bkt.clouddn.com/%E7%90%86%E8%AE%BA%E7%B1%BB%E8%AF%BE%E7%A8%8B%E5%A4%A7%E7%BA%B2-OS-170805.docx" download="操作系统教学大纲">点击下载</a>
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DPointMain from './DPointMain.vue';
import DPointArticle from './DPointArticle.vue';
import PointData from '@/const/DPointData';
export default {
  methods: {
    selectMenu (index) {
      this.index = index;
      $('html, body').animate({
            scrollTop: 0
      }, 'fast')
    }
  },
  components: {
    DPointMain,
    DPointArticle
  },
  data () {
    return {
      index: 0,
      data: PointData.chapter1,
      menus: [
        { index: '0', title: '介绍' },
        { index: '1', title: '第一章 操作系统引论' },
        { index: '2', title: '第二章 进程的描述与控制' },
        { index: '3', title: '第三章 处理机调度与死锁' },
        { index: '4', title: '第四章 存储器管理' },
        { index: '5', title: '第五章 虚拟存储器' },
        { index: '6', title: '第六章 输入输出系统' },
        { index: '7', title: '第七章 文件管理' },
        { index: '8', title: '第八章 操作系统接口' },
        { index: '9', title: '课程考核' },
        { index: '10', title: '使用教材与教学参考书目' },
        { index: '11', title: '下载教学大纲' }
      ]
    }
  },
  watch: {
    index (value) {
      if (value > 0) {
        let key = 'chapter' + value
        this.data = PointData[key]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/main/point/dpoint.scss';
</style>
