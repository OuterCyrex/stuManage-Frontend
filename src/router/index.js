import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import indexWeb from '../components/indexWeb.vue'
import stuPart from '@/components/StuPart.vue'
import gradePart from '@/components/gradePart.vue'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
    children: [
      { path: '/', component: indexWeb },
      { path: '/student', component: stuPart },
      { path: '/grade', component: gradePart }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
