import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [
    {
        path : '/',
        redirect : '/login'   //路由重定向 redirect
    },
    {
        path :'/login',
        component : Login
    },
    {
        path :'/home',
        component : ()=>import('@/components/Home.vue'),
        redirect: '/Welcome',
        children : [
            {
                path : '/Welcome',
                component : ()=>import('@/components/Welcome.vue')
            },
            {
                path: '/users',
                component : ()=>import('@/components/user/Users.vue')
            },
            {
                path: '/rights',
                component : ()=>import('@/components/power/Rights.vue')
            },
            {
                path: '/roles',
                component: ()=>import('@/components/power/Roles.vue')
            },
            {
                path: '/categories',
                component: ()=>import('@/components/goods/Cate.vue')
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
//挂载路由导航守卫
// router.beforeEach( (to,from,next)=>{
//     //to将要访问的路径
//     //from 代表从哪儿个路径跳转而来
//     //next是个函数  代表放行。
//     //next()  放行  next('/login')  强制跳转的路径
//     //if( to.path === '/login' ) return next();  //如果路径是登录的路径，直接放行
//     //获取token
//     //const tokenStr = window.sessionStorage.getItem('token');
//     //if(!tokenStr) return next('/login');   //如果没有token，强制跳转到登录页面
//     //next();   //代表有token，直接放行了。
// })

export default router
