import { createRouter, createWebHistory } from 'vue-router'
import WafDashboard from '../views/WafDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'WafDashboard',
    component: WafDashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
