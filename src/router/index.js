import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/components/main/Index'
import DCourse from '@/components/components/main/course/DCourse'
import DCourseDetail from '@/components/components/main/course/DCourseDetail'
import DExercise from '@/components/components/main/exercise/DExercise'
import DTask from '@/components/components/main/task/DTask'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'Index',
      path: '/',
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
      name: 'Task',
      path: '/task',
      component: DTask
    }
  ]
})
