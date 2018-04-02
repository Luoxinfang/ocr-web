import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Login from '@/components/login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  let iExTime = 2 * 24 * 60 * 60 * 1000
  if (to.path === '/login') {
    if (localStorage.token) {
      return next('/')
    }
  } else {
    if (!localStorage.token || !localStorage.tokenCreateDate ||
      (+localStorage.tokenCreateDate + iExTime) < +new Date()) {
      return next('/login')
    }
  }
  next()
})

export default router
