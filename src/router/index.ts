import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import History from '../views/History.vue'
import Pagination from '@/views/Pagination.vue'

const router = createRouter({
  history: createWebHistory('/dolphins-web/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: History
    },
    {
      path: '/page',
      name: 'page',
      component: Pagination
    },
  ]
})

export default router
