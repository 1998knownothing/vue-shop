import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Right from '@/components/rights/right.vue'
import Role from '@/components/rights/role.vue'
import Goodslist from '@/components/goods/list.vue'
import GoodslistAdd from '@/components/goods/add.vue'



Vue.use(Router)

import {Message} from  'element-ui';

 const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children:[
       {
         name: 'users',
         path: '/users',
         component: Users
       }
      ]
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children:[
       {
         name: 'rights',
         path: '/rights',
         component: Right
       },
       {
         name: 'roles',
         path: '/roles',
         component: Role
       },
       {
         name: 'goods',
         path: '/goods',
         component: Goodslist
       },
       {
         name: 'goodsadd',
         path: '/goods/add',
         component: GoodslistAdd
       }
      ]
    }

  ]
})

//路由守卫在 路由配置生效之前判断token
router.beforeEach((to,from,next)=>{
  console.log(to,from)
  if(to.path === '/login'){
    next()
  }else{
    const token = localStorage.getItem('token')
    if(!token){
      //this.$router.push({name:'login'})
      //this.$message...
      Message.warning('回到登录页')
      router.push({
        name: 'login'
      })
      return
    }
    next()
  }



})

export default router
