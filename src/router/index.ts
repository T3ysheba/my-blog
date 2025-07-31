import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { Home } from '@/pages'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
