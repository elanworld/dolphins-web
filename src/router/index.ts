import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import History from '../views/History.vue'
import Pagination from '@/views/Pagination.vue'
import Layout from '../components/Layout.vue'
import Windowstage from '../views/Windowstage.vue'

const router = createRouter({
  history: createWebHistory('/dolphins-web/'),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
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
          component: History,
          meta:{title:'浏览历史'}
        },
        {
          path: '/page',
          name: 'page',
          component: Pagination
        },
        {
          path: '/show',
          name: 'show',
          component: Windowstage
        },
      ]
    },
  ]
})
router.afterEach((to,from,next) => {
  //遍历meta改变title
  if (to.meta.title) {
    document.title = String(to.meta.title);
  }
  window.scrollTo(0,0);
  if (to.query?.auth) {
    localStorage.setItem("Authorization",to.query?.auth.toString())
  }
});



export default router
