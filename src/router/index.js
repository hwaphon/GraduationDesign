import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/components/main/Index'
import DCourse from '@/components/components/main/course/DCourse'
import DCourseDetail from '@/components/components/main/course/DCourseDetail'
import DExercise from '@/components/components/main/exercise/DExercise'
import DExerciseDetail from '@/components/components/main/exercise/DExerciseDetail'
import DTask from '@/components/components/main/task/DTask'
import DUserCenter from '@/components/components/user/UserCenter'
import DMessage from '@/components/components/main/message/DMessage'
import DMessageDetail from '@/components/components/main/message/DMessageDetail'
import DPoint from '@/components/components/main/point/DPoint'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'Home',
      path: '/',
      component: Index
    },
    {
      name: 'Index',
      path: '/index',
      component: Index
    },
    {
      name: 'Course',
      path: '/course',
      component: DCourse
    },
    {
      name: 'CourseDetails',
      path: '/course/detail/:id',
      component: DCourseDetail
    },
    {
      name: 'Exercise',
      path: '/exercise',
      component: DExercise
    },
    {
      name: 'ExerciseDetail',
      path: '/exercise/detail/:id',
      component: DExerciseDetail
    },
    {
      name: 'Task',
      path: '/task',
      component: DTask
    },
    {
      name: 'UserCenter',
      path: '/usercenter',
      component: DUserCenter
    },
    {
      name: 'Message',
      path: '/message',
      component: DMessage
    },
    {
      name: 'MessageDetail',
      path: '/message/detail/:id',
      component: DMessageDetail
    },
    {
      name: 'Point',
      path: '/point',
      component: DPoint
    }
  ]
})
