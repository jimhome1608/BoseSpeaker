import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Register from '@/components/Register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
        path: '/Register',
        name: 'Register',
        component: Register,
    },
    {
      path: '/backup',
      name: 'Backup',
      component: Register,
  }
]
})
