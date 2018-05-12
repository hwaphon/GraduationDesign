<template>
  <div class="dpointmain">
    <el-row v-for="(item, index) in intros" :key="index" class="dpointmain-row">
      <el-col :span="9" :offset="2">
        <p>{{ item.f }}</p>
      </el-col>
      <el-col :span="9" :offset="2">
        <p>{{ item.s }}</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="2" :span="20">
        <h2>一、说明</h2>
        <h3>1、课程的性质、地位和任务</h3>
        <p class="dpointmain-p">
          操作系统是计算机系统中最核心和最底层的软件，是计算机系统内各资源的管理者和各活动的组织者、指挥者，使整个计算机系统协调一致且有效地工作。《操作系统》这门课程是计算机相关专业必修的基础课。通过学习，学生可以掌握操作系统的结构和各功能模块对软硬件资源进行管理的技术和方法，体会操作系统是如何为应用程序提供一个方便灵活、安全可靠的工作环境，有助于全面理解整个计算机系统的运作机制，也为今后从事计算机的研究、设计、开发和制作打下坚实的基础。
        </p>
        <h3>2、课程教学的基本要求</h3>
        <p class="dpointmain-p">
          本课程主要讲述操作系统的基本工作原理及实现技术，从计算机系统资源管理的观点出发，全面介绍了处理机、主存储器、文件、设备及磁盘的管理方法及实现，详细描述了操作系统的重要概念——进程，以及进程并发执行中的同步、通信、死锁等问题。通过学习，希望学生掌握计算机操作系统的基本概念、主要功能、主要组成部分、以及各组成部分的不同实现方法，了解计算机操作系统的发展过程、未来趋势。通过实验课，希望学生了解基本算法的实现过程，在实践中掌握操作系统的基本原理和概念，同时提高动手能力。
        </p>
        <p class="dpointmain-p">
          在教学中，应采用设问─启发─讲授─结论的首尾响应方式，引导学生的创造性思维，活跃课堂气氛，充分调动学生的积极性和主动性，同时培养学生的自学能力。应针对重、难点采取由浅至深、由表及里的方法，通过现代化教学手段使教学内容化难为易，达到较好的效果。为进一步提高学生的学习兴趣，课外通过分析某操作系统（如UNIX、Linux）内核，了解该操作系统是如何管理计算机资源的。
        </p>
        <h3>3、课程的重点与难点</h3>
        <p class="dpointmain-p">
          <strong>重点：</strong>操作系统的基本理论和基本概念，常用的算法，操作系统的五大功能（处理机管理、存储器管理设备管理、设备管理、文件管理、用户接口），操作系统发展的新技术以及操作系统发展的趋势。
        </p>
        <p class="dpointmain-p">
          <strong>难点：</strong>进程同步算法，死锁问题、虚拟存储器、外存空间管理。
        </p>
        <h2>二、课堂教学时数及课后作业题型分配</h2>
        <el-table
          border
          :data="tableData"
          fit
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{ textAlign: 'center' }"
          style="width: 100%"
          class="dpoint-table">
          <el-table-column prop="chapter" label="章目"></el-table-column>
          <el-table-column prop="content" label="教学内容"></el-table-column>
          <el-table-column prop="time" label="教学时数"></el-table-column>
          <el-table-column prop="method" label="教学方式或手段"></el-table-column>
          <el-table-column label="课后作业">
            <el-table-column label="思考题" prop="sk"></el-table-column>
            <el-table-column label="练习题" prop="lx"></el-table-column>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      intros: [
        { f: '课程性质：专业基础课程', s: '先修课程：程序设计、数据结构' },
        { f: '总学时：51', s: '学分：3' },
        { f: '理论学时：51', s: '实验学时：0' },
        { f: '开课学院：数学计算机科学学院', s: '适用专业：软件工程专业' }
      ],
      tableData: [
        { chapter: '一', content: '操作系统引论', time: 3, method: '讲授（多媒体）', sk: ' ', lx: '✔' },
        { chapter: '二', content: '进程的描述与控制', time: 9, method: '讲授（多媒体）', sk: ' ', lx: '✔' },
        { chapter: '三', content: '处理机调度与死锁', time: 9, method: '讲授（多媒体）', sk: ' ', lx: '✔' },
        { chapter: '四', content: '存储器管理', time: 6, method: '讲授（多媒体）', sk: ' ', lx: '✔' },
        { chapter: '五', content: '虚拟存储器', time: 6, method: '讲授（多媒体）', sk: ' ', lx: '✔' },
        { chapter: '六', content: '输入输出系统', time: 6, method: '讲授（多媒体）', sk: ' ', lx: '✔' },
        { chapter: '七', content: '文件管理', time: 3, method: '讲授（多媒体）', sk: ' ', lx: '✔' },
        { chapter: '八', content: '磁盘存储器管理', time: 3, method: '讲授（多媒体）', sk: ' ', lx: '✔' },
        { chapter: '九', content: '操作系统接口', time: 3, method: '讲授（多媒体）', sk: ' ', lx: '' },
        { chapter: '', content: '复习', time: 3, method: '', sk: ' ', lx: '' },
        { chapter: '', content: '合计', time: 51, method: '', sk: ' ', lx: '' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/main/point/dpointmain.scss';
</style>
