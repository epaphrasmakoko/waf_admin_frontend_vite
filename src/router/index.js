import { createRouter, createWebHistory } from 'vue-router'
import WafDashboard from '../views/WafDashboard.vue'
import MonitoringTab from '../views/MonitoringTab.vue'
import AssetsTab from '../views/AssetsTab.vue'
import ForensicTab from '../views/ForensicTab.vue'
import ProfileTab from '../views/ProfileTab.vue'
import LoginPage from '../views/LoginPage.vue'

const routes = [
  {
    path: '/',
    name: 'WafDashboard',
    component: WafDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/monitoring',
    name: 'MonitoringTab',
    component: MonitoringTab,
    meta: { requiresAuth: true }
  },
  {
    path: '/assets',
    name: 'AssetsTab',
    component: AssetsTab,
    meta: { requiresAuth: true }
  },
  {
    path: '/forensic',
    name: 'ForensicTab',
    component: ForensicTab,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'ProfileTab',
    component: ProfileTab,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = window.isAuthenticated?.value || false
  console.log('Router guard - isAuthenticated:', isAuthenticated)

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/profile')
  } else {
    next()
  }
})

export default router